import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Vector3 } from 'three'
import { CameraTransition } from '../src/features/globe/math/CameraTransition.ts'
import {
  HOME_POSITION,
  MIN_CAMERA_DISTANCE,
  MAX_CAMERA_DISTANCE,
} from '../src/features/globe/config.ts'
import { cities } from '../src/features/globe/data/network.ts'
import { toPosition } from '../src/features/globe/math/coordinates.ts'
function settle(motion, position) {
  for (let i = 0; i < 600 && motion.active; i++) {
    motion.advance(position, 1 / 60)
    assert.ok(position.length() >= MIN_CAMERA_DISTANCE - 1e-8)
  }
  assert.equal(motion.active, false)
}
test('first mounted command focuses the selected city instead of resetting home', () => {
  const motion = new CameraTransition(),
    position = new Vector3(...HOME_POSITION)
  motion.apply({ type: 'focus', index: 0 }, position)
  settle(motion, position)
  assert.ok(
    position.distanceTo(toPosition(cities[0].lat, cities[0].lon, 6.94)) < 1e-8,
  )
})
test('rapid zoom accumulates against the destination and does not double apply a replayed effect', () => {
  const motion = new CameraTransition(),
    position = new Vector3(...HOME_POSITION)
  const command = { type: 'zoom', direction: 1 }
  motion.apply(command, position)
  motion.apply(command, position)
  motion.apply({ type: 'zoom', direction: 1 }, position)
  settle(motion, position)
  assert.ok(Math.abs(position.length() - (6.94 - 1.3)) < 1e-8)
})
test('zoom preserves an ongoing focus direction, clamps distance, and reset converges', () => {
  const motion = new CameraTransition(),
    position = new Vector3(...HOME_POSITION)
  motion.apply({ type: 'focus', index: 1 }, position)
  for (let i = 0; i < 30; i++)
    motion.apply({ type: 'zoom', direction: -1 }, position)
  settle(motion, position)
  assert.ok(
    position.distanceTo(
      toPosition(cities[1].lat, cities[1].lon, MAX_CAMERA_DISTANCE),
    ) < 1e-8,
  )
  motion.apply({ type: 'home' }, position)
  settle(motion, position)
  assert.ok(position.distanceTo(new Vector3(...HOME_POSITION)) < 1e-8)
})
test('manual cancellation stops motion; effect cleanup allows a fresh replay', () => {
  const motion = new CameraTransition(),
    position = new Vector3(...HOME_POSITION)
  const command = { type: 'focus', index: 1 }
  motion.apply(command, position)
  motion.advance(position, 1 / 60)
  motion.cancel()
  const stopped = position.clone()
  motion.advance(position, 10)
  assert.deepEqual(position, stopped)
  motion.reset()
  motion.apply(command, position)
  assert.equal(motion.active, true)
  settle(motion, position)
})
