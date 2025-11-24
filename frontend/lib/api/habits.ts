import { Habit, HabitCreate, HabitUpdate } from '@/types'
import { fetchApi } from './client'

export const habitsApi = {
    getAll: () => fetchApi<Habit[]>('/habits'),

    getOne: (id: string) => fetchApi<Habit>(`/habits/${id}`),

    create: (data: HabitCreate) =>
        fetchApi<Habit>('/habits', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    update: (id: string, data: HabitUpdate) =>
        fetchApi<Habit>(`/habits/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/habits/${id}`, {
            method: 'DELETE',
        }),
}