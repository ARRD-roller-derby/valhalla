import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'

const Skills = dynamic(() => import('@/pages_related').then((comp) => comp.Skills), { ssr: false })
export default function SkillsPage() {
  return <Skills />
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req })
  return !session
    ? {
        redirect: { destination: '/login' },
      }
    : { props: { session } }
}
