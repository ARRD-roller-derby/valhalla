/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */

interface UnderlineIconProps {
  className?: string
}
export function UnderlineIcon({ className }: UnderlineIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" className={className}>
      <path d="M16 32H48h96 32V96H144 128V224c0 53 43 96 96 96s96-43 96-96V96H304 272V32h32 96 32V96H400 384V224c0 88.4-71.6 160-160 160s-160-71.6-160-160V96H48 16V32zM0 480V416H32 416h32v64H416 32 0z" />
    </svg>
  )
}
