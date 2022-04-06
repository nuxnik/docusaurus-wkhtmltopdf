import got from 'got';
import jsdom from 'jsdom';
import Cli from './Cli.js';
import fs from 'fs';

const { JSDOM } = jsdom;

export default class Crawler
{
  constructor(pdfGenerator, url, listFile, pdfFile)
  {
    this.listFile     = listFile;
    this.pdfFile      = pdfFile;
    this.pdfGenerator = pdfGenerator;
    this.buffer       = new Set();
    this.baseUrl      = url.origin;
    this.scope        = url.pathname;
    this.tocHTML      = '<h1>Table of Contents</h1>';
  }

  async requestPage(url) {
    await got(url).then(resp => {
      this.buffer.add(url);
      const dom = new JSDOM(resp.body);
      const nextLinkEl = dom.window.document.querySelector(Cli.argv.selector || '.pagination-nav__item--next > a');
      const toc = dom.window.document.querySelectorAll('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
      toc.forEach( item => {
        this.tocHTML += '<h2>' + item.innerHTML + '</h2>';
      })

      if (nextLinkEl) {
        const nextLink = `${this.baseUrl}${nextLinkEl.href}`;
        console.log(`Got link: ${nextLink}`);

        this.buffer.add(nextLink);
        this.requestPage(nextLink);
      } else {
        console.log('No next link found!');

        if (Cli.argv.append) {
          Cli.argv.append.split(',').map(item => {
            const url = item.match(/^https?:\/\//) ? item : `${this.baseUrl}${this.scope}${item}`;
            this.buffer.add(url);
            console.log(`Got link: ${url} [append]`);
          });
        }

        if (this.buffer.size > 0) {
          fs.writeFileSync(this.listFile, [...this.buffer].join('\n'), async err => {
            console.log(`Writing buffer (${this.buffer.size} links) to ${this.listFile}`);
            if (err) {
              console.error(err);
              return;
            }
          });
          if (!Cli.argv.listOnly) {
            this.pdfGenerator.generate(this.listFile, this.pdfFile, this.tocHTML);
          }
        } else {
          console.log('No buffer to write!');
        }
      }
    }).catch(err => {
      console.log(`Error:`, err);
    });
  }
}
