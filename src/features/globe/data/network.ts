/**
 * 演示网络只存储可序列化数据，不依赖 Three.js。
 * 这样 DOM 面板无需为了显示城市名就下载 WebGL 运行时。
 * routes 是有向边 [起点索引, 终点索引]；重新排列城市时必须同步迁移边。
 * code 是稳定 UI key，香港的 HK 是产品简称，不是机场代码。
 */
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

/** 固定的 20 条示例连接，不代表真实交易数据。 */
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

/** 通过城市代码查找入口，避免组件内出现不透明的数字 12。 */
export const EXPLORE_CITY_INDEX = cities.findIndex((city) => city.code === 'HK')
