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
import { useTranslations } from 'next-intl'

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

    const t = useTranslations('habits')
    const tCommon = useTranslations('common')

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <Button color="primary" onPress={onOpen}>
                    + {t('newHabit')}
                </Button>
            </div>

            {habits.length === 0 ? (
                <p className="text-gray-500">{t('noHabits')}</p>
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
                    <ModalHeader>{t('newHabit')}</ModalHeader>
                    <ModalBody>
                        <Input
                            label={t('name')}
                            placeholder={t('namePlaceholder')}
                            value={name}
                            onValueChange={setName}
                            autoFocus
                        />
                        <Textarea
                            label={t('description')}
                            placeholder={t('descriptionPlaceholder')}
                            value={description}
                            onValueChange={setDescription}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={handleClose}>
                            {tCommon('cancel')}
                        </Button>
                        <Button
                            color="primary"
                            onPress={handleSubmit}
                            isDisabled={!name.trim()}
                            isLoading={isSubmitting}
                        >
                            {tCommon('create')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}