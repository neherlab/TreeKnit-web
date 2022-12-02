import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'

import { Tooltip } from 'src/components/Common/Tooltip'
import { getGraphColor } from 'src/components/Tree/getGraphColor'
import { useEnable } from 'src/hooks/useEnable'
import { PHYLO_GRAPH_EDGE_THICKNESS } from 'src/components/Tree/PhyloGraph/constants'
import { getNodesForEdge, Graph, GraphEdge } from './graph'

const PathT = styled.path<{ color?: string; z?: number }>`
  stroke-width: ${PHYLO_GRAPH_EDGE_THICKNESS}px;
  stroke: ${(props) => props.color ?? '#aaa'};
  pointer-events: auto;
  cursor: pointer;
`

const PathS = styled.path<{ color?: string }>`
  fill: none;
  stroke-width: ${PHYLO_GRAPH_EDGE_THICKNESS}px;
  stroke: ${(props) => props.color ?? '#aaa'};
  pointer-events: auto;
  cursor: pointer;
`

export interface EdgeProps {
  edge: GraphEdge
  graph: Graph
}

export function Edge({ edge, graph }: EdgeProps) {
  const refVertical = useRef<SVGCircleElement>(null)
  const [isVerticalTooltipOpen, openVerticalTooltip, closeVerticalTooltip] = useEnable(false)

  const refHorizontal = useRef<SVGCircleElement>(null)
  const [isHorizontalTooltipOpen, openHorizontalTooltip, closeHorizontalTooltip] = useEnable(false)

  const paths = useMemo(() => {
    const { source, target } = getNodesForEdge(graph, edge)

    const sourcePaths = source.segments.map((segment, i) => {
      const color = getGraphColor(segment)
      const corner = PHYLO_GRAPH_EDGE_THICKNESS / 2
      const offset = i * PHYLO_GRAPH_EDGE_THICKNESS
      return (
        <PathT
          key={`source-path-${segment}`}
          ref={refVertical}
          color={color}
          /* prettier-ignore */
          d={`M ${source.layout.xTBarStart + offset}, ${source.layout.yTBarStart - corner + offset} L ${source.layout.xTBarEnd + offset}, ${source.layout.yTBarEnd + corner}`}
          onMouseEnter={openVerticalTooltip}
          onMouseOut={closeVerticalTooltip}
        />
      )
    })

    const targetPaths = target.segments.map((segment, i) => {
      const color = getGraphColor(segment)
      const corner = PHYLO_GRAPH_EDGE_THICKNESS / 2
      const offset = i * PHYLO_GRAPH_EDGE_THICKNESS
      return (
        <PathS
          key={`target-path-${segment}`}
          ref={refHorizontal}
          color={color}
          /* prettier-ignore */
          d={`M ${source.layout.xTBarStart + corner}, ${target.y + offset} L ${target.x}, ${target.y + offset}`}
          onMouseEnter={openHorizontalTooltip}
          onMouseOut={closeHorizontalTooltip}
        />
      )
    })

    return (
      <g>
        {sourcePaths}
        {targetPaths}
      </g>
    )
  }, [closeHorizontalTooltip, closeVerticalTooltip, edge, graph, openHorizontalTooltip, openVerticalTooltip])

  const tooltipVertical = useMemo(() => {
    return (
      <Tooltip target={refVertical} isOpen={isVerticalTooltipOpen} fullWidth>
        <pre>{JSON.stringify(edge, null, 2)}</pre>
      </Tooltip>
    )
  }, [edge, isVerticalTooltipOpen])

  const tooltipHorizontal = useMemo(() => {
    return (
      <Tooltip target={refHorizontal} isOpen={isHorizontalTooltipOpen} fullWidth>
        <pre>{JSON.stringify(edge, null, 2)}</pre>
      </Tooltip>
    )
  }, [edge, isHorizontalTooltipOpen])

  return (
    <>
      {paths}
      {tooltipVertical}
      {tooltipHorizontal}
    </>
  )
}
