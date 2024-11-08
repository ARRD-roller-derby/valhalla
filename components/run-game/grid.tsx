import { GRID_SIZE_COLS, GRID_SIZE_ROWS, useRunGame } from '@/entities/rungame.store'
import { BoltIcon, DragonIcon } from '@/ui'
import { useEffect, useRef } from 'react'

export function Grid() {
  // ---- Store ---- //
  const {
    grid,
    player,
    jammer,
    score,
    movePlayer: _movePlayer,
    runJammer: _runJammer,
    initGame,
    increaseScore,
    decreaseScore,
  } = useRunGame()

  // ---- Refs ---- //
  const refs = useRef({
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

  const movePlayer = (direction: 'left' | 'right', colNum?: number) => {
    const { x } = refs.current.player
    if (colNum) {
      refs.current.player.x = colNum
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

    refs.current.previousTime = time
    refs.current.request = requestAnimationFrame(run)
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

    recognition.onerror = (event) => {
      console.error('Erreur de reconnaissance vocale', event)
      if (event.error === 'network' && retryCount < maxRetries) {
        console.log('Relancement de la reconnaissance vocale après une erreur réseau.')
        retryCount += 1 // Augmenter le compteur de tentatives
        if (!isRestarting && !isRecognizing) {
          isRestarting = true // Marquer le redémarrage en cours
          recognition.start()
        }
      } else {
        console.error('Erreur critique ou nombre maximal de tentatives atteint. Arrêt de la reconnaissance vocale.')
      }
    }

    recognition.onend = () => {
      console.log('Reconnaissance terminée, relancement...')
      isRecognizing = false

      if (!isRestarting && retryCount < maxRetries) {
        isRestarting = true // Marquer le redémarrage en cours
        recognition.start()
      }
    }

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1]
      const command = lastResult[0].transcript.trim().toLowerCase()

      console.log('Commande reconnue:', command)
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
        refs.current.recognitionInstance.stop()
        refs.current.recognitionInstance = null
      }
    }
  }, [])

  // === RENDER === //

  if (!grid?.length) return null
  return (
    <div className="max-h-max w-full max-w-md">
      <div>SCORE: {score}</div>
      <div
        className="relative grid max-h-max w-full max-w-md cursor-pointer"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE_COLS}, 1fr)`,
        }}
      >
        {/* CONTRÔLES DU JEU */}
        <div className="absolute bottom-0 left-0 top-0 w-1/2" id="c-left" onClick={() => movePlayer('left')} />
        <div className="absolute bottom-0 right-0 top-0 w-1/2 " id="c-right" onClick={() => movePlayer('right')} />

        {grid.map((row, x) => (
          <div key={x} className="flex flex-col">
            {row.map((col, y) => (
              <div key={y} className="h-6 border-x border-x-orange-600">
                {/* Player */}
                {x === player.x && y === player.y && (
                  <div className="flex h-full w-full items-center justify-center fill-arrd-highlight">
                    <DragonIcon />
                  </div>
                )}
                {/* Jammer */}
                {x === jammer.x && y === jammer.y && (
                  <div className="flex h-full w-full items-center justify-center fill-arrd-textError">
                    <BoltIcon />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
