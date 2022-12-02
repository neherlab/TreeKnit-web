import { uniq } from 'lodash'
import React, { useMemo } from 'react'
import { Col, Form, FormGroup, Label, Row } from 'reactstrap'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'

import { getGraphColor } from 'src/components/Tree/getGraphColor'
import { useTranslationSafe } from 'src/helpers/useTranslationSafe'
import { segmentDisplayStateAtom, SEGMENT_TOGGLE_VALUES } from 'src/state/tree.state'
import { Multitoggle } from 'src/components/Common/Multitoggle'
import type { GraphRaw } from 'src/components/Tree/PhyloGraph/graph'

const TreeSidebarWrapper = styled.aside`
  width: 300px;
  height: 100%;
  border-left: ${(props) => props.theme.gray400} 2px solid;
  padding: 1rem;
  margin-left: 1rem;
`

const LegendMarker = styled.span<{ color: string }>`
  width: 15px;
  height: 15px;
  background-color: ${(props) => props.color};
  margin: auto 0;
`

export interface TreeSidebarProps {
  graph: GraphRaw
}

export function TreeSidebar({ graph }: TreeSidebarProps) {
  const { t } = useTranslationSafe()

  const { segmentToggles } = useMemo(() => {
    const segments = graph.nodes.reduce((segments, node) => {
      return uniq([...segments, ...node.segments])
    }, [] as string[])

    const segmentToggles = segments.map((segment) => (
      <FormGroup key={segment}>
        <Label>
          <div className="d-flex">
            <LegendMarker color={getGraphColor(segment)} />
            <span className="ml-2">{segment}</span>
          </div>
          <SegmentToggle segment={segment} />
        </Label>
      </FormGroup>
    ))

    return { segmentToggles }
  }, [graph.nodes])

  return (
    <TreeSidebarWrapper>
      <Row noGutters>
        <Col>
          <h5>{t('Segments')}</h5>
          <Form>{segmentToggles}</Form>
        </Col>
      </Row>
    </TreeSidebarWrapper>
  )
}

export interface SegmentToggleProps {
  segment: string
}

export function SegmentToggle({ segment }: SegmentToggleProps) {
  const [segmentState, setSegmentState] = useRecoilState(segmentDisplayStateAtom(segment))
  return <Multitoggle values={SEGMENT_TOGGLE_VALUES} value={segmentState} onChange={setSegmentState} />
}
