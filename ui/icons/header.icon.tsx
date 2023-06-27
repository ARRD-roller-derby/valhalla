/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */

interface HeaderIconProps {
  className?: string
}
export function HeaderIcon({ className }: HeaderIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" className={className}>
      <path d="M64 96V64H0V96 256 416v32H64V416 288H256V416v32h64V416 256 96 64H256V96 224H64V96zm341 61.2l43-19.1V384H416 384v64h32 64 64 32V384H544 512V96 64H480 464h-6.8L451 66.8 384 96.5v70l21-9.3z" />
    </svg>
  )
}
