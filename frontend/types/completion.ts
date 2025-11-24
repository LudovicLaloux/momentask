export interface Completion {
    id: string
    habit_id: string
    completed_date: string // format YYYY-MM-DD
}

export interface CompletionCreate {
    habit_id: string
    completed_date: string
}