//import libraries
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

/**
 * configure the cli options
 */
export default class Cli
{
  /**
   * Parse all arguments
   */
  static argv = yargs(hideBin(process.argv))
    .option('url', {
      alias: 'u',
      description: 'Base URL, should be the baseUrl of the Docusaurus instance (e.g. https://docusaurus.io/docs/)',
      type: 'string',
    })
    .option('selector', {
      alias: 's',
      description: 'CSS selector to find the link of the next page',
      type: 'string',
    })
    .option('dest', {
      alias: 'd',
      description: 'Working directory. Default to ./pdf',
      type: 'string',
    })
    .option('file', {
      alias: 'f',
      description: 'Change default list output filename',
      type: 'string',
    })
    .option('output', {
      alias: 'o',
      description: 'Change PDF output filename',
      type: 'string',
    })
    .option('include-index', {
      description: 'Include / (passed URL) in generated PDF',
      type: 'bolean',
    })
    .option('prepend', {
      description: 'Prepend additional pages, split with comma',
      type: 'string',
    })
    .option('append', {
      description: 'Append additional pages, split with comma',
      type: 'string',
    })
    .option('wkhtmltopdf-args', {
      description: 'Additional options for wkhtmltopdf',
      type: 'string',
    })
    .option('list-only', {
      description: 'Fetch list without generating PDF',
      type: 'bolean',
    })
    .option('pdf-only', {
      description: 'Generate PDF without fetching list. Ensure list exists',
      type: 'bolean',
    })
    .help()
    .alias('help', 'h')
    .argv;
}
