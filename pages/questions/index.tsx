// Bibliothèques externes
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'

// Import dynamique
const Questions = dynamic(() => import('@/pages_related').then((comp) => comp.Questions), { ssr: false })
export default function QuestionsPage() {
  return <Questions />
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = (await getSession({ req })) as any

  if (!session) return { redirect: { destination: '/login' } }

  const roles = session?.user?.roles || []

  if (!roles.some((role: any) => ['bureau', 'dev'].includes(role.name.toLocaleLowerCase())))
    return { redirect: { destination: '/login' } }

  return { props: { session } }
}
