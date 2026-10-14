import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ModelViewer } from '../viewer/ModelViewer'

const BASE = `${import.meta.env.BASE_URL}demo/`

interface Probe { label: string; tissue: string; mean: number; sd: number; ras: number[]; ijk_web: number[] }
interface DemoData {
  slicer_version: string
  dataset: { dims: number[]; spacing_mm: number[]; hu_min: number; hu_max: number; outside_fov_value: number }
  presets: Record<string, { window: number; level: number }>
  probes: Probe[]
  threshold: { min: number; max: number }
  segment: {
    effects: string[]; voxel_count: number; volume_cm3_labelmap: number; volume_cm3_surface: number; surface_cm2: number
    hu_mean: number; hu_median: number; hu_p5: number; hu_p95: number; model: string; model_tris: number; model_tris_original: number
  }
  volume_rendering: { dataset: string; dims: number[]; spacing_mm: number[]; preset: string }
  volume: {
    file: string; dims_ijk: number[]; spacing_mm: number[]; full_res_offset_ijk: number[]; factor_ij: number
    full_res_ijk_to_ras: number[][]; lut_hu: number[]; mean_abs_err_hu: number
  }
}

interface Vol { hu: Int16Array; nx: number; ny: number; nz: number; sp: number[] }

async function loadVolume(d: DemoData): Promise<Vol> {
  const r = await fetch(BASE + d.volume.file)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  let buf = new Uint8Array(await r.arrayBuffer())
  // Berkas disimpan gzip; bila CDN sudah mendekompresi (Content-Encoding), pakai langsung.
  if (buf[0] === 0x1f && buf[1] === 0x8b) {
    if (typeof DecompressionStream === 'undefined') throw new Error('Peramban tidak mendukung DecompressionStream')
    const s = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))
    buf = new Uint8Array(await new Response(s).arrayBuffer())
  }
  const [nx, ny, nz] = d.volume.dims_ijk
  if (buf.length !== nx * ny * nz) throw new Error('Ukuran volume tidak sesuai')
  const lut = Int16Array.from(d.volume.lut_hu)
  const hu = new Int16Array(buf.length)
  for (let i = 0; i < buf.length; i++) hu[i] = lut[buf[i]]
  return { hu, nx, ny, nz, sp: d.volume.spacing_mm }
}

type Plane = 'axial' | 'coronal' | 'sagittal'
const PLANE_INFO: Record<Plane, { label: string; color: string; slicer: string }> = {
  axial: { label: 'Aksial', color: '#C0392B', slicer: 'Red' },
  sagittal: { label: 'Sagital', color: '#D4AC0D', slicer: 'Yellow' },
  coronal: { label: 'Koronal', color: '#27AE60', slicer: 'Green' },
}

const STEPS = [
  { n: 1, t: 'Muat CTChest, tata letak Four-Up', min: '17.35' },
  { n: 2, t: 'Crosshair MPR', min: '17.38' },
  { n: 3, t: 'Preset jendela dan Data Probe', min: '17.41' },
  { n: 4, t: 'Threshold 200–3.000 HU', min: '17.45' },
  { n: 5, t: 'Islands, Scissors, Smoothing, Show 3D', min: '17.48' },
  { n: 6, t: 'Segment Statistics dan Volume Rendering', min: '17.51' },
]

export default function SlicerDemo() {
  const [d, setD] = useState<DemoData | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [vol, setVol] = useState<Vol | null>(null)
  const [volErr, setVolErr] = useState<string | null>(null)
  const [step, setStep] = useState(() => {
    const m = /#demo-slicer\/(\d)/.exec(location.hash)
    return m ? Math.min(6, Math.max(1, +m[1])) : 1
  })
  const [zoom, setZoom] = useState<string | null>(null)
  const bodyRef = useRef<HTMLElement>(null)
  useEffect(() => { bodyRef.current?.scrollTo(0, 0) }, [step])

  useEffect(() => {
    fetch(BASE + 'demo.json').then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((j: DemoData) => { setD(j); loadVolume(j).then(setVol).catch((e) => setVolErr(String(e))) })
      .catch((e) => setErr(String(e)))
  }, [])
  useEffect(() => { history.replaceState(null, '', `#demo-slicer/${step}`) }, [step])
  useEffect(() => {
    const f = () => { const m = /#demo-slicer\/(\d)/.exec(location.hash); if (m) setStep(Math.min(6, Math.max(1, +m[1]))) }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])

  if (err) return <div className="fatal" role="alert"><h2>Data demo gagal dimuat</h2><p>{err}</p></div>
  if (!d) return <div className="fatal" role="status"><p>Memuat demo 3D Slicer…</p></div>

  const shot = (name: string, alt: string, cap: string) => (
    <figure className="shot">
      <button className="shot-btn" onClick={() => setZoom(name)} aria-label={`Perbesar: ${alt}`}>
        <img src={`${BASE}shots/${name}.webp`} alt={alt} loading="lazy" />
      </button>
      <figcaption>{cap}</figcaption>
    </figure>
  )

  return (
    <main className="demo" data-testid="slicer-demo">
      <nav className="demo-nav" aria-label="Langkah demo">
        <p className="eyebrow">Bagian 5 · Demo 3D Slicer</p>
        <ol>
          {STEPS.map((s) => (
            <li key={s.n}>
              <button className={step === s.n ? 'on' : ''} aria-current={step === s.n ? 'step' : undefined} onClick={() => setStep(s.n)} data-testid={`step-${s.n}`}>
                <span className="num">{s.n}</span><span className="st">{s.t}</span><span className="meta">{s.min}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="demo-req">
          <p className="eyebrow">Persiapan</p>
          <ul>
            <li>3D Slicer {d.slicer_version} (diuji di versi ini) dari <a href="https://download.slicer.org" target="_blank" rel="noreferrer">download.slicer.org</a></li>
            <li>Internet untuk Sample Data CTChest dan CTACardio, atau unduh sebelum kuliah</li>
            <li>Semua tangkapan layar dan angka di halaman ini dihasilkan dengan menjalankan langkah-langkah ini di Slicer {d.slicer_version}</li>
          </ul>
        </div>
      </nav>

      <article className="demo-body" data-testid="demo-step" ref={bodyRef}>
        {step === 1 && <>
          <Head n={1} t="Muat CTChest dan pilih tata letak Four-Up" />
          <Do items={[
            <>Menu <b>File › Download Sample Data</b> (modul <i>Sample Data</i>, kategori Informatics) → klik <b>CTChest</b>.</>,
            <>Tombol tata letak di toolbar → <b>Four-Up</b>: irisan aksial (merah), sagital (kuning), koronal (hijau), dan tampilan 3D.</>,
          ]} />
          <Facts rows={[
            ['Ukuran volume', `${d.dataset.dims.join(' × ')} voxel`],
            ['Jarak voxel', `${d.dataset.spacing_mm.map(fmt).join(' × ')} mm`],
            ['Rentang nilai', `${d.dataset.hu_min} sampai ${d.dataset.hu_max}`],
          ]} />
          <p className="callout">Nilai {d.dataset.outside_fov_value} muncul di sudut gambar, di luar lingkaran rekonstruksi (FOV). Itu nilai pengisi dari pemindai, bukan udara. Udara di dalam FOV sekitar −990 HU.</p>
          {shot('s1_fourup', 'Slicer dengan CTChest pada tata letak Four-Up', `Slicer ${d.slicer_version}: CTChest, Four-Up.`)}
          <Mpr d={d} vol={vol} err={volErr} mode="basic" />
        </>}

        {step === 2 && <>
          <Head n={2} t="Gerakkan crosshair untuk membaca hubungan tiga bidang" />
          <Do items={[
            <>Aktifkan crosshair dari ikon crosshair di toolbar.</>,
            <>Tahan <kbd>Shift</kbd> sambil menggerakkan kursor di salah satu irisan: dua irisan lainnya ikut berpindah ke titik yang sama.</>,
            <>Ikuti satu struktur (mis. aorta descendens atau korpus vertebra) dari aksial ke koronal dan sagital.</>,
          ]} />
          {shot('s2_crosshair', 'Crosshair Slicer di pusat volume', 'Crosshair menghubungkan ketiga bidang pada satu titik RAS.')}
          <Mpr d={d} vol={vol} err={volErr} mode="crosshair" />
        </>}

        {step === 3 && <>
          <Head n={3} t="Preset jendela (W/L) dan pembacaan HU" />
          <Do items={[
            <>Modul <b>Volumes</b> → bagian <i>Display</i> → baris <i>Presets</i>: klik <b>CT-Bone</b> lalu <b>CT-Lung</b>.</>,
            <>Arahkan kursor ke jaringan; nilai HU tampil di panel <b>Data Probe</b> (kiri bawah).</>,
          ]} />
          <table className="data">
            <caption>Preset bawaan Slicer {d.slicer_version} (VolumeDisplayPresets.json)</caption>
            <thead><tr><th>Preset</th><th>Window</th><th>Level</th><th>Rentang tampil (HU)</th></tr></thead>
            <tbody>{Object.entries(d.presets).map(([k, p]) => (
              <tr key={k}><td>{k}</td><td className="tab">{p.window}</td><td className="tab">{p.level}</td><td className="tab">{p.level - p.window / 2} sampai {p.level + p.window / 2}</td></tr>
            ))}</tbody>
          </table>
          <div className="shots2">
            {shot('s3_ct_bone', 'Irisan aksial dengan preset CT-Bone', 'CT-Bone (W 1000 / L 400)')}
            {shot('s3_ct_lung', 'Irisan aksial dengan preset CT-Lung', 'CT-Lung (W 1400 / L −500)')}
          </div>
          <table className="data" data-testid="probe-table">
            <caption>HU terukur pada CTChest, irisan aksial yang sama (ROI 7 × 7 voxel, resolusi penuh)</caption>
            <thead><tr><th>Jaringan</th><th>Rata-rata HU</th><th>SD</th></tr></thead>
            <tbody>{d.probes.map((p) => <tr key={p.label}><td>{p.label}</td><td className="tab">{fmt(p.mean)}</td><td className="tab">{fmt(p.sd)}</td></tr>)}</tbody>
          </table>
          <p className="note">Bandingkan dengan Tabel L.3 (Praktikum 1). Nilai satu ROI pada satu pasien, bukan nilai rujukan.</p>
          <Mpr d={d} vol={vol} err={volErr} mode="presets" />
        </>}

        {step === 4 && <>
          <Head n={4} t="Segment Editor: Threshold 200–3.000 HU" />
          <Do items={[
            <>Modul <b>Segment Editor</b> → <i>Source volume</i>: CTChest → <b>Add</b> (segmen baru).</>,
            <>Efek <b>Threshold</b> → rentang <b>200</b> sampai <b>3000</b> → <b>Apply</b>. Pratinjau hijau menunjukkan voxel yang akan masuk segmen.</>,
          ]} />
          <p className="callout">Ambang menentukan permukaan model. Coba geser batas bawah ke 100 atau 400 dan lihat tulang tipis (kosta, skapula) hilang atau bertambah, serta jaringan lain (kalsifikasi, kabel EKG) ikut terpilih.</p>
          {shot('s4_threshold_applied', 'Segment Editor setelah Threshold diterapkan', 'Segment Editor, efek Threshold diterapkan.')}
          <Mpr d={d} vol={vol} err={volErr} mode="threshold" />
        </>}

        {step === 5 && <>
          <Head n={5} t="Rapikan segmen, lalu Show 3D" />
          <Do items={[
            <><b>Islands</b> → <i>Remove small islands</i> (ukuran minimum 1.000 voxel) untuk membuang bintik derau.</>,
            <><b>Scissors</b> untuk memotong bagian yang tidak diinginkan (mis. meja pemeriksaan) bila ikut terpilih.</>,
            <><b>Smoothing</b> → <i>Median</i>, kernel 2 mm.</>,
            <>Tombol <b>Show 3D</b> di atas daftar segmen.</>,
          ]} />
          <p className="note">Pada CTChest, meja pemeriksaan tidak ikut terpilih pada ambang 200 HU, jadi Scissors tidak diperlukan untuk hasil di bawah.</p>
          <BoneModel d={d} />
          {shot('s5_show3d', 'Slicer menampilkan model tulang 3D dari segmen', 'Show 3D: model permukaan dari segmen tulang.')}
        </>}

        {step === 6 && <>
          <Head n={6} t="Ukur volume, lalu Volume Rendering" />
          <Do items={[
            <>Modul <b>Segment Statistics</b> (kategori Quantification) → <i>Segmentation</i>: segmen tulang, <i>Scalar volume</i>: CTChest → <b>Apply</b>.</>,
            <>Muat <b>CTACardio</b> dari Sample Data → modul <b>Volume Rendering</b> → aktifkan ikon mata → <i>Preset</i>: <b>CT-Cardiac3</b> → aktifkan <i>Crop</i> dan atur ROI di sekitar jantung.</>,
          ]} />
          <table className="data" data-testid="stats-table">
            <caption>Segment Statistics, segmen tulang CTChest (Slicer {d.slicer_version})</caption>
            <tbody>
              <tr><td>Jumlah voxel</td><td className="tab">{d.segment.voxel_count.toLocaleString('id-ID')}</td></tr>
              <tr><td>Volume (labelmap)</td><td className="tab">{fmt(d.segment.volume_cm3_labelmap)} cm³</td></tr>
              <tr><td>Volume (permukaan tertutup)</td><td className="tab">{fmt(d.segment.volume_cm3_surface)} cm³</td></tr>
              <tr><td>Luas permukaan</td><td className="tab">{fmt(d.segment.surface_cm2)} cm²</td></tr>
              <tr><td>HU rata-rata / median</td><td className="tab">{fmt(d.segment.hu_mean)} / {d.segment.hu_median}</td></tr>
              <tr><td>HU persentil 5–95</td><td className="tab">{d.segment.hu_p5} – {d.segment.hu_p95}</td></tr>
            </tbody>
          </table>
          <p className="callout">Dua angka volume berbeda sekitar 5% karena dihitung dari representasi berbeda: hitungan voxel versus mesh yang sudah dihaluskan. Volume ini mencakup seluruh voxel ≥ 200 HU dalam bidang pandang, termasuk sebagian skapula dan klavikula, jadi bukan volume tulang toraks yang terdefinisi anatomis.</p>
          {shot('s6_statistics', 'Tabel Segment Statistics di Slicer', 'Segment Statistics: tabel hasil.')}
          <div className="shots2">
            {shot('s6_vr_dark', 'Volume rendering jantung CTACardio dengan preset CT-Cardiac3', `CTACardio (${d.volume_rendering.dims.join(' × ')} voxel), preset ${d.volume_rendering.preset}, ROI dipangkas di sekitar jantung.`)}
            {shot('s6_vr_ctacardio', 'Modul Volume Rendering di Slicer', 'Modul Volume Rendering.')}
          </div>
          <p className="note">Penutup: ekspor segmen ke STL (Segmentations › Export to files) untuk cetak 3D, sesuai Praktikum 6.</p>
        </>}

        <div className="demo-pager">
          <button className="btn-secondary" disabled={step === 1} onClick={() => setStep(step - 1)}>← Sebelumnya</button>
          <button className="btn-primary" disabled={step === 6} onClick={() => setStep(step + 1)} data-testid="next-step">Berikutnya →</button>
        </div>
        <p className="note src">Data: CTChest dan CTACardio dari Sample Data bawaan 3D Slicer. Asal klinis kedua dataset tidak didokumentasikan; pengembang Slicer menyatakan sample data bebas dipakai. Gambar dan angka dibuat dengan menjalankan Slicer {d.slicer_version} secara otomatis pada 14 Oktober 2026 (skrip <code>slicer_demo.py</code>).</p>
      </article>

      {zoom && <Zoom name={zoom} onClose={() => setZoom(null)} />}
    </main>
  )
}

function Head({ n, t }: { n: number; t: string }) {
  return <header className="demo-head"><p className="eyebrow">Langkah {n} dari 6</p><h2>{t}</h2></header>
}
function Do({ items }: { items: ReactNode[] }) {
  return <section className="do"><p className="eyebrow">Di 3D Slicer</p><ol>{items.map((x, i) => <li key={i}>{x}</li>)}</ol></section>
}
function Facts({ rows }: { rows: [string, string][] }) {
  return <dl className="facts demo-facts">{rows.map(([a, b]) => <Fragment key={a}><dt>{a}</dt><dd className="tab">{b}</dd></Fragment>)}</dl>
}
const fmt = (v: number) => v.toLocaleString('id-ID', { maximumFractionDigits: 2 })

function Zoom({ name, onClose }: { name: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { ref.current?.showModal() }, [])
  return (
    <dialog ref={ref} className="zoom" onClose={onClose} onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <img src={`${BASE}shots/${name}.webp`} alt="" />
      <form method="dialog"><button className="btn-primary">Tutup</button></form>
    </dialog>
  )
}

/* ---------------- MPR interaktif ---------------- */

type MprMode = 'basic' | 'crosshair' | 'presets' | 'threshold'

function Mpr({ d, vol, err, mode }: { d: DemoData; vol: Vol | null; err: string | null; mode: MprMode }) {
  const [c, setC] = useState(() => {
    const p = d.probes.find((x) => x.tissue === 'bone') ?? d.probes[0]
    return p.ijk_web.slice() as number[]
  })
  const [preset, setPreset] = useState(mode === 'presets' ? 'CT-Bone' : mode === 'threshold' ? 'CT-Bone' : 'CT-Abdomen')
  const [thr, setThr] = useState<[number, number]>([d.threshold.min, d.threshold.max])
  const [hover, setHover] = useState<{ ijk: number[]; hu: number } | null>(null)
  const showThr = mode === 'threshold'

  const thrStats = useMemo(() => {
    if (!vol || !showThr) return null
    let n = 0
    const h = vol.hu
    for (let i = 0; i < h.length; i++) if (h[i] >= thr[0] && h[i] <= thr[1]) n++
    const vv = vol.sp[0] * vol.sp[1] * vol.sp[2]
    return { n, cm3: (n * vv) / 1000 }
  }, [vol, thr, showThr])

  if (err) return <div className="mpr-wrap"><p className="err">Volume interaktif gagal dimuat ({err}). Tangkapan layar di atas tetap berlaku.</p></div>
  if (!vol) return <div className="mpr-wrap" data-testid="mpr-loading"><p className="note">Memuat volume CT interaktif (1,8 MB)…</p></div>

  const w = d.presets[preset]
  const ras = (ijk: number[]) => {
    const M = d.volume.full_res_ijk_to_ras, f = d.volume.factor_ij, o = d.volume.full_res_offset_ijk
    const fi = o[0] + f * ijk[0] + (f - 1) / 2, fj = o[1] + f * ijk[1] + (f - 1) / 2, fk = ijk[2]
    return [0, 1, 2].map((r) => M[r][0] * fi + M[r][1] * fj + M[r][2] * fk + M[r][3])
  }
  const cur = hover ?? { ijk: c, hu: vol.hu[c[0] + vol.nx * (c[1] + vol.ny * c[2])] }
  const r = ras(cur.ijk)

  return (
    <section className="mpr-wrap" aria-label="Latihan MPR di peramban" data-testid="mpr">
      <p className="eyebrow">Coba di peramban</p>
      <div className="mpr-controls">
        {(mode === 'presets' || mode === 'threshold' || mode === 'basic') && (
          <div className="seg" role="radiogroup" aria-label="Preset jendela">
            {Object.keys(d.presets).map((k) => (
              <button key={k} role="radio" aria-checked={preset === k} className={preset === k ? 'on' : ''} onClick={() => setPreset(k)} data-testid={`preset-${k}`}>{k}</button>
            ))}
          </div>
        )}
        {showThr && (
          <div className="thr" data-testid="threshold">
            <label>Batas bawah <input type="range" min={-1000} max={1500} step={10} value={thr[0]} onChange={(e) => setThr([Math.min(+e.target.value, thr[1]), thr[1]])} /> <b className="tab">{thr[0]} HU</b></label>
            <label>Batas atas <input type="range" min={-1000} max={3071} step={10} value={thr[1]} onChange={(e) => setThr([thr[0], Math.max(+e.target.value, thr[0])])} /> <b className="tab">{thr[1]} HU</b></label>
            <button className="btn-secondary" onClick={() => setThr([d.threshold.min, d.threshold.max])}>200–3.000</button>
          </div>
        )}
        {mode === 'presets' && (
          <div className="seg" aria-label="Lompat ke titik ukur">
            {d.probes.map((p) => <button key={p.label} onClick={() => setC(p.ijk_web.slice())} title={p.label}>{p.label.split(' (')[0]}</button>)}
          </div>
        )}
      </div>
      <div className="mpr">
        {(['axial', 'sagittal', 'coronal'] as Plane[]).map((pl) => (
          <SliceView key={pl} plane={pl} vol={vol} c={c} win={w} thr={showThr ? thr : null}
            onSet={(ijk) => setC(ijk)} onHover={(ijk) => setHover(ijk ? { ijk, hu: vol.hu[ijk[0] + vol.nx * (ijk[1] + vol.ny * ijk[2])] } : null)} />
        ))}
      </div>
      <div className="probe" data-testid="probe" aria-live="polite">
        <span><b>Data Probe</b></span>
        <span className="tab">HU <b data-testid="probe-hu">{cur.hu}</b></span>
        <span className="tab">R {fmt1(r[0])} · A {fmt1(r[1])} · S {fmt1(r[2])} mm</span>
        <span className="meta">W {w.window} / L {w.level}</span>
        {thrStats && <span className="tab" data-testid="thr-stats">≥ ambang: {thrStats.n.toLocaleString('id-ID')} voxel ≈ <b>{fmt(Math.round(thrStats.cm3))} cm³</b></span>}
      </div>
      <p className="note">
        {mode === 'crosshair' ? 'Klik atau seret di salah satu irisan (di Slicer: Shift + gerak kursor) untuk memindahkan crosshair; dua irisan lain ikut berpindah. ' : 'Klik atau seret untuk memindahkan crosshair. '}
        Volume web diperkecil 3× ({d.volume.spacing_mm.map(fmt).join(' × ')} mm per voxel, galat kode HU rata-rata {fmt(d.volume.mean_abs_err_hu)} HU); Slicer memakai resolusi penuh.
        {showThr && ` Volume di atas adalah hitungan kasar pada volume web sebelum Islands dan Smoothing; Slicer mengukur ${fmt(d.segment.volume_cm3_labelmap)} cm³ setelah kedua langkah itu.`}
      </p>
    </section>
  )
}
const fmt1 = (v: number) => v.toFixed(1)

function SliceView({ plane, vol, c, win, thr, onSet, onHover }: {
  plane: Plane; vol: Vol; c: number[]; win: { window: number; level: number }; thr: [number, number] | null
  onSet: (ijk: number[]) => void; onHover: (ijk: number[] | null) => void
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { nx, ny, nz, sp } = vol
  // dimensi gambar (kolom, baris) dan ukuran fisik per piksel
  const [W, H, pw, ph] = plane === 'axial' ? [nx, ny, sp[0], sp[1]] : plane === 'coronal' ? [nx, nz, sp[0], sp[2]] : [ny, nz, sp[1], sp[2]]
  const toIjk = (col: number, row: number): number[] => {
    if (plane === 'axial') return [col, row, c[2]]
    if (plane === 'coronal') return [col, c[1], nz - 1 - row]
    return [c[0], col, nz - 1 - row]
  }
  const idx = plane === 'axial' ? c[2] : plane === 'coronal' ? c[1] : c[0]

  useEffect(() => {
    const cv = ref.current!
    const off = document.createElement('canvas'); off.width = W; off.height = H
    const ctx = off.getContext('2d')!
    const img = ctx.createImageData(W, H)
    const lo = win.level - win.window / 2, sc = 255 / win.window
    for (let row = 0; row < H; row++) {
      for (let col = 0; col < W; col++) {
        const [i, j, k] = toIjk(col, row)
        const v = vol.hu[i + nx * (j + ny * k)]
        let g = (v - lo) * sc; g = g < 0 ? 0 : g > 255 ? 255 : g
        const o = 4 * (row * W + col)
        if (thr && v >= thr[0] && v <= thr[1]) {
          img.data[o] = g * 0.45; img.data[o + 1] = 120 + g * 0.5; img.data[o + 2] = g * 0.35
        } else { img.data[o] = img.data[o + 1] = img.data[o + 2] = g }
        img.data[o + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
    const dpr = Math.min(window.devicePixelRatio, 2)
    const cssW = cv.clientWidth || 300
    const cssH = cssW * (H * ph) / (W * pw)
    cv.style.height = `${cssH}px`
    cv.width = Math.round(cssW * dpr); cv.height = Math.round(cssH * dpr)
    const g2 = cv.getContext('2d')!
    g2.imageSmoothingEnabled = true; g2.imageSmoothingQuality = 'high'
    g2.drawImage(off, 0, 0, cv.width, cv.height)
    // crosshair
    const sx = cv.width / W, sy = cv.height / H
    const [cc, cr] = plane === 'axial' ? [c[0], c[1]] : plane === 'coronal' ? [c[0], nz - 1 - c[2]] : [c[1], nz - 1 - c[2]]
    g2.strokeStyle = 'rgba(255, 214, 10, 0.9)'; g2.lineWidth = Math.max(1, dpr)
    g2.beginPath()
    g2.moveTo((cc + 0.5) * sx, 0); g2.lineTo((cc + 0.5) * sx, cv.height)
    g2.moveTo(0, (cr + 0.5) * sy); g2.lineTo(cv.width, (cr + 0.5) * sy)
    g2.stroke()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vol, c[0], c[1], c[2], win.window, win.level, thr?.[0], thr?.[1], plane])

  const pick = (e: React.PointerEvent, set: boolean) => {
    const r = ref.current!.getBoundingClientRect()
    const col = Math.floor(((e.clientX - r.left) / r.width) * W)
    const row = Math.floor(((e.clientY - r.top) / r.height) * H)
    if (col < 0 || row < 0 || col >= W || row >= H) return
    const ijk = toIjk(col, row)
    if (set) onSet(ijk)
    onHover(ijk)
  }
  const info = PLANE_INFO[plane]
  const orient = plane === 'axial' ? ['A', 'P', 'R', 'L'] : plane === 'coronal' ? ['S', 'I', 'R', 'L'] : ['S', 'I', 'A', 'P']
  return (
    <figure className="slice" style={{ ['--plane' as string]: info.color }}>
      <figcaption><span>{info.label}</span><span className="meta">{info.slicer} · irisan {idx + 1}/{plane === 'axial' ? nz : plane === 'coronal' ? ny : nx}</span></figcaption>
      <div className="slice-canvas">
        <canvas ref={ref} data-testid={`slice-${plane}`} aria-label={`Irisan ${info.label.toLowerCase()} CTChest`} role="img"
          onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); pick(e, true) }}
          onPointerMove={(e) => pick(e, e.buttons === 1 || e.shiftKey)}
          onPointerLeave={() => onHover(null)} />
        <span className="o t">{orient[0]}</span><span className="o b">{orient[1]}</span><span className="o l">{orient[2]}</span><span className="o r">{orient[3]}</span>
      </div>
    </figure>
  )
}

/* ---------------- model tulang hasil Slicer ---------------- */

function BoneModel({ d }: { d: DemoData }) {
  const host = useRef<HTMLDivElement>(null)
  const mv = useRef<ModelViewer | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  useEffect(() => {
    const v = new ModelViewer(host.current!, { background: '#07090C' })
    v.renderer.domElement.setAttribute('aria-label', 'Model 3D tulang hasil threshold CTChest di 3D Slicer. Seret untuk memutar.')
    v.renderer.domElement.dataset.testid = 'bone-canvas'
    mv.current = v
    v.load(BASE + d.segment.model).then(() => setState('ready')).catch(() => setState('error'))
    return () => v.dispose()
  }, [d.segment.model])
  return (
    <section className="bone">
      <p className="eyebrow">Hasil Show 3D, diekspor dari Slicer (bisa diputar)</p>
      <div className="bone-stage" ref={host} data-state={state} data-testid="bone-model">
        {state === 'loading' && <span className="stage-loading">Memuat model…</span>}
        {state === 'error' && <span className="stage-loading err">Model gagal dimuat.</span>}
        <div className="mini-toolbar">
          <button onClick={() => mv.current?.view('front')}>Anterior</button>
          <button onClick={() => mv.current?.view('back')}>Posterior</button>
          <button onClick={() => mv.current?.view('left')}>Kiri</button>
          <button onClick={() => mv.current?.view('right')}>Kanan</button>
        </div>
      </div>
      <p className="note">Segmen “tulang” diekspor dari Slicer sebagai OBJ ({d.segment.model_tris_original.toLocaleString('id-ID')} segitiga), lalu disederhanakan menjadi {d.segment.model_tris.toLocaleString('id-ID')} segitiga untuk web. Koordinat RAS asli dipertahankan.</p>
    </section>
  )
}
