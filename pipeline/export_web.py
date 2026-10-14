"""Decimate + export one GLB per system chunk, and write manifest.json for the website."""
import bpy, sys, json, os, collections
sys.path.insert(0, r'C:\Users\NuRichter\anat\scripts')
OUT = r'C:\Users\NuRichter\anat\web_raw'
os.makedirs(OUT, exist_ok=True)
D = r'C:\Users\NuRichter\bp3d_raw'
EL = {e['file']: e for e in json.load(open(D + r'\elements.json', encoding='utf8'))}

CHUNK = {'integument': 'skin', 'skeletal': 'skeletal', 'cartilage': 'skeletal', 'muscle': 'muscular', 'ligament': 'connective',
         'fascia': 'connective', 'artery': 'arteries', 'vein': 'veins', 'heart': 'heart', 'nervous': 'nervous', 'sensory': 'sensory',
         'respiratory': 'respiratory', 'digestive': 'digestive', 'urinary': 'urogenital', 'reproductive': 'urogenital',
         'endocrine': 'endocrine', 'lymphatic': 'endocrine'}
RATIO = {'muscle': 0.22, 'vein': 0.28, 'artery': 0.28, 'skeletal': 0.4, 'nervous': 0.3, 'sensory': 0.12, 'integument': 0.3,
         'respiratory': 0.35, 'digestive': 0.45, 'heart': 0.5}


def region(e, zc, xc):
    a = e['anc']; n = e['name'].lower()
    if 'upper limb' in a or 'pectoral girdle' in a or (abs(xc) > 0.17 and zc > 0.75): return 'upper_limb'
    if 'lower limb' in a or 'pelvic girdle' in a and 'hip bone' in n or zc < 0.72: return 'lower_limb'
    if zc > 1.38: return 'head_neck'
    if zc > 1.06: return 'thorax'
    if zc > 0.86: return 'abdomen'
    return 'pelvis'


meshes = [o for o in bpy.data.objects if o.type == 'MESH' and o['system'] != 'other']
for o in [o for o in bpy.data.objects if o.type == 'MESH' and o['system'] == 'other']:
    bpy.data.objects.remove(o)
items = []
for o in meshes:
    s = o['system'] if o['label'] != 'parenchyma' else 'digestive'
    nf = len(o.data.polygons)
    r = RATIO.get(s, 0.5)
    r = max(r, min(1.0, 120 / max(nf, 1)))
    if r < 0.999:
        m = o.modifiers.new('dec', 'DECIMATE'); m.ratio = r
    mn = [1e9] * 3; mx = [-1e9] * 3
    import mathutils
    for v in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(v)
        for i in range(3): mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
    zc = (mn[2] + mx[2]) / 2; xc = (mn[0] + mx[0]) / 2
    e = EL[o.name]
    items.append(dict(id=o.name, fma=e['fma'], name=e['name'], system=s, chunk=CHUNK[s], region=region(e, zc, xc),
                      sup=bool(e.get('superficial')), tris=nf, c=[round(xc, 4), round(-((mn[1] + mx[1]) / 2), 4) if False else round((mn[1] + mx[1]) / 2, 4), round(zc, 4)]))

by_chunk = collections.defaultdict(list)
for it in items: by_chunk[it['chunk']].append(it['id'])
for ch, ids in by_chunk.items():
    bpy.ops.object.select_all(action='DESELECT')
    for i in ids: bpy.data.objects[i].select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, ch + '.glb'), export_format='GLB', use_selection=True, export_apply=True,
                              export_materials='NONE', export_yup=True, export_normals=True, export_texcoords=False,
                              export_extras=False)
    print('EXPORTED', ch, len(ids), flush=True)

# concept index (part-of + is-a) restricted to exported elements
ids = {it['id'] for it in items}
concepts = {}
for p in ('partof', 'isa'):
    for l in list(open(f'{D}/{p}_element_parts.txt', encoding='utf8'))[1:]:
        c, n, f = l.rstrip('\n').split('\t')
        if f in ids:
            concepts.setdefault(c, {'name': n, 'els': set()})['els'].add(f)
parents = collections.defaultdict(set)
for l in list(open(f'{D}/partof_inclusion_relation_list.txt', encoding='utf8'))[1:]:
    a, an, b, bn = l.rstrip('\n').split('\t'); parents[b].add(a)
idx = {it['id']: k for k, it in enumerate(items)}
clist = []
for c, v in concepts.items():
    if len(v['els']) == 1 and items[idx[next(iter(v['els']))]]['fma'] == c: continue  # same as element itself
    clist.append(dict(fma=c, name=v['name'], els=sorted(idx[e] for e in v['els'])))
clist.sort(key=lambda x: (-len(x['els']), x['name']))
# part-of breadcrumbs for each element (direct parents names)
names = {c: v['name'] for c, v in concepts.items()}
for l in list(open(f'{D}/partof_inclusion_relation_list.txt', encoding='utf8'))[1:]:
    a, an, b, bn = l.rstrip('\n').split('\t'); names.setdefault(a, an); names.setdefault(b, bn)
for it in items:
    ps = [names[p] for p in parents.get(it['fma'], []) if p in names]
    it['partOf'] = sorted(ps)[:3]
json.dump(dict(items=items, concepts=clist), open(os.path.join(OUT, 'manifest.json'), 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
print('MANIFEST', len(items), len(clist))
