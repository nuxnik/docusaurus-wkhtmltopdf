import wkhtmltopdf from 'wkhtmltopdf';
import fs from 'fs';

export default class PdfGenerator {

  constructor(args, merger)
  {
    this.merger           = merger;
    this.args             = args;
    this.precompiledFiles = [];
    this.i                = 0;
  }

  generate(list, filename)
  {
    // get list of files
    const that  = this;
    const files = fs.readFileSync(list, 'UTF-8').toString().split("\n");
    console.log(`Generating single pages ...`);
    Promise.all(
      files.map((url) => {
        that.generateSingle(url, filename).then();
      })
    ).then(() => {
      return that.merge(filename);
    });
  }

  generateSingle(url, filename) {

    // get precompiled file name and save to array
    let precompiled = filename.replace(/.pdf$/, '.' + this.i + '.pdf');
    this.precompiledFiles.push(precompiled);
    this.i++;

    // generate pdf
    return wkhtmltopdf(url, {
      output : precompiled
    });
  }

  merge(filename) {

    let that = this;
    Promise.all(
      this.precompiledFiles.map((file) => {
        that.merger.add(file);
      })
    ).then(() => {
      return that.merger.save(filename)
        .then(() => {
          return Promise.all(
            this.precompiledFiles.map((file) => {
              // delete files
              fs.unlink(file, (err) => {
                if (err) {
                  throw err;
                }
              });
            })
          )
      });
    });
  }
}
