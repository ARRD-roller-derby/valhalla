// Bibliothèques externes
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'

// Import dynamique
const Badge = dynamic(() => import('@/pages_related').then((comp) => comp.Badge), { ssr: false })
export default function BadgesPage() {
  return <Badge />
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req })
  return !session
    ? {
        redirect: { destination: '/login' },
      }
    : { props: { session } }
}
