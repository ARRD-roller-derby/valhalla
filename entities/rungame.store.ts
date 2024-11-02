import { create } from 'zustand'

export const GRID_SIZE_COLS = 4 // X
export const GRID_SIZE_ROWS = 4 * 4 // Y

type RunGameState = {
  grid: number[][]
  indicator: { x: number; y: number }
  jammer: { x: number; y: number }
  player: { x: number; y: number }
  score: number
}

type RunGameGetters = {
  initGame: () => void
  generateGrid: () => void
}

type RunGameSetters = {
  movePlayer: (direction: 'left' | 'right') => void
  runJammer: (x?: number) => void
}

export type RunGameStore = RunGameState & RunGameGetters & RunGameSetters

export const useRunGame = create<RunGameStore>((set, get) => ({
  grid: [],
  jammer: { x: 0, y: GRID_SIZE_ROWS - 1 },
  player: { x: 1, y: 2 },
  indicator: { x: 0, y: 0 },
  score: 0,
  generateGrid() {
    const grid = Array.from({ length: GRID_SIZE_COLS }, () => Array.from({ length: GRID_SIZE_ROWS }, () => 0))
    set({ grid })
  },
  initGame() {
    // ====== initialiser le jeu ====== //

    get().generateGrid()
    //TODO creer la grille.
    //TODO placer le joueur
  },

  // ====== SETTERS ====== //
  movePlayer(direction) {
    const { player } = get()
    const { x, y } = player
    if (direction === 'left' && x === 0) return
    if (direction === 'right' && x === GRID_SIZE_COLS - 1) return

    const newX = direction === 'left' ? x - 1 : x + 1
    set({ player: { x: newX, y } })
  },
  runJammer(newX) {
    const { jammer } = get()

    const newY = jammer.y - 1 < 0 ? GRID_SIZE_ROWS - 1 : jammer.y - 1

    set({ jammer: { x: newX || jammer.x, y: newY } })
  },
}))
