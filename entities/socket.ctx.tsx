/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useContext, useEffect, createContext, useState } from 'react'
import { PUSHER_KEY, PUSHER_REGION } from '@/utils'
import Pusher from 'pusher-js'
import { useSession } from 'next-auth/react'

// INTERFACES ---------------------------------------------------------------
interface SocketProviderProps {
  children: ReactNode
}

export enum TriggerTypes {
  WALLET = 'wallet',
  EVENTS = 'events',
  EVENT = 'event',
  PARTICIPATION = 'participation',
}

interface ISocketMessage<T = any> {
  type: TriggerTypes
  value: T
  id: string
}

// CONTEXT ------------------------------------------------------------------
export const SocketContext = createContext<ISocketMessage | null>(null)

// HOOKS --------------------------------------------------------------------

export function useSocketTrigger<T>(type: TriggerTypes, action: (msg: T) => void): ISocketMessage | null {
  const message = useContext(SocketContext)

  useEffect(() => {
    if (message && message?.type == type) action(message?.value)
  }, [message])

  return message
}

export function useSocket() {
  const { data: session } = useSession()
  const [message, setMessage] = useState<ISocketMessage | null>(null)

  const cbSocket = (data: ISocketMessage) => {
    setMessage(data)
    setTimeout(() => setMessage(null), 400)
    return data
  }

  useEffect(() => {
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_REGION,
    })

    const channel = pusher.subscribe('valhalla')
    channel.bind('public', cbSocket)

    if (session?.user?.id) channel.bind(session.user.id, cbSocket)
  }, [])

  return message
}

// PROVIDER -----------------------------------------------------------------
export function SocketProvider({ children }: SocketProviderProps) {
  const message = useSocket()

  return <SocketContext.Provider value={message}>{children}</SocketContext.Provider>
}
