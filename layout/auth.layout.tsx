import { Avatar } from '@/components/avatar'
import { LogoAndGoBack } from '@/components/logo-and-goback'
import { SocketProvider } from '@/entities/socket'

interface AuthLayoutProps {
  children: React.ReactNode
}
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <SocketProvider>
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-1 h-screen">
        <nav className="col-span-full flex justify-between items-center p-1">
          <LogoAndGoBack />
          <div className="flex items-center gap-1">
            <p>wallet (ecoute le socket)</p>
            <Avatar />
          </div>
        </nav>
        <div className="MENU">
          <div>AGENDA</div>
          <div>Skills</div>
          <div>JEUX</div>
          <div>REPERTOIRE</div>
        </div>
        <main className="h-full overflow-y-auto">{children}</main>
      </div>
    </SocketProvider>
  )
}
