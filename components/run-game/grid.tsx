'use client'
import { GRID_SIZE_COLS, GRID_SIZE_ROWS, useRunGame } from '@/entities/rungame.store'
import { Button } from '@/ui'
import { ExplodeIcon } from '@/ui/icons/explode.icon'
import { StarIcon } from '@/ui/icons/star.icon'
import { WallIcon } from '@/ui/icons/wall.icon'
import { useEffect, useRef } from 'react'

export function Grid() {
  // ---- Store ---- //
  const {
    grid,
    player,
    jammer,
    score,
    start,
    gameOver,
    startGame: _startGame,
    movePlayer: _movePlayer,
    runJammer: _runJammer,
    initGame,
    increaseScore,
    decreaseScore,
  } = useRunGame()

  // ---- Refs ---- //
  const refs = useRef<{
    grid: number[][]
    request: number | undefined
    previousTime: number | undefined
    jammer: { x: number; y: number }
    player: { x: number; y: number }
    accumulatedTime: number
    speed: number
    isRecognizing: boolean
    recognitionInstance: any
  }>({
    grid,
    request: undefined,
    previousTime: undefined,
    jammer: {
      x: jammer.x,
      y: jammer.y,
    },
    player: {
      x: player.x,
      y: player.y,
    },
    accumulatedTime: 0,
    speed: 20,
    isRecognizing: false,
    recognitionInstance: null,
  })

  // === Boucle de jeu === //

  const startGame = () => {
    if (!start) {
      _startGame()
      refs.current.speed = 20
      refs.current.jammer = { x: 0, y: GRID_SIZE_ROWS - 40 }
    }
  }

  const movePlayer = (direction: 'left' | 'right', colNum?: number) => {
    const { x } = refs.current.player
    if (colNum) {
      refs.current.player.x = colNum - 1
      _movePlayer(direction, refs.current.player.x)
      return
    }
    if (direction === 'left' && x === 0) return
    if (direction === 'right' && x === GRID_SIZE_COLS - 1) return

    refs.current.player.x = direction === 'left' ? x - 1 : x + 1
    _movePlayer(direction)
  }

  const runJammer = (newX: number | undefined, resetY?: boolean) => {
    const jammer = refs?.current?.jammer

    if (!jammer) return
    const newY = jammer.y - 1 < 0 || resetY ? Math.floor(Math.random() * 20) + GRID_SIZE_ROWS : jammer.y - 1

    const x = jammer.y - 1 < 0 || resetY ? getRandomColumn(jammer.x) : newX
    refs.current.jammer = { x: x || jammer.x, y: newY }

    _runJammer(x || jammer.x, newY)
  }

  const run = (time: number) => {
    if (refs?.current?.previousTime != null) {
      const deltaTime = time - refs.current.previousTime
      updateGame(deltaTime)
    }

    if (refs?.current) {
      refs.current.previousTime = time

      refs.current.request = requestAnimationFrame(run)
    }
  }

  const getRandomColumn = (currentCol: number) => {
    let randomIndex = Math.floor(Math.random() * GRID_SIZE_COLS)

    while (currentCol === randomIndex) {
      randomIndex = Math.floor(Math.random() * GRID_SIZE_COLS)
    }

    return randomIndex
  }

  // === Core game === //

  const updateGame = (deltaTime: number) => {
    if (!refs.current.grid?.length) return
    const distance = (refs.current.speed * deltaTime) / 1000 // Convertir deltaTime de ms à s

    refs.current.accumulatedTime += distance

    if (refs.current.accumulatedTime >= 2) {
      // ====> Collision avec le jammer
      if (refs.current.jammer.x === refs.current.player.x && refs.current.player.y === refs.current.jammer.y) {
        const randomIndex = getRandomColumn(refs.current.jammer.x)
        runJammer(randomIndex, true)
        increaseScore()
        if (refs.current.speed < 300) refs.current.speed += 1
      } else {
        runJammer(undefined)
      }

      // jammer passe le joueur
      if (refs.current.jammer.y + 2 === refs.current.player.y) {
        decreaseScore()
      }

      refs.current.accumulatedTime = 0
    }
  }

  const keyBoardHandler = (e: any) => {
    const left = ['ArrowLeft', 'q']
    const right = ['ArrowRight', 'd']
    if (left.includes(e.key)) movePlayer('left')
    if (right.includes(e.key)) movePlayer('right')
  }

  const startVoiceControl = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Web Speech API non supportée dans ce navigateur')
      return
    }

    //@ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.interimResults = false
    recognition.continuous = true

    // Variable pour contrôler si un redémarrage est déjà en cours
    let isRestarting = false
    let isRecognizing = false // Ajout de l'état de reconnaissance
    let retryCount = 0
    const maxRetries = 5

    recognition.onstart = () => {
      console.log('Reconnaissance vocale démarrée')
      isRecognizing = true
      isRestarting = false // Réinitialiser le flag de redémarrage lorsqu'il démarre correctement
      retryCount = 0 // Réinitialiser le compteur de tentatives
    }

    recognition.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale', event)
      if (event.error === 'network' && retryCount < maxRetries) {
        retryCount += 1 // Augmenter le compteur de tentatives
        if (!isRestarting && !isRecognizing) {
          isRestarting = true // Marquer le redémarrage en cours
          recognition.start()
        }
      } else {
      }
    }

    recognition.onend = () => {
      isRecognizing = false

      if (!isRestarting && retryCount < maxRetries) {
        isRestarting = true // Marquer le redémarrage en cours
        recognition.start()
      }
    }

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1]
      const command = lastResult[0].transcript.trim().toLowerCase()

      if (command.match(/un|1/g)) {
        movePlayer('left', 1)
      }
      if (command.match(/deux|2/g)) {
        movePlayer('left', 2)
      }
      if (command.match(/trois|3/g)) {
        movePlayer('right', 3)
      }
      if (command.match(/quatre|4/g)) {
        movePlayer('right', 4)
      }
    }

    // Démarrer la reconnaissance si elle n'est pas déjà en cours
    if (!isRecognizing && !isRestarting) {
      recognition.start()
    }
  }

  // === EFFECTS === //

  useEffect(() => {
    if (refs?.current) {
      refs.current.grid = initGame()
      refs.current.request = requestAnimationFrame(run)

      setTimeout(() => {
        startVoiceControl(), 1000
      })
    }
    window.addEventListener('keydown', keyBoardHandler)
    return () => {
      window.removeEventListener('keydown', keyBoardHandler)
      if (refs?.current?.request) cancelAnimationFrame(refs.current.request)
      if (refs.current.recognitionInstance) {
        refs.current.recognitionInstance?.stop()
        refs.current.recognitionInstance = null
      }
    }
  }, [])

  // === RENDER === //

  if (!grid?.length) return null
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-2 grid grid-rows-[auto_1fr] md:justify-center">
        <div>
          SCORE: <span className="text-lg font-bold oldstyle-nums text-arrd-highlight">{start ? score : 0}</span>
        </div>
        <div
          className="pointer-events-none grid h-full w-full cursor-pointer lg:w-96"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE_COLS}, 1fr)`,
          }}
        >
          {grid.map((row, x) => (
            <div key={x} className="flex flex-1 flex-col">
              {row.map((col, y) => (
                <div key={y} className="relative h-full border-x border-x-orange-800">
                  {/* Player */}
                  {x === player.x && y === player.y && (
                    <div
                      className="flex h-full w-full items-center justify-center fill-amber-700 data-[hide=true]:hidden"
                      data-hide={x === jammer.x && y === jammer.y}
                    >
                      <WallIcon className="h-auto w-9" />
                    </div>
                  )}
                  {/* Jammer */}
                  {x === jammer.x && y === jammer.y && (
                    <div
                      className="flex h-full w-full items-center justify-center fill-arrd-highlight data-[hide=true]:hidden"
                      data-hide={x === player.x && y === player.y}
                    >
                      <StarIcon className="h-auto w-9" />
                    </div>
                  )}
                  {x === jammer.x && y === jammer.y && x === player.x && y === player.y && (
                    <div className="absolute -inset-4 flex h-full w-full origin-center scale-150 items-center justify-center fill-yellow-300">
                      <ExplodeIcon className="h-auto w-9" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* CONTRÔLES DU JEU */}
        <div className="absolute bottom-0 left-0 top-0 w-1/2" id="c-left" onClick={() => movePlayer('left')} />
        <div className="absolute bottom-0 right-0 top-0 w-1/2 " id="c-right" onClick={() => movePlayer('right')} />

        {!start && (
          <>
            <div className="absolute -inset-2 backdrop-blur-sm backdrop-filter">
              <div className="bg-base-primary fixed inset-0 opacity-10" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center  justify-center gap-2">
              {gameOver && (
                <div className="bg-black/20 p-2 text-lg">
                  SCORE:{' '}
                  <span className="text-lg font-bold oldstyle-nums text-arrd-highlight">{start ? score : 0}</span>
                </div>
              )}
              <Button onClick={() => startGame()} text="Jouer" size="large" type="secondary" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
