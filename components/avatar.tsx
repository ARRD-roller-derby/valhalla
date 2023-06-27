/* eslint-disable @next/next/no-img-element */
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useSession } from 'next-auth/react'
import { dc } from '@/utils'

export function Avatar() {
  const { data: session } = useSession()

  if (!session) return null
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
        <Menu.Items className="divide-second-100 absolute right-0 z-30 m-3 w-56 origin-top-right divide-y rounded-md border border-arrd-bgLight bg-arrd-bgDark shadow-lg ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>{({ active }) => <button>Edit</button>}</Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={dc('group flex w-full items-center rounded-md px-2 py-2 text-sm', [
                    active,
                    'bg-violet-500 text-white',
                    'text-gray-900',
                  ])}
                >
                  Duplicate
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={dc('group flex w-full items-center rounded-md px-2 py-2 text-sm', [
                    active,
                    'bg-violet-500 text-white',
                    'text-gray-900',
                  ])}
                >
                  Archive
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                  } group  flex  w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Move
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
