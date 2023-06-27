import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'

const Games = dynamic(() => import('@/pages_related').then((comp) => comp.Games), { ssr: false })
export default function GamesPage() {
  return <Games />
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req })
  return !session
    ? {
        redirect: { destination: '/login' },
      }
    : { props: { session } }
}
