import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

export interface ModelViewerOptions {
  /** Warna latar; null = mengikuti tema (transparan di atas latar CSS). */
  background?: string | null
  onPick?: (name: string | null) => void
  /** Sumbu "depan" model setelah konversi glTF (default: -Z = anterior untuk data RAS/Blender). */
  front?: THREE.Vector3
}

/** Penampil GLB tunggal: orbit, pilih bagian (nama mesh/node), transparansi bagian lain, atur ulang. */
export class ModelViewer {
  readonly renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100000)
  private controls: OrbitControls
  private loader = new GLTFLoader()
  private root: THREE.Object3D | null = null
  private meshes: THREE.Mesh[] = []
  private baseMat = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>()
  private selected: string | null = null
  private ghost = false
  private needsRender = true
  private raf = 0
  private ro: ResizeObserver
  private down = { x: 0, y: 0 }
  private home = { pos: new THREE.Vector3(), target: new THREE.Vector3() }
  private front: THREE.Vector3

  constructor(private host: HTMLElement, private opts: ModelViewerOptions = {}) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: opts.background == null })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.NeutralToneMapping
    this.renderer.domElement.setAttribute('role', 'img')
    host.appendChild(this.renderer.domElement)
    if (opts.background) this.scene.background = new THREE.Color(opts.background)
    this.front = opts.front ?? new THREE.Vector3(0, 0, -1)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.controls.dampingFactor = 0.12
    this.controls.addEventListener('change', () => (this.needsRender = true))

    const hemi = new THREE.HemisphereLight('#ffffff', '#5a5148', 1.3)
    const key = new THREE.DirectionalLight('#fff6ec', 2.0)
    const fill = new THREE.DirectionalLight('#e8f0ff', 0.7)
    const rim = new THREE.DirectionalLight('#ffffff', 0.9)
    // cahaya mengikuti kamera agar sisi yang dilihat selalu terang
    this.camera.add(key, fill, rim)
    key.position.set(-1, 1.5, 1); fill.position.set(1.5, 0.3, 1); rim.position.set(0, 1, -2)
    this.scene.add(hemi, this.camera)

    this.loader.setMeshoptDecoder(MeshoptDecoder)
    const el = this.renderer.domElement
    el.addEventListener('pointerdown', (e) => (this.down = { x: e.clientX, y: e.clientY }))
    el.addEventListener('pointerup', this.onUp)
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(host)
    this.resize()
    const loop = () => {
      this.raf = requestAnimationFrame(loop)
      if (this.controls.update() || this.needsRender) {
        this.renderer.render(this.scene, this.camera)
        this.needsRender = false
      }
    }
    loop()
  }

  async load(url: string, fallbackColor?: string): Promise<{ parts: string[]; tris: number }> {
    const gltf = await this.loader.loadAsync(url)
    if (this.root) this.scene.remove(this.root)
    this.root = gltf.scene
    this.meshes = []
    this.baseMat.clear()
    let tris = 0
    const parts = new Set<string>()
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      this.meshes.push(m)
      const name = partName(m)
      parts.add(name)
      const g = m.geometry
      tris += (g.index ? g.index.count : g.attributes.position.count) / 3
      if (fallbackColor) {
        m.material = new THREE.MeshStandardMaterial({ color: fallbackColor, roughness: 0.6, metalness: 0 })
      } else {
        const mats = Array.isArray(m.material) ? m.material : [m.material]
        mats.forEach((mt) => { const s = mt as THREE.MeshStandardMaterial; if ('metalness' in s) s.metalness = 0; mt.side = THREE.DoubleSide })
      }
      this.baseMat.set(m, m.material)
    })
    this.scene.add(gltf.scene)
    this.frame()
    this.needsRender = true
    return { parts: [...parts].sort(), tris: Math.round(tris) }
  }

  /** Bingkai ulang kamera ke model, dari arah anterior. */
  frame() {
    if (!this.root) return
    const box = new THREE.Box3().setFromObject(this.root)
    const c = box.getCenter(new THREE.Vector3())
    const r = box.getSize(new THREE.Vector3()).length() / 2
    const dist = r / Math.sin(THREE.MathUtils.degToRad(this.camera.fov / 2)) * 0.9
    this.camera.near = dist / 100; this.camera.far = dist * 20; this.camera.updateProjectionMatrix()
    this.home.target.copy(c)
    this.home.pos.copy(c).addScaledVector(this.front, dist)
    this.reset()
  }

  reset() {
    this.camera.position.copy(this.home.pos)
    this.controls.target.copy(this.home.target)
    this.camera.up.set(0, 1, 0)
    this.controls.update()
    this.needsRender = true
  }

  /** Putar kamera mengelilingi target: 'front' | 'back' | 'left' | 'right' (kiri/kanan pasien). */
  view(v: 'front' | 'back' | 'left' | 'right') {
    const d = this.home.pos.distanceTo(this.home.target)
    const f = this.front.clone()
    const lat = new THREE.Vector3(0, 1, 0).cross(f).normalize() // arah kiri pasien bila f = anterior (sistem tangan kanan)
    const dir = v === 'front' ? f : v === 'back' ? f.negate() : v === 'right' ? lat.negate() : lat
    this.camera.position.copy(this.home.target).addScaledVector(dir, d)
    this.controls.target.copy(this.home.target)
    this.controls.update()
    this.needsRender = true
  }

  select(name: string | null) {
    this.selected = name
    this.applyMaterials()
  }

  setGhost(on: boolean) {
    this.ghost = on
    this.applyMaterials()
  }

  private applyMaterials() {
    for (const m of this.meshes) {
      const base = this.baseMat.get(m)!
      const isSel = this.selected != null && partName(m) === this.selected
      if (isSel) {
        const src = (Array.isArray(base) ? base[0] : base) as THREE.MeshStandardMaterial
        const sm = src.clone()
        sm.emissive = new THREE.Color('#FF6A1A'); sm.emissiveIntensity = 0.35
        sm.transparent = false; sm.opacity = 1; sm.depthWrite = true
        m.material = sm
      } else if (this.ghost && this.selected != null) {
        m.material = new THREE.MeshStandardMaterial({ color: '#8C97A3', transparent: true, opacity: 0.12, depthWrite: false })
      } else {
        m.material = base
      }
    }
    this.needsRender = true
  }

  private onUp = (e: PointerEvent) => {
    if (Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y) > 4 || !this.opts.onPick) return
    const r = this.renderer.domElement.getBoundingClientRect()
    const p = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    const rc = new THREE.Raycaster()
    rc.setFromCamera(p, this.camera)
    const hits = rc.intersectObjects(this.meshes, false).filter((h) => {
      const mt = (h.object as THREE.Mesh).material as THREE.Material
      return !(mt.transparent && mt.opacity < 0.2)
    })
    this.opts.onPick(hits.length ? partName(hits[0].object as THREE.Mesh) : null)
  }

  private resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.needsRender = true
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.controls.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}

/** Nama bagian: nama mesh, atau nama node induk bila mesh tanpa nama (pola umum ekspor glTF). */
export function partName(m: THREE.Object3D): string {
  const own = m.name && !/^mesh_?\d*$|^Mesh\d*$/i.test(m.name) ? m.name : ''
  return (own || m.parent?.name || 'tanpa nama').replace(/^VH_[MF]_/, '').replace(/_/g, ' ')
}
