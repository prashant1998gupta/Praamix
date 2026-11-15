import { people, whoWeAre } from '../content/people.ts'
import { ExternalAction } from './Action.tsx'
import { Picture } from './Picture.tsx'

/** Homepage: names, what each person does, and one line about their work. */
export function PeopleBrief() {
  return (
    <ul className="people-brief">
      {people.map((person) => (
        <li className="people-brief__item" key={person.id}>
          <h3 className="h-sub">{person.name}</h3>
          <p className="role">{person.role}</p>
          <p>{person.intro}</p>
        </li>
      ))}
    </ul>
  )
}

/**
 * Studio page: a full profile for each person, given equal weight. A portrait
 * appears only when a real photo has been supplied, and a title only when one
 * has been confirmed.
 */
export function PeopleProfiles() {
  return (
    <div className="profiles">
      {people.map((person) => (
        <article className="profile" data-tilt="" key={person.id} aria-labelledby={`${person.id}-name`}>
          {person.portrait && (
            <div className="profile__portrait">
              <Picture image={person.portrait} sizes="(min-width: 56em) 280px, 60vw" />
            </div>
          )}
          <h3 className="profile__name" id={`${person.id}-name`}>
            {person.name}
          </h3>
          <p className="role">{person.role}</p>
          {person.title && <p className="profile__title">{person.title}</p>}
          <p className="profile__bio">{person.bio}</p>
          <p className="label">{whoWeAre.areasLabel}</p>
          <ul className="ticks">
            {person.areas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          {person.links.map((link) => (
            <ExternalAction key={link.url} href={link.url} variant="outline">
              {link.label}
              <span className="visually-hidden">: {person.name}</span>
            </ExternalAction>
          ))}
        </article>
      ))}
    </div>
  )
}
