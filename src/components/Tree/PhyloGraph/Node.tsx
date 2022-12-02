import { isNil } from 'lodash'
import React, { ReactElement, RefObject, useMemo, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { getGraphColor, mixMultipleColors } from 'src/components/Tree/getGraphColor'
import { segmentDisplayStatesAtom } from 'src/state/tree.state'
import styled from 'styled-components'
import { opacify, transparentize } from 'polished'

import { useEnable } from 'src/hooks/useEnable'
import { Tooltip } from 'src/components/Common/Tooltip'
import type { Graph, GraphNode } from './graph'
import { isLeafNode } from './graph'
import { PHYLO_GRAPH_NODE_LABEL_FONT_SIZE, PHYLO_GRAPH_NODE_RADIUS } from './constants'

const NodeCircle = styled.circle<{ fill?: string }>`
  fill: ${(props) => props.fill ?? '#555'};
  r: ${PHYLO_GRAPH_NODE_RADIUS};
`

const NodeSquare = styled.rect<{ fill?: string }>`
  rx: 2px;
  fill: ${(props) => props.fill ?? '#555'};
  stroke: black;
  filter: drop-shadow(0px 0px 2px #000a);
`

export interface CladeTreeNodeProps {
  node: GraphNode
  graph: Graph
}

export function Node({ node, graph }: CladeTreeNodeProps): ReactElement {
  const { x, y, name, id, segments, reassortmentTwin } = node
  const segmentStates = useRecoilValue(segmentDisplayStatesAtom)
  const isLeaf = useMemo(() => isLeafNode(graph, id), [graph, id])
  const ref = useRef<SVGElement>(null)
  const [isTooltipOpen, openTooltip, closeTooltip] = useEnable(false)
  const text = useMemo(() => {
    if (!isLeaf) {
      return null
    }

    if (segments.every((segment) => segmentStates[segment] === 'Hide')) {
      return null
    }

    let opacity = 1
    if (segments.every((segment) => ['Hide', 'Dim'].includes(segmentStates[segment]))) {
      opacity = 0.5
    }

    return (
      <text
        x={x + PHYLO_GRAPH_NODE_RADIUS * 2}
        y={y + PHYLO_GRAPH_NODE_LABEL_FONT_SIZE / 2 - 2}
        width={PHYLO_GRAPH_NODE_RADIUS * 2}
        height={PHYLO_GRAPH_NODE_RADIUS * 2}
        fill="#222"
        opacity={opacity}
        fontSize={PHYLO_GRAPH_NODE_LABEL_FONT_SIZE}
        textAnchor="left"
      >
        {name}
      </text>
    )
  }, [isLeaf, name, segmentStates, segments, x, y])

  const marker = useMemo(() => {
    if (!isLeaf && isNil(reassortmentTwin)) {
      return null
    }

    if (segments.every((segment) => segmentStates[segment] === 'Hide')) {
      return null
    }

    let color = mixMultipleColors(segments.map((segment) => getGraphColor(segment)))
    color = opacify(1)(color)
    if (segments.every((segment) => ['Hide', 'Dim'].includes(segmentStates[segment]))) {
      color = transparentize(0.5)(color)
    }

    if (!isNil(reassortmentTwin)) {
      return (
        <NodeSquare
          ref={ref as RefObject<SVGRectElement>}
          x={x - PHYLO_GRAPH_NODE_RADIUS / 2}
          y={y - PHYLO_GRAPH_NODE_RADIUS / 2}
          fill={color}
          width={PHYLO_GRAPH_NODE_RADIUS * 2}
          height={PHYLO_GRAPH_NODE_RADIUS * 2}
          onMouseEnter={openTooltip}
          onMouseLeave={closeTooltip}
        />
      )
    }

    return (
      <NodeCircle
        ref={ref as RefObject<SVGCircleElement>}
        cx={x}
        cy={y}
        fill={color}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
      />
    )
  }, [isLeaf, reassortmentTwin, segments, x, y, openTooltip, closeTooltip, segmentStates])

  const elements = useMemo(() => {
    return (
      <g>
        {marker}
        {text}
      </g>
    )
  }, [marker, text])

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
