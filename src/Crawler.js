// import modules
import Cli from './Cli.js';
import fs from 'fs';
import got from 'got';
import { JSDOM } from 'jsdom';

/**
 * Crawl a docusaurus URL and scrape the data
 */
export default class Crawler
{
  /**
   * The class constructor
   *
   * @param PdfGenerator pdfgenerator The pdfgenerator object
   * @param string listFile The file containing the urls the scrape
   * @param string pdfFile The pdf file to output the data to
   */
  constructor(pdfGenerator, url, listFile, pdfFile)
  {
    this.listFile     = listFile;
    this.pdfFile      = pdfFile;
    this.pdfGenerator = pdfGenerator;
    this.buffer       = new Set();
    this.baseUrl      = url.origin;
    this.scope        = url.pathname;
    this.tocHTML      = '<h1>Table of Contents</h1>';

    // prepend urls to crawler
    if (Cli.argv.prepend) {
      Cli.argv.prepend.split(',').map(item => {
        const url = item.match(/^https?:\/\//) ? item : `${this.baseUrl}${this.scope}${item}`;
        this.buffer.add(url);
        console.log(`Got link: ${url} [prepend]`);
      });
    }

    // include index
    if (Cli.argv.includeIndex) {
      console.log(`Got link: ${this.baseUrl}${this.scope} [index]`);
      this.buffer.add(`${this.baseUrl}${this.scope}`);
    }
  }

  /**
   * Make a request to the page and scrape the data
   *
   * @param string url The url to scrape
   */
  async requestPage(url) {

    // get the URL
    await got(url).then(resp => {

      // add the initial url to the buffer
      this.buffer.add(url);

      // read the DOM data from the response
      const dom = new JSDOM(resp.body);

      // get the next page
      const nextLinkEl = dom.window.document.querySelector(Cli.argv.selector || '.pagination-nav__link--next');

      // Get the header tags from the source and add the HTML
      if (Cli.argv.toc) {
        const toc = dom.window.document.querySelectorAll('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
        toc.forEach( item => {

          // TODO - separate this into a template file
          this.tocHTML += '<h2>' + item.innerHTML + '</h2>';
        })
      } else {
        this.tocHTML = '';
      }

      if (nextLinkEl) {
        const nextLink = `${this.baseUrl}${nextLinkEl.href}`;
        console.log(`Got link: ${nextLink}`);
        if (!this.buffer.has(nextLink)) {
          this.buffer.add(nextLink);
          this.requestPage(nextLink);
        } else {
          this.genDoc(url);
        }
      } else {
        this.genDoc(url);
      }
    }).catch(err => {
      console.log(`Error:`, err);
    });

    return this;
  }

  genDoc(url)
  {
    console.log('No next link found!');

    // append additional urls
    if (Cli.argv.append) {
      Cli.argv.append.split(',').map(item => {
        const url = item.match(/^https?:\/\//) ? item : `${this.baseUrl}${this.scope}${item}`;
        this.buffer.add(url);
        console.log(`Got link: ${url} [append]`);
      });
    }

    // write the data buffer to the list file
    if (this.buffer.size > 0) {
      fs.writeFileSync(this.listFile, [...this.buffer].join('\n'), async err => {
        console.log(`Writing buffer (${this.buffer.size} links) to ${this.listFile}`);
        if (err) {
          console.error(err);
          return;
        }
      });

      // generate the PDF
      if (!Cli.argv.listOnly) {
        this.pdfGenerator.generate(this.listFile, this.pdfFile, this.tocHTML);
      }
    } else {
      console.log('No buffer to write!');
    }

  }
}
