import { DiscordButton } from '@/ui'
import { APP_NAME } from '@/utils'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

export function Login() {
  const handleSignIn = () => {
    signIn('discord')
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 h-screen">
      <div className="w-24">
        <Image
          src="/static/images/valhalla.svg"
          alt="logo arrd"
          width={75}
          height={75}
        />
      </div>

      <h1>{APP_NAME}</h1>
      <div>
        <DiscordButton onClick={handleSignIn} />
      </div>
    </div>
  )
}
