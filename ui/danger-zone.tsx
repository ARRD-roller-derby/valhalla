interface DangerZoneProps {
  children: React.ReactNode
}

export function DangerZone({ children }: DangerZoneProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="text-sm  text-arrd-textError">Zone dangereuse</div>
      <div className="w-full rounded border border-arrd-textError bg-arrd-bgDark p-4"> {children}</div>
    </div>
  )
}
