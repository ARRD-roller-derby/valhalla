// Bibliothèques externes
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
export default function IndexPage() {
  return <></>
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req })

  return {
    redirect: { destination: session ? '/agenda' : '/login' },
  }
}
