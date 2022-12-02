import React from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { Col, Row } from 'reactstrap'

import type { GraphRaw } from 'src/components/Tree/PhyloGraph/graph'
import { PhyloGraph } from 'src/components/Tree/PhyloGraph/PhyloGraph'
import { TreeSidebar } from 'src/components/Tree/TreeSidebar'

export interface TreeProps {
  graph: GraphRaw
}

export function Tree({ graph }: TreeProps) {
  const {
    width,
    height,
    ref: containerRef,
  } = useResizeDetector({
    handleHeight: true,
    refreshOptions: { leading: true, trailing: true },
  })

  return (
    <Row noGutters className="w-100 h-100">
      <Col>
        <div className="w-100 h-100" ref={containerRef}>
          {width && height && <PhyloGraph width={width} height={height} graph={graph} />}
        </div>
      </Col>
      <TreeSidebar graph={graph} />
    </Row>
  )
}
