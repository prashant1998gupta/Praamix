import { useEffect, useRef } from 'react'

/*
 * The one flourish on the site: the opening picture drifts a few pixels
 * towards the pointer and eases back when the pointer leaves.
 *
 * A damped spring drives two numbers, --dx and --dy (each from -1 to 1), on
 * the [data-drift] element inside the area this hook is attached to. CSS turns
 * them into a small shift. Touch does nothing, and with reduced motion
 * requested nothing moves. The loop runs only while something is moving.
 */

const STIFFNESS = 90
const DAMPING = 15
const AXES = ['x', 'y'] as const

const clamp = (value: number) => Math.max(-1, Math.min(1, value))

export function useDrift<T extends HTMLElement>() {
  const zoneRef = useRef<T>(null)

  useEffect(() => {
    const zone = zoneRef.current
    const body = zone?.querySelector<HTMLElement>('[data-drift]')
    if (!zone || !body) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const position = { x: 0, y: 0 }
    const velocity = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    let frame = 0
    let last = 0

    const rest = () => {
      cancelAnimationFrame(frame)
      frame = 0
      for (const axis of AXES) {
        position[axis] = 0
        velocity[axis] = 0
        target[axis] = 0
      }
      body.style.removeProperty('--dx')
      body.style.removeProperty('--dy')
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      let moving = false

      for (const axis of AXES) {
        const pull = STIFFNESS * (target[axis] - position[axis])
        velocity[axis] += (pull - DAMPING * velocity[axis]) * dt
        position[axis] += velocity[axis] * dt
        if (Math.abs(velocity[axis]) > 0.01 || Math.abs(target[axis] - position[axis]) > 0.001) {
          moving = true
        }
      }

      if (!moving && target.x === 0 && target.y === 0) {
        rest()
        return
      }

      body.style.setProperty('--dx', position.x.toFixed(4))
      body.style.setProperty('--dy', position.y.toFixed(4))
      frame = moving ? requestAnimationFrame(tick) : 0
    }

    const wake = () => {
      if (reduced.matches || frame) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const area = zone.getBoundingClientRect()
      if (area.width === 0 || area.height === 0) return
      target.x = clamp(((event.clientX - area.left) / area.width) * 2 - 1)
      target.y = clamp(((event.clientY - area.top) / area.height) * 2 - 1)
      wake()
    }

    const onLeave = () => {
      target.x = 0
      target.y = 0
      wake()
    }

    const onPreference = () => {
      if (reduced.matches) rest()
    }

    zone.addEventListener('pointermove', onMove, { passive: true })
    zone.addEventListener('pointerleave', onLeave, { passive: true })
    reduced.addEventListener('change', onPreference)

    return () => {
      zone.removeEventListener('pointermove', onMove)
      zone.removeEventListener('pointerleave', onLeave)
      reduced.removeEventListener('change', onPreference)
      rest()
    }
  }, [])

  return zoneRef
}
