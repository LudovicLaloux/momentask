'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, useDisclosure } from '@nextui-org/react'
import { Plus } from 'lucide-react'
import { Habit } from '@/types'
import CreateHabitModal from './Sidebar/CreateHabitModal'

interface Props {
    habits: Habit[]
    selectedHabitId: string | null
    onSelectHabit: (habitId: string) => void
    onHabitsChange: (habits: Habit[]) => void
}

export default function Sidebar({ habits, selectedHabitId, onSelectHabit, onHabitsChange }: Props) {
    const t = useTranslations('habits')
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <aside className="w-80 border-r border-gray-700 flex flex-col h-screen">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
                    <Button
                        color="primary"
                        onPress={onOpen}
                        startContent={<Plus size={20} />}
                        className="w-full"
                    >
                        {t('newHabit')}
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {habits.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">{t('noHabits')}</p>
                    ) : (
                        <ul className="space-y-2">
                            {habits.map((habit) => (
                                <li key={habit.id}>
                                    <button
                                        onClick={() => onSelectHabit(habit.id)}
                                        className={`
                      w-full text-left p-4 rounded-lg transition-all
                      ${selectedHabitId === habit.id
                                                ? 'bg-primary/20 border-2 border-primary'
                                                : 'bg-gray-800 hover:bg-gray-700 border-2 border-transparent'
                                            }
                    `}
                                    >
                                        <h3 className="font-semibold">{habit.name}</h3>
                                        {habit.description && (
                                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                                {habit.description}
                                            </p>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>

            <CreateHabitModal isOpen={isOpen} onClose={onClose} onHabitsChange={(newHabit) => onHabitsChange([...habits, ...newHabit])} />

        </>
    )
}