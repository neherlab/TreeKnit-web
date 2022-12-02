import React from 'react'
import { Col, Row } from 'reactstrap'

import { Layout } from 'src/components/Layout/Layout'

import AboutContent from './About.mdx'

export function AboutPage() {
  return (
    <Layout>
      <Row noGutters className="my-2 mx-4">
        <Col>
          <AboutContent />
        </Col>
      </Row>
    </Layout>
  )
}
