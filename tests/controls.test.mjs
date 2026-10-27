import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  controlsReducer,
  initialControls,
} from '../src/features/globe/state/controls.ts'
import { cities } from '../src/features/globe/data/network.ts'

test('reset atomically clears focus and zoom without changing playback preferences', () => {
  const before = {
    ...initialControls,
    selected: 12,
    zoom: -7,
    speed: 2,
    pausedOverride: true,
  }
  const after = controlsReducer(before, { type: 'reset' })
  assert.deepEqual(after, { ...before, selected: null, zoom: 0, reset: 1 })
  assert.equal(before.selected, 12)
})
test('repeated and reversed zoom clicks always produce distinct commands', () => {
  let state = initialControls
  for (const [direction, expected] of [
    [1, 1],
    [1, 2],
    [-1, -3],
    [-1, -4],
    [1, 5],
  ]) {
    state = controlsReducer(state, { type: 'zoom', direction })
    assert.equal(state.zoom, expected)
  }
})
test('explore selects Hong Kong and explicitly starts playback', () => {
  const state = controlsReducer(
    { ...initialControls, pausedOverride: true },
    { type: 'explore' },
  )
  assert.equal(cities[state.selected].code, 'HK')
  assert.equal(state.pausedOverride, false)
})
test('invalid city input is rejected and manual playback overrides the effective preference', () => {
  for (const index of [-1, 100, NaN, 0.5])
    assert.equal(
      controlsReducer(initialControls, { type: 'select', index }),
      initialControls,
    )
  assert.equal(initialControls.pausedOverride, null)
  assert.equal(
    controlsReducer(initialControls, { type: 'toggle-playback', paused: true })
      .pausedOverride,
    false,
  )
  assert.equal(
    controlsReducer(initialControls, { type: 'toggle-playback', paused: false })
      .pausedOverride,
    true,
  )
})
