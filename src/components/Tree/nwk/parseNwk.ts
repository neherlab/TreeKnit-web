import type { GraphRaw } from 'src/components/Tree/PhyloGraph/graph'
import { convertIcyTreeToGraph, IcyTreeNode } from 'src/components/Tree/nwk/convertIcyTreeToGraph'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getTreesFromNewick } from './icytree/treeparsing'

export function parseNwk(content: string): GraphRaw {
  const trees = getTreesFromNewick(content) as unknown as { root: IcyTreeNode }[]
  return convertIcyTreeToGraph(trees[0].root)
}
