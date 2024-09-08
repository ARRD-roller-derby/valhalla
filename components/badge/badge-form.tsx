import { useBadges } from '@/entities'
import { FooterModal, LabelBlock, ListSelector, TagsInput, TextInput } from '@/ui'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Editor } from '../editor'
import { IBadgeSchema } from '@/models/badges.model'

type BadgeFormProps = {
  formInit?: Partial<IBadgeSchema>
  returnTab?: string
}
export function BadgeForm({
  returnTab = 'badges',
  formInit = {
    name: '',
    isProgressive: false,
    description: '',
    tags: [],
    date: new Date(),
    level: 'bronze',
    type: 'derby',
  },
}: BadgeFormProps) {
  //Store ------------------------------------------------------
  const { loadingCreate, updateBadge, createBadge } = useBadges()

  // hooks ------------------------------------------------------
  const router = useRouter()

  // state
  const [form, setForm] = useState(formInit)

  // Functions

  const handleCreate = async () => {
    setForm(formInit)
    if (form?._id) await updateBadge(form)
    else await createBadge(form)

    const url = formInit?._id ? `/badges/${form._id}` : '/badges'
    router.push({
      pathname: url,
      query: { tab: returnTab },
    })
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-2 p-4">
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
            {
              label: 'Association',
              value: 'association',
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
      <FooterModal
        closeModal={close}
        loading={loadingCreate}
        txtConfirm={`${formInit?._id ? 'Mettre à jour' : 'Créer'} le badge`}
        onConfirm={handleCreate}
      />
    </div>
  )
}
