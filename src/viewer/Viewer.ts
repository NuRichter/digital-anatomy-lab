import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { SYSTEM_COLOR, type SystemKey } from '../config'
import type { Item } from '../types'

export type ViewName = 'front' | 'back' | 'left' | 'right'

export interface ViewerCallbacks {
  onPick: (id: string | null) => void
  onChunkState: (chunk: string, state: 'loading' | 'ready' | 'error') => void
}

const SELECT = new THREE.Color('#FF6A1A')

/** Imperative three.js stage. React owns UI state and calls setVisible/select/etc. */
export class Viewer {
  readonly renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private loader = new GLTFLoader()
  private meshes = new Map<string, THREE.Mesh>() // id -> mesh
  private chunkPromises = new Map<string, Promise<void>>()
  private baseMats = new Map<SystemKey, THREE.MeshStandardMaterial>()
  private selMats = new Map<SystemKey, THREE.MeshStandardMaterial>()
  private ghostMat: THREE.MeshStandardMaterial
  private selected = new Set<string>()
  private xray = false
  private raycaster = new THREE.Raycaster()
  private needsRender = true
  private raf = 0
  private ro: ResizeObserver
  private down = { x: 0, y: 0, t: 0 }
  private disposed = false
  private homeTarget = new THREE.Vector3(0, 0.85, 0)
  private homeDist = 3.1
  private anim: { from: THREE.Vector3; to: THREE.Vector3; tf: THREE.Vector3; tt: THREE.Vector3; t0: number; dur: number } | null = null

  constructor(private host: HTMLElement, private itemsById: Map<string, Item>, private cb: ViewerCallbacks, dark: boolean) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.NeutralToneMapping
    this.renderer.domElement.setAttribute('aria-label', 'Model anatomi 3D seluruh tubuh. Seret untuk memutar, gulir untuk memperbesar.')
    this.renderer.domElement.setAttribute('role', 'img')
    this.renderer.domElement.dataset.testid = 'viewer-canvas'
    host.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(30, 1, 0.01, 50)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.controls.dampingFactor = 0.12
    this.controls.minDistance = 0.12
    this.controls.maxDistance = 8
    this.controls.addEventListener('change', () => (this.needsRender = true))
    this.setBackground(dark)

    const hemi = new THREE.HemisphereLight('#ffffff', '#5a5148', 1.25)
    const key = new THREE.DirectionalLight('#fff6ec', 2.0); key.position.set(-2, 3, 3)
    const fill = new THREE.DirectionalLight('#e8f0ff', 0.7); fill.position.set(3, 1, 2)
    const rim = new THREE.DirectionalLight('#ffffff', 1.0); rim.position.set(0, 2, -3)
    this.scene.add(hemi, key, fill, rim)

    for (const [s, hex] of Object.entries(SYSTEM_COLOR) as [SystemKey, string][]) {
      const rough = s === 'skeletal' ? 0.7 : s === 'sensory' ? 0.3 : 0.55
      this.baseMats.set(s, new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: 0 }))
      this.selMats.set(s, new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: 0, emissive: SELECT, emissiveIntensity: 0.2 }))
    }
    this.ghostMat = new THREE.MeshStandardMaterial({ color: '#8C97A3', transparent: true, opacity: 0.08, depthWrite: false, roughness: 0.4 })

    this.loader.setMeshoptDecoder(MeshoptDecoder)
    const el = this.renderer.domElement
    el.addEventListener('pointerdown', this.onDown)
    el.addEventListener('pointerup', this.onUp)
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(host)
    this.resize()
    this.view('front', false)
    this.loop()
  }

  setBackground(dark: boolean) {
    this.scene.background = new THREE.Color(dark ? '#1C2126' : '#E4E5E1')
    this.needsRender = true
  }

  /** Load a chunk once; resolves when meshes are in the scene. */
  loadChunk(chunk: string): Promise<void> {
    const existing = this.chunkPromises.get(chunk)
    if (existing) return existing
    this.cb.onChunkState(chunk, 'loading')
    const p = new Promise<void>((resolve, reject) => {
      this.loader.load(
        `${import.meta.env.BASE_URL}models/${chunk}.glb`,
        (gltf) => {
          if (this.disposed) return resolve()
          gltf.scene.traverse((o) => {
            const m = o as THREE.Mesh
            if (!m.isMesh) return
            const id = m.name.split('.')[0]
            const it = this.itemsById.get(id) ?? this.itemsById.get(m.parent?.name ?? '')
            if (!it) return
            m.name = it.id
            m.userData.id = it.id
            m.material = this.baseMats.get(it.system)!
            m.visible = false
            this.meshes.set(it.id, m)
          })
          this.scene.add(gltf.scene)
          this.cb.onChunkState(chunk, 'ready')
          this.needsRender = true
          resolve()
        },
        undefined,
        (err) => {
          this.chunkPromises.delete(chunk)
          this.cb.onChunkState(chunk, 'error')
          reject(err)
        },
      )
    })
    this.chunkPromises.set(chunk, p)
    return p
  }

  isLoaded(chunk: string) {
    return this.chunkPromises.has(chunk)
  }

  /** visible: predicate on item id. */
  applyVisibility(visible: (id: string) => boolean) {
    for (const [id, m] of this.meshes) m.visible = visible(id)
    this.refreshMaterials()
  }

  setSelection(ids: string[]) {
    this.selected = new Set(ids)
    this.refreshMaterials()
  }

  setXray(on: boolean) {
    this.xray = on
    this.refreshMaterials()
  }

  private refreshMaterials() {
    const hasSel = this.selected.size > 0
    for (const [id, m] of this.meshes) {
      const it = this.itemsById.get(id)!
      if (this.selected.has(id)) m.material = this.selMats.get(it.system)!
      else if (this.xray && hasSel) m.material = this.ghostMat
      else m.material = this.baseMats.get(it.system)!
      m.renderOrder = this.selected.has(id) ? 1 : 0
    }
    this.needsRender = true
  }

  /** Bounding box of currently visible meshes (or a given id set). */
  private bounds(ids?: Iterable<string>) {
    const box = new THREE.Box3()
    const list = ids ? [...ids].map((i) => this.meshes.get(i)).filter(Boolean) as THREE.Mesh[] : [...this.meshes.values()].filter((m) => m.visible)
    for (const m of list) {
      if (!m.geometry.boundingBox) m.geometry.computeBoundingBox()
      box.union(m.geometry.boundingBox!.clone().applyMatrix4(m.matrixWorld))
    }
    return box
  }

  focus(ids: string[], animate = true) {
    const box = this.bounds(ids)
    if (box.isEmpty()) return
    const size = box.getSize(new THREE.Vector3()).length()
    const center = box.getCenter(new THREE.Vector3())
    const dir = this.camera.position.clone().sub(this.controls.target).normalize()
    const dist = Math.max(0.18, (size / 2) / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * 1.15)
    this.moveTo(center.clone().add(dir.multiplyScalar(dist)), center, animate)
  }

  focusVisible() {
    const ids = [...this.meshes.entries()].filter(([, m]) => m.visible).map(([id]) => id)
    if (ids.length) this.focus(ids)
  }

  view(v: ViewName, animate = true) {
    const t = this.homeTarget.clone()
    const d = this.homeDist
    const pos = { front: new THREE.Vector3(0, 0.1, d), back: new THREE.Vector3(0, 0.1, -d), left: new THREE.Vector3(d, 0.1, 0), right: new THREE.Vector3(-d, 0.1, 0) }[v]
    this.moveTo(t.clone().add(pos), t, animate)
  }

  reset() {
    this.view('front')
  }

  private moveTo(pos: THREE.Vector3, target: THREE.Vector3, animate: boolean) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!animate || reduce) {
      this.camera.position.copy(pos); this.controls.target.copy(target); this.controls.update(); this.needsRender = true; return
    }
    this.anim = { from: this.camera.position.clone(), to: pos, tf: this.controls.target.clone(), tt: target, t0: performance.now(), dur: 400 }
  }

  private onDown = (e: PointerEvent) => {
    this.down = { x: e.clientX, y: e.clientY, t: performance.now() }
  }

  private onUp = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y) > 5 || performance.now() - this.down.t > 600) return
    const r = this.renderer.domElement.getBoundingClientRect()
    const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    this.raycaster.setFromCamera(ndc, this.camera)
    const targets = [...this.meshes.values()].filter((m) => m.visible && m.material !== this.ghostMat)
    const hit = this.raycaster.intersectObjects(targets, false)[0]
    this.cb.onPick(hit ? (hit.object.userData.id as string) : null)
  }

  private resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.needsRender = true
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    if (this.anim) {
      const k = Math.min(1, (performance.now() - this.anim.t0) / this.anim.dur)
      const e = 1 - Math.pow(1 - k, 3)
      this.camera.position.lerpVectors(this.anim.from, this.anim.to, e)
      this.controls.target.lerpVectors(this.anim.tf, this.anim.tt, e)
      if (k >= 1) this.anim = null
      this.needsRender = true
    }
    const moved = this.controls.update()
    if (moved || this.needsRender) {
      this.renderer.render(this.scene, this.camera)
      this.needsRender = false
      this.frames++
    }
  }

  frames = 0

  stats() {
    let tris = 0, vis = 0
    for (const m of this.meshes.values()) if (m.visible) { vis++; tris += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3 }
    return { meshes: this.meshes.size, visible: vis, triangles: Math.round(tris), calls: this.renderer.info.render.calls }
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.renderer.domElement.removeEventListener('pointerdown', this.onDown)
    this.renderer.domElement.removeEventListener('pointerup', this.onUp)
    this.controls.dispose()
    this.scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) m.geometry.dispose() })
    for (const m of [...this.baseMats.values(), ...this.selMats.values(), this.ghostMat]) m.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
