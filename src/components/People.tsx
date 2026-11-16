import { people, whoWeAre } from '../content/people.ts'
import { nudgePiece } from '../hooks/pieces.ts'
import type { PieceIndex } from '../hooks/pieces.ts'
import { ExternalAction } from './Action.tsx'
import { Piece } from './Logo.tsx'
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
 *
 * The logo has two game pieces, and there are two people. Each profile carries
 * one of the pieces, and pointing at a profile makes that piece jump in the
 * logo at the top of the page.
 */
export function PeopleProfiles() {
  return (
    <div className="profiles">
      {people.map((person, index) => (
        <article
          className="profile"
          data-tilt=""
          key={person.id}
          aria-labelledby={`${person.id}-name`}
          onPointerEnter={() => nudgePiece((index % 2) as PieceIndex)}
        >
          {person.portrait && (
            <div className="profile__portrait">
              <Picture image={person.portrait} sizes="(min-width: 56em) 280px, 60vw" />
            </div>
          )}
          <span className="profile__mono" aria-hidden="true">
            {person.name.charAt(0)}
          </span>
          <span className="profile__piece" aria-hidden="true">
            <Piece index={(index % 2) as PieceIndex} />
          </span>
          <h3 className="profile__name" id={`${person.id}-name`}>
            {person.name}
          </h3>
          <p className="role">{person.role}</p>
          {person.title && <p className="profile__title">{person.title}</p>}
          <p className="profile__bio">{person.bio}</p>
          <p className="label">{whoWeAre.areasLabel}</p>
          <ul className="profile__areas">
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
