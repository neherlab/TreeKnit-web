import 'reflect-metadata'

import 'src/styles/global.scss'

import { memoize } from 'lodash'
import React, { Suspense, useMemo } from 'react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { RecoilRoot } from 'recoil'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientConfig, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { I18nextProvider } from 'react-i18next'
import { MDXProvider } from '@mdx-js/react'

import { DOMAIN_STRIPPED } from 'src/constants'
import { theme } from 'src/theme'
import i18n from 'src/i18n/i18n'
import { ErrorPopup } from 'src/components/Error/ErrorPopup'
import { LOADING } from 'src/components/Loading/Loading'
import { SEO } from 'src/components/Common/SEO'
import { Plausible } from 'src/components/Common/Plausible'
import { ErrorBoundary } from 'src/components/Error/ErrorBoundary'
import { PreviewWarning } from 'src/components/Common/PreviewWarning'
import { getMdxComponents } from 'src/components/Common/MdxComponents'

if (process.env.NODE_ENV === 'development') {
  // Ignore recoil warning messages in browser console
  // https://github.com/facebookexperimental/Recoil/issues/733
  const shouldFilter = (args: (string | undefined)[]) =>
    args[0] && typeof args[0].includes === 'function' && args[0].includes('Duplicate atom key')

  const mutedConsole = memoize((console: Console) => ({
    ...console,
    warn: (...args: (string | undefined)[]) => (shouldFilter(args) ? null : console.warn(...args)),
    error: (...args: (string | undefined)[]) => (shouldFilter(args) ? null : console.error(...args)),
  }))
  global.console = mutedConsole(global.console)
}

const REACT_QUERY_OPTIONS: QueryClientConfig = {
  defaultOptions: { queries: { suspense: true, retry: 1 } },
}

export function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = useMemo(() => new QueryClient(REACT_QUERY_OPTIONS), [])

  return (
    <Suspense fallback={LOADING}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RecoilRoot>
          <DndProvider backend={HTML5Backend}>
            <ThemeProvider theme={theme}>
              <MDXProvider components={getMdxComponents}>
                <Plausible domain={DOMAIN_STRIPPED} />
                <I18nextProvider i18n={i18n}>
                  <ErrorBoundary>
                    <SEO />
                    <PreviewWarning />
                    <Component {...pageProps} />
                    <ErrorPopup />
                  </ErrorBoundary>
                </I18nextProvider>
              </MDXProvider>
            </ThemeProvider>
          </DndProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </Suspense>
  )
}

// NOTE: This disables server-side rendering (SSR) entirely
export default dynamic(() => Promise.resolve(MyApp), { ssr: false })
