import { DiscordIcon } from './icons/discord.icon'

interface DiscordButtonProps {
  onClick: () => void
}

export function DiscordButton({ onClick }: DiscordButtonProps) {
  return (
    <div
      className="bg-discord text-white flex items-center gap-1 
  rounded-md p-2 cursor-pointer 
  fill-white hover:bg-discordHover ease-in-out duration-200"
      onClick={onClick}
    >
      <DiscordIcon />
      <div>Se connecter avec Discord</div>
    </div>
  )
}
