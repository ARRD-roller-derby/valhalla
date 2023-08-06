import { ISkill } from '@/models'
import { Button, Checkbox, FooterModal, LabelBlock, Modal, TextInput } from '@/ui'
import { SkillCategorySelector } from './skill-category.selector'
import { SKILL_CATEGORIES } from '@/utils'
import { useState } from 'react'
import { useSkills } from '@/entities'
import { SkillLevelSelector } from './skill-level.selector'
import { Editor } from '../editor'
import { TagLevelSelector } from '../tag'

interface SkillCreateBtnProps {
  onClick?: () => void
  skill?: ISkill
}
export function SkillFormModal({ skill }: SkillCreateBtnProps) {
  //store
  const { loadingCreate, createSkill } = useSkills()

  // const
  const actionType = skill ? 'Modifier' : 'Créer' // ou modifier
  const descaler = skill ? 'la' : 'une' // ou modifier

  const formInit: {
    name: string
    msp: boolean
    description: any
    category: {
      label: string
      value: string
    }
    tags: string[]
  } = {
    name: '',
    msp: false,
    description: {},
    category: {
      label: SKILL_CATEGORIES.derby,
      value: SKILL_CATEGORIES.derby,
    },
    tags: [],
  }

  // state
  const [form, setForm] = useState(formInit)

  // Functions

  const handleCreate = async () => {
    const newSkill = {
      ...form,
      category: form.category.value,
    }

    createSkill(newSkill)
    setForm(formInit)
  }

  return (
    <Modal
      title={`${actionType} ${descaler} compétence`}
      button={(onClick) => <Button onClick={onClick} text={`${actionType} ${descaler} compétence`} type="secondary" />}
      footer={(close) => (
        <FooterModal
          closeModal={close}
          loading={loadingCreate}
          txtConfirm="Créer la compétence"
          onConfirm={handleCreate}
        />
      )}
    >
      {() => (
        <div className="flex flex-col gap-2 p-4">
          <LabelBlock label="Nom">
            <TextInput value={form.name} setValue={(name) => setForm((prev) => ({ ...prev, name }))} />
          </LabelBlock>

          <LabelBlock label="Catégorie">
            <SkillCategorySelector onSelect={(type) => setForm((prev) => ({ ...prev, type }))} />
          </LabelBlock>

          <LabelBlock label="Niveau">
            <SkillLevelSelector onSelect={(type) => setForm((prev) => ({ ...prev, type }))} />
          </LabelBlock>

          <div className="my-2">
            <Checkbox
              label="Requis pour les MSP"
              checked={form.msp}
              onChange={() => setForm((prev) => ({ ...prev, msp: !prev.msp }))}
            />
          </div>

          <LabelBlock label="Description" col>
            <Editor
              content={form.description}
              onChange={(description) => setForm((prev) => ({ ...prev, description }))}
            />
          </LabelBlock>

          <LabelBlock label="Tags">
            <TagLevelSelector onSelect={(tags) => setForm((prev) => ({ ...prev, tags }))} type="skill" />
          </LabelBlock>
        </div>
      )}
    </Modal>
  )
}
