/* eslint-disable react-hooks/exhaustive-deps */
import { useIsMobile } from '@/hooks'
import { useRouter } from 'next/router'
import { ArrowLeftIcon } from '@/ui'
import { useMemo } from 'react'
import Image from 'next/image'
import { APP_NAME, routes } from '@/utils'
import Link from 'next/link'

export function LogoAndGoBack() {
  const isMobile = useIsMobile()
  const router = useRouter()

  const currentPage = useMemo(() => {
    const routeRegex = new RegExp(router.route)
    const findRoute = routes.find((route) => route.path.match(routeRegex))
    const title = findRoute?.name || ''
    return title || APP_NAME
  }, [router.route])

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
