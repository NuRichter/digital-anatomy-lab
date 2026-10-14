// Compress per-system GLB chunks exported from Blender (see README, "Pipeline aset").
// Usage: node scripts/process-assets.mjs <raw-dir>
import { execFileSync } from 'node:child_process'
import { readdirSync, copyFileSync, statSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const raw = process.argv[2] ?? 'raw'
const out = 'public/models'
mkdirSync(out, { recursive: true })
const cli = join('node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js')
for (const f of readdirSync(raw).filter((f) => f.endsWith('.glb'))) {
  const src = join(raw, f), dst = join(out, f)
  execFileSync(process.execPath, [cli, 'meshopt', src, dst, '--level', 'medium',
    '--quantize-position', '14', '--quantize-normal', '8'], { stdio: 'inherit' })
  console.log(f, (statSync(src).size / 1e6).toFixed(2), 'MB ->', (statSync(dst).size / 1e6).toFixed(2), 'MB')
}
copyFileSync(join(raw, 'manifest.json'), 'public/manifest.json')
