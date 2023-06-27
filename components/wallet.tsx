import { DragonIcon } from '@/ui'
import { useSession } from 'next-auth/react'

export function Wallet() {
  const { data: session } = useSession()
  const wallet = session?.user?.wallet || 1500
  //TODO brancher au socket
  return (
    <div className="text-tierce font-poppins font-bold flex gap-1 items-center text-lg md:text-sm">
      {wallet}
      <DragonIcon className="fill-tierce text-lg  md:text-sm" />
    </div>
  )
}
