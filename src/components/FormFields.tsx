import type { ReactNode } from 'react'
import type { IconName } from '../content/types.ts'
import { Icon } from './Icon.tsx'

type ControlProps = { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }

type FieldProps = {
  id: string
  label: string
  optional?: boolean
  hint?: string
  error?: string
  /** Draws the input. It receives the id and the links to its hint and error. */
  children: (control: ControlProps) => ReactNode
}

/** One labelled input, with its hint above it and its error below. */
export function Field({ id, label, optional, hint, error, children }: FieldProps) {
  const describedBy =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  return (
    <div className="field" data-invalid={error ? '' : undefined}>
      <label className="field__label" htmlFor={id}>
        {label}
        {optional && <span className="field__optional"> (optional)</span>}
      </label>
      {hint && (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

type ChoicesProps = {
  legend: string
  hint?: string
  name: string
  type: 'checkbox' | 'radio'
  options: string[]
  selected: string[]
  onToggle: (option: string) => void
  /** An icon for some or all of the options, by option name. */
  icons?: Record<string, IconName>
}

/**
 * A group of chips: tick as many as apply, or pick one. Always optional. Each
 * chip is a real checkbox or radio button, so keyboards and screen readers
 * treat it as one.
 */
export function Choices({ legend, hint, name, type, options, selected, onToggle, icons }: ChoicesProps) {
  return (
    <fieldset className="choices">
      <legend className="field__label">
        {legend}
        <span className="field__optional"> (optional)</span>
      </legend>
      {hint && <p className="field__hint">{hint}</p>}
      <div className="choices__list">
        {options.map((option) => (
          <label className="choice" key={option}>
            <input
              type={type}
              name={name}
              value={option}
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
            />
            {icons?.[option] && <Icon name={icons[option]} />}
            <span>{option}</span>
            <span className="choice__tick" aria-hidden="true" />
          </label>
        ))}
      </div>
    </fieldset>
  )
}
