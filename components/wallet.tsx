// Bibliothèques externes
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

// Bibliothèques internes
import { TriggerTypes, useSocketTrigger } from '@/entities'
import { DragonIcon } from '@/ui'

export function Wallet() {
  // stores
  const { data: session } = useSession()

  // state
  const [wallet, setWallet] = useState(session?.user?.wallet || 1500)

  // hooks
  useSocketTrigger<number>(TriggerTypes.WALLET, (msg) => {
    if (typeof msg !== 'number') return
    setWallet(msg as number)
  })

  // effects
  useEffect(() => {
    if (!session?.user?.wallet) return
    setWallet(session.user.wallet)
  }, [session?.user?.wallet])

  return (
    <div className="flex items-center gap-1 font-poppins text-lg font-bold text-arrd-highlight md:text-sm">
      {wallet}
      <DragonIcon className="fill-arrd-highlight text-lg  md:text-sm" />
    </div>
  )
}
