interface CardProps {
  children: React.ReactNode
}

export function Card({ children }: CardProps) {
  return <div className="rounded border border-arrd-border bg-arrd-bgDark p-2">{children}</div>
}
