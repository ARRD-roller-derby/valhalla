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
        <div onClick={open}>
          <WallIcon className="h-7 w-7 fill-black opacity-10" />
        </div>
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
