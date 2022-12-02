import { atom, atomFamily, selector } from 'recoil'

export const SEGMENT_TOGGLE_VALUES = ['Hide', 'Dim', 'Show']

export const segmentsAtom = atom<string[]>({
  key: 'segments',
  default: [],
})

export const segmentDisplayStateAtom = atomFamily<string, string>({
  key: 'segmentDisplayState',
  default: 'Show',
})

export const segmentDisplayStatesAtom = selector<Record<string, string>>({
  key: 'segmentDisplayStates',
  get({ get }) {
    return Object.fromEntries(get(segmentsAtom).map((segment) => [segment, get(segmentDisplayStateAtom(segment))]))
  },
  set({ get, reset }) {
    get(segmentsAtom).forEach((segment) => reset(segmentDisplayStateAtom(segment)))
    reset(segmentsAtom)
  },
})
