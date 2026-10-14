import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ModelViewer } from '../viewer/ModelViewer'

const BASE = `${import.meta.env.BASE_URL}hra/`

interface Organ {
  slug: string; label_id: string; label_latin_or_en: string; sex: string; hra_version: string; source_data: string
  license: string; source_url: string; file: string; bytes: number; tris: number; parts: string[]; parts_total?: number
  front?: [number, number, number]
}
interface Catalog { organs: Organ[]; attribution: string; citation: string; retrieved: string }

/** Organ detail dari Human Reference Atlas: penampil terpisah dari atlas tubuh BodyParts3D. */
export default function OrganLab() {
  const [cat, setCat] = useState<Catalog | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [slug, setSlug] = useState<string | null>(null)
  const [parts, setParts] = useState<string[]>([])
  const [tris, setTris] = useState(0)
  const [pick, setPick] = useState<string | null>(null)
  const [ghost, setGhost] = useState(true)
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const host = useRef<HTMLDivElement>(null)
  const mv = useRef<ModelViewer | null>(null)
  const ghostRef = useRef(ghost)
  ghostRef.current = ghost

  useEffect(() => {
    fetch(BASE + 'hra.json').then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((j) => {
        const c: Catalog = Array.isArray(j) ? { organs: j, attribution: '', citation: '', retrieved: '' } : j
        setCat(c)
        const want = /#organ\/([\w-]+)/.exec(location.hash)?.[1]
        setSlug(c.organs.find((o) => o.slug === want)?.slug ?? c.organs[0]?.slug ?? null)
      })
      .catch((e) => setErr(String(e)))
  }, [])

  const organ = cat?.organs.find((o) => o.slug === slug) ?? null

  useEffect(() => {
    if (!organ || !host.current) return
    history.replaceState(null, '', `#organ/${organ.slug}`)
    const v = new ModelViewer(host.current, {
      background: '#07090C', onPick: (n) => setPick(n),
      front: organ.front ? new THREE.Vector3(...organ.front) : new THREE.Vector3(0, 0, 1),
    })
    v.renderer.domElement.setAttribute('aria-label', `Model 3D ${organ.label_id}. Seret untuk memutar, klik untuk memilih bagian.`)
    v.renderer.domElement.dataset.testid = 'organ-canvas'
    mv.current = v
    v.setGhost(ghostRef.current)
    setState('loading'); setPick(null); setParts([])
    v.load(organ.file.startsWith('/') ? `${import.meta.env.BASE_URL}${organ.file.slice(1)}` : BASE + organ.file).then((r) => { setParts(r.parts); setTris(r.tris); setState('ready') }).catch(() => setState('error'))
    return () => { v.dispose(); mv.current = null }
  }, [organ])

  useEffect(() => { mv.current?.select(pick) }, [pick])
  useEffect(() => { mv.current?.setGhost(ghost) }, [ghost])

  if (err) return <div className="fatal" role="alert"><h2>Katalog organ gagal dimuat</h2><p>{err}</p></div>
  if (!cat) return <div className="fatal" role="status"><p>Memuat katalog organ…</p></div>

  return (
    <main className="organ" data-testid="organ-lab">
      <nav className="demo-nav" aria-label="Daftar organ">
        <p className="eyebrow">Organ detail · Human Reference Atlas</p>
        <ol className="organ-list">
          {cat.organs.map((o) => (
            <li key={o.slug}>
              <button className={o.slug === slug ? 'on' : ''} aria-current={o.slug === slug ? 'true' : undefined} onClick={() => setSlug(o.slug)} data-testid={`organ-${o.slug}`}>
                <span className="st">{o.label_id}</span>
                <span className="meta">{o.sex === 'female' ? 'perempuan' : o.sex === 'male' ? 'laki-laki' : o.sex} · {o.parts_total ?? o.parts.length} bagian</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="note">Model organ ini berasal dari orang yang berbeda dengan atlas tubuh BodyParts3D, sehingga ditampilkan terpisah dan tidak digabung ke tubuh.</p>
      </nav>

      <section className="stage organ-stage" aria-label="Penampil organ">
        <div className="canvas-host" ref={host} data-state={state} data-testid="organ-stage" />
        {state === 'loading' && <div className="stage-loading">Memuat {organ?.label_id}…</div>}
        {state === 'error' && <div className="stage-loading err">Model gagal dimuat.</div>}
        <div className="toolbar" role="toolbar" aria-label="Kontrol tampilan organ">
          <button onClick={() => mv.current?.view('front')}>Anterior</button>
          <button onClick={() => mv.current?.view('back')}>Posterior</button>
          <button onClick={() => mv.current?.view('right')}>Kanan</button>
          <button onClick={() => mv.current?.view('left')}>Kiri</button>
          <span className="sep" />
          <button aria-pressed={ghost} onClick={() => setGhost((g) => !g)} title="Transparankan bagian lain saat satu bagian dipilih">X-ray</button>
          <button onClick={() => { setPick(null); mv.current?.reset() }}>Atur ulang</button>
        </div>
      </section>

      <aside className="panel right organ-info" aria-label="Informasi organ">
        {organ && (
          <div className="panel-inner info">
            <p className="eyebrow">{organ.hra_version}</p>
            <h2 className="title-latin">{organ.label_id}</h2>
            <dl className="facts">
              <dt>Nama</dt><dd>{organ.label_latin_or_en}</dd>
              <dt>Sumber</dt><dd>{organ.source_data}</dd>
              <dt>Lisensi</dt><dd>{organ.license}</dd>
              <dt>Mesh</dt><dd className="tab">{(tris || organ.tris).toLocaleString('id-ID')} segitiga · {(organ.bytes / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 })} MB</dd>
            </dl>
            <div>
              <p className="eyebrow">Bagian ({parts.length || organ.parts.length}) {pick && <>· dipilih: <b className="pick">{pick}</b></>}</p>
              <ul className="parts" data-testid="organ-parts">
                {(parts.length ? parts : organ.parts).map((p) => (
                  <li key={p}><button className={p === pick ? 'on' : ''} onClick={() => setPick(p === pick ? null : p)}>{p}</button></li>
                ))}
              </ul>
            </div>
            <p className="note">Nama bagian sesuai berkas sumber (bahasa Inggris/istilah HRA). <a href={organ.source_url} target="_blank" rel="noreferrer">Halaman sumber</a>.</p>
            {cat.attribution && <p className="note">{cat.attribution}</p>}
          </div>
        )}
      </aside>
    </main>
  )
}
