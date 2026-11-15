import { pipeline, stages } from '../content/services.ts'

/**
 * The nine production stages as a numbered list. Each one opens to show the
 * work and what it typically produces. The first is open to begin with.
 */
export function Stages() {
  return (
    <ol className="stages">
      {stages.map((stage, index) => (
        <li className="stages__item" key={stage.title}>
          <details className="stage" open={index === 0}>
            <summary className="stage__head">
              <span className="stage__num" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="stage__title">{stage.title}</span>
              <span className="stage__summary">{stage.summary}</span>
              <span className="mark" aria-hidden="true" />
            </summary>
            <div className="stage__body">
              <p>{stage.work}</p>
              <div>
                <p className="label">{pipeline.deliverablesLabel}</p>
                <ul className="ticks">
                  {stage.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        </li>
      ))}
    </ol>
  )
}
