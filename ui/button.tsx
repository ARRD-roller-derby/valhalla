// Bibliothèques internes
import { dc } from '@/utils'

interface ButtonProps {
  text: string
  loading?: boolean
  disabled?: boolean
  onClick: () => void
  type?: 'primary' | 'secondary' | 'danger'
}

export function Button({ onClick, text, type, disabled, loading }: ButtonProps) {
  // const
  const styles = {
    primary: 'bg-arrd-bgLight',
    secondary: 'bg-arrd-secondary',
    danger: 'bg-arrd-textError',
  }

  return (
    <button
      onClick={onClick}
      className={dc(
        'rounded-md text-sm text-arrd-textExtraLight',
        'px-2 py-1 md:px-4 md:py-2',
        styles[type || 'primary']
      )}
      disabled={disabled}
    >
      {loading ? 'Chargement...' : text}
    </button>
  )
}
