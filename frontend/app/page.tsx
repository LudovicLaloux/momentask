import { habitsApi } from '@/lib/api'
import Dashboard from '@/components/Dashboard'

export default async function HomePage() {
  const habits = await habitsApi.getAll()

  return <Dashboard initialHabits={habits} />
}