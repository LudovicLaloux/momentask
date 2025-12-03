'use client'

import { useState } from 'react'
import { Habit } from '@/types'
import Sidebar from './Sidebar'
import MainContent from './MainContent'

interface Props {
    initialHabits: Habit[]
}

export default function Dashboard({ initialHabits }: Props) {
    const [habits, setHabits] = useState(initialHabits)
    const [selectedHabitId, setSelectedHabitId] = useState<string | null>(
        initialHabits.length > 0 ? initialHabits[0].id : null
    )

    const selectedHabit = habits.find(h => h.id === selectedHabitId)

    return (
        <div className="flex h-screen">
            <Sidebar
                habits={habits}
                selectedHabitId={selectedHabitId}
                onSelectHabit={setSelectedHabitId}
                onHabitsChange={setHabits}
            />
            <MainContent
                selectedHabitId={selectedHabitId}
                selectedHabitName={selectedHabit?.name || null}
            />
        </div>
    )
}