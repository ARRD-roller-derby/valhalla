interface EditorMenuGroupProps {
  children: React.ReactNode
}

export function EditorMenuGroup({ children }: EditorMenuGroupProps) {
  return <div className="flex gap-2">{children}</div>
}
