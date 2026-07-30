import { Modal } from '@/ui'

import { Grid } from '../run-game/grid'
import { WallIcon } from '@/ui/icons/wall.icon'
import { useRunGame } from '@/entities/rungame.store'

export function WallOfDeathModal() {
  const { stopGame } = useRunGame()
  return (
    <Modal
      title="Wall of Death"
      onClose={stopGame}
      button={(open) => (
        <button type="button" aria-label="Ouvrir Wall of Death" className="border-0 bg-transparent p-0" onClick={open}>
          <WallIcon className="h-7 w-7 fill-black opacity-10" />
        </button>
      )}
    >
      {() => (
        <div className="relative flex h-[calc(100dvh-2rem)] items-center justify-center gap-1 p-2">
          <Grid />
        </div>
      )}
    </Modal>
  )
}
