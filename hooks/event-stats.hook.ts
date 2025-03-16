import { useEvent } from '@/entities'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useEventStats() {
  const { event } = useEvent()
  const { data: session } = useSession()
  const [loading, setLoading] = useState<boolean>(false)
  const [stats, setStats] = useState<any>([])

  const getEventStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${event._id.toString()}/stats`)
      const { stats } = await res.json()
      setStats(stats)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) getEventStats()
  }, [session])

  return { loading, stats, getEventStats }
}
