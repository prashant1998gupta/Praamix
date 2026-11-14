/*
 * measure() runs inside the page (it is sent with page.evaluate), so it can
 * only use what it declares itself. It returns measurements and a list of
 * problems for the current screen size.
 */
export function measure() {
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const ignore = '.rails, .visually-hidden, .skip-link, noscript, script, style'
  const problems = []
  const round = (value, places = 1) => Number(value.toFixed(places))
  const tag = (el) => {
    const first = typeof el.className === 'string' ? el.className.split(' ')[0] : ''
    return el.tagName.toLowerCase() + (first ? `.${first}` : '')
  }
  const textSpan = (node) => {
    const range = document.createRange()
    range.selectNodeContents(node)
    const rects = [...range.getClientRects()].filter((rect) => rect.width > 0)
    if (rects.length === 0) return 0
    return Math.max(...rects.map((r) => r.right)) - Math.min(...rects.map((r) => r.left))
  }
  const lineCount = (el) =>
    Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight))

  /* Sideways scrolling, and anything hanging past the edges */
  const pageWidth = document.documentElement.scrollWidth
  if (pageWidth > vw + 1) problems.push(`page is ${pageWidth}px wide in a ${vw}px viewport`)
  const outside = []
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest(ignore) || el.closest('svg')) continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) continue
    if (rect.right > vw + 1 || rect.left < -1) {
      outside.push(`${tag(el)} ${round(rect.left)}..${round(rect.right)}`)
    }
  }
  if (outside.length) problems.push(`outside the viewport: ${outside.slice(0, 4).join(', ')}`)

  /* Display type that is fitted to the width of its column */
  const fits = {}
  const masthead = document.querySelector('.masthead')
  if (masthead) {
    const word = masthead.querySelector('.wordmark').getBoundingClientRect().width
    fits.masthead = round(word / masthead.clientWidth, 3)
    if (fits.masthead > 1.002) problems.push(`masthead is wider than its column (${fits.masthead})`)
    if (fits.masthead < 0.9) problems.push(`masthead fills only ${fits.masthead} of its column`)
  }
  for (const box of document.querySelectorAll('.title-fit')) {
    const heading = box.querySelector('.game-title')
    const words = [...heading.querySelectorAll('.game-title__word')]
    const stacked = getComputedStyle(words[0]).display === 'block'
    const boxes = words.flatMap((word) => [...word.getClientRects()])
    const oneLine =
      Math.max(...boxes.map((box) => box.right)) - Math.min(...boxes.map((box) => box.left))
    const widest = stacked ? Math.max(...words.map(textSpan)) : oneLine
    const expected = stacked ? words.length : 1
    fits.title = round(widest / box.clientWidth, 3)
    fits.titleLines = lineCount(heading)
    if (fits.title > 1.002) problems.push(`game title is wider than its column (${fits.title})`)
    if (fits.title < 0.8) problems.push(`game title fills only ${fits.title} of its column`)
    if (fits.titleLines !== expected) {
      problems.push(`game title is on ${fits.titleLines} lines, expected ${expected}`)
    }
  }

  /* Touch targets */
  const small = []
  for (const el of document.querySelectorAll('a[href], button, input, select, textarea, summary')) {
    if (el.closest(ignore)) continue
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) continue
    if (rect.width < 43.5 || rect.height < 43.5) {
      small.push(`${tag(el)} ${round(rect.width)}×${round(rect.height)}`)
    }
  }
  if (small.length) problems.push(`targets under 44px: ${small.join(', ')}`)

  /* Text size and line length */
  let smallest = Infinity
  let smallestIn = ''
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const parent = walker.currentNode.parentElement
    if (!walker.currentNode.textContent.trim() || !parent || parent.closest(ignore)) continue
    if (parent.getClientRects().length === 0) continue
    const size = parseFloat(getComputedStyle(parent).fontSize)
    if (size < smallest) {
      smallest = size
      smallestIn = tag(parent)
    }
  }
  if (smallest < 13.9) problems.push(`text at ${round(smallest)}px in ${smallestIn}`)

  /* The longest line of running text, counted character by character. */
  const longestLineIn = (el) => {
    const perLine = new Map()
    const nodes = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const range = document.createRange()
    while (nodes.nextNode()) {
      const node = nodes.currentNode
      for (let i = 0; i < node.length; i += 1) {
        range.setStart(node, i)
        range.setEnd(node, i + 1)
        const rect = range.getClientRects()[0]
        if (!rect) continue
        const line = Math.round(rect.top)
        perLine.set(line, (perLine.get(line) ?? 0) + 1)
      }
    }
    return Math.max(0, ...perLine.values())
  }

  let longestLine = 0
  for (const el of document.querySelectorAll('main p, main dd')) {
    if (el.closest(ignore) || lineCount(el) < 2) continue
    longestLine = Math.max(longestLine, longestLineIn(el))
  }
  if (longestLine > 80) problems.push(`lines of up to ${longestLine} characters`)

  /* Media frames */
  let tallestFrame = 0
  for (const plate of document.querySelectorAll('.plate')) {
    const frame = plate.getBoundingClientRect()
    tallestFrame = Math.max(tallestFrame, frame.height / vh)
    const slip = plate.querySelector('.plate__slip')?.getBoundingClientRect()
    if (
      slip &&
      (slip.left < frame.left - 0.5 ||
        slip.right > frame.right + 0.5 ||
        slip.top < frame.top - 0.5 ||
        slip.bottom > frame.bottom + 0.5)
    ) {
      problems.push('placeholder label is cut off by its frame')
    }
  }
  if (tallestFrame > 1) {
    problems.push(`a media frame is ${round(tallestFrame, 2)} times the height of the screen`)
  }

  /* Is the way into the game on the first screen? */
  const action = document.querySelector('.hero__action')
  const firstScreen = action
    ? action.getBoundingClientRect().bottom + window.scrollY <= vh
    : null

  return {
    vw,
    vh,
    problems,
    fits,
    smallestText: round(smallest),
    longestLine,
    tallestFrame: round(tallestFrame, 2),
    firstScreen,
  }
}
