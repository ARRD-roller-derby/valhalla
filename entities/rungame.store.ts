import { create } from 'zustand'

export const GRID_SIZE_COLS = 4 // X
export const GRID_SIZE_ROWS = 4 * 4 // Y

type RunGameState = {
  grid: number[][]
  indicator: { x: number; y: number }
  jammer: { x: number; y: number }
  player: { x: number; y: number }
  score: number
  start: boolean
  gameOver: boolean
}

type RunGameGetters = {
  initGame: () => RunGameState['grid']
  generateGrid: () => RunGameState['grid']
}

type RunGameSetters = {
  movePlayer: (direction: 'left' | 'right', colNum?: number) => void
  runJammer: (x: number | undefined, deepY: number) => void
  increaseScore: () => void
  decreaseScore: () => void
  startGame: () => void
  stopGame: () => void
}

export type RunGameStore = RunGameState & RunGameGetters & RunGameSetters

export const useRunGame = create<RunGameStore>((set, get) => ({
  start: false,
  gameOver: false,
  grid: [],
  jammer: { x: 0, y: GRID_SIZE_ROWS - 1 },
  player: { x: 1, y: 2 },
  indicator: { x: 0, y: 0 },
  score: 0,
  generateGrid() {
    const grid = Array.from({ length: GRID_SIZE_COLS }, () => Array.from({ length: GRID_SIZE_ROWS }, () => 0))
    set({ grid })
    return grid
  },
  initGame() {
    // ====== initialiser le jeu ====== //

    return get().generateGrid()
  },

  // ====== SETTERS ====== //
  movePlayer(direction, colNum) {
    const { player } = get()
    const { x, y } = player

    if (colNum) {
      set({ player: { x: colNum, y } })
      return
    }
    if (direction === 'left' && x === 0) return
    if (direction === 'right' && x === GRID_SIZE_COLS - 1) return

    const newX = direction === 'left' ? x - 1 : x + 1
    set({ player: { x: newX, y } })
  },
  runJammer(newX, deepY) {
    const { jammer } = get()
    set({ jammer: { x: newX || jammer.x, y: deepY } })
  },
  increaseScore() {
    set((state) => ({ score: state.score + 10 }))
  },
  decreaseScore() {
    const { score, start } = get()
    const newScore = score - 5
    if (newScore < 0 && start) return set({ gameOver: true, start: false })
    set((state) => ({ score: state.score - 5 }))
  },
  startGame() {
    set({ start: true, gameOver: false, score: 0, jammer: { x: get().jammer.x, y: GRID_SIZE_ROWS + 40 } })
  },
  stopGame() {
    set({ start: false, gameOver: true })
  },
}))
