#!/usr/bin/env node

// import modules
import Cli from './src/Cli.js';
import Crawler from './src/Crawler.js';
import PDFMerger from 'pdf-merger-js';
import PdfGenerator from './src/PdfGenerator.js';
import fs from 'fs';

// get the arguments
const argv = Cli.argv;

// parse the url
const url = Cli.argv.url?.replace(/\/$/, '') || 'https://meshtastic.org/docs/getting-started';

// Output file
argv.dest          = argv.dest || './pdf';
const parsedUrl    = new URL(url);
const baseUrl      = parsedUrl.origin;
const scope        = parsedUrl.pathname;
const scopeName    = scope !== '/' ? `-${scope.replace(/\/$/, '').replace(/^\//, '').replace(/\//, '-')}` : '';
const listFile     = argv.file || `${argv.dest}/${parsedUrl.hostname}${scopeName}.txt`;
const pdfFile      = argv.output || `${argv.dest}/${parsedUrl.hostname}${scopeName}.pdf`;
const merger       = new PDFMerger();
const pdfGenerator = new PdfGenerator(merger);
const crawler      = new Crawler(pdfGenerator, parsedUrl, listFile, pdfFile);

// make output folder
!fs.existsSync(argv.dest) && fs.mkdirSync(argv.dest);

// generate the pdf
if (argv.pdfOnly) {
  pdfGenerator.generate(listFile, pdfFile);
} else {

  // prepend urls to crawler
  if (argv.prepend) {
    argv.prepend.split(',').map(item => {
      const url = item.match(/^https?:\/\//) ? item : `${baseUrl}${scope}${item}`;
      buffer.add(url);
      console.log(`Got link: ${url} [prepend]`);
    });
  }

  if (argv.includeIndex) {
    console.log(`Got link: ${baseUrl}${scope} [index]`);
    buffer.add(`${baseUrl}${scope}`);
  }

  // crawl the starting page
  crawler.requestPage(`${baseUrl}${scope}`);
}
