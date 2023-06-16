/* eslint-disable react-hooks/exhaustive-deps */
import {
  FC,
  ReactNode,
  useContext,
  useEffect,
  createContext,
  useState,
} from 'react'
import { PUSHER_KEY, PUSHER_REGION } from '../utils/constants'
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
}

interface ISocketMessage {
  type: TriggerTypes
  value: number | string | Record<string, unknown>
  id: string
}

// CONTEXT ------------------------------------------------------------------
export const SocketContext = createContext<ISocketMessage | null>(null)

// HOOKS --------------------------------------------------------------------

export const useSocketTrigger = (
  type: TriggerTypes,
  action: (msg: number | string | Record<string, unknown>) => void
) => {
  const message = useContext(SocketContext)

  useEffect(() => {
    if (message && message?.type == type) action(message?.value)
  }, [message])

  return message
}

export const useSocket = () => {
  const { data: session } = useSession()
  const [message, setMessage] = useState<ISocketMessage | null>(null)

  const cbSocket = (data: ISocketMessage) => {
    setMessage(data)
    setTimeout(() => setMessage(null), 400)
  }

  useEffect(() => {
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_REGION,
    })

    const channel = pusher.subscribe('valhalla')
    channel.bind('public', cbSocket)
    if (session?.user?.id) channel.bind(session?.user?.id, cbSocket)
  }, [])

  return message
}

// PROVIDER -----------------------------------------------------------------
export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const message = useSocket()

  return (
    <SocketContext.Provider value={message}>{children}</SocketContext.Provider>
  )
}
