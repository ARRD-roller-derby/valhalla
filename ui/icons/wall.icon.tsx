/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */

interface WallIconProps {
  className?: string
}
export function WallIcon({ className }: WallIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="1em" className={className}>
      <path d="M96 32l0 80 256 0 0-80L96 32zM64 112l0-80L0 32l0 80 64 0zM0 144l0 96 208 0 0-96L0 144zM0 368l64 0 0-96L0 272l0 96zm0 32l0 80 208 0 0-80L0 400zm240 0l0 80 208 0 0-80-208 0zm208-32l0-96-64 0 0 96 64 0zm-96 0l0-96L96 272l0 96 256 0zm96-224l-208 0 0 96 208 0 0-96zm0-32l0-80-64 0 0 80 64 0z" />
    </svg>
  )
}