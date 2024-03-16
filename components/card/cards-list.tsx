import { CardProvider, useCards } from '@/entities/card.store'
import { useEffect } from 'react'
import { Card } from '@/components/card'

export function CardList() {
  const { getCards, cards } = useCards()

  useEffect(() => {
    getCards()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3  lg:grid-cols-4  xl:grid-cols-5">
        {cards
          .filter((card) => !!card.player)
          .map((card) => (
            <CardProvider id={card._id.toString()} key={card._id.toString()}>
              <Card />
            </CardProvider>
          ))}
      </div>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-3  lg:grid-cols-4  xl:grid-cols-5">
        {cards
          .filter((card) => !!card.question)
          .map((card) => (
            <CardProvider id={card._id.toString()} key={card._id.toString()}>
              <Card />
            </CardProvider>
          ))}
      </div>
    </div>
  )
}
