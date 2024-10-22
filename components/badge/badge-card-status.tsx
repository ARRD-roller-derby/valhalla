import { IBadge, useBadges } from '@/entities'
import { checkRoles, ROLES } from '@/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

type BadgeCardStatusProps = {
  badge: IBadge
}

export function BadgeCardStatus({ badge }: BadgeCardStatusProps) {
  // ===== HOOKS =================================
  const router = useRouter()
  const { data: session } = useSession()
  const { unlockBadge } = useBadges()

  // ===== STATE =================================
  const [win, setWin] = useState(badge.win)

  // ===== HANDLER =================================

  const handleWin = () => {
    unlockBadge(
      badge._id.toString(),
      (router.query.id as string) || (session?.user?.providerAccountId.toString() as string)
    )
    setWin(!win)
  }

  // ===== CONST ==================================
  const canSee = useMemo(() => {
    if (!session?.user) return false
    return checkRoles([ROLES.coach, ROLES.dev], session.user)
  }, [session])

  // ===== RENDER ==================================

  if (canSee)
    return (
      <button
        className="rounded-sm bg-arrd-secondary p-1  text-xs text-arrd-textLight data-[win=true]:bg-arrd-textDark"
        onClick={handleWin}
        data-win={win}
      >
        {win ? 'retirer' : 'débloquer'}
      </button>
    )

  return win ? (
    <div className="text-end text-xs text-arrd-highlight">obtenu</div>
  ) : (
    <div className="text-end text-xs text-arrd-textError">verrouillé</div>
  )
}
