
import docopt from 'docopt'
import hq from './hq.js'

const docs = `
Name:
  hq - commandline HTTP processor

Usage:
  hq <selector>
Description:
  hq selects HTML content using a standard JS selector and returns matching content in JSON format. This includes both the
  element's text-content and any HTML attributes that were set.

Examples:
  hq 'p'
  hq 'div.user-panel:not(.main)'
`

const cli = () => {
  const args = docopt.docopt(docs, {})
  hq(args)
}

cli()
