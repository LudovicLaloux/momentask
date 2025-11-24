import { habitsApi, completionsApi } from '@/lib/api'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import HabitCalendar from './HabitCalendar'

interface Props {
    params: Promise<{ id: string }>
}

export default async function HabitPage({ params }: Props) {
    const { id } = await params

    try {
        const [habit, completions] = await Promise.all([
            habitsApi.getOne(id),
            completionsApi.getAll(id),
        ])

        return (
            <main className="max-w-2xl mx-auto p-6">
                <Link href="/" className="text-blue-500 hover:underline mb-4 block">
                    ← Back to habits
                </Link>

                <h1 className="text-3xl font-bold mb-2">{habit.name}</h1>
                {habit.description && (
                    <p className="text-gray-400 mb-8">{habit.description}</p>
                )}

                <HabitCalendar habitId={habit.id} completions={completions} />
            </main>
        )
    } catch (error) {
        console.error('Error fetching habit:', error)
        notFound()
    }
}