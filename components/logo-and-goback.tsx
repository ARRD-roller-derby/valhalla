/* eslint-disable react-hooks/exhaustive-deps */
// Bibliothèques externes
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useMemo } from 'react'
import Image from 'next/image'

// Bibliothèques internes
import { useIsMobile } from '@/hooks'
import { APP_NAME, routes } from '@/utils'
import { ArrowLeftIcon } from '@/ui'

export function LogoAndGoBack() {
  // hooks
  const isMobile = useIsMobile()
  const router = useRouter()

  // const
  const currentPage = useMemo(() => {
    const routeRegex = new RegExp(router.route)
    const findRoute = routes.find((route) => route.path.match(routeRegex))
    const title = findRoute?.name || ''
    return title || APP_NAME
  }, [router.route])

  // render
  if (router.asPath !== '/agenda' && isMobile)
    return (
      <Link className="flex items-center gap-1" href={'/'}>
        <ArrowLeftIcon className="fill-arrd-primary text-lg" />
        <div className="text-tierce">{currentPage}</div>
      </Link>
    )

  return (
    <div>
      <Image
        src="/static/images/valhalla.svg"
        alt="logo"
        width={50}
        height={50}
        className="h-8 w-8 cursor-pointer rounded-full"
      />
    </div>
  )
}
