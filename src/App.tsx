import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ATTRIBUTION, GROUPS, LAYERS, REGIONS, SYNONYMS, SYSTEM_COLOR, SYSTEM_LABEL } from './config'
import type { Concept, Item, Manifest, Selection } from './types'
import { Viewer, webglAvailable, type ViewName } from './viewer/Viewer'

type ChunkState = 'idle' | 'loading' | 'ready' | 'error'
type Tab = 'jelajah' | 'info'

const REGION_LABEL = Object.fromEntries(REGIONS.map((r) => [r.key, r.label]))

function useMedia(q: string) {
  const [on, setOn] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const f = () => setOn(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [q])
  return on
}

function useManifest() {
  const [m, setM] = useState<Manifest | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const load = useCallback(() => {
    setErr(null)
    fetch(`${import.meta.env.BASE_URL}manifest.json`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(setM)
      .catch((e) => setErr(String(e)))
  }, [])
  useEffect(load, [load])
  return { m, err, retry: load }
}

export default function App() {
  const { m, err, retry } = useManifest()
  const [dark, setDark] = useState(() => localStorage.getItem('dal-theme') === 'dark')
  const [about, setAbout] = useState(false)
  const gl = useMemo(webglAvailable, [])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('dal-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="brand-mark" aria-hidden>◐</span>
          <div>
            <h1>Laboratorium Anatomi Digital</h1>
            <p className="brand-sub">Atlas 3D seluruh tubuh · BodyParts3D</p>
          </div>
        </div>
        <div className="top-actions">
          <button className="btn-secondary" onClick={() => setDark((d) => !d)} aria-pressed={dark} data-testid="theme-toggle">
            {dark ? <>Tema <span className="long">atlas</span></> : <><span className="long">Mode </span><span className="cap">proyektor</span></>}
          </button>
          <button className="btn-secondary" onClick={() => setAbout(true)} data-testid="about-open">Tentang<span className="long"> dan sumber</span></button>
        </div>
      </header>
      {err && (
        <div className="fatal" role="alert">
          <h2>Data katalog gagal dimuat</h2>
          <p>Periksa koneksi internet, lalu coba lagi. ({err})</p>
          <button className="btn-primary" onClick={retry}>Coba lagi</button>
        </div>
      )}
      {!err && !m && <div className="fatal" role="status" aria-live="polite"><p>Memuat katalog struktur…</p></div>}
      {m && (gl ? <Lab m={m} dark={dark} /> : <NoWebGL m={m} />)}
      {about && <About m={m} onClose={() => setAbout(false)} />}
    </div>
  )
}

function NoWebGL({ m }: { m: Manifest }) {
  const [q, setQ] = useState('')
  const res = useMemo(() => search(m, q).slice(0, 40), [m, q])
  return (
    <main className="nowebgl" data-testid="nowebgl">
      <img src={`${import.meta.env.BASE_URL}fallback.jpg`} alt="Render statis model anatomi: lapisan kulit sampai pembuluh dan otak" />
      <div>
        <h2>Tampilan 3D tidak tersedia di peramban ini</h2>
        <p>WebGL tidak aktif atau tidak didukung. Aktifkan akselerasi perangkat keras, atau buka situs ini di Chrome, Edge, Firefox, atau Safari versi terbaru. Katalog struktur tetap dapat dicari di bawah.</p>
        <input className="search" placeholder="Cari struktur (mis. jantung, femur)…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari struktur" />
        <ul className="results static">
          {res.map((r) => <li key={r.key}><span className="latin">{r.name}</span> <span className="meta">{r.meta}</span></li>)}
        </ul>
      </div>
    </main>
  )
}

interface Result { key: string; name: string; meta: string; sel: Selection; color: string }

function search(m: Manifest, raw: string): Result[] {
  const q0 = raw.trim().toLowerCase()
  if (q0.length < 2) return []
  const q = SYNONYMS[q0] ?? q0
  const out: Result[] = []
  const seen = new Set<string>()
  const score = (n: string) => (n === q ? 0 : n.startsWith(q) ? 1 : n.includes(' ' + q) ? 2 : 3)
  m.concepts.forEach((c) => {
    const n = c.name.toLowerCase()
    if (!n.includes(q)) return
    seen.add(c.name)
    const sys = m.items[c.els[0]].system
    out.push({ key: 'c' + c.fma, name: c.name, meta: `${c.els.length} bagian · ${c.fma}`, sel: { kind: 'concept', concept: c }, color: SYSTEM_COLOR[sys] })
  })
  m.items.forEach((it, i) => {
    const n = it.name.toLowerCase()
    if (!n.includes(q) || seen.has(it.name)) return
    out.push({ key: 'i' + it.id, name: it.name, meta: `${SYSTEM_LABEL[it.system]} · ${it.fma}`, sel: { kind: 'item', index: i }, color: SYSTEM_COLOR[it.system] })
  })
  return out.sort((a, b) => score(a.name.toLowerCase()) - score(b.name.toLowerCase()) || a.name.length - b.name.length)
}

function Lab({ m, dark }: { m: Manifest; dark: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const viewer = useRef<Viewer | null>(null)
  const itemsById = useMemo(() => new Map(m.items.map((it) => [it.id, it])), [m])
  const indexById = useMemo(() => new Map(m.items.map((it, i) => [it.id, i])), [m])
  const [chunks, setChunks] = useState<Record<string, ChunkState>>({})
  const [groups, setGroups] = useState<Set<string>>(() => new Set(LAYERS[1].groups))
  const [layer, setLayer] = useState<string>('L2')
  const [region, setRegion] = useState('all')
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [isolated, setIsolated] = useState<Set<string> | null>(null)
  const [sel, setSel] = useState<Selection>(null)
  const [xray, setXray] = useState(false)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<Tab>('jelajah')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [firstModel, setFirstModel] = useState(false)
  const mobile = useMedia('(max-width: 900px)')

  const deepOnly = LAYERS.find((l) => l.key === layer)?.deepMusclesOnly ?? false

  // mount viewer once
  useEffect(() => {
    const v = new Viewer(hostRef.current!, itemsById, {
      onPick: (id) => {
        if (id == null) { setSel(null); return }
        const i = indexById.get(id)
        if (i != null) { setSel({ kind: 'item', index: i }); setTab('info') }
      },
      onChunkState: (c, s) => {
        setChunks((p) => ({ ...p, [c]: s }))
        if (s === 'ready') setFirstModel(true)
      },
    }, dark)
    viewer.current = v
    ;(window as unknown as { __dal: Viewer }).__dal = v
    // progressive: skin preview first, then the default layer
    v.loadChunk('skin').catch(() => {})
    return () => { v.dispose(); viewer.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => viewer.current?.setBackground(dark), [dark])

  // ensure chunks for active groups are loaded
  const wantedChunks = useMemo(() => {
    const s = new Set<string>()
    GROUPS.forEach((g) => groups.has(g.key) && g.chunks.forEach((c) => s.add(c)))
    if (sel?.kind === 'concept') sel.concept.els.forEach((i) => s.add(m.items[i].chunk))
    if (sel?.kind === 'item') s.add(m.items[sel.index].chunk)
    return s
  }, [groups, sel, m])
  useEffect(() => {
    const v = viewer.current
    if (!v) return
    wantedChunks.forEach((c) => { if (!v.isLoaded(c)) v.loadChunk(c).catch(() => {}) })
  }, [wantedChunks])

  const selIds = useMemo(() => {
    if (!sel) return [] as string[]
    if (sel.kind === 'item') return [m.items[sel.index].id]
    return sel.concept.els.map((i) => m.items[i].id)
  }, [sel, m])

  const groupOf = useMemo(() => {
    const map: Record<string, string> = {}
    GROUPS.forEach((g) => g.systems.forEach((s) => (map[s] = g.key)))
    return map
  }, [])

  const loadedKey = Object.entries(chunks).filter(([, s]) => s === 'ready').map(([c]) => c).join(',')

  // visibility
  useEffect(() => {
    const v = viewer.current
    if (!v) return
    const selSet = new Set(selIds)
    const showSkinPreview = !firstModelBeyondSkin(chunks) && groups.size > 0
    v.applyVisibility((id) => {
      const it = itemsById.get(id)!
      if (isolated) return isolated.has(id)
      if (hidden.has(id)) return false
      if (selSet.has(id)) return true
      const g = groupOf[it.system]
      let on = groups.has(g) || (showSkinPreview && g === 'skin')
      if (on && deepOnly && it.system === 'muscle' && it.sup) on = false
      if (on && region !== 'all' && it.region !== region) on = false
      return on
    })
    v.setSelection(selIds)
  }, [groups, deepOnly, region, hidden, isolated, selIds, loadedKey, itemsById, groupOf, chunks])

  useEffect(() => viewer.current?.setXray(xray), [xray])

  // re-frame when the region filter changes
  const prevRegion = useRef('all')
  useEffect(() => {
    if (prevRegion.current === region) return
    prevRegion.current = region
    const t = setTimeout(() => (region === 'all' ? viewer.current?.reset() : viewer.current?.focusVisible()), 60)
    return () => clearTimeout(t)
  }, [region])

  // focus on selection when it is loaded
  const selChunksReady = selIds.every((id) => chunks[itemsById.get(id)!.chunk] === 'ready')
  useEffect(() => {
    if (selIds.length && selChunksReady) viewer.current?.focus(selIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selIds.join(','), selChunksReady])

  const results = useMemo(() => search(m, q).slice(0, 30), [m, q])

  const chooseLayer = (key: string) => {
    const L = LAYERS.find((l) => l.key === key)!
    setLayer(key); setGroups(new Set(L.groups)); setIsolated(null)
  }
  const toggleGroup = (k: string) => {
    setLayer('')
    setGroups((p) => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n })
  }
  const isolate = () => { if (selIds.length) setIsolated(new Set(selIds)) }
  const hide = () => {
    if (!selIds.length) return
    setHidden((p) => new Set([...p, ...selIds])); setSel(null)
  }
  const showAll = () => { setHidden(new Set()); setIsolated(null) }
  const resetAll = () => { showAll(); setSel(null); setRegion('all'); setXray(false); chooseLayer('L2'); viewer.current?.reset() }
  const view = (v: ViewName) => viewer.current?.view(v)

  // keyboard shortcuts (not while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select')) return
      if (e.key === 'Escape') { setSel(null); setIsolated(null) }
      else if (e.key === 'i' || e.key === 'I') isolate()
      else if (e.key === 'h' || e.key === 'H') hide()
      else if (e.key === 'r' || e.key === 'R') resetAll()
      else if (e.key === 'x' || e.key === 'X') setXray((x) => !x)
      else if (e.key === '/') { e.preventDefault(); document.getElementById('dal-search')?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const allReady = [...wantedChunks].every((c) => chunks[c] === 'ready')
  useEffect(() => { if (allReady && firstModel) performance.mark('dal-ready') }, [allReady, firstModel])
  const loadingChunks = Object.entries(chunks).filter(([, s]) => s === 'loading').map(([c]) => c)
  const errorChunks = Object.entries(chunks).filter(([, s]) => s === 'error').map(([c]) => c)
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    m.items.forEach((it) => { const g = groupOf[it.system]; c[g] = (c[g] ?? 0) + 1 })
    return c
  }, [m, groupOf])

  const left = (
    <div className="panel-inner">
      <div className="search-wrap">
        <label htmlFor="dal-search" className="eyebrow">Cari struktur</label>
        <input id="dal-search" className="search" type="search" autoComplete="off" placeholder="mis. jantung, femur, liver…" value={q}
          onChange={(e) => setQ(e.target.value)} data-testid="search-input" />
        {q.trim().length >= 2 && (
          <ul className="results" data-testid="search-results" aria-label="Hasil pencarian">
            {results.length === 0 && <li className="empty">Tidak ada struktur bernama “{q}” dalam dataset ini.</li>}
            {results.map((r) => (
              <li key={r.key}>
                <button onClick={() => { setSel(r.sel); setIsolated(null); setXray(true); setTab('info'); setQ('') }}>
                  <span className="dot" style={{ background: r.color }} aria-hidden />
                  <span className="latin">{r.name}</span>
                  <span className="meta">{r.meta}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <section>
        <h2 className="eyebrow">Lapisan diseksi</h2>
        <div className="layers" role="radiogroup" aria-label="Lapisan diseksi" data-testid="layers">
          {LAYERS.map((l, i) => (
            <button key={l.key} role="radio" aria-checked={layer === l.key} className={layer === l.key ? 'on' : ''} onClick={() => chooseLayer(l.key)}>
              <span className="num">{i + 1}</span>{l.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="eyebrow">Sistem</h2>
        <ul className="systems" data-testid="systems">
          {GROUPS.map((g) => {
            const st = g.chunks.map((c) => chunks[c] ?? 'idle')
            const state = st.includes('error') ? 'error' : st.includes('loading') ? 'loading' : ''
            return (
              <li key={g.key}>
                <label className={groups.has(g.key) ? 'on' : ''}>
                  <input type="checkbox" checked={groups.has(g.key)} onChange={() => toggleGroup(g.key)} />
                  <span className="dot" style={{ background: g.color }} aria-hidden />
                  <span className="sys-name">{g.label}</span>
                  <span className="meta">{state === 'loading' ? 'memuat…' : state === 'error' ? 'gagal' : counts[g.key] ?? 0}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h2 className="eyebrow">Wilayah</h2>
        <select className="select" value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Wilayah tubuh" data-testid="region">
          {REGIONS.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
      </section>
    </div>
  )

  const info = <InfoPanel m={m} sel={sel} onIsolate={isolate} onHide={hide} onFocus={() => viewer.current?.focus(selIds)}
    onClear={() => setSel(null)} isolated={!!isolated} onShowAll={showAll} onPickConcept={(c) => setSel({ kind: 'concept', concept: c })} />

  return (
    <main className="lab">
      {!mobile && <aside className="panel left" aria-label="Navigasi struktur">{left}</aside>}
      <section className="stage" aria-label="Penampil 3D" data-testid="stage" data-ready={allReady && firstModel ? 'true' : 'false'}>
        <div className="canvas-host" ref={hostRef} />
        <div className="toolbar" role="toolbar" aria-label="Kontrol tampilan">
          <button onClick={() => view('front')} title="Tampak anterior">Anterior</button>
          <button onClick={() => view('back')} title="Tampak posterior">Posterior</button>
          <button onClick={() => view('right')} title="Tampak lateral kanan">Kanan</button>
          <button onClick={() => view('left')} title="Tampak lateral kiri">Kiri</button>
          <span className="sep" />
          <button onClick={() => setXray((x) => !x)} aria-pressed={xray} title="Transparankan struktur lain (X)" data-testid="xray">X-ray</button>
          <button onClick={showAll} disabled={!hidden.size && !isolated} title="Tampilkan semua struktur yang disembunyikan" data-testid="show-all">Tampilkan semua</button>
          <button onClick={resetAll} title="Atur ulang tampilan (R)" data-testid="reset">Atur ulang</button>
        </div>
        <div className="status" role="status" aria-live="polite" data-testid="status">
          {loadingChunks.length > 0 && <span>Memuat model: {loadingChunks.join(', ')}…</span>}
          {errorChunks.length > 0 && (
            <span className="err">Model gagal dimuat ({errorChunks.join(', ')}).{' '}
              <button onClick={() => errorChunks.forEach((c) => viewer.current?.loadChunk(c).catch(() => {}))}>Coba lagi</button></span>
          )}
          {isolated && <span>Mode isolasi · <button onClick={() => setIsolated(null)}>keluar</button></span>}
        </div>
        {!firstModel && <div className="stage-loading" data-testid="stage-loading">Memuat pratinjau tubuh…</div>}
        <p className="orient" aria-hidden>Seret: putar · Gulir/cubit: zoom · Klik kanan/dua jari: geser · Klik: pilih</p>
      </section>
      {!mobile && <aside className="panel right" aria-label="Informasi struktur" data-testid="info-panel">{info}</aside>}

      {/* mobile bottom sheet */}
      {mobile && <div className={`sheet ${sheetOpen ? 'open' : ''}`}>
        <div className="sheet-tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'jelajah'} onClick={() => { setTab('jelajah'); setSheetOpen(true) }}>Jelajah</button>
          <button role="tab" aria-selected={tab === 'info'} onClick={() => { setTab('info'); setSheetOpen(true) }}>Info{sel ? ' •' : ''}</button>
          <button className="sheet-toggle" onClick={() => setSheetOpen((o) => !o)} aria-expanded={sheetOpen} aria-label={sheetOpen ? 'Tutup panel' : 'Buka panel'}>{sheetOpen ? '▾' : '▴'}</button>
        </div>
        <div className="sheet-body">{tab === 'jelajah' ? left : info}</div>
      </div>}
    </main>
  )
}

function firstModelBeyondSkin(chunks: Record<string, ChunkState>) {
  return Object.entries(chunks).some(([c, s]) => c !== 'skin' && s === 'ready')
}

function InfoPanel(p: {
  m: Manifest; sel: Selection; isolated: boolean
  onIsolate: () => void; onHide: () => void; onFocus: () => void; onClear: () => void; onShowAll: () => void; onPickConcept: (c: Concept) => void
}) {
  const { m, sel } = p
  if (!sel) {
    return (
      <div className="panel-inner info-empty">
        <h2 className="eyebrow">Informasi struktur</h2>
        <p>Klik sebuah struktur pada model, atau cari namanya, untuk melihat identitas, sistem, dan hubungannya.</p>
        <dl className="kbd">
          <dt>Klik</dt><dd>pilih struktur</dd>
          <dt>I</dt><dd>isolasi pilihan</dd>
          <dt>H</dt><dd>sembunyikan pilihan</dd>
          <dt>X</dt><dd>x-ray</dd>
          <dt>R</dt><dd>atur ulang</dd>
          <dt>/</dt><dd>cari</dd>
        </dl>
        <p className="note">Nama struktur memakai istilah FMA (bahasa Inggris) sesuai sumber data. Model adalah atlas satu pria dewasa, bukan data pasien.</p>
      </div>
    )
  }
  const items: Item[] = sel.kind === 'item' ? [m.items[sel.index]] : sel.concept.els.map((i) => m.items[i])
  const first = items[0]
  const name = sel.kind === 'item' ? first.name : sel.concept.name
  const fma = sel.kind === 'item' ? first.fma : sel.concept.fma
  const systems = [...new Set(items.map((i) => SYSTEM_LABEL[i.system]))]
  const regions = [...new Set(items.map((i) => REGION_LABEL[i.region] ?? i.region))]
  const parents = sel.kind === 'item' ? first.partOf : []
  const parentConcepts = parents.map((n) => m.concepts.find((c) => c.name === n)).filter(Boolean) as Concept[]
  return (
    <div className="panel-inner info" data-testid="info">
      <p className="eyebrow">{sel.kind === 'concept' ? 'Kelompok struktur' : 'Struktur'}</p>
      <h2 className="title-latin" data-testid="info-name">{name}</h2>
      <dl className="facts">
        <dt>FMA ID</dt><dd className="tab">{fma}</dd>
        <dt>Sistem</dt><dd>{systems.join(', ')}</dd>
        <dt>Wilayah</dt><dd>{regions.slice(0, 4).join(', ')}{regions.length > 4 ? '…' : ''}</dd>
        {sel.kind === 'concept' && <><dt>Bagian</dt><dd className="tab">{items.length} mesh</dd></>}
        {sel.kind === 'item' && <><dt>Berkas</dt><dd className="tab">{first.id}.obj</dd></>}
      </dl>
      {parentConcepts.length > 0 && (
        <div className="partof">
          <p className="eyebrow">Bagian dari</p>
          {parentConcepts.map((c) => <button key={c.fma} className="chip" onClick={() => p.onPickConcept(c)}>{c.name}</button>)}
        </div>
      )}
      <div className="actions">
        <button className="btn-primary" onClick={p.onIsolate} data-testid="isolate">Isolasi</button>
        <button className="btn-secondary" onClick={p.onHide} data-testid="hide">Sembunyikan</button>
        <button className="btn-secondary" onClick={p.onFocus}>Fokus</button>
        <button className="btn-secondary" onClick={p.onClear}>Batal pilih</button>
        {p.isolated && <button className="btn-secondary" onClick={p.onShowAll}>Keluar isolasi</button>}
      </div>
      <p className="note">Sumber geometri: BodyParts3D (DBCLS), elemen {items.slice(0, 3).map((i) => i.id).join(', ')}{items.length > 3 ? '…' : ''}.</p>
    </div>
  )
}

function About({ m, onClose }: { m: Manifest | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { ref.current?.showModal() }, [])
  const bySys = useMemo(() => {
    const c: Record<string, number> = {}
    m?.items.forEach((it) => (c[SYSTEM_LABEL[it.system]] = (c[SYSTEM_LABEL[it.system]] ?? 0) + 1))
    return Object.entries(c).sort((a, b) => b[1] - a[1])
  }, [m])
  return (
    <dialog ref={ref} className="about" onClose={onClose} aria-labelledby="about-title" data-testid="about">
      <h2 id="about-title">Tentang laboratorium ini</h2>
      <p>Laboratorium Anatomi Digital adalah penjelajah anatomi 3D untuk mata kuliah <em>Teknik Anatomi Digital</em> (Program Magister Kedokteran). Situs ini melengkapi dua presentasi kuliah dan tidak menggantikan diseksi, atlas, maupun citra klinis.</p>
      <h3>Sumber model dan lisensi</h3>
      <p><strong>{ATTRIBUTION}</strong> (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>). Data asli: <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noreferrer">DBCLS Life Science Database Archive</a>, rilis 4.0. Rujukan: Mitsuhashi N, dkk. (2009). BodyParts3D: 3D structure database for anatomical concepts. <em>Nucleic Acids Research</em>, 37, D782–D785.</p>
      <p>Perubahan: mesh disederhanakan (decimation) dan dikompresi untuk web, dikelompokkan per sistem, serta diberi warna konvensi atlas. Berkas OBJ lama mencantumkan CC BY-SA 2.1 JP; README DBCLS (2025) menetapkan CC BY 4.0.</p>
      <h3>Cakupan dan keterbatasan</h3>
      <ul>
        <li>Satu model pria dewasa. Bukan rekonstruksi satu kadaver atau pasien; jangan dipakai untuk pengukuran klinis.</li>
        <li>Tidak tersedia: saraf perifer utama, kelenjar tiroid dan paratiroid, kelenjar limfe, organ reproduksi wanita, serta beberapa otot (mis. m. rectus abdominis, m. latissimus dorsi, m. masseter).</li>
        <li>Pembagian otot superfisial dan dalam pada lapisan 2–3 bersifat didaktis.</li>
        <li>Wilayah tubuh ditentukan otomatis dari relasi FMA dan posisi; beberapa struktur di perbatasan wilayah dapat masuk wilayah tetangga.</li>
      </ul>
      {bySys.length > 0 && (
        <>
          <h3>Struktur yang tersedia ({m?.items.length} mesh, {m?.concepts.length} kelompok yang dapat dicari)</h3>
          <table className="cov"><tbody>{bySys.map(([k, v]) => <tr key={k}><td>{k}</td><td className="tab">{v}</td></tr>)}</tbody></table>
        </>
      )}
      <p className="note">Kode situs: lisensi MIT. Turunan model mengikuti CC BY 4.0 dengan atribusi di atas.</p>
      <form method="dialog"><button className="btn-primary" data-testid="about-close">Tutup</button></form>
    </dialog>
  )
}
