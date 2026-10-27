import { Curve, Vector3 } from 'three'
export const cities = [
  {
    name: 'London',
    country: 'United Kingdom',
    lat: 51.507,
    lon: -0.128,
    code: 'LHR',
  },
  {
    name: 'San Francisco',
    country: 'United States',
    lat: 37.775,
    lon: -122.419,
    code: 'SFO',
  },
  {
    name: 'New York',
    country: 'United States',
    lat: 40.713,
    lon: -74.006,
    code: 'JFK',
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    lat: 1.352,
    lon: 103.82,
    code: 'SIN',
  },
  { name: 'Tokyo', country: 'Japan', lat: 35.676, lon: 139.65, code: 'HND' },
  {
    name: 'Sydney',
    country: 'Australia',
    lat: -33.869,
    lon: 151.209,
    code: 'SYD',
  },
  {
    name: 'São Paulo',
    country: 'Brazil',
    lat: -23.55,
    lon: -46.633,
    code: 'GRU',
  },
  {
    name: 'Cape Town',
    country: 'South Africa',
    lat: -33.925,
    lon: 18.424,
    code: 'CPT',
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.204,
    lon: 55.27,
    code: 'DXB',
  },
  { name: 'Paris', country: 'France', lat: 48.857, lon: 2.352, code: 'CDG' },
  { name: 'Mumbai', country: 'India', lat: 19.076, lon: 72.878, code: 'BOM' },
  {
    name: 'Toronto',
    country: 'Canada',
    lat: 43.653,
    lon: -79.383,
    code: 'YYZ',
  },
  {
    name: '香港 · Hong Kong',
    country: 'China',
    lat: 22.3193,
    lon: 114.1694,
    code: 'HK',
  },
] as const
export type City = (typeof cities)[number]
export function toPosition(lat: number, lon: number, radius = 2) {
  const phi = (lat * Math.PI) / 180,
    theta = (lon * Math.PI) / 180
  return new Vector3(
    Math.cos(phi) * Math.sin(theta),
    Math.sin(phi),
    Math.cos(phi) * Math.cos(theta),
  ).multiplyScalar(radius)
}
export const routes = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 8],
  [0, 7],
  [1, 4],
  [1, 3],
  [2, 6],
  [2, 9],
  [3, 4],
  [3, 5],
  [3, 10],
  [4, 5],
  [6, 7],
  [8, 10],
  [8, 3],
  [9, 11],
  [7, 8],
  [12, 0],
  [12, 3],
] as const
export const colors = ['#a996ff', '#70e1e8', '#658dff', '#edafd8']
export const HOME_POSITION = toPosition(24, 108, 6.94).toArray()

/** Great-circle direction with radial lift. Endpoints sit just above the ocean. */
export class FlightCurve extends Curve<Vector3> {
  private a: Vector3
  private b: Vector3
  constructor(a: Vector3, b: Vector3) {
    super()
    this.a = a.clone().normalize()
    this.b = b.clone().normalize()
  }
  getPoint(t: number, target = new Vector3()) {
    const angle = this.a.angleTo(this.b)
    const denominator = Math.sin(angle)
    if (Math.abs(denominator) < 1e-6) {
      if (angle < 1e-6) return target.copy(this.a).multiplyScalar(2.018)
      // Antipodal points have no unique great circle; choose a stable orthogonal axis.
      const axis = new Vector3()
        .crossVectors(
          this.a,
          Math.abs(this.a.y) < 0.9
            ? new Vector3(0, 1, 0)
            : new Vector3(1, 0, 0),
        )
        .normalize()
      target.copy(this.a).applyAxisAngle(axis, Math.PI * t)
    } else {
      target
        .copy(this.a)
        .multiplyScalar(Math.sin((1 - t) * angle) / denominator)
        .addScaledVector(this.b, Math.sin(t * angle) / denominator)
    }
    return target
      .normalize()
      .multiplyScalar(
        2.018 + Math.sin(Math.PI * t) * Math.min(angle * 0.53, 0.95),
      )
  }
}
