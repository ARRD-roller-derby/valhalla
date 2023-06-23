/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */

interface GameIconProps {
  className?: string
}
export function GameIcon({ className }: GameIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 0 384 512"
      className={className}
    >
      <path d="M0 0H384V512H0V0zM96 64V224H288V64H96zM232 384a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm88-72a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM96 288v32H64v32H96v32h32V352h32V320H128V288H96z" />
    </svg>
  )
}
