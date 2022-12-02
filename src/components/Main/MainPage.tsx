import React, { useCallback, useMemo, useState } from 'react'
import { Col, Row } from 'reactstrap'

import type { GraphRaw } from 'src/components/Tree/PhyloGraph/graph'
import { Layout } from 'src/components/Layout/Layout'
import { UploadBox } from 'src/components/UploadZone/UploadBox'
import { Tree } from 'src/components/Tree/Tree'

export function MainPage() {
  const [graph, setGraph] = useState<GraphRaw | undefined>(undefined)

  const onUpload = useCallback(() => {}, [])

  const content = useMemo(() => {
    if (graph) {
      return <Tree graph={graph} />
    }
    return <UploadBox onUpload={onUpload} />
  }, [graph, onUpload])

  return (
    <Layout>
      <Row noGutters className="w-100 h-100">
        <Col className="w-100 h-100">{content}</Col>
      </Row>
    </Layout>
  )
}
