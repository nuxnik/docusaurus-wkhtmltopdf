import wkhtmltopdf from 'wkhtmltopdf';
import fs from 'fs';

export default class PdfGenerator {

  constructor(args, merger)
  {
    this.merger           = merger;
    this.args             = args;
  }

  async generate(list, filename, toc)
  {
    // get list of files
    const files = fs.readFileSync(list, 'UTF-8').toString().split("\n");
    console.log('Generating single pages ...');

    // collect the single files
    let promises = [];
    let precompiledFiles = [];
    let i = 0;

    // add the toc
    let tocFile = './pdf/toc.pdf';
    precompiledFiles.push(tocFile);
    promises.push(this.generateSingle(toc, tocFile));

    files.forEach((url) => {

      // get precompiled file name and save to array
      let precompiled = filename.replace(/.pdf$/, '.' + i + '.pdf');
      precompiledFiles.push(precompiled);
      i++;
      promises.push(this.generateSingle(url, precompiled));
    })

    // resolve and merge
    Promise.all(promises).then(async() => {
      console.log("Merging pdf files...");
      precompiledFiles.forEach((file) => {
        console.log(file);
        this.merger.add(file);
      });

      // merge into one file
      this.merger.save(filename).then(() => {

        // clean up tmp files
        console.log("cleaning up...");
        precompiledFiles.forEach((file) => {
          fs.unlink(file, (err) => {
            if (err) {
                throw err;
            }
          })
        })
      })
    })
  }

  generateSingle(url, filename) 
  {
    // generate pdf
    let stream = fs.createWriteStream(filename);
    return new Promise((resolve, reject) => {
      wkhtmltopdf(url, {userStyleSheet: './print.css', marginTop: 15, marginRight: 15, marginBottom: 15, marginLeft: 15}).pipe(
        fs.createWriteStream(filename)
        .on('finish', () => {
          console.log("Created:" + filename); 
          resolve()
        })
      );
    });
  }
}
