import React, { ReactElement, useMemo, useRef } from 'react'
import { getGraphColor } from 'src/components/Tree/getGraphColor'
import styled from 'styled-components'
import { mix, opacify } from 'polished'

import { useEnable } from 'src/hooks/useEnable'
import { Tooltip } from 'src/components/Common/Tooltip'
import type { Graph, GraphNode } from './graph'
import { isLeafNode } from './graph'
import { PHYLO_GRAPH_NODE_LABEL_FONT_SIZE, PHYLO_GRAPH_NODE_RADIUS } from './constants'

const NodeCircle = styled.circle<{ fill?: string }>`
  fill: ${(props) => props.fill ?? '#555'};
  r: ${PHYLO_GRAPH_NODE_RADIUS};
`

export interface CladeTreeNodeProps {
  node: GraphNode
  graph: Graph
}

export function Node({ node, graph }: CladeTreeNodeProps): ReactElement {
  const { x, y, name, id, segments } = node
  const isLeaf = useMemo(() => isLeafNode(graph, id), [graph, id])
  const ref = useRef<SVGCircleElement>(null)
  const [isTooltipOpen, openTooltip, closeTooltip] = useEnable(false)

  const text = useMemo(() => {
    if (!isLeaf) {
      return null
    }
    return (
      <text
        x={x + PHYLO_GRAPH_NODE_RADIUS * 2}
        y={y + PHYLO_GRAPH_NODE_LABEL_FONT_SIZE / 2 - 2}
        width={PHYLO_GRAPH_NODE_RADIUS * 2}
        height={PHYLO_GRAPH_NODE_RADIUS * 2}
        fill="#222"
        fontSize={PHYLO_GRAPH_NODE_LABEL_FONT_SIZE}
        textAnchor="left"
      >
        {name}
      </text>
    )
  }, [isLeaf, name, x, y])

  const circle = useMemo(() => {
    if (!isLeaf) {
      return null
    }

    let color = segments.reduce((color, segment) => {
      return mix(0.5, color, getGraphColor(segment))
    }, '#00000000')
    color = opacify(1)(color)
    return <NodeCircle ref={ref} cx={x} cy={y} fill={color} onMouseEnter={openTooltip} onMouseLeave={closeTooltip} />
  }, [isLeaf, segments, x, y, openTooltip, closeTooltip])

  const elements = useMemo(() => {
    return (
      <g>
        {circle}
        {text}
      </g>
    )
  }, [circle, text])

  const tooltip = useMemo(() => {
    return (
      <Tooltip target={ref} isOpen={isTooltipOpen} fullWidth>
        <pre>{JSON.stringify(node, null, 2)}</pre>
      </Tooltip>
    )
  }, [isTooltipOpen, node])

  return (
    <>
      {elements}
      {tooltip}
    </>
  )
}
