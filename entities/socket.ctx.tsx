/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useContext, useEffect, createContext, useState } from 'react'
import { useSession } from 'next-auth/react'

// INTERFACES ---------------------------------------------------------------
interface SocketProviderProps {
  children: ReactNode
}

export enum TriggerTypes {
  BADGE_COUNT = 'badge_count',
  EVENTS = 'events',
  EVENT = 'event',
  PARTICIPATION = 'participation',
  SKILLS = 'skills',
  SHOP = 'shop',
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

  const cbSocket = (data: { action: { type: TriggerTypes; value: any } }) => {
    setMessage(data?.action as ISocketMessage)
    setTimeout(() => setMessage(null), 400)
    return data?.action as ISocketMessage
  }

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || '')

    ws.addEventListener('open', () => {
      if (ws) {
        ws.send(
          JSON.stringify({
            action: 'subscribe',
            provider: session?.user?.id || 'public',
          })
        )
        ws.send(
          JSON.stringify({
            action: 'subscribe',
            provider: 'public',
          })
        )
      }
    })
    ws.addEventListener('message', (ev) => {
      const data = ev.data.startsWith('{') ? JSON.parse(ev.data) : ev.data
      if (data.action) cbSocket(data)
    })
  }, [])

  return message
}

// PROVIDER -----------------------------------------------------------------
export function SocketProvider({ children }: SocketProviderProps) {
  const message = useSocket()

  return <SocketContext.Provider value={message}>{children}</SocketContext.Provider>
}
