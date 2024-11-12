// Bibliothèques internes
import { dc } from '@/utils'

interface ButtonProps {
  text: string
  loading?: boolean
  disabled?: boolean
  onClick: () => void
  size?: 'small' | 'default' | 'large'
  type?: 'primary' | 'secondary' | 'danger' | 'invert-secondary' | 'invert-primary'
}

export function Button({ onClick, text, type, size = 'default', disabled, loading }: ButtonProps) {
  // const
  const styles = {
    primary: 'bg-arrd-bgLight text-arrd-textExtraLight',
    secondary: 'bg-arrd-secondary text-arrd-textExtraLight',
    danger: 'bg-arrd-textError text-arrd-textExtraLight',
    'invert-secondary': 'bg-transparent border border-arrd-secondary text-arrd-secondary',
    'invert-primary': 'bg-transparent border border-arrd-primary text-arrd-primary',
  }

  return (
    <button
      onClick={onClick}
      data-size={size}
      className={dc(
        'rounded-md text-sm',
        'px-2 py-1 data-[size=small]:rounded-sm data-[size=large]:p-3 data-[size=small]:p-1 data-[size=large]:text-lg  data-[size=small]:text-xs md:px-4 md:py-2',
        styles[type || 'primary']
      )}
      disabled={disabled}
    >
      {loading ? 'Chargement...' : text}
    </button>
  )
}
