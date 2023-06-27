import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import dynamic from 'next/dynamic'

const Login = dynamic(
  () => import('@/pages_related/login.page').then((comp) => comp.Login),
  {
    ssr: false,
  }
)
export default function LoginPage() {
  return <Login />
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req })
  return session
    ? {
        redirect: { destination: '/' },
      }
    : { props: {} }
}
