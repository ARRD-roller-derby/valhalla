/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */

interface LegendaryIconProps {
  className?: string
}
export function LegendaryIcon({ className }: LegendaryIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={className}>
      <path d="M384 64L416 0l32 64 64 32-64 32-32 64-32-64L320 96l64-32zM128 192L192 64l64 128 128 64L256 320 192 448 128 320 0 256l128-64zM416 320l32 64 64 32-64 32-32 64-32-64-64-32 64-32 32-64z" />
    </svg>
  )
}
