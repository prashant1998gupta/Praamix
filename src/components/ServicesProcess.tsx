import { journey } from '../content/services-process.ts'
import { ownWork, ways } from '../content/services-scope.ts'
import { TextLink } from './Action.tsx'

/** Full production, a single stage, or an existing project. Then our own game, labelled as ours. */
export function Ways() {
  return (
    <section className="section" aria-labelledby="ways-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h-section" id="ways-title">
            {ways.heading}
          </h2>
        </div>
        <div className="trio">
          {ways.items.map((item) => (
            <div className="trio__item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        <aside className="callout" aria-labelledby="own-title">
          <p className="label">{ownWork.label}</p>
          <h3 className="h-sub" id="own-title">
            {ownWork.heading}
          </h3>
          <p>{ownWork.body}</p>
          <TextLink to="/games/sheriff-town-vr">{ownWork.action}</TextLink>
        </aside>
      </div>
    </section>
  )
}

/** The seven steps from inquiry to delivery, and what is handed over. */
export function Journey() {
  return (
    <section className="section band" aria-labelledby="journey-title">
      <div className="wrap">
        <div className="section-head">
          <h2 className="h-section" id="journey-title">
            {journey.heading}
          </h2>
        </div>
        <ol className="journey">
          {journey.steps.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="handoff">
          <h3 className="h-sub">{journey.handoff.heading}</h3>
          <p>{journey.handoff.text}</p>
        </div>
      </div>
    </section>
  )
}
