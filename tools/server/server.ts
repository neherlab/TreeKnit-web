/**
 * Serves production build artifacts.
 *
 * /!\ Only for development purposes, e.g. verifying that production build runs
 * on developer's machine.
 *
 * This server is very naive, slow and insecure. Real-world deployments should
 * use either a 3rd-party static hosting or a robust static server, such as
 * Nginx, instead.
 *
 */

import type { ServerResponse } from 'http'
import path from 'path'
import express, { Request, Response } from 'express'
import allowMethods from 'allow-methods'
import compression from 'compression'
import morgan from 'morgan'
import expressStaticGzip from 'express-static-gzip'

import { getenv } from '../../lib/getenv'
import { findModuleRoot } from '../../lib/findModuleRoot'

const { moduleRoot } = findModuleRoot()

const buildDir = path.join(moduleRoot, '.build', 'production', 'web')
const nextDir = path.join(buildDir, '_next')
const NOT_FOUND_HTML = path.join(buildDir, '404.html')

const expressStaticGzipOptions = { enableBrotli: true, serveStatic: { extensions: ['html'] } }

const cacheNone = {
  ...expressStaticGzipOptions,
  serveStatic: {
    ...expressStaticGzipOptions.serveStatic,
    setHeaders: (res: ServerResponse) => res.setHeader('Cache-Control', 'no-cache'),
  },
}
const cacheOneYear = {
  ...expressStaticGzipOptions,
  serveStatic: {
    ...expressStaticGzipOptions.serveStatic,
    maxAge: '31556952000',
    immutable: true,
  },
}

function notFound(req: Request, res: Response) {
  res.status(404)
  res.format({
    html() {
      res.sendFile(NOT_FOUND_HTML)
    },
    json() {
      res.json({ error: 'Not found' })
    },
    default() {
      res.type('txt').send('Not found')
    },
  })
}

function main() {
  const app = express()

  app.use(morgan('dev'))
  app.use(compression())
  app.use(allowMethods(['GET', 'HEAD']))
  app.use('/_next', expressStaticGzip(nextDir, cacheOneYear))
  app.use(expressStaticGzip(buildDir, cacheNone))
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache')
    res.sendFile(path.join(buildDir, 'index.html'))
    next()
  })
  app.use(notFound)

  const port = getenv('WEB_PORT_PROD')
  app.listen(port, () => {
    console.info(`Server is listening on port ${port}`)
  })
}

main()
