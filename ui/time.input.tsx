import { TOption } from '@/types'
import { ListSelector } from './list-selector'

interface TimeInputProps {
  time: string
  setTime: (time: string) => void
}

export function TimeInput({ time, setTime }: TimeInputProps) {
  const [hours, minutes] = time.split(':')
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return {
      label: hour,
      value: hour,
    }
  })
  const minuteOptions = ['00', '15', '30', '45'].map((m) => ({
    label: m,
    value: m,
  }))

  const handleHourChange = (hour: TOption) => setTime(`${hour.value}:${minutes}`)
  const handleMinuteChange = (minute: TOption) => setTime(`${hours}:${minute.value}`)

  return (
    <div className="inline-grid grid-cols-[1fr_auto_1fr] items-center gap-1">
      <ListSelector
        options={hourOptions}
        defaultValue={{
          label: hours,
          value: hours,
        }}
        onSelect={handleHourChange}
      />
      <div className=" text-center text-2xl font-bold">:</div>
      <ListSelector options={minuteOptions} onSelect={handleMinuteChange} />
    </div>
  )
}
