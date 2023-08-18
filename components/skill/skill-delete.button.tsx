// Bibliothèques externes
import { useRouter } from 'next/router'

// Bibliothèques internes
import { useSkill, useSkills } from '@/entities'
import { Button, FooterModal, Modal } from '@/ui'

export function SkillDeleteBtn() {
  // Stores -----------------------------------------------------------------
  const { loadingSkill, del } = useSkills()
  const { skill } = useSkill()

  // Hooks ------------------------------------------------------------------
  const router = useRouter()

  // Const ------------------------------------------------------------------
  const txt = 'Supprimer la compétence'

  // Fonctions --------------------------------------------------------------
  const handleSubmit = async () => {
    del(skill._id)
    router.push('/skills')
  }

  //Rendu ------------------------------------------------------------------
  return (
    <Modal
      title={txt}
      button={(onClick) => <Button onClick={onClick} text={txt} type="danger" />}
      footer={(close) => (
        <FooterModal
          closeModal={close}
          loading={loadingSkill === skill._id}
          txtConfirm={txt}
          onConfirm={handleSubmit}
        />
      )}
    >
      {() => (
        <div className="p-4">
          Êtes-vous sûr de vouloir <span className="font-bold">supprimer</span>{' '}
          <span className="text-arrd-highlight">{skill.name}</span> ?
        </div>
      )}
    </Modal>
  )
}
