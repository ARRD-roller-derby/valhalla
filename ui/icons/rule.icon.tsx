/**
 *
 * @description Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.
 */

interface RuleIconProps {
  className?: string
}
export function RuleIcon({ className, ...rest }: RuleIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className={className} {...rest}>
      <path
        className="fa-secondary"
        opacity=".4"
        d="M0 352L160 512 512 160 352 0 283.3 68.7c16 16 32 32 48 48c3.8 3.8 7.5 7.5 11.3 11.3c-7.5 7.5-15.1 15.1-22.6 22.6c-3.8-3.8-7.5-7.5-11.3-11.3c-16-16-32-32-48-48c-13.8 13.8-27.6 27.6-41.4 41.4c16 16 32 32 48 48c3.8 3.8 7.5 7.5 11.3 11.3c-7.5 7.5-15.1 15.1-22.6 22.6c-3.8-3.8-7.5-7.5-11.3-11.3c-16-16-32-32-48-48c-13.8 13.8-27.6 27.6-41.4 41.4c16 16 32 32 48 48c3.8 3.8 7.5 7.5 11.3 11.3c-7.5 7.5-15.1 15.1-22.6 22.6c-3.8-3.8-7.5-7.5-11.3-11.3c-16-16-32-32-48-48c-13.8 13.8-27.6 27.6-41.4 41.4c16 16 32 32 48 48c3.8 3.8 7.5 7.5 11.3 11.3c-7.5 7.5-15.1 15.1-22.6 22.6l-11.3-11.3-48-48C45.8 306.2 22.9 329.1 0 352z"
      />
      <path
        className="fa-primary"
        d="M283.3 68.7l48 48L342.6 128 320 150.6l-11.3-11.3-48-48 22.6-22.6zm-86.6 86.6l22.6-22.6 48 48L278.6 192 256 214.6l-11.3-11.3-48-48zm-64 64l22.6-22.6 48 48L214.6 256 192 278.6l-11.3-11.3-48-48zm-64 64l22.6-22.6 48 48L150.6 320 128 342.6l-11.3-11.3-48-48z"
      />
    </svg>
  )
}
