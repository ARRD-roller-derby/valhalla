// Bibliothèques externes
import { useSession } from 'next-auth/react'

// Bibliothèques internes
import { AuthLayout } from '@/layout'
import { boosters } from '@/utils/boosters'
import { Booster } from '@/components/card/booster'
import { CardProvider, TriggerTypes, useCards, useSocketTrigger } from '@/entities'
import { useEffect } from 'react'
import { Loader } from '@/ui'
import { CardBuyBtn } from '@/components/card/card-buy.btn'

export function Shop() {
  const { shop, cards, loading } = useCards()
  const { data: session } = useSession()
  const user = session?.user
  if (!user) return null

  useSocketTrigger<number>(TriggerTypes.SHOP, () => {
    shop()
  })

  useEffect(() => {
    shop()
  }, [])

  return (
    <AuthLayout title="Shop">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-4 p-3 sm:grid sm:grid-cols-3 lg:grid-cols-4">
          {boosters.map((booster) => (
            <Booster key={booster.key} booster={booster} />
          ))}
        </div>
        {loading && (
          <div className="flex w-full items-center justify-center">
            <Loader />
          </div>
        )}
        <div className="flex flex-col gap-4 p-3 md:grid md:grid-cols-3  lg:grid-cols-4  xl:grid-cols-5">
          {cards
            .filter((card) => !!card.player)
            .map((card) => (
              <CardProvider id={card._id.toString()} key={card._id.toString()}>
                <CardBuyBtn />
              </CardProvider>
            ))}
        </div>
      </div>
    </AuthLayout>
  )
}
