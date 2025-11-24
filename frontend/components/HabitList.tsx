'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Textarea,
    useDisclosure,
} from '@nextui-org/react'
import { Habit } from '@/types'
import { habitsApi } from '@/lib/api'

interface Props {
    initialHabits: Habit[]
}

export default function HabitList({ initialHabits }: Props) {
    const [habits, setHabits] = useState(initialHabits)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSubmit = async () => {
        if (!name.trim()) return

        setIsSubmitting(true)
        try {
            const newHabit = await habitsApi.create({
                name: name.trim(),
                description: description.trim() || undefined,
            })
            setHabits([...habits, newHabit])
            handleClose()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setName('')
        setDescription('')
        onClose()
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Habits</h1>
                <Button color="primary" onPress={onOpen}>
                    + New Habit
                </Button>
            </div>

            {habits.length === 0 ? (
                <p className="text-gray-500">No habits yet. Create your first one!</p>
            ) : (
                <ul className="space-y-4">
                    {habits.map((habit) => (
                        <li key={habit.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800">
                            <Link href={`/habits/${habit.id}`}>
                                <h2 className="text-xl font-semibold">{habit.name}</h2>
                                {habit.description && (
                                    <p className="text-gray-400 mt-1">{habit.description}</p>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <Modal isOpen={isOpen} onClose={handleClose} backdrop="opaque">
                <ModalContent>
                    <ModalHeader>New Habit</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Name"
                            placeholder="e.g., Morning exercise"
                            value={name}
                            onValueChange={setName}
                            autoFocus
                        />
                        <Textarea
                            label="Description"
                            placeholder="Optional description..."
                            value={description}
                            onValueChange={setDescription}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleSubmit}
                            isDisabled={!name.trim()}
                            isLoading={isSubmitting}
                        >
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}