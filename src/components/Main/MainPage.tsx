import React, { useCallback, useMemo, useState } from 'react'
import { Col, Row, UncontrolledAlert } from 'reactstrap'

import type { GraphRaw } from 'src/components/Tree/PhyloGraph/graph'
import { Layout } from 'src/components/Layout/Layout'
import { UploadBox } from 'src/components/UploadZone/UploadBox'
import { Tree } from 'src/components/Tree/Tree'
import { readFile } from 'src/helpers/readFile'
import { sanitizeError } from 'src/helpers/sanitizeError'
import { useTranslationSafe } from 'src/helpers/useTranslationSafe'
import { parseNwk } from 'src/components/Tree/nwk/parseNwk'

export function MainPage() {
  const { t } = useTranslationSafe()
  const [graph, setGraph] = useState<GraphRaw | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)

  const onUpload = useCallback((file: File[]) => {
    readFile(file[0])
      .then((content) => {
        const graph = parseNwk(content)
        return setGraph(graph)
      })
      .catch((error) => setError(sanitizeError(error)))
  }, [])

  const mainComponent = useMemo(() => {
    if (graph) {
      return <Tree graph={graph} />
    }
    return <UploadBox onUpload={onUpload} />
  }, [graph, onUpload])

  const errorComponent = useMemo(() => {
    if (!error) {
      return null
    }
    return <UncontrolledAlert>{error?.message ?? t('Unknown error')}</UncontrolledAlert>
  }, [error, t])

  return (
    <Layout>
      <Row noGutters className="w-100 h-100">
        <Col className="w-100 h-100">{mainComponent}</Col>
      </Row>
      <Row noGutters>
        <Col>{errorComponent}</Col>
      </Row>
    </Layout>
  )
}
