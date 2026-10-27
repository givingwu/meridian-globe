import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Billboard, Html, OrbitControls } from '@react-three/drei'
import {
  Color,
  Quaternion,
  Vector3,
  AdditiveBlending,
  ShaderMaterial,
  TubeGeometry,
  Mesh,
  MeshBasicMaterial,
} from 'three'
import {
  cities,
  colors,
  routes,
  toPosition,
  FlightCurve,
  HOME_POSITION,
} from './data'
import {
  arcFragment,
  arcVertex,
  glowVertex,
  glowFragment,
  oceanFragment,
  oceanVertex,
  pointFragment,
  pointVertex,
} from './shaders'
import land from './land.json'
import { routeWindow } from './routeAnimation'

export const landCount = land.length / 3
export interface GlobeProps {
  paused: boolean
  showRoutes: boolean
  speed: number
  selected: number | null
  reset: number
  zoom: number
  onSelect: (index: number | null) => void
}
function Land({ paused, speed }: Pick<GlobeProps, 'paused' | 'speed'>) {
  const material = useRef<ShaderMaterial>(null)
  const pixelRatio = useThree((state) => state.gl.getPixelRatio())
  const positions = useMemo(
    () => new Float32Array(land.map((v) => v * 2.006)),
    [],
  )
  const seeds = useMemo(
    () =>
      new Float32Array(
        Array.from({ length: landCount }, (_, i) => (i * 0.6180339) % 1),
      ),
    [],
  )
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } }),
    [pixelRatio],
  )
  useFrame((_, delta) => {
    if (material.current && !paused)
      material.current.uniforms.uTime.value += Math.min(delta, 0.05) * speed
  })
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={pointVertex}
        fragmentShader={pointFragment}
        transparent
        depthWrite={false}
      />
    </points>
  )
}
function Route({
  pair,
  index,
  paused,
  speed,
}: {
  pair: readonly [number, number]
  index: number
  paused: boolean
  speed: number
}) {
  const material = useRef<ShaderMaterial>(null)
  const geometry = useRef<TubeGeometry>(null)
  const elapsed = useRef(0)
  const curve = useMemo(
    () =>
      new FlightCurve(
        toPosition(cities[pair[0]].lat, cities[pair[0]].lon, 1),
        toPosition(cities[pair[1]].lat, cities[pair[1]].lon, 1),
      ),
    [pair],
  )
  const uniforms = useMemo(
    () => ({
      uStart: { value: 0 },
      uEnd: { value: 0 },
      uColor: { value: new Color(colors[index % colors.length]) },
    }),
    [index],
  )
  useFrame((_, delta) => {
    if (!paused) elapsed.current += Math.min(delta, 0.05) * speed
    const { start, end } = routeWindow(elapsed.current, index, routes.length)
    if (!geometry.current || !material.current) return
    // Each complete tube segment has five radial faces, two triangles per face.
    const first = Math.floor(start * 160)
    const last = Math.ceil(end * 160)
    geometry.current.setDrawRange(first * 30, Math.max(0, last - first) * 30)
    material.current.uniforms.uStart.value = start
    material.current.uniforms.uEnd.value = end
  })
  return (
    <mesh>
      <tubeGeometry
        ref={geometry}
        args={[curve, 160, 0.005, 5, false]}
        onUpdate={(g) => g.setDrawRange(0, 0)}
      />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={arcVertex}
        fragmentShader={arcFragment}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  )
}
function CityMarker({
  index,
  paused,
  speed,
  selected,
  onSelect,
}: { index: number } & Pick<
  GlobeProps,
  'paused' | 'speed' | 'selected' | 'onSelect'
>) {
  const city = cities[index]
  const [hovered, setHovered] = useState(false)
  const ring = useRef<Mesh>(null)
  const pulse = useRef<MeshBasicMaterial>(null)
  const time = useRef(index * 0.37)
  const position = useMemo(() => toPosition(city.lat, city.lon, 2.025), [city])
  const quaternion = useMemo(
    () =>
      new Quaternion().setFromUnitVectors(
        new Vector3(0, 0, 1),
        position.clone().normalize(),
      ),
    [position],
  )
  useFrame((_, delta) => {
    if (!paused) time.current += Math.min(delta, 0.05) * speed
    const phase = (time.current % 2.5) / 2.5
    if (ring.current) ring.current.scale.setScalar(1 + phase * 2.5)
    if (pulse.current) pulse.current.opacity = 0.5 * (1 - phase) ** 2
  })
  return (
    <group position={position} quaternion={quaternion}>
      <mesh ref={ring}>
        <ringGeometry args={[0.024, 0.029, 32]} />
        <meshBasicMaterial
          ref={pulse}
          color={colors[index % colors.length]}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <circleGeometry args={[selected === index ? 0.027 : 0.016, 16]} />
        <meshBasicMaterial
          color={
            hovered || selected === index
              ? '#ffffff'
              : colors[index % colors.length]
          }
        />
      </mesh>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(index)
        }}
      >
        <sphereGeometry args={[0.034, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {(hovered || selected === index) && (
        <Html
          center
          occlude
          position={[0, 0.11, 0.04]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="city-label">
            {city.name}
            <span>{city.country}</span>
          </div>
        </Html>
      )}
    </group>
  )
}
function CameraMotion({
  selected,
  reset,
  zoom,
  onSelect,
}: Pick<GlobeProps, 'selected' | 'reset' | 'zoom' | 'onSelect'>) {
  const { camera } = useThree()
  const target = useRef<Vector3 | null>(null)
  const turn = useMemo(() => new Quaternion(), [])
  const step = useMemo(() => new Quaternion(), [])
  const direction = useMemo(() => new Vector3(), [])
  useEffect(() => {
    if (selected !== null)
      target.current = toPosition(
        cities[selected].lat,
        cities[selected].lon,
        camera.position.length(),
      )
  }, [selected, camera])
  useEffect(() => {
    target.current = new Vector3(...HOME_POSITION)
  }, [reset])
  useEffect(() => {
    if (zoom)
      target.current = camera.position
        .clone()
        .normalize()
        .multiplyScalar(
          Math.max(
            4.3,
            Math.min(9, camera.position.length() - Math.sign(zoom) * 0.65),
          ),
        )
  }, [zoom, camera])
  useFrame((_, delta) => {
    if (!target.current) return
    const alpha = 1 - Math.exp(-Math.min(delta, 0.05) * 4)
    const radius = camera.position.length()
    const nextRadius = radius + (target.current.length() - radius) * alpha
    direction.copy(target.current).normalize()
    camera.position.normalize()
    turn.setFromUnitVectors(camera.position, direction)
    step.identity().slerp(turn, alpha)
    camera.position.applyQuaternion(step).multiplyScalar(nextRadius)
    camera.lookAt(0, 0, 0)
    if (camera.position.distanceTo(target.current) < 0.005)
      target.current = null
  })
  // Manual controls may take over at any point during a focus transition.
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const stop = () => {
      target.current = null
      if (selected !== null) onSelect(null)
    }
    gl.domElement.addEventListener('pointerdown', stop)
    return () => gl.domElement.removeEventListener('pointerdown', stop)
  }, [gl, selected, onSelect])
  return null
}
function Ocean({ paused, speed }: Pick<GlobeProps, 'paused' | 'speed'>) {
  const material = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame((_, delta) => {
    if (material.current && !paused)
      material.current.uniforms.uTime.value += Math.min(delta, 0.05) * speed
  })
  return (
    <>
      <mesh
        onPointerOver={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={oceanVertex}
          fragmentShader={oceanFragment}
        />
      </mesh>
      <Billboard>
        <mesh>
          <planeGeometry args={[5.8, 5.8]} />
          <shaderMaterial
            vertexShader={glowVertex}
            fragmentShader={glowFragment}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </Billboard>
    </>
  )
}
function Scene(props: GlobeProps) {
  return (
    <>
      <Ocean paused={props.paused} speed={props.speed} />
      <Land paused={props.paused} speed={props.speed} />
      {props.showRoutes &&
        routes.map((pair, index) => (
          <Route
            key={index}
            pair={pair}
            index={index}
            paused={props.paused}
            speed={props.speed}
          />
        ))}
      {cities.map((_, index) => (
        <CityMarker key={index} index={index} {...props} />
      ))}
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.07}
        minDistance={4.3}
        maxDistance={9}
        autoRotate={!props.paused && props.selected === null}
        autoRotateSpeed={0.3 * props.speed}
        rotateSpeed={0.5}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI - 0.3}
      />
      <CameraMotion {...props} />
    </>
  )
}
export default function Globe(props: GlobeProps) {
  const [visible, setVisible] = useState(!document.hidden)
  useEffect(() => {
    const listener = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', listener)
    return () => document.removeEventListener('visibilitychange', listener)
  }, [])
  return (
    <Canvas
      camera={{ position: HOME_POSITION, fov: 43 }}
      dpr={[1, 1.8]}
      frameloop={visible ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true }}
      fallback={
        <div className="fallback">
          当前浏览器不支持 WebGL，请使用开启硬件加速的浏览器。
        </div>
      }
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  )
}
