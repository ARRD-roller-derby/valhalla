import { IBadge, useBadges } from '@/entities'
import { Button, Modal } from '@/ui'
import { useEffect, useState } from 'react'
import JSConfetti from 'js-confetti'
import { BadgeCard } from './badge-card'

export function BadgeUnlockModal() {
  const { getHasViewed, haveViewedBadge } = useBadges()
  const [data, setData] = useState<IBadge[] | null>(null)

  useEffect(() => {
    getHasViewed().then((res) => {
      setData(res)

      if (res.length > 0) {
        const confetti = new JSConfetti()
        confetti.addConfetti({
          emojis: ['🔴', '🟡', '🟠', '🟢', '🔵', '🟣', '🔸', '🔷', '🌈', '🐉'],
          emojiSize: 30,
          confettiNumber: 200,
        })
      }
    })
  }, [])

  const handleClose = () => {
    setData(null)
    haveViewedBadge()
  }

  if (data === null || data?.length <= 0) return null
  return (
    <Modal
      title={data.length > 1 ? 'Badges débloqués' : 'Badge débloqué'}
      onClose={handleClose}
      button={() => <div className="hidden" />}
      openDefault={true}
      footer={(close) => (
        <div className="flex justify-center p-4">
          <Button
            onClick={() => {
              close()
              handleClose()
            }}
            text="Fermer"
            type="secondary"
          />
        </div>
      )}
    >
      {() => (
        <div className="overflow-y-auto p-4">
          <div className="flex flex-col gap-2">
            {data.map((badge) => (
              <BadgeCard key={badge._id.toString()} badge={badge} />
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
