import type { SystemKey } from './config'

export interface Item {
  id: string // BodyParts3D element file id, e.g. FJ3162
  fma: string
  name: string
  system: SystemKey
  chunk: string
  region: string
  sup: boolean
  tris: number
  c: [number, number, number]
  partOf: string[]
}

export interface Concept {
  fma: string
  name: string
  els: number[] // indexes into items
}

export interface Manifest {
  items: Item[]
  concepts: Concept[]
}

export type Selection =
  | { kind: 'item'; index: number }
  | { kind: 'concept'; concept: Concept }
  | null
