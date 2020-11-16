import docopt from 'docopt';
import hq from './hq.js';
const docs = `
Name:
  hq - commandline HTTP processor
Usage:
  hq <selector> [--all]
Description:
  hq
`;
const cli = () => {
    const args = docopt.docopt(docs, {});
    hq(args);
};
cli();
