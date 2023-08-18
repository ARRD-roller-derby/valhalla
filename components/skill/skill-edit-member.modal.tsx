// Bibliothèques externes
import { useState } from 'react'

// Bibliothèques internes
import { useSkill, useSkills } from '@/entities'
import { EditIcon, FooterModal, Modal } from '@/ui'
import { SkillUserLevelSelector } from '@/components'

interface SkillEditModalProps {
  providerAccountId: string
}
export function SkillEditModal({ providerAccountId }: SkillEditModalProps) {
  // Stores -----------------------------------
  const { skill } = useSkill()
  const { getMember } = useSkills()
  const member = getMember(providerAccountId)
  const memberInSkill = skill.users.find((user) => user.providerAccountId === providerAccountId)
  const { loadingUpdateUserLevel, updateSkillUserLevel } = useSkills()

  // Constantes -----------------------------------
  const initialLevel = () => {
    if (!memberInSkill) return 'Non acquis'
    if (memberInSkill.master) return 'Maîtrisé'
    if (memberInSkill.learned) return 'Appris'
    if (memberInSkill.notAcquired) return 'Non acquis'
    return 'Non acquis'
  }

  // States -----------------------------------
  const [level, setLevel] = useState(initialLevel())

  if (!member) return <></>
  return (
    <Modal
      title={`modifier le niveau de ${member.username} pour ${member.username}`}
      button={(onClick) => (
        <div onClick={onClick} className="cursor-pointer">
          <EditIcon className="fill-arrd-primary" />
        </div>
      )}
      footer={(close) => (
        <FooterModal
          closeModal={close}
          loading={loadingUpdateUserLevel}
          txtConfirm="Modifier le niveau"
          onConfirm={() => updateSkillUserLevel(skill._id, member.providerAccountId, level)}
        />
      )}
    >
      {() => (
        <div className="flex flex-col gap-2 p-4">
          <SkillUserLevelSelector defaultValue={initialLevel()} onSelect={(level) => setLevel(level)} />
        </div>
      )}
    </Modal>
  )
}
