import { isNil } from 'lodash'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Col, Row, UncontrolledAlert } from 'reactstrap'

import type { GraphRaw } from 'src/components/Tree/PhyloGraph/graph'
import { Layout } from 'src/components/Layout/Layout'
import { UploadBox } from 'src/components/UploadZone/UploadBox'
import { Tree } from 'src/components/Tree/Tree'
import { readFile } from 'src/helpers/readFile'
import { useTranslationSafe } from 'src/helpers/useTranslationSafe'
import { parseNwk } from 'src/components/Tree/nwk/parseNwk'

export function MainPage() {
  const { t } = useTranslationSafe()
  const [graph, setGraph] = useState<GraphRaw | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const removeGraph = useCallback(() => setGraph(undefined), [])

  const onUpload = useCallback(
    (file: File[]) => {
      readFile(file[0])
        .then((content) => {
          const graph = parseNwk(content)
          setGraph(graph)
          setError(undefined)
          return undefined
        })
        .catch((error_) => {
          setGraph(undefined)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
          setError(`Error: ${error_?.message ?? t('Unknown error')}`)
        })
    },
    [t],
  )

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
    return (
      <Row noGutters className="my-2">
        <Col>
          <UncontrolledAlert color="danger">{error}</UncontrolledAlert>
        </Col>
      </Row>
    )
  }, [error])

  return (
    <Layout>
      <Row noGutters className="w-100 h-100">
        <Col className="w-100 h-100">{mainComponent}</Col>
      </Row>
      {errorComponent}
      <Row noGutters className="my-2 w-100">
        <Col className="d-flex w-100">
          <Button
            color={isNil(graph) ? 'secondary' : 'primary'}
            className="ml-auto"
            disabled={isNil(graph)}
            onClick={removeGraph}
          >
            {t('Remove tree')}
          </Button>
        </Col>
      </Row>
    </Layout>
  )
}
