import { Avatar } from '@/components/avatar'
import { SocketProvider } from '@/entities/socket'

interface AuthLayoutProps {
  children: React.ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <SocketProvider>
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-1 h-screen">
        <nav className="col-span-full flex justify-between items-center">
          BARRE DE NAV
          <Avatar />
        </nav>
        <div className="MENU">menu</div>
        <main className="h-full overflow-y-auto">{children}</main>
      </div>
    </SocketProvider>
  )
}
