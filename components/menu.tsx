// Bibliothèques externes
import Link from 'next/link'
import { useRouter } from 'next/router'

// Bibliothèques internes
import { useIsMobile } from '@/hooks'
import { dc, routes } from '@/utils'

export function Menu() {
  // hooks --------------------------------------------------
  const router = useRouter()
  const isMobile = useIsMobile()

  // Rendu --------------------------------------------------
  return (
    <div className="flex flex-auto justify-around gap-1 p-3 md:flex-col">
      {routes
        .filter((route) => route.inMenu)
        .map((route) => {
          const Icon = route.icon
          return (
            <Link key={route.name} href={route.path}>
              <div
                className={dc('flex items-center gap-1', [
                  router.pathname.includes(route.path),
                  'text-arrd-highlight',
                  'text-arrd-primary',
                ])}
                data-active={router.pathname.includes(route.path)}
              >
                <Icon
                  className={dc(' text-3xl md:text-base', [
                    router.pathname.includes(route.path),
                    'fill-arrd-highlight',
                    'fill-arrd-primary',
                  ])}
                />
                {!isMobile && ' ' + route.name}
              </div>
            </Link>
          )
        })}
    </div>
  )
}
