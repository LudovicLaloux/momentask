'use client'

import { useState } from 'react'
import { Completion } from '@/types'
import { completionsApi } from '@/lib/api'

interface Props {
    habitId: string
    completions: Completion[]
}

export default function HabitCalendar({ habitId, completions: initialCompletions }: Props) {
    const [completions, setCompletions] = useState(initialCompletions)
    const [currentDate, setCurrentDate] = useState(new Date())

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    // Check if a date is completed
    const isCompleted = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return completions.some(c => c.completed_date === dateStr)
    }

    // Get completion for a date
    const getCompletion = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return completions.find(c => c.completed_date === dateStr)
    }

    // Toggle completion
    const toggleDay = async (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const existing = getCompletion(day)

        if (existing) {
            await completionsApi.delete(existing.id)
            setCompletions(completions.filter(c => c.id !== existing.id))
        } else {
            const newCompletion = await completionsApi.create({
                habit_id: habitId,
                completed_date: dateStr,
            })
            setCompletions([...completions, newCompletion])
        }
    }

    // Navigation
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-700 rounded">
                    ←
                </button>
                <h2 className="text-xl font-semibold">{monthName}</h2>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-700 rounded">
                    →
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-gray-500 text-sm py-2">
                        {day}
                    </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const completed = isCompleted(day)

                    return (
                        <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`
                p-2 rounded-lg transition-colors
                ${completed
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'hover:bg-gray-700'
                                }
              `}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}