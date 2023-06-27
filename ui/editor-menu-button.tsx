import { dc } from '@/utils'
import { Editor } from '@tiptap/react'

interface EditorMenuBtnProps {
  editor: Editor
  name: string
  onClick: () => void
  isDisabled: () => boolean
  icon: React.ReactNode
}
export function EditorMenuBtn({ name, onClick, isDisabled, icon, editor }: EditorMenuBtnProps) {
  return (
    <button
      key={name}
      onClick={onClick}
      disabled={isDisabled()}
      className={dc(
        'rounded border border-arrd-border fill-arrd-text p-1 text-sm',
        'hover:border-arrd-textLight hover:fill-arrd-textLight',
        [editor.isActive(name), 'border-arrd-accent', 'border-arrd-border']
      )}
    >
      {icon}
    </button>
  )
}
