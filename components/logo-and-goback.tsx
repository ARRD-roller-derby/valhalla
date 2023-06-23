import useIsMobile from '@/hooks/is-mobile.hook'
import { useRouter } from 'next/router'
import { ArrowLeft } from '../ui/icons/arrow-left.icon'
import { useMemo } from 'react'
import { pageTitle } from '@/utils/pageTitle'
import Image from 'next/image'
import { APP_NAME } from '@/utils/constants'

export function LogoAndGoBack() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const currentPage = useMemo(() => {
    const title = pageTitle?.[router.route] || ''
    return title || APP_NAME
  }, [router.route])

  if (router.asPath !== '/' && isMobile)
    return (
      <div>
        <ArrowLeft />
        <div>{currentPage}</div>
      </div>
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
