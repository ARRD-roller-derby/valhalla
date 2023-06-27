import { useEvent, useEvents } from '@/entities'
import { Button, FooterModal, Modal } from '@/ui'
import { useRouter } from 'next/router'

export function EventDeleteBtn() {
  const router = useRouter()
  const { loadingEvent, del } = useEvents()
  const { event } = useEvent()
  const txt = "Supprimer l'événement"

  const handleSubmit = async () => {
    del(event._id)
    router.push('/agenda')
  }

  return (
    <Modal
      title={txt}
      button={(onClick) => <Button onClick={onClick} text={txt} type="danger" />}
      footer={(close) => (
        <FooterModal
          closeModal={close}
          loading={loadingEvent === event._id}
          txtConfirm={txt}
          onConfirm={handleSubmit}
        />
      )}
    >
      {() => (
        <div className="p-4">
          Êtes-vous sûr de vouloir <span className="font-bold">supprimer</span>{' '}
          <span className="text-arrd-highlight">{event.title}</span> ?
        </div>
      )}
    </Modal>
  )
}
