// import modules
import Cli from './Cli.js';
import fs from 'fs';
import gs from 'node-gs';
import wkhtmltopdf from 'wkhtmltopdf';
import log from './tools.js';

/**
 * Generate a PDF
 */
export default class PdfGenerator {

  /**
   * The class constructor
   *
   * @param PDFMerger merger The PDFMerger object 
   */
  constructor(merger)
  {
    this.merger = merger;
  }

  /**
   * Generate multiple pdf files and merge them into one
   *
   * @param string list The file containg the URLs to include in the PDF
   * @param string filename The output file name
   * @param string toc The HTML for the table of contents
   */
  generate(list, filename, toc)
  {
    // get list of files
    log('Generating single pages ...');
    const files          = fs.readFileSync(list, 'UTF-8').toString().split("\n");
    let promises         = [];
    let precompiledFiles = [];
    let i                = 0;

    // add the toc to the PDF
    if (Cli.argv.toc) {
      let tocFile = Cli.argv.dest + '/toc.pdf';
      precompiledFiles.push(tocFile);
      promises.push(this.generateSingle(toc, tocFile));
    }

    // iterate the urls and generate single PDFs
    files.forEach((url) => {

      // get precompiled file name and save to array
      let precompiled = filename.replace(/.pdf$/, '.' + i + '.pdf');
      precompiledFiles.push(precompiled);
      i++;
      promises.push(this.generateSingle(url, precompiled));
    })

    // resolve all the promises then merge the files into one
    Promise.all(promises).then(() => {
      log("Merging pdf files ...");
      precompiledFiles.forEach((file) => {
        this.merger.add(file);
      });

      // merge into one file
      this.merger.save(filename).then(() => {

        this.compressFile(filename).then(() => {

          // clean up tmp files
          log("cleaning up temporary files ...");
          //precompiledFiles.push(list);
          precompiledFiles.forEach((file) => {
            fs.unlink(file, (err) => {
              if (err) {
                  throw err;
              }
            })
          });

          // stream the file
          if (Cli.argv.stdout) {
            this.streamFile(filename);
          }
        });
      });
    })

    return this;
  }

  /**
   * Generate a single PDF file
   * 
   * @param string url The URL to scrape the data from.
   * @param string filename The filename of the PDF which will contain the data
   */
  generateSingle(url, filename) 
  {
    // wrap PDF maker in a promise
    return new Promise((resolve, reject) => {

      // TODO make options configurable from external arguments
      wkhtmltopdf(url, {userStyleSheet: 'file://' + process.cwd() + '/print.css', marginTop: 15, marginRight: 15, marginBottom: 15, marginLeft: 15}).pipe(
        fs.createWriteStream(filename)
        .on('finish', () => {
          //log("Created:" + filename); 
          resolve()
        })
      );
    });

    return this;
  }

  /**
   * compress the pdf file
   * @param string filename The filename of the PDF which will be compressed
   */
  compressFile(filename)
  {
    let newFilename = filename.replace(/.pdf$/, '-compressed.pdf');

    // compress the document
    return new Promise((resolve, reject) => {
      if (Cli.argv.compress) {
        log("Compressing file " + filename + ' ...'); 
        gs()
          .device( 'pdfwrite' )
          .option( '-dCompatibilityLevel=1.4' )
          .option( '-dPDFSETTINGS=/ebook' )
          .nopause()
          .quiet()
          .batch()
          .input( filename )
          .output( newFilename )
          //.executablePath( 'ghostscript/bin/./gs' )
          .exec( ( error, stdout, stderr ) => {
            if ( error ) {
              reject("Failed: compression process failed");
            } else {
              resolve("Success: compression complete");
            }
          });
      } else {
        resolve("Skipping compression");
      }
    });
  }

  /**
   * Stream the file to std output
   *
   * @param string filename The filename of the PDF which will be compressed
   */
  async streamFile(filename)
  {
    if (Cli.argv.stdout) {
      await fs.createReadStream(filename).pipe(process.stdout)
    }
  }
}
