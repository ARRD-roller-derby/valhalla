/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */

interface ShortIconProps {
  className?: string
}

export function ShortIcon({ className }: ShortIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" className={className}>
      <path d="M0 224H48 272h48V176L160 32 0 176v48zM160 96.6L248.2 176H71.8L160 96.6zM0 288v48L160 480 320 336V288H272 48 0zM160 415.4L71.8 336H248.2L160 415.4z" />
    </svg>
  )
}
