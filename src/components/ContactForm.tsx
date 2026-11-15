import { useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router'
import { contact } from '../content/contact.ts'
import { inquiryMode, support } from '../content/site.ts'
import type { IconName } from '../content/types.ts'
import { EMPTY_BRIEF, deliver, validate } from './briefForm.ts'
import type { Brief, BriefErrors, BriefStatus } from './briefForm.ts'
import { Choices, Field } from './FormFields.tsx'

type TextKey = Exclude<keyof Brief, 'platforms'>

const MESSAGES: Record<BriefStatus, string> = {
  idle: '',
  sending: '',
  checked: contact.status.checked,
  sent: contact.status.sent,
  mail: contact.status.mail,
  failed: contact.status.failed,
}

const PLATFORM_ICONS: Record<string, IconName> = {
  Mobile: 'phone',
  PC: 'monitor',
  Web: 'globe',
  Console: 'gamepad',
  VR: 'headset',
  'AR or mixed reality': 'layers',
}

/** One numbered card of the brief. */
function Card({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="brief__group">
      <legend className="brief__legend">
        <span className="brief__number" aria-hidden="true">
          {number}
        </span>
        <span className="h-sub">{title}</span>
      </legend>
      {children}
    </fieldset>
  )
}

/** The brief so far, beside the form. It fills in as the visitor answers. */
function ProjectFile({ brief }: { brief: Brief }) {
  const { file } = contact
  const essentials = [brief.name.trim(), brief.email.trim(), brief.summary.trim()].filter(Boolean).length
  const client = [brief.name.trim(), brief.company.trim()].filter(Boolean).join(' · ')
  const rows: [string, string][] = [
    [file.rows.client, client],
    [file.rows.reply, brief.email.trim()],
    [file.rows.game, brief.summary.trim()],
    [file.rows.type, brief.gameType],
    [file.rows.platforms, brief.platforms.join(', ')],
    [file.rows.engine, brief.engine],
    [file.rows.budget, brief.budget],
    [file.rows.timeframe, brief.timeframe],
  ]

  return (
    <section className="file on-ink" aria-labelledby="file-title">
      <p className="file__tab" id="file-title">
        {file.heading}
      </p>
      <div className="file__meter">
        <p>
          <span>{essentials === 3 ? file.ready : file.essentials}</span>
          <span>{essentials} of 3</span>
        </p>
        <div className="file__bar" aria-hidden="true">
          <span style={{ width: `${(essentials / 3) * 100}%` }} />
        </div>
      </div>
      <dl className="file__rows">
        {rows.map(([term, value]) => (
          <div key={term} data-filled={value ? '' : undefined}>
            <dt>{term}</dt>
            <dd>{value || file.empty}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
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
  const { fields, groups, aside } = contact
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
    <div className="contact__layout">
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

        <Card number="01" title={groups.you}>
          <div className="brief__pair">
            <Field id="brief-name" label={fields.name} error={errors.name}>
              {(control) => <input type="text" autoComplete="name" {...text('name')} {...control} />}
            </Field>
            <Field id="brief-email" label={fields.email} error={errors.email}>
              {(control) => <input type="email" autoComplete="email" {...text('email')} {...control} />}
            </Field>
          </div>
          <Field id="brief-company" label={fields.company} optional>
            {(control) => <input type="text" autoComplete="organization" {...text('company')} {...control} />}
          </Field>
        </Card>

        <Card number="02" title={groups.project}>
          <Field id="brief-summary" label={fields.summary} hint={fields.summaryHint} error={errors.summary}>
            {(control) => <textarea rows={5} {...text('summary')} {...control} />}
          </Field>
          <Choices
            legend={fields.gameType}
            name="gameType"
            type="radio"
            options={contact.gameTypes}
            selected={[brief.gameType]}
            onToggle={set('gameType')}
          />
          <Choices
            legend={fields.platforms}
            hint={fields.platformsHint}
            name="platforms"
            type="checkbox"
            options={contact.platforms}
            selected={brief.platforms}
            onToggle={togglePlatform}
            icons={PLATFORM_ICONS}
          />
          <Choices
            legend={fields.engine}
            name="engine"
            type="radio"
            options={contact.engines}
            selected={[brief.engine]}
            onToggle={set('engine')}
          />
        </Card>

        <Card number="03" title={groups.planning}>
          <Choices
            legend={fields.budget}
            hint={fields.budgetHint}
            name="budget"
            type="radio"
            options={contact.budgets}
            selected={[brief.budget]}
            onToggle={set('budget')}
          />
          <Choices
            legend={fields.timeframe}
            name="timeframe"
            type="radio"
            options={contact.timeframes}
            selected={[brief.timeframe]}
            onToggle={set('timeframe')}
          />
        </Card>

        <div className="brief__send">
          <button className="btn btn--accent" type="submit" disabled={status === 'sending'}>
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

      <aside className="contact__aside">
        <ProjectFile brief={brief} />
        <div className="contact__notes">
          <h2 className="h-sub">{aside.heading}</h2>
          <ul className="ticks">
            {aside.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {support.email && (
            <>
              <h2 className="h-sub">{aside.supportHeading}</h2>
              <p>
                <a href={`mailto:${support.email}`}>{support.email}</a>
              </p>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
