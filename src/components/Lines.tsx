/**
 * A heading written as short lines, each on its own row.
 * The space after each line keeps the words apart for screen readers and when the text is copied.
 */
export function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line) => (
        <span className="line" key={line}>
          {line}{' '}
        </span>
      ))}
    </>
  )
}
