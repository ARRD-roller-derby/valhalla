import { Avatar, LogoAndGoBack, Menu, Wallet } from '@/components'
import { SocketProvider } from '@/entities'
import { dc } from '@/utils'
import Head from 'next/head'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
}
export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <SocketProvider>
      <div
        className={dc(
          'grid h-screen gap-1',
          'grid-areas-menu-mobile',
          'grid-cols-menu-mobile',
          'grid-rows-menu-mobile',
          'md:grid-areas-menu-desktop',
          'md:grid-cols-menu-desktop',
          'md:grid-rows-menu-desktop',
          'bg-arrd-bg text-arrd-text'
        )}
      >
        <Head>
          <title>{title ? `${title} | ` : ''}Valhalla</title>
        </Head>
        <nav className="flex items-center justify-between p-1 grid-in-nav">
          <LogoAndGoBack />
          <div className="flex items-center gap-3">
            <Wallet />
            <Avatar />
          </div>
        </nav>
        <div className="grid-in-menu">
          <Menu />
        </div>
        <main className="h-full overflow-y-auto grid-in-main">{children}</main>
      </div>
    </SocketProvider>
  )
}
