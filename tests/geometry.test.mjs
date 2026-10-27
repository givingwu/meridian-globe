import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { Vector3 } from 'three'
import { cities, routes } from '../src/features/globe/data/network.ts'
import { toPosition } from '../src/features/globe/math/coordinates.ts'
import { FlightCurve } from '../src/features/globe/math/FlightCurve.ts'

test('geographic coordinates follow a consistent, north-up convention', () => {
  assert.ok(toPosition(0, 0).distanceTo(new Vector3(0, 0, 2)) < 1e-9)
  assert.ok(toPosition(90, 0).distanceTo(new Vector3(0, 2, 0)) < 1e-9)
  assert.ok(toPosition(0, 90).distanceTo(new Vector3(2, 0, 0)) < 1e-9)
})
test('every route reaches its cities and never penetrates the globe', () => {
  for (const [from, to] of routes) {
    const a = toPosition(cities[from].lat, cities[from].lon, 1)
    const b = toPosition(cities[to].lat, cities[to].lon, 1)
    const curve = new FlightCurve(a, b)
    assert.ok(
      curve.getPoint(0).distanceTo(a.clone().multiplyScalar(2.018)) < 1e-8,
    )
    assert.ok(
      curve.getPoint(1).distanceTo(b.clone().multiplyScalar(2.018)) < 1e-8,
    )
    for (let i = 0; i <= 100; i++)
      assert.ok(curve.getPoint(i / 100).length() >= 2.018 - 1e-9)
  }
})
test('coincident and antipodal destinations remain finite and outside the sphere', () => {
  for (const destination of [new Vector3(0, 0, 1), new Vector3(0, 0, -1)]) {
    const curve = new FlightCurve(new Vector3(0, 0, 1), destination)
    for (let i = 0; i <= 100; i++)
      assert.ok(curve.getPoint(i / 100).length() >= 2.018 - 1e-9)
  }
})
test('precomputed land is nonempty, finite, and on the unit sphere', () => {
  const land = JSON.parse(
    readFileSync(
      new URL('../src/features/globe/data/land.json', import.meta.url),
    ),
  )
  assert.ok(land.length / 3 > 15000 && land.length / 3 < 30000)
  assert.equal(land.length % 3, 0)
  for (let i = 0; i < land.length; i += 3)
    assert.ok(Math.abs(Math.hypot(...land.slice(i, i + 3)) - 1) < 0.000002)
})

test('city roster is the original twelve plus Hong Kong, with valid connected routes', () => {
  const expected = [
    'LHR',
    'SFO',
    'JFK',
    'SIN',
    'HND',
    'SYD',
    'GRU',
    'CPT',
    'DXB',
    'CDG',
    'BOM',
    'YYZ',
    'HK',
  ]
  assert.deepEqual(
    cities.map((city) => city.code),
    expected,
  )
  assert.equal(routes.length, 20)
  for (const route of routes)
    for (const index of route) assert.ok(index >= 0 && index < cities.length)
  for (let index = 0; index < cities.length; index++)
    assert.ok(routes.some((route) => route.includes(index)))
})
