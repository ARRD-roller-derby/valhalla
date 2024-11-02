import { GRID_SIZE_COLS, GRID_SIZE_ROWS, useRunGame } from '@/entities/rungame.store'
import { BoltIcon, DragonIcon } from '@/ui'
import { useEffect, useRef } from 'react'

export function Grid() {
  // ---- Store ---- //
  const { grid, player, jammer, movePlayer, runJammer, initGame } = useRunGame()

  // ---- Refs ---- //
  const requestRef: {
    current: number | undefined
  } = useRef()
  const previousTimeRef: {
    current: number | undefined
  } = useRef()
  const accumulatedTimeRef: {
    current: number
  } = useRef(0)

  // === Boucle de jeu === //
  const run = (time: number) => {
    if (previousTimeRef.current != null) {
      const deltaTime = time - previousTimeRef.current
      updateGame(deltaTime)
    }

    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(run)
  }

  // === Core game === //

  const updateGame = (deltaTime: number) => {
    if (!grid?.length) return
    const timeToSeconds = deltaTime / 1000
    const speed = 100 // par exemple, 100 pixels par seconde
    const distance = (speed * deltaTime) / 1000 // Convertir deltaTime de ms à s

    accumulatedTimeRef.current += distance

    if (accumulatedTimeRef.current >= 2) {
      const randomIndex = Math.floor(Math.random() * GRID_SIZE_COLS)
      //TODO mettre tout le jeu dans une ref
      const newX = jammer.x === player.x && player.y === jammer.y ? randomIndex : undefined

      // console.log('jammer', jammer, player)
      runJammer(newX)
      accumulatedTimeRef.current = 0
      //TODO déplacer le jammer
    }

    // Mettez à jour l'état de votre jeu en utilisant 'distance'
  }

  const keyBoardHandler = (e: any) => {
    const left = ['ArrowLeft', 'q']
    const right = ['ArrowRight', 'd']
    if (left.includes(e.key)) movePlayer('left')
    if (right.includes(e.key)) movePlayer('right')
  }

  // === EFFECTS === //

  useEffect(() => {
    window.addEventListener('keydown', keyBoardHandler)
    return () => {
      window.removeEventListener('keydown', keyBoardHandler)
    }
  }, [])
  useEffect(() => {
    initGame()
  }, [])

  useEffect(() => {
    requestRef.current = requestAnimationFrame(run)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  // === RENDER === //

  if (!grid?.length) return null
  return (
    <div
      className="relative grid max-h-max w-full max-w-md cursor-pointer"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE_COLS}, 1fr)`,
      }}
    >
      {
        // CONTRÔLES DU JEU
      }

      <div className="absolute bottom-0 left-0 top-0 w-1/2" id="c-left" onClick={() => movePlayer('left')} />
      <div className="absolute bottom-0 right-0 top-0 w-1/2 " id="c-right" onClick={() => movePlayer('right')} />

      {grid.map((row, x) => (
        <div key={x} className="flex flex-col">
          {row.map((col, y) => (
            <div key={y} className="h-6 border-x border-x-orange-600">
              {
                // Player
                x === player.x && y === player.y && (
                  <div className="flex h-full w-full items-center justify-center fill-arrd-highlight">
                    <DragonIcon />
                  </div>
                )
              }
              {
                // Jammer
                x === jammer.x && y === jammer.y && (
                  <div className="flex h-full w-full items-center justify-center fill-arrd-textError">
                    <BoltIcon />
                  </div>
                )
              }
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
