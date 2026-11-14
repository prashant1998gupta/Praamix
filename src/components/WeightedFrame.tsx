import type { ReactNode } from 'react'

type Props = { children: ReactNode; className?: string }

/**
 * Holds featured media on a backing slab. Place it inside an element that
 * carries the ref from useWeight: that element is the area that responds.
 */
export function WeightedFrame({ children, className }: Props) {
  return (
    <div className={className ? `weighted ${className}` : 'weighted'} data-weight>
      <div className="weighted__backing" aria-hidden="true" />
      <div className="weighted__body">{children}</div>
    </div>
  )
}
