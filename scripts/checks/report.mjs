/** Collects results, prints them as they arrive, and keeps the text for report.txt. */
export function createReport() {
  const lines = []
  let failed = 0
  let passed = 0

  const say = (text = '') => {
    lines.push(text)
    console.log(text)
  }

  return {
    section(title) {
      say('')
      say(title)
    },
    check(name, pass, detail = '') {
      if (pass) passed += 1
      else failed += 1
      say(`  ${pass ? 'ok  ' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
    },
    note(text) {
      say(`        ${text}`)
    },
    get failed() {
      return failed
    },
    get passed() {
      return passed
    },
    text: () => `${lines.join('\n')}\n`,
  }
}
