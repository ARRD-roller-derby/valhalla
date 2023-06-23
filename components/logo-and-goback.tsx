/* eslint-disable react-hooks/exhaustive-deps */
import useIsMobile from '@/hooks/is-mobile.hook'
import { useRouter } from 'next/router'
import { ArrowLeft } from '../ui/icons/arrow-left.icon'
import { useMemo } from 'react'
import Image from 'next/image'
import { APP_NAME } from '@/utils/constants'
import { routes } from '@/utils/menu.routes'
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
      <Link className="flex gap-1 items-center" href={'/'}>
        <ArrowLeft className="fill-arrd text-lg" />
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
        className="rounded-full w-8 h-8 border-2 border-arrd cursor-pointer"
      />
    </div>
  )
}
