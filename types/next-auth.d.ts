import NextAuth from 'next-auth'

declare module 'next-auth' {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string
      emailVerified: string
      wallet: number
      roles: {
        id: string
        name: string
        color: string
      }[]
      nickname: string
      providerAccountId: string
    }
  }
}
