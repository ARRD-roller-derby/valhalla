/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */
interface HandIconProps {
  className?: string
}
export function HandIcon({ className }: HandIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={className}>
      <path d="M288 32V0H224V32 256H192V64 32H128V64 336c0 1.5 0 3.1 .1 4.6L84.5 299.1l-29-27.6L.3 329.4l29 27.6 95.5 91c43.1 41.1 100.4 64 160 64H304c97.2 0 176-78.8 176-176V128 96H416v32V256H384V64 32H320V64 256H288V32z" />
    </svg>
  )
}
