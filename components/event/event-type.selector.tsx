import { ListSelector } from '@/ui'
import { EVENT_TYPES } from '@/entities'
import { TOption } from '@/types'

interface EventTypeSelectorProps {
  onSelect: (eventType: string) => void
  defaultValue?: string
}

export function EventTypeSelector({ onSelect, defaultValue }: EventTypeSelectorProps) {
  const handleSelect = (option: TOption) => {
    onSelect(option.value as string)
  }
  const eventTypes = EVENT_TYPES.map((eventType) => ({
    label: eventType,
    value: eventType,
  }))

  const val = defaultValue ? { label: defaultValue, value: defaultValue } : eventTypes[0]

  return <ListSelector options={eventTypes} onSelect={handleSelect} defaultValue={val} />
}
