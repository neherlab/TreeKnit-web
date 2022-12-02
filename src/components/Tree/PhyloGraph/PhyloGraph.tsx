import React, { useMemo, useRef } from 'react'
import { verifyGraph } from 'src/components/Tree/PhyloGraph/verifyGraph'
import styled from 'styled-components'

import { calculateGraphLayout, GraphRaw } from './graph'
import { Node } from './Node'
import { Edge } from './Edge'

const Svg = styled.svg`
  font-family: sans-serif;
  font-size: 1.25rem;
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  height: 100%;
`

export interface PhyloGraphProps {
  width: number
  height: number
  graph: GraphRaw
}

export function PhyloGraph({ width, height, graph: graphRaw }: PhyloGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const { nodeComponents, edgeComponents } = useMemo(() => {
    if (!width || !height) {
      return { nodeComponents: [], edgeComponents: [] }
    }
    verifyGraph(graphRaw)
    const graph = calculateGraphLayout(graphRaw, width, height)
    const nodeComponents = graph.nodes.map((node) => <Node key={node.id} graph={graph} node={node} />)
    const edgeComponents = graph.edges.map((edge) => <Edge key={edge.id} graph={graph} edge={edge} />)
    return { nodeComponents, edgeComponents }
  }, [graphRaw, height, width])

  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} ref={svgRef}>
      <g>{edgeComponents}</g>
      <g>{nodeComponents}</g>
    </Svg>
  )
}
