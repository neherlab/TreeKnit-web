import React from 'react'
import { Col, Row } from 'reactstrap'

// import type { GraphRaw } from 'src/components/Tree/PhyloGraph/graph'
// import { Tree } from 'src/components/Tree/Tree'
import { Layout } from 'src/components/Layout/Layout'

export function MainPage() {
  // const graph = {} as GraphRaw

  return (
    <Layout>
      <Row noGutters>
        <Col>{/*<Tree graph={graph} />*/}</Col>
      </Row>
    </Layout>
  )
}
