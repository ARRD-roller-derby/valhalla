import { useBadges } from '@/entities'
import { Button, Checkbox, FooterModal, LabelBlock, ListSelector, Modal, TagsInput, TextInput } from '@/ui'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Editor } from '../editor'
import { IBadgeSchema } from '@/models/badges.model'

export function BadgeForm() {
  //Store ------------------------------------------------------
  const { loadingCreate, createBadge } = useBadges()

  // hooks ------------------------------------------------------
  const router = useRouter()

  // Constante ------------------------------------------------------
  const formInit: Partial<IBadgeSchema> = {
    name: '',
    isProgressive: false,
    description: '',
    tags: [],
    date: new Date(),
    level: 'bronze',
    type: 'derby',
  }

  // state
  const [form, setForm] = useState(formInit)

  // Functions

  const handleCreate = async () => {
    createBadge(form)

    setForm(formInit)
    router.push({
      query: { tab: 'badges' },
    })
  }

  return (
    <Modal
      title="Ajouter un badge"
      button={(onClick) => <Button onClick={onClick} text="Ajouter" type="secondary" />}
      footer={(close) => (
        <FooterModal
          closeModal={close}
          loading={loadingCreate}
          txtConfirm={`Créer le badge`}
          onConfirm={handleCreate}
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
              options={[
                {
                  label: 'Bronze',
                  value: 'bronze',
                },
                {
                  label: 'Argent',
                  value: 'argent',
                },
                {
                  label: 'Or',
                  value: 'or',
                },
              ]}
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

          <LabelBlock label="Tags">
            <TagsInput onChange={(tags) => setForm((prev) => ({ ...prev, tags }))} />
          </LabelBlock>
        </div>
      )}
    </Modal>
  )
}
