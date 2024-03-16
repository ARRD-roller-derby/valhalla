/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */
interface ShopIconProps {
  className?: string
}

export function ShopIcon({ className }: ShopIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" height="1em" className={className}>
      <path d="M0 192H640V128L544 0H96L0 128v64zM64 384V512H384V384 224H320V384H128V224H64V384zM512 512h64V224H512V512z" />
    </svg>
  )
}
