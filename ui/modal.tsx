// Bibliothèques externes
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

// Bibliothèques internes
import { Button, CrossIcon, Loader } from '@/ui'

// FOOTER ---------------------------------------------

interface FooterModalProps {
  closeModal: () => void
  onCancel?: () => void
  onConfirm?: () => Promise<void>
  onConfirmCb?: (cb: () => void) => Promise<void>
  txtCancel?: string
  txtConfirm?: string
  loading?: boolean
}

export function FooterModal({
  onCancel,
  closeModal,
  onConfirm,
  onConfirmCb,
  txtCancel,
  txtConfirm,
  loading,
}: FooterModalProps) {
  // functions
  const handleCancel = () => {
    onCancel?.()
    closeModal()
  }

  const handleConfirm = async () => {
    if (loading) return
    if (onConfirm) await onConfirm()
    if (onConfirmCb) {
      await onConfirmCb(closeModal)
      return
    }
    closeModal()
  }

  return (
    <div className="mt-2 flex justify-between gap-1 px-3">
      <Button text={txtCancel || 'Annuler'} type="secondary" onClick={handleCancel} />
      {loading ? <Loader /> : <Button text={txtConfirm || 'Valider'} onClick={handleConfirm} />}
    </div>
  )
}

// MODAL ---------------------------------------------

interface ModalProps {
  children: (close: () => void) => React.ReactNode
  button: (open: () => void) => React.ReactNode
  title?: string
  footer?: (close: () => void) => React.ReactNode
  onClose?: () => void
  onOpen?: () => void
}

export function Modal({ title, children, button, onOpen, onClose, footer }: ModalProps) {
  // states
  const [isOpen, setIsOpen] = useState(false)

  // functions
  const closeModal = () => {
    onClose?.()
    setIsOpen(false)
  }

  const openModal = () => {
    onOpen?.()
    setIsOpen(true)
  }

  return (
    <>
      {button(openModal)}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex h-full items-center justify-center text-center md:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="z-50 grid max-h-screen w-full max-w-md transform grid-rows-[auto_1fr_auto] bg-arrd-bg pb-2 text-left align-middle shadow-xl ring-1 ring-arrd-accent transition-all md:rounded">
                  <Dialog.Title
                    as="h3"
                    className="flex justify-between p-2 text-2xl font-medium leading-6 text-arrd-primary"
                  >
                    <div>{title}</div>
                    <div onClick={closeModal}>
                      <CrossIcon className="h-7 w-7 cursor-pointer fill-arrd-primary" />
                    </div>
                  </Dialog.Title>

                  {children(closeModal)}

                  {footer && footer(closeModal)}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
