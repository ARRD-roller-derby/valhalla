export function getResume(text: string, length = 30) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
