import { test } from 'node:test'
import assert from 'node:assert/strict'
import { routeWindow } from '../src/routeAnimation.ts'

test('a route starts empty and grows from a fixed origin to the destination', () => {
  assert.deepEqual(routeWindow(0, 0, 20), { start: 0, end: 0 })
  let previous = 0
  for (let t = 0; t < 1.3; t += 0.01) {
    const window = routeWindow(t, 0, 20)
    assert.equal(window.start, 0)
    assert.ok(window.end >= previous && window.end <= 1)
    previous = window.end
  }
  assert.deepEqual(routeWindow(1.3, 0, 20), { start: 0, end: 1 })
})
test('retreat advances the origin, then leaves no persistent geometry', () => {
  let previous = 0
  for (let t = 1.3; t < 4.1; t += 0.01) {
    const window = routeWindow(t, 0, 20)
    assert.equal(window.end, 1)
    assert.ok(window.start >= previous && window.start <= 1)
    previous = window.start
  }
  assert.deepEqual(routeWindow(4.2, 0, 20), { start: 0, end: 0 })
  assert.deepEqual(routeWindow(8, 0, 20), { start: 0, end: 0 })
})
test('routes are staggered and all visible intervals remain bounded', () => {
  assert.deepEqual(routeWindow(0.2, 1, 20), { start: 0, end: 0 })
  assert.ok(routeWindow(0.5, 1, 20).end > 0)
  for (let index = 0; index < 20; index++)
    for (let t = 0; t < 25; t += 0.05) {
      const { start, end } = routeWindow(t, index, 20)
      assert.ok(start >= 0 && end <= 1 && start <= end)
    }
})
