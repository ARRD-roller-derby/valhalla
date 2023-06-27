import { SessionProvider } from 'next-auth/react'
import 'leaflet/dist/leaflet.css'
import 'nprogress/nprogress.css'
import '../styles/globals.css'
import 'cropperjs/dist/cropper.css'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import fr from 'dayjs/locale/fr'
import NProgress from 'nprogress'
import { Router } from 'next/router'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())
NProgress.configure({ showSpinner: false })

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.locale(fr)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/Paris')

export default function App({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
