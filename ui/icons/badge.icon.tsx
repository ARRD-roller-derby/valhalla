/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */

interface BadgeIconProps {
  className?: string
}
export function BadgeIcon({ className, ...rest }: BadgeIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={className} {...rest}>
      <path
        className="fa-secondary"
        opacity=".4"
        d="M0 0L144 0 250.7 160.1c-43.6 1.3-83.3 18.5-113.4 45.9L0 0zM261.3 160.1L368 0 512 0 374.7 206c-30.1-27.5-69.7-44.6-113.4-45.9z"
      />
      <path
        className="fa-primary"
        d="M256 512a176 176 0 1 0 0-352 176 176 0 1 0 0 352zm29.7-214.8l66.3 9.2-48 44.5 11.3 62.8L256 384l-59.3 29.7L208 350.8l-48-44.5 66.3-9.2L256 240l29.7 57.2z"
      />
    </svg>
  )
}
