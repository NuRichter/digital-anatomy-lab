// Atlas configuration: systems, chunks, layer presets, regions and search synonyms.

export type SystemKey =
  | 'integument' | 'skeletal' | 'cartilage' | 'muscle' | 'ligament' | 'fascia' | 'artery' | 'vein' | 'heart'
  | 'nervous' | 'sensory' | 'respiratory' | 'digestive' | 'urinary' | 'reproductive' | 'endocrine' | 'lymphatic'

export interface SystemGroup {
  key: string
  label: string
  systems: SystemKey[]
  chunks: string[]
  color: string
}

// Groups shown in the "Sistem" panel. Colours follow DESIGN.md (atlas system colours).
export const GROUPS: SystemGroup[] = [
  { key: 'skin', label: 'Kulit', systems: ['integument'], chunks: ['skin'], color: '#D9B59C' },
  { key: 'skeletal', label: 'Rangka dan kartilago', systems: ['skeletal', 'cartilage'], chunks: ['skeletal'], color: '#E3DAC4' },
  { key: 'muscular', label: 'Otot', systems: ['muscle'], chunks: ['muscular'], color: '#A8453D' },
  { key: 'connective', label: 'Ligamen dan fasia', systems: ['ligament', 'fascia'], chunks: ['connective'], color: '#CFC8B4' },
  { key: 'heart', label: 'Jantung', systems: ['heart'], chunks: ['heart'], color: '#9C2F2A' },
  { key: 'arteries', label: 'Arteri', systems: ['artery'], chunks: ['arteries'], color: '#C1272D' },
  { key: 'veins', label: 'Vena', systems: ['vein'], chunks: ['veins'], color: '#2E5AA6' },
  { key: 'nervous', label: 'Saraf dan otak', systems: ['nervous'], chunks: ['nervous'], color: '#DDAE2E' },
  { key: 'sensory', label: 'Organ indera (mata)', systems: ['sensory'], chunks: ['sensory'], color: '#3A9CC0' },
  { key: 'respiratory', label: 'Pernapasan', systems: ['respiratory'], chunks: ['respiratory'], color: '#E09A97' },
  { key: 'digestive', label: 'Pencernaan', systems: ['digestive'], chunks: ['digestive'], color: '#C4844C' },
  { key: 'urogenital', label: 'Urinaria dan reproduksi', systems: ['urinary', 'reproductive'], chunks: ['urogenital'], color: '#8A6BB0' },
  { key: 'endocrine', label: 'Endokrin dan limfoid', systems: ['endocrine', 'lymphatic'], chunks: ['endocrine'], color: '#2F9A8A' },
]

export const SYSTEM_COLOR: Record<SystemKey, string> = {
  integument: '#D9B59C', skeletal: '#E6DCC3', cartilage: '#AFC6CC', muscle: '#A8453D', ligament: '#D9D2C4', fascia: '#D9D2C4',
  artery: '#C1272D', vein: '#2E5AA6', heart: '#9C2F2A', nervous: '#E3C2B4', sensory: '#E8E6E1', respiratory: '#E09A97',
  digestive: '#D49A72', urinary: '#8E3B2F', reproductive: '#C7857C', endocrine: '#B5476A', lymphatic: '#6B2C3E',
}

export const SYSTEM_LABEL: Record<SystemKey, string> = {
  integument: 'Kulit', skeletal: 'Rangka', cartilage: 'Kartilago', muscle: 'Otot', ligament: 'Ligamen', fascia: 'Fasia',
  artery: 'Arteri', vein: 'Vena', heart: 'Jantung', nervous: 'Saraf dan otak', sensory: 'Organ indera', respiratory: 'Pernapasan',
  digestive: 'Pencernaan', urinary: 'Urinaria', reproductive: 'Reproduksi', endocrine: 'Endokrin', lymphatic: 'Limfoid',
}

export interface Layer {
  key: string
  label: string
  groups: string[]
  deepMusclesOnly?: boolean
}

// Dissection order, superficial to deep. Mirrors the 3D lecture deck.
export const LAYERS: Layer[] = [
  { key: 'L1', label: 'Kulit', groups: ['skin'] },
  { key: 'L2', label: 'Otot superfisial', groups: ['muscular', 'skeletal', 'connective', 'sensory'] },
  { key: 'L3', label: 'Otot dalam', groups: ['muscular', 'skeletal', 'connective', 'sensory'], deepMusclesOnly: true },
  { key: 'L4', label: 'Rangka dan organ', groups: ['skeletal', 'heart', 'respiratory', 'digestive', 'urogenital', 'endocrine', 'nervous', 'sensory'] },
  { key: 'L5', label: 'Organ dan pembuluh', groups: ['heart', 'respiratory', 'digestive', 'urogenital', 'endocrine', 'arteries', 'veins', 'nervous', 'sensory'] },
  { key: 'L6', label: 'Pembuluh dan otak', groups: ['heart', 'arteries', 'veins', 'nervous'] },
]

export const REGIONS: { key: string; label: string }[] = [
  { key: 'all', label: 'Seluruh tubuh' },
  { key: 'head_neck', label: 'Kepala dan leher' },
  { key: 'thorax', label: 'Toraks' },
  { key: 'abdomen', label: 'Abdomen' },
  { key: 'pelvis', label: 'Pelvis' },
  { key: 'upper_limb', label: 'Ekstremitas atas' },
  { key: 'lower_limb', label: 'Ekstremitas bawah' },
]

// Indonesian lay/clinical terms -> English FMA search term. Only maps to names that exist in BodyParts3D.
export const SYNONYMS: Record<string, string> = {
  jantung: 'heart', hati: 'liver', hepar: 'liver', paru: 'lung', 'paru-paru': 'lung', pulmo: 'lung', ginjal: 'kidney', ren: 'kidney',
  lambung: 'stomach', gaster: 'stomach', limpa: 'spleen', lien: 'spleen', splen: 'spleen', pankreas: 'pancreas', usus: 'intestine',
  'usus besar': 'colon', 'usus halus': 'small intestine', kerongkongan: 'esophagus', esofagus: 'esophagus', oesophagus: 'esophagus',
  trakea: 'trachea', tenggorokan: 'larynx', laring: 'larynx', otak: 'brain', 'otak kecil': 'cerebellum', serebelum: 'cerebellum',
  tengkorak: 'skull', kranium: 'skull', cranium: 'skull', tulang: 'bone', otot: 'muscle', arteri: 'artery', vena: 'vein', aorta: 'aorta',
  'tulang belakang': 'vertebra', vertebra: 'vertebra', rusuk: 'rib', iga: 'rib', costa: 'rib', panggul: 'hip bone', pelvis: 'hip bone',
  'tulang paha': 'femur', 'tulang lengan': 'humerus', 'tulang kering': 'tibia', 'tempurung lutut': 'patella', 'kandung kemih': 'urinary bladder',
  'kantong empedu': 'gallbladder', 'kandung empedu': 'gallbladder', mata: 'eyeball', 'bola mata': 'eyeball', lensa: 'lens', gigi: 'tooth',
  rahang: 'mandible', mandibula: 'mandible', 'tulang dada': 'sternum', sternum: 'sternum', diafragma: 'diaphragm', kulit: 'skin',
  timus: 'thymus', hipofisis: 'pituitary', 'kelenjar adrenal': 'adrenal', suprarenal: 'adrenal', prostat: 'prostate', testis: 'testis',
}

export const ATTRIBUTION =
  'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International'
