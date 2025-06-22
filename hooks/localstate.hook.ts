// Bibliothèque externe
import { useState } from 'react'

export function useLocalState<T>(
  initialState: T,
  nameOfState: string
): {
  localState: T
  setLocalState: (newState: T) => void
} {
  // const
  const ls = (): T => {
      if (typeof window !== 'undefined') {
        const ls = localStorage.getItem(nameOfState)
        if (!ls) return initialState
        try {
          const parsed = JSON.parse(ls)
          return parsed
        } catch (error) {
          return initialState
        }
      } else {
        return initialState
      }
    },
    [state, setState] = useState<T>(ls())

  const setLocalState = (newState: T) => {
    if (typeof newState === 'object') {
      setState(newState)
      localStorage.setItem(nameOfState, JSON.stringify(newState))
    } else if (typeof newState === 'function') {
      setState((prev) => {
        const state = newState(prev)
        localStorage.setItem(nameOfState, JSON.stringify(state))
        return state
      })
    }
  }

  return {
    localState: state,
    setLocalState,
  }
}
