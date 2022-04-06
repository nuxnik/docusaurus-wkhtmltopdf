// import modules
import fs from 'fs';
import wkhtmltopdf from 'wkhtmltopdf';

/**
 * Generate a PDF
 */
export default class PdfGenerator {

  /**
   * The class constructor
   *
   * @param array args The CLI arguments
   * @param PDFMerger merger The PDFMerger object 
   */
  constructor(args, merger)
  {
    this.merger = merger;
    this.args   = args;
  }

  /**
   * Generate multiple pdf files and merge them into one
   *
   * @param string list The file containg the URLs to include in the PDF
   * @param string filename The output file name
   * @param string toc The HTML for the table of contents
   */
  async generate(list, filename, toc)
  {
    // get list of files
    console.log('Generating single pages ...');
    const files          = fs.readFileSync(list, 'UTF-8').toString().split("\n");
    let promises         = [];
    let precompiledFiles = [];
    let i                = 0;

    // add the toc to the PDF
    let tocFile = this.args.dest + '/toc.pdf';
    precompiledFiles.push(tocFile);
    promises.push(this.generateSingle(toc, tocFile));

    // iteratr the urls and generate single PDFs
    files.forEach((url) => {

      // get precompiled file name and save to array
      let precompiled = filename.replace(/.pdf$/, '.' + i + '.pdf');
      precompiledFiles.push(precompiled);
      i++;
      promises.push(this.generateSingle(url, precompiled));
    })

    // resolve all the promises then merge the files into one
    Promise.all(promises).then(() => {
      console.log("Merging pdf files ...");
      precompiledFiles.forEach((file) => {
        this.merger.add(file);
      });

      // merge into one file
      this.merger.save(filename).then(() => {

        // clean up tmp files
        console.log("cleaning up temporary files ...");
        precompiledFiles.push(list);
        precompiledFiles.forEach((file) => {
          fs.unlink(file, (err) => {
            if (err) {
                throw err;
            }
          })
        })
      })

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
    // generate pdf
    let stream = fs.createWriteStream(filename);

    // wrap PDF maker in a promise
    return new Promise((resolve, reject) => {

      // TODO make options configurable from external arguments
      wkhtmltopdf(url, {userStyleSheet: './print.css', marginTop: 15, marginRight: 15, marginBottom: 15, marginLeft: 15}).pipe(
        fs.createWriteStream(filename)
        .on('finish', () => {
          //console.log("Created:" + filename); 
          resolve()
        })
      );
    });

    return this;
  }
}
