import { Avatar } from '@/components/avatar'
import { LogoAndGoBack } from '@/components/logo-and-goback'
import { Menu } from '@/components/menu'
import { Wallet } from '@/components/wallet'
import { SocketProvider } from '@/entities/socket'
import useIsMobile from '@/hooks/is-mobile.hook'

interface AuthLayoutProps {
  children: React.ReactNode
}
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <SocketProvider>
      <div
        className="
    grid
    gap-1
    h-screen
    grid-areas-menu-mobile
    grid-cols-menu-mobile
    grid-rows-menu-mobile
    md:grid-areas-menu-desktop
    md:grid-cols-menu-desktop
    md:grid-rows-menu-desktop
  "
      >
        <nav className="grid-in-nav flex justify-between items-center p-1">
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
