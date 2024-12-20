/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */

interface DiceIconProps {
  className?: string
}
export function DiceIcon({ className }: DiceIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={className}>
      <path
        className="fa-secondary"
        opacity=".4"
        d="M6.6 176L64.1 76.4 240 139.3l0 106.8L131.2 300.5 6.6 176zM94.8 53.4L187.4 0 324.6 0l92.6 53.4L256 111 94.8 53.4zM272 139.3L447.9 76.4 505.4 176 380.8 300.5 272 246.1l0-106.8z"
      />
      <path
        className="fa-primary"
        d="M398.1 328.5L512 214.6l0 110L443.4 443.4l-99.1 57.2 53.8-172.1zm-33.4-.3L307.2 512l-102.5 0L147.3 328.2 256 273.9l108.7 54.3zm-250.8 .3l53.8 172.1L68.6 443.4 0 324.6l0-110L113.9 328.5z"
      />
    </svg>
  )
}
