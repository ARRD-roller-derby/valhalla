import { useEvent, useEvents } from '@/entities'
import { Button, FooterModal, Modal } from '@/ui'

export function EventCancelBtn() {
  const { loadingEvent, cancel } = useEvents()
  const { event } = useEvent()
  const actionType = event.cancelled ? 'Rétablir' : 'Annuler'

  const handleSubmit = async () => {
    await cancel(event._id)
  }

  return (
    <Modal
      title={`${actionType} l'événement`}
      button={(onClick) => <Button onClick={onClick} text={`${actionType} l'événement`} type="secondary" />}
      footer={(close) => (
        <FooterModal
          closeModal={close}
          loading={loadingEvent === event._id}
          txtConfirm={`${actionType} l'événement`}
          onConfirm={handleSubmit}
        />
      )}
    >
      {() => (
        <div className="p-4">
          Êtes-vous sûr de vouloir <span className="font-bold">{actionType}</span>{' '}
          <span className="text-arrd-highlight">{event.title}</span> ?
        </div>
      )}
    </Modal>
  )
}
