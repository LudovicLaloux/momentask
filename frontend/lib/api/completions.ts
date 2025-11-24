import { Completion, CompletionCreate } from '@/types'
import { fetchApi } from './client'

// Completions
export const completionsApi = {
    getAll: (habitId?: string) => {
        const params = habitId ? `?habit_id=${habitId}` : ''
        return fetchApi<Completion[]>(`/completions${params}`)
    },

    create: (data: CompletionCreate) =>
        fetchApi<Completion>('/completions', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    delete: (id: string) =>
        fetchApi<void>(`/completions/${id}`, {
            method: 'DELETE',
        }),
}