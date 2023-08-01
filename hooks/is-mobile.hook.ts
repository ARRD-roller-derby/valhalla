/* eslint-disable react-hooks/exhaustive-deps */
// Bibliothèque externe
import { useEffect } from 'react'

// Bibliothèque interne
import { useLocalState } from '@/hooks'

export function useIsMobile(): boolean {
  // state
  const { localState, setLocalState } = useLocalState<{ isMobile: boolean }>({ isMobile: true }, 'valhalla_device')

  // functions
  function handleResize() {
    setLocalState({ isMobile: window.innerWidth <= 600 ? true : false })
  }

  // effects
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
  }, [])

  return typeof window !== 'undefined' ? localState.isMobile : false
}
