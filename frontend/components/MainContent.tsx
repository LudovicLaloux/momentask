'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Completion } from '@/types'
import { completionsApi } from '@/lib/api'
import HabitCalendar from '@/app/habits/[id]/HabitCalendar'

interface Props {
    selectedHabitId: string | null
    selectedHabitName: string | null
}

export default function MainContent({ selectedHabitId, selectedHabitName }: Props) {
    const t = useTranslations('habits')
    const [completions, setCompletions] = useState<Completion[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!selectedHabitId) {
            setCompletions([])
            return
        }

        const fetchCompletions = async () => {
            setIsLoading(true)
            try {
                const data = await completionsApi.getAll(selectedHabitId)
                setCompletions(data)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCompletions()
    }, [selectedHabitId])

    if (!selectedHabitId) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <p className="text-xl">Select a habit to view its calendar</p>
                </div>
            </main>
        )
    }

    return (
        <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">{selectedHabitName}</h2>

                {isLoading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <HabitCalendar habitId={selectedHabitId} completions={completions} />
                )}
            </div>
        </main>
    )
}