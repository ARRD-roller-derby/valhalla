/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */

interface EpicIconProps {
  className?: string
}
export function EpicIcon({ className }: EpicIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={className}>
      <path d="M0 256l192 64 64 192 64-192 192-64L320 192 256 0 192 192 0 256zM54.1 88l17 17 48 48 17 17L169.9 136l-17-17L105 71l-17-17L54.1 88zm403.9 0L424 54.1 407 71l-48 48-17 17L376 169.9l17-17 48-48 17-17zM441 407l-48-48-17-17L342.1 376l17 17 48 48 17 17L457.9 424l-17-17zM54.1 424L88 457.9l17-17 48-48 17-17L136 342.1l-17 17L71 407l-17 17z" />
    </svg>
  )
}
