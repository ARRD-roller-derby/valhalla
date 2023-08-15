/* eslint-disable @next/next/no-img-element */

// Bibliothèques externes
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

// Bibliothèques internes
import { dc } from '@/utils'

export function Avatar() {
  // stores
  const { data: session } = useSession()

  if (!session) return <></>

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button as="div">
          <div>
            <img
              src={session.user.image}
              alt="avatar"
              className="h-8 w-8 cursor-pointer rounded-full border-2 border-arrd-primary"
            />
          </div>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="input divide-second-100 absolute right-0 z-30 m-3 flex w-56 origin-top-right flex-col divide-y">
          <Menu.Item>
            {({ active }) => (
              <button
                className={dc('p-1 text-left text-sm text-arrd-textLight', [active, 'bg-arrd-secondary'])}
                onClick={() => signOut()}
              >
                Déconnexion
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
