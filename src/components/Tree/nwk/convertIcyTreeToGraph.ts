import { GraphEdge, GraphNodeRaw, GraphRaw } from 'src/components/Tree/PhyloGraph/graph'

export interface IcyTreeNode {
  label: string
  branchLength: number
  height: number
  annotation: {
    segments: string[]
  }
  children: IcyTreeNode[]
}

export interface IcyTreeNodeWithIds extends IcyTreeNode {
  id: string
  children: IcyTreeNodeWithIds[]
}

/** Convert old phyloTree data format (https://github.com/nextstrain/phyloTree) to the new graph data format */
export function convertIcyTreeToGraph(tree: IcyTreeNode): GraphRaw {
  const nodes: GraphNodeRaw[] = []
  const treeWithIds = flattenTreeNodesRecursive(tree, nodes)

  const edges: GraphEdge[] = []
  flattenTreeEdgesRecursive(treeWithIds, nodes, edges)

  return { nodes, edges }
}

/** Index tree nodes with unique IDs */
function flattenTreeNodesRecursive(node: IcyTreeNode, nodes: GraphNodeRaw[]): IcyTreeNodeWithIds {
  const id = nodes.length.toString()

  nodes.push({ id, name: node.label, segments: node.annotation.segments, height: node.height })

  const children = node.children ?? []
  const childrenWithIds = children.map((child) => flattenTreeNodesRecursive(child, nodes))
  return { ...node, id, children: childrenWithIds }
}

/** Convert tree node hierarchy into flat lists of nodes and edges */
function flattenTreeEdgesRecursive(node: IcyTreeNodeWithIds, nodes: GraphNodeRaw[], edges: GraphEdge[]) {
  const children = node.children ?? []
  children.forEach((child) => {
    edges.push({ id: edges.length.toString(), source: node.id, target: child.id, branchLength: child.branchLength })
    flattenTreeEdgesRecursive(child, nodes, edges)
  })
}
