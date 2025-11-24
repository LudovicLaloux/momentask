import { habitsApi } from '@/lib/api'
import HabitList from '@/components/HabitList'

export default async function HomePage() {
  const habits = await habitsApi.getAll()

  return (
    <main className="max-w-2xl mx-auto p-6">
      <HabitList initialHabits={habits} />
    </main>
  )
}