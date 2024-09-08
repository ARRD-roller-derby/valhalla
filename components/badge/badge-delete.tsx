import { useBadges } from '@/entities'
import { IBadgeSchema } from '@/models'
import { Button, Modal } from '@/ui'
import { useRouter } from 'next/router'

type BadgeDeleteProps = {
  badge: IBadgeSchema
}
export function BadgeDelete({ badge }: BadgeDeleteProps) {
  const { deleteBadge, loadingDelete } = useBadges()
  const router = useRouter()

  const handleDelete = async () => {
    await deleteBadge(badge._id)
    router.push('/badges')
  }

  return (
    <Modal button={(open) => <Button type="danger" text="Supprimer" onClick={open} />}>
      {(close) => (
        <div className="flex flex-col gap-3 p-3">
          <div className="text-center">
            Supprimer le badge: <span className="font-bold">{badge.name} </span>?
          </div>
          <div className="flex w-full justify-between">
            <Button
              type="danger"
              text="Annuler"
              onClick={() => {
                console.log('delete')
                close()
              }}
              disabled={loadingDelete}
            />
            <Button text="Supprimer" onClick={handleDelete} disabled={loadingDelete} />
          </div>
        </div>
      )}
    </Modal>
  )
}
