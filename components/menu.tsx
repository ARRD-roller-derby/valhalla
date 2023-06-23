import useIsMobile from '@/hooks/is-mobile.hook'
import { routes } from '@/utils/menu.routes'
import Link from 'next/link'
import { useRouter } from 'next/router'

export function Menu() {
  const router = useRouter()
  const isMobile = useIsMobile()
  return (
    <div className="flex gap-1 flex-auto justify-around p-3 md:flex-col">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link key={route.name} href={route.path}>
            <div
              className="color-arrd flex gap-1 items-center"
              data-active={router.pathname === route.path}
            >
              <Icon className="fill-arrd text-3xl md:text-base" />
              {!isMobile && ' ' + route.name}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
