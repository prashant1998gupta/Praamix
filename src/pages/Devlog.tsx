import { Link, useParams } from 'react-router'
import { Arrow } from '../components/Arrow.tsx'
import { Art } from '../components/Picture.tsx'
import { devlog, devlogPath, posts } from '../content/devlog.ts'
import { gamePath, sheriffTownVr } from '../content/game.ts'
import { SIZES } from '../content/images.ts'
import { metaFor, PRESS_KIT_PATH } from '../content/routes.ts'
import { useDocumentMeta } from '../hooks/useDocumentMeta.ts'
import { NotFound } from './NotFound.tsx'

/** "26 November 2026", from "2026-11-26". Written out by hand so it reads the same everywhere. */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
function longDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

/** The list of devlog posts, newest first. */
export function Devlog() {
  useDocumentMeta(metaFor(devlogPath()))

  return (
    <main id="main" tabIndex={-1}>
      <section className="section" aria-labelledby="devlog-title">
        <div className="wrap">
          <div className="page-head">
            <p className="eyebrow">{devlog.eyebrow}</p>
            <h1 className="h-page" id="devlog-title">
              {devlog.heading}
            </h1>
            <p className="lede">{devlog.lede}</p>
          </div>
          <ul className="devlog__list">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link className="devlog__card" to={devlogPath(post)}>
                  <Art image={post.image} sizes={SIZES.half} variant="cover" caption={false} />
                  <span className="devlog__body">
                    <time className="devlog__date" dateTime={post.date}>
                      {longDate(post.date)}
                    </time>
                    <span className="devlog__title">{post.title}</span>
                    <span className="devlog__text">{post.description}</span>
                    <span className="link-arrow">
                      <span>Read the post</span>
                      <Arrow />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

/** One devlog post. */
export function DevlogPost() {
  const { slug } = useParams()
  const post = posts.find((item) => item.slug === slug)
  useDocumentMeta(metaFor(post ? devlogPath(post) : '/404'))
  if (!post) return <NotFound />

  return (
    <main id="main" tabIndex={-1}>
      <article className="section devlog-post" aria-labelledby="post-title">
        <div className="wrap devlog-post__wrap">
          <p className="eyebrow">
            <Link to={devlogPath()}>{devlog.eyebrow}</Link>
          </p>
          <h1 className="h-page" id="post-title">
            {post.title}
          </h1>
          <p className="devlog__date">
            By Praamix · <time dateTime={post.date}>{longDate(post.date)}</time>
          </p>
          <Art image={post.image} sizes={SIZES.wide} variant="cover" />
          <p className="lede">{post.intro}</p>
          {post.sections.map((section) => (
            <section key={section.heading} className="devlog-post__section">
              <h2 className="h-sub">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          <div className="devlog-post__next">
            <Link className="link-arrow" to={gamePath(sheriffTownVr)}>
              <span>See {sheriffTownVr.title}: maps, tool guns and the trailer</span>
              <Arrow />
            </Link>
            <Link className="link-arrow" to={PRESS_KIT_PATH}>
              <span>Press kit</span>
              <Arrow />
            </Link>
            <Link className="link-arrow" to={devlogPath()}>
              <span>All devlog posts</span>
              <Arrow />
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}
