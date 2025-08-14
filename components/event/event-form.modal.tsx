// Bibliothèques externes
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

// Bibliothèques internes
import { IEvent } from '@/models'
import { TOption } from '@/types'
import { frequencyOpts } from '@/utils'
import { RolesSelector } from '@/ui/roles-selector'
import { EVENT_TYPES, IEventForm, useEvents } from '@/entities'
import { Editor, AddressSelector, EventTypeSelector } from '@/components'
import { Checkbox, DateInput, FooterModal, LabelBlock, ListSelector, Modal, NumInput, TimeInput, TextInput } from '@/ui'

interface EventModalProps {
  day?: dayjs.Dayjs
  customButton: (callbacks: () => void) => React.ReactNode // Update children prop
  eventToUpdate?: IEvent
}

export function EventFormModal({ day, eventToUpdate, customButton }: EventModalProps) {
  // Stores -----------------------------------------------------------------------------
  const { loading, currentDay, updateEvent, createEvent } = useEvents()
  const [reset, setReset] = useState(0)

  // Constantes -------------------------------------------------------------------------

  const formInit = {
    type: EVENT_TYPES[0],
    title: EVENT_TYPES[0],
    description: {},
    descriptionPublic: {},

    recurrence: false,
    frequency: frequencyOpts[0],
    frequencyCount: 1,

    ...eventToUpdate,
    visibility: eventToUpdate?.visibility || 'Membre',
    start: eventToUpdate?.start ? dayjs(eventToUpdate.start) : day || currentDay || dayjs(),
    end: eventToUpdate?.end ? dayjs(eventToUpdate.end) : day || currentDay || dayjs(),
    startHour: eventToUpdate?.start
      ? dayjs(eventToUpdate.start).format('HH:mm')
      : dayjs().add(1, 'hour').set('minute', 0).format('HH:mm'),
    endHour: eventToUpdate?.end
      ? dayjs(eventToUpdate.end).format('HH:mm')
      : dayjs().add(2, 'hour').set('minute', 0).format('HH:mm'),
    address: {
      label: eventToUpdate?.address?.label || '',
      value: eventToUpdate?.address || '',
    } as TOption,
  } as any

  // States ------------------------------------------------------------------------------
  const [form, setForm] = useState<any>(formInit || ({} as IEventForm))

  // Fonctions ---------------------------------------------------------------------------

  const handleSubmit = async () => {
    const { description, descriptionPublic, visibility, type, title, address } = form
    const [startHour, startMinute] = form.startHour.split(':')
    const [endHour, endMinute] = form.endHour.split(':')
    const start = dayjs(form.start.toDate())
      .set('hour', parseInt(startHour))
      .set('minute', parseInt(startMinute))
      .set('second', 0)
    const end = dayjs(form.end.toDate())
      .set('hour', parseInt(endHour))
      .set('minute', parseInt(endMinute))
      .set('second', 0)

    const event: IEventForm = {
      title: title || type,
      type,
      description,
      descriptionPublic,
      visibility: visibility || 'Membre',
      start: start.toISOString(),
      end: end.toISOString(),
    }

    if (form.type !== 'En ligne' && address?.value) event.address = address.value as string

    if (form.recurrence) {
      const recurrence = {
        frequency: form.frequency.value as string,
        count: form.frequencyCount,
      }
      event.recurrence = recurrence
    }

    if (eventToUpdate) {
      await updateEvent(eventToUpdate._id, event)
    } else {
      await createEvent(event)
    }
    setForm(formInit)
  }

  const handleSetType = (type: string) => {
    setForm((prev: any) => {
      if (prev.visibility === '@everyone' && type.match(/derby|patinage|scrimmage|match|bootcamp/i))
        prev.visibility = 'Membres'
      return { ...prev, type }
    })
  }

  const handleChangeEnd = () => {
    if (form.start && form.end && dayjs(form.start).isValid() && dayjs(form.end).isValid()) {
      if (dayjs(form.start).isAfter(dayjs(form.end))) setForm((prev: any) => ({ ...prev, end: form.start }))
    } else if (!form.end) setForm((prev: any) => ({ ...prev, end: form.start, endHour: form.startHour }))

    if (form.startHour && form.endHour) {
      const startDateTime = dayjs(form.start)
        .hour(parseInt(form.startHour.split(':')[0]))
        .minute(parseInt(form.startHour.split(':')[1]))
      const endDateTime = dayjs(form.end)
        .hour(parseInt(form.endHour.split(':')[0]))
        .minute(parseInt(form.endHour.split(':')[1]))

      if (dayjs(form.start).isSame(dayjs(form.end)) && startDateTime.isAfter(endDateTime)) {
        const newEndDateTime = dayjs(form.start)
          .hour(parseInt(form.startHour.split(':')[0]))
          .minute(parseInt(form.startHour.split(':')[1]))
          .add(1, 'hour')

        const newEndHour = newEndDateTime.format('HH:mm')

        setForm((prev: any) => ({ ...prev, endHour: newEndHour }))
        setReset(Date.now())
      }
    }
  }

  // Effets ------------------------------------------------------------------------------
  useEffect(() => {
    const titleIsType = EVENT_TYPES.find((type) => type === form.title)
    if (titleIsType || !form.title) setForm((prev: any) => ({ ...prev, title: form.type }))
  }, [form.type])

  useEffect(() => {
    handleChangeEnd()
  }, [form.start, form.end, form.startHour, form.endHour])

  // Render ------------------------------------------------------------------------------
  return (
    <Modal
      button={customButton}
      footer={(close) => (
        <FooterModal
          closeModal={close}
          onCancel={() => setForm(formInit)}
          loading={loading}
          txtConfirm={eventToUpdate ? 'Modifier' : 'Créer'}
          onConfirm={handleSubmit}
        />
      )}
    >
      {() => (
        <div className="flex flex-col gap-2 overflow-auto p-2">
          <LabelBlock label="Type">
            <EventTypeSelector onSelect={handleSetType} defaultValue={form.type} />
          </LabelBlock>

          <LabelBlock label="Titre (facultatif)">
            <TextInput value={form.title} setValue={(title) => setForm((prev: any) => ({ ...prev, title }))} />
          </LabelBlock>

          <LabelBlock label="Début">
            <div className="grid grid-cols-[auto_auto_1fr] items-center gap-2">
              <DateInput date={form.start} setDate={(start) => setForm((prev: any) => ({ ...prev, start }))} />
              <div className="text-center">{'à'}</div>
              <TimeInput
                time={form.startHour}
                setTime={(startHour) => setForm((prev: any) => ({ ...prev, startHour }))}
              />
            </div>
          </LabelBlock>

          <LabelBlock label="Fin">
            <div className="grid grid-cols-[auto_auto_1fr] items-center gap-2">
              <DateInput date={form.end} setDate={(end) => setForm((prev: any) => ({ ...prev, end }))} />
              <div className="text-center">{'à'}</div>
              <TimeInput
                time={form.endHour}
                setTime={(endHour) => setForm((prev: any) => ({ ...prev, endHour }))}
                key={reset}
              />
            </div>
          </LabelBlock>

          {!eventToUpdate && (
            <Checkbox
              label="Activer la récurrence"
              checked={form.recurrence}
              onChange={() => setForm((prev: any) => ({ ...prev, recurrence: !prev.recurrence }))}
            />
          )}

          {form.recurrence && (
            <div className="mt-2 flex flex-col flex-wrap gap-1 sm:grid sm:grid-cols-[auto_1fr] sm:gap-3">
              <NumInput
                num={form.frequencyCount}
                setNum={(frequencyCount) => setForm((prev: any) => ({ ...prev, frequencyCount }))}
              />

              <ListSelector
                options={frequencyOpts}
                onSelect={(frequency) => setForm((prev: any) => ({ ...prev, frequency }))}
              />
            </div>
          )}

          {form.visibility === '@everyone' && (
            <LabelBlock label="Description publique" col>
              <Editor
                content={form.descriptionPublic}
                onChange={(descriptionPublic) => setForm((prev: any) => ({ ...prev, descriptionPublic }))}
              />
            </LabelBlock>
          )}

          <LabelBlock label="Description" col>
            <Editor
              content={form.description}
              onChange={(description) => setForm((prev: any) => ({ ...prev, description }))}
            />
          </LabelBlock>

          {form.type !== 'En ligne' && (
            <LabelBlock label="Adresse" col>
              <AddressSelector
                address={form.address}
                onSelect={(address: TOption) => setForm((prev: any) => ({ ...prev, address }))}
              />
            </LabelBlock>
          )}

          <LabelBlock label="Visibilité" col>
            <RolesSelector
              key={form.visibility}
              defaultValue={{
                label: form.visibility,
                value: form.visibility,
              }}
              onSelect={(visibility) => setForm((prev: any) => ({ ...prev, visibility: visibility.value as string }))}
            />
          </LabelBlock>
        </div>
      )}
    </Modal>
  )
}
