import { useState } from 'react'

export function useLocalState<T>(
  initialState: T,
  nameOfState: string
): {
  localState: T
  setLocalState: (newState: T) => void
} {
  const ls = (): T => {
      if (typeof window !== 'undefined') {
        const ls = localStorage.getItem(nameOfState)
        return ls ? JSON.parse(ls) : initialState
      } else {
        return initialState
      }
    },
    [state, setState] = useState<T>(ls())

  const setLocalState = (newState: T) => {
    setState(newState)
    localStorage.setItem(nameOfState, JSON.stringify(newState))
  }

  return {
    localState: state,
    setLocalState,
  }
}
