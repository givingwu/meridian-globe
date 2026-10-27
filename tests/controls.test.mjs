import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  controlsReducer,
  initialControls,
} from '../src/features/globe/state/controls.ts'
import { cities } from '../src/features/globe/data/network.ts'

test('reset replaces stale camera intent without changing playback preferences', () => {
  const before = {
    ...initialControls,
    selected: 12,
    speed: 2,
    pausedOverride: true,
    cameraCommand: { type: 'zoom', direction: -1 },
  }
  const after = controlsReducer(before, { type: 'reset' })
  assert.deepEqual(after, {
    ...before,
    selected: null,
    cameraCommand: { type: 'home' },
  })
  assert.equal(before.selected, 12)
})
test('commands survive lazy loading and repeated explore creates a fresh focus request', () => {
  const first = controlsReducer(initialControls, { type: 'explore' })
  const second = controlsReducer(first, { type: 'explore' })
  assert.equal(cities[first.selected].code, 'HK')
  assert.deepEqual(second.cameraCommand, {
    type: 'focus',
    index: first.selected,
  })
  assert.notEqual(first.cameraCommand, second.cameraCommand)
  assert.equal(first.pausedOverride, false)
})
test('invalid city input cannot corrupt the current command', () => {
  for (const index of [-1, 100, NaN, 0.5])
    assert.equal(
      controlsReducer(initialControls, { type: 'select', index }),
      initialControls,
    )
})
test('batched playback toggles use the latest reducer state, not a stale render snapshot', () => {
  const first = controlsReducer(initialControls, {
    type: 'toggle-playback',
    paused: true,
  })
  const second = controlsReducer(first, {
    type: 'toggle-playback',
    paused: true,
  })
  assert.equal(first.pausedOverride, false)
  assert.equal(second.pausedOverride, true)
})
