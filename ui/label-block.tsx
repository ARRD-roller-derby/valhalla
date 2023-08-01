// Bibliothèques internes
import { dc } from '@/utils'

interface LabelBlockProps {
  label: string
  children: React.ReactNode
  col?: boolean
}

export function LabelBlock({ label, children, col = false }: LabelBlockProps) {
  return (
    <div
      className={dc('grid items-center gap-1', [
        col,
        'grid-rows-[auto_1fr]',
        'grid-rows-[auto_1fr] md:grid-cols-[auto_1fr] md:gap-2',
      ])}
    >
      <label className="font-bold text-arrd-primary">{label}</label>
      {children}
    </div>
  )
}
