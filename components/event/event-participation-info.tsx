import { InfoIcon, Modal } from '@/ui'
import { participationTypes } from '@/utils'

export function EventParticipationInfo() {
  // Rendu ------------------------------------------------------------------
  return (
    <Modal
      title="Signification des Icônes de Présence"
      button={(onClick) => (
        <button
          type="button"
          aria-label="Afficher la signification des icônes de présence"
          className="flex h-full items-center justify-center border-0 bg-transparent p-0 opacity-20"
          onClick={onClick}
        >
          <InfoIcon className="h-4 w-4 fill-arrd-text" />
        </button>
      )}
    >
      {() => (
        <div className="flex flex-col justify-center gap-1">
          <div className="p-3 text-sm italic">
            Saviez-vous ? Double-cliquez sur l&rsquo;icône de présence pour indiquer que votre participation est à confirmer !
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
