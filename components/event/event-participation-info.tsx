import { InfoIcon, Modal } from '@/ui'
import { participationTypes } from '@/utils'

export function EventParticipationInfo() {
  return (
    <Modal
      title="Signification des Icônes de Présence"
      button={(onClick) => (
        <div onClick={onClick} className="flex h-full cursor-pointer items-center justify-center opacity-20">
          <InfoIcon className="h-4 w-4 fill-arrd-text" />
        </div>
      )}
    >
      {() => (
        <div className="flex flex-col justify-center gap-1">
          <div className="p-3 text-sm italic">
            Saviez-vous ? Double-cliquez sur l'icône de présence pour indiquer que votre participation est à confirmer !
          </div>
          <div className="grid grid-cols-2 gap-3 fill-arrd-highlight px-3 ">
            {participationTypes.map((pType) => (
              <div
                key={pType.key}
                className="flex flex-col items-center gap-1 rounded-sm border border-arrd-border bg-arrd-bgDark p-2"
              >
                <div>{pType.icon}</div>
                <div className="text-sm">{pType.key}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
