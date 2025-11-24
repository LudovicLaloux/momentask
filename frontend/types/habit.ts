export interface Habit {
    id: string
    name: string
    description: string | null
}

export interface HabitCreate {
    name: string
    description?: string
}

export interface HabitUpdate {
    name?: string
    description?: string
}

