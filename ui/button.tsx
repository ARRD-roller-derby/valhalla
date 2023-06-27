import { dc } from '@/utils'

interface ButtonProps {
  text: string
  loading?: boolean
  disabled?: boolean
  onClick: () => void
  type?: 'primary' | 'secondary' | 'danger'
}

export function Button({
  onClick,
  text,
  type,
  disabled,
  loading,
}: ButtonProps) {
  const styles = {
    primary: 'bg-arrd',
    secondary: 'bg-second',
    danger: 'bg-txtError',
  }

  return (
    <button
      onClick={onClick}
      className={dc(
        'text-white rounded-md',
        'px-2 py-1 md:px-4 md:py-2',
        styles[type || 'primary']
      )}
      disabled={disabled}
    >
      {loading ? 'Chargement...' : text}
    </button>
  )
}
