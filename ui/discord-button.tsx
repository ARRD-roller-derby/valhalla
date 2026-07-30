// Bibliothèques internes
import { DiscordIcon } from '@/ui'

interface DiscordButtonProps {
  onClick: () => void
}

export function DiscordButton({ onClick }: DiscordButtonProps) {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-1 rounded-md border-0
  bg-arrd-discord fill-white p-2
  text-white duration-200 ease-in-out hover:bg-arrd-discordHover"
      onClick={onClick}
    >
      <DiscordIcon />
      <span>Se connecter avec Discord</span>
    </button>
  )
}
