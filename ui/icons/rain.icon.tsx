/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */
interface RainIconProps {
  className?: string
}

export function RainIcon({ className }: RainIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={className}>
      <path d="M96 320H0V224c0-41.8 26.7-77.4 64-90.5V112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80v16c53 0 96 43 96 96v96H416 96zM72 352h56L56 512H0L72 352zm120 0h56L176 512H120l72-160zm168 0L288 512H232l72-160h56zm64 0h56L408 512H352l72-160z" />
    </svg>
  )
}
