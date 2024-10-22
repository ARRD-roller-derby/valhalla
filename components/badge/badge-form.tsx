import { useBadges } from '@/entities'
import { Button, FooterModal, LabelBlock, ListSelector, Modal, TextInput } from '@/ui'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Editor } from '../editor'
import { IBadgeSchema } from '@/models/badges.model'
import { BADGE_LEVELS } from '@/utils/badge-levels'

type BadgeFormProps = {
  badge: IBadgeSchema
}

export function BadgeForm({ badge }: BadgeFormProps) {
  //Store ------------------------------------------------------
  const { loadingCreate, loadingUpdate, createBadge, updateBadge } = useBadges()

  // hooks ------------------------------------------------------
  const router = useRouter()

  // Constante ------------------------------------------------------
  const formInit: Partial<IBadgeSchema> = {
    name: badge?.name || '',
    isProgressive: false,
    description: badge?.description || '',
    tags: [],
    date: new Date(),
    level: BADGE_LEVELS.find((level) => level.value === badge?.level)?.value || BADGE_LEVELS[0].value,
    type: badge?.type || 'derby',
  }

  // state
  const [form, setForm] = useState(formInit)
  const isInEditMode = !!badge?._id

  // Functions

  const handleUpdate = async () => {
    updateBadge({ ...badge, ...form })
  }

  const handleCreate = async () => {
    createBadge(form)

    setForm(formInit)
    router.push({
      query: { tab: 'badges' },
    })
  }

  return (
    <Modal
      title={isInEditMode ? `Modifier ${badge.name}` : 'Ajouter un badge'}
      button={(onClick) => (
        <Button
          onClick={onClick}
          text={isInEditMode ? 'Modifier' : 'Ajouter'}
          type="secondary"
          size={isInEditMode ? 'small' : 'default'}
        />
      )}
      footer={(close) => (
        <FooterModal
          closeModal={close}
          loading={loadingCreate || loadingUpdate}
          txtConfirm={`${isInEditMode ? 'Modifier' : 'Créer'} le badge`}
          onConfirm={isInEditMode ? handleUpdate : handleCreate}
        />
      )}
    >
      {() => (
        <div className="flex flex-col gap-2 p-4">
          <LabelBlock label="Nom">
            <TextInput value={form.name || ''} setValue={(name) => setForm((prev) => ({ ...prev, name }))} />
          </LabelBlock>

          <LabelBlock label="Type">
            <ListSelector
              options={[
                {
                  label: 'Derby',
                  value: 'derby',
                },
                {
                  label: 'Patins',
                  value: 'patins',
                },
              ]}
              onSelect={(type) => setForm((prev) => ({ ...prev, typ: type.value as IBadgeSchema['type'] }))}
            />
          </LabelBlock>
          <LabelBlock label="Niveau">
            <ListSelector
              options={BADGE_LEVELS}
              defaultValue={BADGE_LEVELS.find((level) => level.value === form.level)}
              onSelect={(level) => setForm((prev) => ({ ...prev, level: level.value as IBadgeSchema['level'] }))}
            />
          </LabelBlock>

          {/* <div className="my-2">
            <Checkbox
              label="Progressif"
              checked={form.isProgressive || false}
              onChange={() => setForm((prev) => ({ ...prev, isProgressive: !prev.isProgressive }))}
            />
            <div className="text-xs italic">
              Ajoute une bar de progression augmentant grâce aux badges partageant les mêmes tags.
            </div>
          </div>
          */}

          <LabelBlock label="Description" col>
            <Editor
              content={form.description || ''}
              onChange={(description) => setForm((prev) => ({ ...prev, description }))}
            />
          </LabelBlock>
        </div>
      )}
    </Modal>
  )
}
