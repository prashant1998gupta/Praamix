import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { contact } from '../content/contact.ts'
import { inquiryMode } from '../content/site.ts'
import { EMPTY_BRIEF, deliver, validate } from './briefForm.ts'
import type { Brief, BriefErrors, BriefStatus } from './briefForm.ts'
import { Choices, Field, Select } from './FormFields.tsx'

type TextKey = Exclude<keyof Brief, 'platforms'>

const MESSAGES: Record<BriefStatus, string> = {
  idle: '',
  sending: '',
  checked: contact.status.checked,
  sent: contact.status.sent,
  mail: contact.status.mail,
  failed: contact.status.failed,
}

/**
 * The project brief. Answers stay in the form whatever happens: after an
 * error, after a check, and after sending.
 */
export function ContactForm() {
  const draft = inquiryMode() === 'draft'
  const [brief, setBrief] = useState(EMPTY_BRIEF)
  const [errors, setErrors] = useState<BriefErrors>({})
  const [status, setStatus] = useState<BriefStatus>('idle')
  const problems = useRef<HTMLDivElement>(null)
  const { fields, groups } = contact
  const found = Object.entries(errors)

  const set = (key: TextKey) => (value: string) => setBrief((now) => ({ ...now, [key]: value }))
  const text = (key: TextKey) => ({
    className: 'input',
    value: brief[key],
    onChange: (event: { target: { value: string } }) => set(key)(event.target.value),
  })
  const togglePlatform = (name: string) =>
    setBrief((now) => ({
      ...now,
      platforms: now.platforms.includes(name)
        ? now.platforms.filter((item) => item !== name)
        : [...now.platforms, name],
    }))

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const next = validate(brief)
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setStatus('idle')
      requestAnimationFrame(() => problems.current?.focus())
      return
    }
    setStatus('sending')
    setStatus(await deliver(brief))
  }

  return (
    <form className="brief" onSubmit={onSubmit} noValidate aria-label="Project brief">
      {draft && (
        <div className="notice" role="note">
          <p className="notice__title">{contact.draft.title}</p>
          <p>{contact.draft.text}</p>
        </div>
      )}

      {found.length > 0 && (
        <div className="notice notice--error" role="alert" tabIndex={-1} ref={problems}>
          <p className="notice__title">
            {found.length === 1 ? 'One answer needs' : `${found.length} answers need`} attention
          </p>
          <ul>
            {found.map(([key, message]) => (
              <li key={key}>
                <button
                  className="link-button"
                  type="button"
                  onClick={() => document.getElementById(`brief-${key}`)?.focus()}
                >
                  {message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="brief__group">
        <legend className="h-sub">{groups.you}</legend>
        <Field id="brief-name" label={fields.name} error={errors.name}>
          {(control) => <input type="text" autoComplete="name" {...text('name')} {...control} />}
        </Field>
        <Field id="brief-email" label={fields.email} error={errors.email}>
          {(control) => <input type="email" autoComplete="email" {...text('email')} {...control} />}
        </Field>
        <Field id="brief-company" label={fields.company} optional>
          {(control) => (
            <input type="text" autoComplete="organization" {...text('company')} {...control} />
          )}
        </Field>
      </fieldset>

      <fieldset className="brief__group">
        <legend className="h-sub">{groups.project}</legend>
        <Field id="brief-summary" label={fields.summary} hint={fields.summaryHint} error={errors.summary}>
          {(control) => <textarea rows={5} {...text('summary')} {...control} />}
        </Field>
        <Field id="brief-type" label={fields.gameType} optional>
          {(control) => (
            <Select value={brief.gameType} options={contact.gameTypes} onChange={set('gameType')} {...control} />
          )}
        </Field>
        <Choices
          legend={fields.platforms}
          hint={fields.platformsHint}
          name="platforms"
          type="checkbox"
          options={contact.platforms}
          selected={brief.platforms}
          onToggle={togglePlatform}
        />
        <Choices
          legend={fields.engine}
          name="engine"
          type="radio"
          options={contact.engines}
          selected={[brief.engine]}
          onToggle={set('engine')}
        />
      </fieldset>

      <fieldset className="brief__group">
        <legend className="h-sub">{groups.planning}</legend>
        <Field id="brief-budget" label={fields.budget} hint={fields.budgetHint} optional>
          {(control) => (
            <Select value={brief.budget} options={contact.budgets} onChange={set('budget')} {...control} />
          )}
        </Field>
        <Field id="brief-timeframe" label={fields.timeframe} optional>
          {(control) => (
            <Select value={brief.timeframe} options={contact.timeframes} onChange={set('timeframe')} {...control} />
          )}
        </Field>
      </fieldset>

      <div className="brief__send">
        <button className="btn btn--solid" type="submit" disabled={status === 'sending'}>
          {draft ? contact.actions.check : status === 'sending' ? contact.actions.sending : contact.actions.send}
        </button>
        <p className="brief__note">
          {draft ? contact.privacy.draft : contact.privacy.live}{' '}
          <Link to="/privacy-policy">{contact.privacy.link}</Link>
        </p>
      </div>
      <p className="brief__status" role="status" data-kind={status}>
        {MESSAGES[status]}
      </p>
    </form>
  )
}
