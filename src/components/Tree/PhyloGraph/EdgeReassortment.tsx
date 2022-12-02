import { mix, transparentize } from 'polished'
import React, { useMemo, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { segmentDisplayStatesAtom } from 'src/state/tree.state'
import styled from 'styled-components'

import { Tooltip } from 'src/components/Common/Tooltip'
import { getGraphColor, mixMultipleColors } from 'src/components/Tree/getGraphColor'
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

  const segmentStates = useRecoilValue(segmentDisplayStatesAtom)

  const path = useMemo(() => {
    const { source, target } = getNodesForEdge(graph, edge)

    if (
      source.segments.every((segment) => segmentStates[segment] === 'Hide') &&
      target.segments.every((segment) => segmentStates[segment] === 'Hide')
    ) {
      return null
    }

    const sourceColor = mixMultipleColors(source.segments.map((segment) => getGraphColor(segment)))
    const targetColor = mixMultipleColors(target.segments.map((segment) => getGraphColor(segment)))
    let color = mix(0.5, targetColor, sourceColor)
    if (
      source.segments.every((segment) => ['Hide', 'Dim'].includes(segmentStates[segment])) &&
      target.segments.every((segment) => ['Hide', 'Dim'].includes(segmentStates[segment]))
    ) {
      color = transparentize(0.25)(color)
    }

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
  }, [closeTooltip, edge, graph, openTooltip, segmentStates])

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
