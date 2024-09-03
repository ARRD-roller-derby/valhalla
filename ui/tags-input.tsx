import { useState } from 'react'
import { TextInput } from './text.input'

type TagsInputProps = {
  onChange: (tags: string[]) => void
  defaultValue?: string[]
}
export function TagsInput({ defaultValue, onChange }: TagsInputProps) {
  const [tags, setTags] = useState(defaultValue || [])

  function handleChange(tags: string) {
    const newTags = tags.split(',').map((tag) => tag.trim())
    setTags(newTags)
    onChange(newTags)
  }
  return <TextInput value={tags.join(', ')} setValue={handleChange} />
}
