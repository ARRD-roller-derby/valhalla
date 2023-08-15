import { ISkill } from '@/models'
import { Button, Checkbox, FooterModal, LabelBlock, Modal, TextInput } from '@/ui'
import { SkillCategorySelector } from './skill-category.selector'
import { SKILL_CATEGORIES, SKILL_LEVELS } from '@/utils'
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
  const { loadingCreate, createSkill, updateSkill } = useSkills()

  // const
  const actionType = skill ? 'Modifier' : 'Créer' // ou modifier
  const descaler = skill ? 'la' : 'une' // ou modifier
  const formInit: {
    name: string
    msp: boolean
    description: any
    category: string
    tags: string[]
    level: string
  } = {
    name: skill?.name || '',
    msp: skill?.msp || false,
    description: skill?.description || {},
    category: skill?.category || SKILL_CATEGORIES.derby,
    tags: skill?.tags || [],
    level: skill?.level || SKILL_LEVELS.base,
  }

  // state
  const [form, setForm] = useState(formInit)

  // Functions

  const handleCreate = async () => {
    if (skill) {
      updateSkill({ ...skill, ...form })
    } else {
      createSkill(form)
    }
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
          txtConfirm={`${actionType} ${descaler} compétence`}
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
            <SkillCategorySelector
              defaultValue={skill?.category}
              onSelect={(category) => setForm((prev) => ({ ...prev, category }))}
            />
          </LabelBlock>

          <LabelBlock label="Niveau">
            <SkillLevelSelector
              defaultValue={skill?.level}
              onSelect={(level) => setForm((prev) => ({ ...prev, level }))}
            />
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
