import React, { PropsWithChildren, HTMLProps } from 'react'
import styled from 'styled-components'
import { Container as ContainerBase } from 'reactstrap'

import { NavigationBar } from './NavigationBar'
import { Footer, PAGE_FOOTER_HEIGHT } from './Footer'

export const Container = styled(ContainerBase)`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: scroll;
`

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 0.5em;
  margin-bottom: ${PAGE_FOOTER_HEIGHT + 12}px;
`

export function Layout({ children }: PropsWithChildren<HTMLProps<HTMLDivElement>>) {
  return (
    <Container fluid>
      <NavigationBar />

      <MainContent>{children}</MainContent>

      <Footer />
    </Container>
  )
}
