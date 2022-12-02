import { isInteger, isNil } from 'lodash'
import { colorHash } from 'src/helpers/colorHash'
import { lighten, mix } from 'polished'

/**
 * Colors from seaborn Python package, rearranged
 * https://github.com/mwaskom/seaborn/blob/feb59d250ea92ef143f5aef50ff6e18869affa7f/seaborn/palettes.py#L29-L30
 */
export const GRAPH_COLORS = [
  '#e8000b',
  '#023eff',
  '#ff7c00',
  '#1ac938',
  '#8b2be2',
  '#9f4800',
  '#f14cc1',
  '#a3a3a3',
  '#ffc400',
  '#00d7ff',
]

/** Returns parsed integer or undefined */
export function parseIntMaybe(x: string | number): number | undefined {
  if (typeof x === 'number' && isInteger(x)) {
    return x
  }

  if (typeof x === 'string') {
    try {
      return Number.parseInt(x, 10)
    } catch {
      return undefined
    }
  }
  return undefined
}

/**
 * Returns one of the predefined colors if input resembles a small integer,
 * or a generated (but stable, reentrant) color
 */
export function getGraphColor(x: string | number) {
  const i = parseIntMaybe(x)
  const color = !isNil(i) && i < GRAPH_COLORS.length ? GRAPH_COLORS[i] : colorHash(x.toString())
  return lighten(0.125)(color)
}

/** Mix an array of color (represented as hex strings) */
export function mixMultipleColors(colors: string[]): string {
  return colors.reduce((result, color) => mix(0.5, result, color), '#00000000')
}
