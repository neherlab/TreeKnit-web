import { isEqual } from 'lodash'
import React, { useMemo, useRef } from 'react'
import { Tooltip } from 'src/components/Common/Tooltip'
import { useEnable } from 'src/hooks/useEnable'
import styled from 'styled-components'

import { getNodesForEdge, Graph, GraphEdge } from './graph'

const PathT = styled.path<{ color?: string }>`
  fill: none;
  stroke-width: 3px;
  stroke: ${(props) => props.color ?? '#aaa'};
  pointer-events: auto;
  cursor: pointer;
`

const PathS = styled.path<{ color?: string }>`
  fill: none;
  stroke-width: 3px;
  stroke: ${(props) => props.color ?? '#aaa'};
  pointer-events: auto;
  cursor: pointer;
  stroke-linecap: round;
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

    let color = '#aaa'
    if (isEqual(source.segments, ['0'])) {
      color = 'red'
    } else if (isEqual(source.segments, ['1'])) {
      color = 'blue'
    }

    const pathVertical = (
      <PathT
        ref={refVertical}
        color={color}
        d={`M ${source.layout.xTBarStart}, ${source.layout.yTBarStart} L ${source.layout.xTBarEnd}, ${source.layout.yTBarEnd}`}
        onMouseEnter={openVerticalTooltip}
        onMouseOut={closeVerticalTooltip}
      />
    )

    color = '#aaa'
    if (isEqual(target.segments, ['0'])) {
      color = 'red'
    } else if (isEqual(target.segments, ['1'])) {
      color = 'blue'
    }

    const pathHorizontal = (
      <PathS
        ref={refHorizontal}
        color={color}
        d={`M ${source.layout.xTBarStart}, ${target.y} L ${target.x}, ${target.y}`}
        onMouseEnter={openHorizontalTooltip}
        onMouseOut={closeHorizontalTooltip}
      />
    )

    return (
      <g>
        {pathVertical}
        {pathHorizontal}
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
