import { useQuery } from '@tanstack/react-query'
import { concurrent } from 'fasy'
import { isNil } from 'lodash'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Col, Row, UncontrolledAlert } from 'reactstrap'
import { useResetRecoilState } from 'recoil'

import type { GraphRaw } from 'src/components/Tree/PhyloGraph/graph'
import { Layout } from 'src/components/Layout/Layout'
import { UploadBox } from 'src/components/UploadZone/UploadBox'
import { Tree } from 'src/components/Tree/Tree'
import { readFile } from 'src/helpers/readFile'
import { useTranslationSafe } from 'src/helpers/useTranslationSafe'
import { parseNwk } from 'src/components/Tree/nwk/parseNwk'
import { segmentDisplayStatesAtom } from 'src/state/tree.state'

const EXAMPLES = ['arg.nwk', '3_seg.nwk', 'different_roots.nwk', 'singletons.nwk', 'small_arg.nwk']

export function MainPage() {
  const { t } = useTranslationSafe()
  const [graph, setGraph] = useState<GraphRaw | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  const resetSegmentDisplayStates = useResetRecoilState(segmentDisplayStatesAtom)

  const removeGraph = useCallback(() => {
    resetSegmentDisplayStates()
    setGraph(undefined)
  }, [resetSegmentDisplayStates])

  const loadGraph = useCallback(
    (content: string) => {
      resetSegmentDisplayStates()
      const graph = parseNwk(content)
      setGraph(graph)
      setError(undefined)
    },
    [resetSegmentDisplayStates],
  )

  const onUpload = useCallback(
    (file: File[]) => {
      readFile(file[0])
        .then((content) => {
          return loadGraph(content)
        })
        .catch((error_) => {
          resetSegmentDisplayStates()
          setGraph(undefined)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/restrict-template-expressions
          setError(`Error: ${error_?.message ?? t('Unknown error')}`)
        })
    },
    [loadGraph, resetSegmentDisplayStates, t],
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
          <div className="d-flex ml-auto">
            <ExamplesSection onExampleClicked={loadGraph} />

            <Button
              className="ml-3"
              color={isNil(graph) ? 'secondary' : 'danger'}
              disabled={isNil(graph)}
              onClick={removeGraph}
            >
              {t('Remove tree')}
            </Button>
          </div>
        </Col>
      </Row>
    </Layout>
  )
}

export interface ExamplesProps {
  onExampleClicked(content: string): void
}

export function ExamplesSection({ onExampleClicked }: ExamplesProps) {
  const { t } = useTranslationSafe()

  const { data } = useQuery<{ name: string; content: string }[]>(['examples'], async () => {
    return concurrent.map(async (example) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const content = await import(`../../../data/${example}`).then((m) => m.default as string)
      return { name: example, content }
    }, EXAMPLES)
  })

  const exampleButtons = useMemo(
    () =>
      data?.map(({ name, content }) => {
        // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
        const onClick = () => onExampleClicked(content)
        return (
          <Button key={name} className="mx-1" color="primary" onClick={onClick}>
            {name}
          </Button>
        )
      }),
    [data, onExampleClicked],
  )

  return (
    <div>
      <h5>{t('Examples:')}</h5>
      {exampleButtons}
    </div>
  )
}
