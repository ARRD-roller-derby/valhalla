// Bibliothèques externes
import { signIn } from 'next-auth/react'
import Image from 'next/image'

// Bibliothèques internes
import { DiscordButton } from '@/ui'
import { APP_NAME } from '@/utils'

export function Login() {
  // functions
  const handleSignIn = () => {
    signIn('discord')
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 bg-arrd-bg">
      <Image src="/static/images/valhalla.svg" alt="logo arrd" width={75} height={75} />

      <h1 className="font-amatic text-2xl">{APP_NAME}</h1>
      <div>
        <DiscordButton onClick={handleSignIn} />
      </div>
    </div>
  )
}
