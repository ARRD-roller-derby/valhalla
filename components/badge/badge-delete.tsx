import { IBadge, useBadges } from '@/entities'
import { Button, Modal } from '@/ui'
import { TrashIcon } from '@/ui/icons/TrashIcon'
import { checkRoles, ROLES } from '@/utils'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

type BadgeDeleteProps = {
  badge: IBadge
}

export function BadgeDelete({ badge }: BadgeDeleteProps) {
  const { data: session } = useSession()
  const { loadingDelete, deleteBadge } = useBadges()

  // ===== CONST ==================================
  const canSee = useMemo(() => {
    if (!session?.user) return false
    return checkRoles([ROLES.coach, ROLES.dev], session.user)
  }, [session])

  // ===== RENDER ==================================

  if (!canSee) return null

  return (
    <Modal
      button={(open) => (
        <div className="absolute right-1 top-1 fill-arrd-textError" onClick={open}>
          <TrashIcon />
        </div>
      )}
      footer={(close) => (
        <div className="mt-2 flex justify-between gap-1 px-3">
          <Button text="Supprimer" onClick={() => deleteBadge(badge._id)} type="primary" loading={loadingDelete} />
          <Button text="Annuler" type="danger" onClick={close} disabled={loadingDelete} />
        </div>
      )}
    >
      {() => (
        <div className="flex flex-col items-center justify-center gap-2 p-2">
          <div className="text-center">Êtes-vous sûr de vouloir supprimer ce badge ?</div>
          <div className="text-arrd-highlight">{badge.name}</div>
        </div>
      )}
    </Modal>
  )
}
