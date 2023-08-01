// Bibliothèques externes
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

// Bibliothèques internes
import { Checkbox, DateInput, FooterModal, LabelBlock, ListSelector, Modal, NumInput, TimeInput, TextInput } from '@/ui'
import { EVENT_TYPES, IEventForm, useEvents } from '@/entities'
import { frequencyOpts, visibilityOpts } from '@/utils'
import { Editor, AddressSelector, EventTypeSelector } from '@/components'
import { TOption } from '@/types'

interface EventModalProps {
  day?: dayjs.Dayjs
  customButton: (callbacks: () => void) => React.ReactNode // Update children prop
}

export function EventCreateModal({ day, customButton }: EventModalProps) {
  // stores
  const { loading, createEvent, currentDay } = useEvents()

  // const
  const formInit = {
    type: EVENT_TYPES[0],
    title: EVENT_TYPES[0],
    description: {},
    start: day || currentDay || dayjs(),
    startHour: dayjs().add(1, 'hour').set('minute', 0).format('HH:mm'),
    endHour: dayjs().add(2, 'hour').set('minute', 0).format('HH:mm'),
    end: day || currentDay || dayjs(),
    recurrence: false,
    frequency: frequencyOpts[0],
    frequencyCount: 1,
    visibility: visibilityOpts[0],
    address: {
      label: '',
      value: '',
    } as TOption,
  }

  // state
  const [form, setForm] = useState(formInit)

  // functions
  const handleSubmit = async () => {
    const { description, visibility, type, title, address } = form
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
      visibility: visibility.value as string,
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
    createEvent(event)
  }

  // effect
  useEffect(() => {
    const titleIsType = EVENT_TYPES.find((type) => type === form.title)
    if (titleIsType || !form.title) setForm((prev) => ({ ...prev, title: form.type }))
  }, [form.type])

  return (
    <Modal
      onOpen={() => setForm(formInit)}
      button={customButton}
      footer={(close) => (
        <FooterModal closeModal={close} loading={loading} txtConfirm="Créer l'évènement" onConfirm={handleSubmit} />
      )}
    >
      {() => (
        <div className="flex flex-col gap-2 overflow-auto p-2">
          <LabelBlock label="Type">
            <EventTypeSelector onSelect={(type) => setForm((prev) => ({ ...prev, type }))} />
          </LabelBlock>

          <LabelBlock label="Titre (facultatif)">
            <TextInput value={form.title} setValue={(title) => setForm((prev) => ({ ...prev, title }))} />
          </LabelBlock>

          <LabelBlock label="Début">
            <div className="grid grid-cols-[auto_auto_1fr] items-center gap-2">
              <DateInput date={form.start} setDate={(start) => setForm((prev) => ({ ...prev, start }))} />
              <div className="text-center">{'à'}</div>
              <TimeInput time={form.startHour} setTime={(startHour) => setForm((prev) => ({ ...prev, startHour }))} />
            </div>
          </LabelBlock>

          <LabelBlock label="Fin">
            <div className="grid grid-cols-[auto_auto_1fr] items-center gap-2">
              <DateInput date={form.end} setDate={(end) => setForm((prev) => ({ ...prev, end }))} />
              <div className="text-center">{'à'}</div>
              <TimeInput time={form.endHour} setTime={(endHour) => setForm((prev) => ({ ...prev, endHour }))} />
            </div>
          </LabelBlock>

          <Checkbox
            label="Activer la récurrence"
            checked={form.recurrence}
            onChange={() => setForm((prev) => ({ ...prev, recurrence: !prev.recurrence }))}
          />

          {form.recurrence && (
            <div className="mt-2 flex flex-col flex-wrap gap-1 sm:grid sm:grid-cols-[auto_1fr] sm:gap-3">
              <NumInput
                num={form.frequencyCount}
                setNum={(frequencyCount) => setForm((prev) => ({ ...prev, frequencyCount }))}
              />

              <ListSelector
                options={frequencyOpts}
                onSelect={(frequency) => setForm((prev) => ({ ...prev, frequency }))}
              />
            </div>
          )}

          <LabelBlock label="Description" col>
            <Editor
              content={form.description}
              onChange={(description) => setForm((prev) => ({ ...prev, description }))}
            />
          </LabelBlock>

          {form.type !== 'En ligne' && (
            <LabelBlock label="Adresse" col>
              <AddressSelector
                address={form.address}
                onSelect={(address: TOption) => setForm((prev) => ({ ...prev, address }))}
              />
            </LabelBlock>
          )}

          <LabelBlock label="Visibilité" col>
            <ListSelector
              options={visibilityOpts}
              onSelect={(visibility) => setForm((prev) => ({ ...prev, visibility }))}
            />
          </LabelBlock>
        </div>
      )}
    </Modal>
  )
}
