#!/usr/bin/env node

// import modules
import Cli from './src/Cli.js';
import Crawler from './src/Crawler.js';
import PDFMerger from 'pdf-merger-js';
import PdfGenerator from './src/PdfGenerator.js';
import commandExists from 'command-exists';
import fs from 'fs';

// get the arguments
const argv = Cli.argv;

// parse the url
const url = Cli.argv.url?.replace(/\/$/, '') || 'https://docusaurus.io/docs';

// Output file
argv.dest          = argv.dest || process.cwd() + '/pdf';
const parsedUrl    = new URL(url);
const baseUrl      = parsedUrl.origin;
const scope        = parsedUrl.pathname;
const scopeName    = scope !== '/' ? `-${scope.replace(/\/$/, '').replace(/^\//, '').replace(/\//, '-')}` : '';
const listFile     = argv.file || `${argv.dest}/${parsedUrl.hostname}${scopeName}.txt`;
const pdfFile      = argv.output || `${argv.dest}/${parsedUrl.hostname}${scopeName}.pdf`;
const merger       = new PDFMerger();
const pdfGenerator = new PdfGenerator(merger);
const crawler      = new Crawler(pdfGenerator, parsedUrl, listFile, pdfFile);

// do a sanity check for required software
let commands = [
    'wkhtmltopdf',
];

if (argv.compress) {
  commands.push('gs')
}

let promises = [];
commands.forEach((command) => {
    promises.push(commandExists(command));
});

Promise.all(promises).then(() => {

  // All is good. Make output folder
  !fs.existsSync(argv.dest) && fs.mkdirSync(argv.dest);

  if (argv.pdfOnly) {

    // generate the pdf without crawling
    pdfGenerator.generate(listFile, pdfFile);
  } else {

    // crawl the starting page
    crawler.requestPage(`${baseUrl}${scope}`);
  }
}).catch(err => {

  // throw error and exit
  console.log(`Error: the following software must be installed on this machine: ` + commands);
  console.log(err);
  process.exit(11);
});
