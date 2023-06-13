import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'
import { useSession, signIn, signOut } from 'next-auth/react'
export default function App() {
  const { data: session } = useSession()

  console.log(session)
  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req })
  return !session
    ? {
        redirect: { destination: '/login' },
      }
    : { props: { session } }
}
