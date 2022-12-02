import { mix } from 'polished'
import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'

import { Tooltip } from 'src/components/Common/Tooltip'
import { getGraphColor } from 'src/components/Tree/getGraphColor'
import { useEnable } from 'src/hooks/useEnable'
import { PHYLO_GRAPH_EDGE_THICKNESS } from 'src/components/Tree/PhyloGraph/constants'
import { getNodesForEdge, Graph, GraphEdge } from './graph'

const ReassortmentLine = styled.line<{ color?: string }>`
  stroke-width: ${PHYLO_GRAPH_EDGE_THICKNESS}px;
  stroke: ${(props) => props.color ?? '#aaa'};
  stroke-dasharray: ${PHYLO_GRAPH_EDGE_THICKNESS};
`

export interface EdgeEdgeReassortmentProps {
  edge: GraphEdge
  graph: Graph
}

export function EdgeReassortment({ edge, graph }: EdgeEdgeReassortmentProps) {
  const ref = useRef<SVGLineElement>(null)
  const [isTooltipOpen, openTooltip, closeTooltip] = useEnable(false)

  const path = useMemo(() => {
    const { source, target } = getNodesForEdge(graph, edge)

    const sourceColor = source.segments.reduce((color, segment) => {
      return mix(0.5, color, getGraphColor(segment))
    }, '#00000000')
    const targetColor = target.segments.reduce((color, segment) => {
      return mix(0.5, color, getGraphColor(segment))
    }, '#00000000')
    const color = mix(0.5, targetColor, sourceColor)

    return (
      <ReassortmentLine
        ref={ref}
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        color={color}
        onMouseEnter={openTooltip}
        onMouseOut={closeTooltip}
      />
    )
  }, [closeTooltip, edge, graph, openTooltip])

  const tooltip = useMemo(() => {
    return (
      <Tooltip target={ref} isOpen={isTooltipOpen} fullWidth>
        <pre>{JSON.stringify(edge, null, 2)}</pre>
      </Tooltip>
    )
  }, [edge, isTooltipOpen])

  return (
    <>
      {path}
      {tooltip}
    </>
  )
}
