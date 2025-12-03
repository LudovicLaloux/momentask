'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { habitsApi } from '@/lib/api';
import { Habit } from '@/types';

interface CreateHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onHabitsChange: (habits: Habit[]) => void;
}

export default function CreateHabitModal({ isOpen, onClose, onHabitsChange }: CreateHabitModalProps) {
    const t = useTranslations('habits')
    const tCommon = useTranslations('common')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!name.trim()) return

        setIsSubmitting(true)
        try {
            const newHabit = await habitsApi.create({
                name: name.trim(),
                description: description.trim() || undefined,
            })
            onHabitsChange([newHabit])
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
            <Modal isOpen={isOpen} onClose={onClose} backdrop="opaque">
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
                            {isSubmitting ? tCommon('creating') : tCommon('create')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
