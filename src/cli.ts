#!/usr/bin/env node

import docopt from 'docopt'
import hq from './hq.js'

const docs = `
Name:
  hq - commandline HTTP processor

Usage:
  hq ls [<url>]
  hq <selector> [<url>]

Description:
  hq selects HTML content using a standard JS selector and returns matching content in JSON format. This includes both the
  element's text-content and any HTML attributes that were set.

Options:
  <selector>    a valid JS element selector.
  <url>         a URL to open directly via puppeteer. Optional. By default, stdin receives HTML from another tool.

Examples:
  hq 'p'
  hq 'div.user-panel:not(.main)'
`

const cli = () => {
  const args = docopt.docopt(docs, {})
  hq(args)
}

cli()
