# Docusaurus PDF Generator Using WKHTMLTOPDF

[![npm version](https://img.shields.io/npm/v/docusaurus-wkhtmltopdf.svg?style=flat)](https://www.npmjs.com/package/docusaurus-wkhtmltopdf)

Extract rendered data from Docusaurus and generate PDF, the hard way. Note that this software requires that [Wkhtmltopdf](https://wkhtmltopdf.org) and [Ghostscript](https://www.ghostscript.com/) is installed and reachable in your PATH variable. NOTE: [Ghostscript](https://www.ghostscript.com/) is optional and should only be installed if you wish to compress the generated PDF files.

## Command Help

```
Options:
      --version           Show version number                          [boolean]
  -u, --url               Base URL, should be the baseUrl of the Docusaurus inst
                          ance (e.g. https://docusaurus.io/docs/)       [string]
  -s, --selector          CSS selector to find the link of the next page[string]
  -d, --dest              Working directory. Default to ./pdf           [string]
  -f, --file              Change default list output filename           [string]
  -o, --output            Change PDF output filename                    [string]
      --include-index     Include / (passed URL) in generated PDF
      --prepend           Prepend additional pages, split with comma    [string]
      --append            Append additional pages, split with comma     [string]
      --wkhtmltopdf-args  Additional options for wkhtmltopdf            [string]
      --list-only         Fetch list without generating PDF
      --pdf-only          Generate PDF without fetching list. Ensure list exists
      --toc               Generate the PDF with a table of contents
      --compress          Compress the output file. REQUIRES ghostscript!
  -h, --help              Show help                                    [boolean]
```

## Standard Usage

If you would prefer to skip installation of node, wkhtmltopdf and ghostscript on your machine see [Docker Installation](#docker-usage)

Before getting started, install [Wkhtmltopdf](https://wkhtmltopdf.org). [Ghostscript](https://www.ghostscript.com/) is optional.

Run the following commands to generate the PDF:

```bash
# Genrate PDF from specific site under `docs` scope
npx docusaurus-wkhtmltopdf -u https://https://docusaurus.io/docs

# Change generating scope to `/docs/xxx/`
npx docusaurus-wkhtmltopdf -u https://https://docusaurus.io/docs/xxx

# Custom working (output) directory
npx docusaurus-wkhtmltopdf -u https://https://docusaurus.io/docs --dest ./pdf-output

# Custom output file name
npx docusaurus-wkhtmltopdf -u https://https://docusaurus.io/docs --output docs.pdf

# Compress the PDF file
npx docusaurus-wkhtmltopdf -u https://https://docusaurus.io/docs --compress
```

To generate PDF from a local Docusaurus instance. You need to first build the site locally:

```bash
# Build the site
yarn build

# Serve built site locally
yarn serve

# Generate PDF from local Docusaurus instance
npx docusaurus-wkhtmltopdf -u http://localhost:4000/docs # Change port to your serving port
```

See help screen for more usages:

```bash
npx docusaurus-wkhtmltpdf -h
```

## Docker Usage

The docker image comes with a working environment so no other external software is needed.

Run the following commands to generate your desired PDF:

NOTE: the generated pdfs are saved to /d2p/pdf in the container.

```bash
# Generate PDF from specific site under `docs` scope 
docker run --rm -v /tmp/pdf:/d2p/pdf nuxnik/docusaurus-to-pdf -u https://https://docusaurus.io/docs

# Change generating scope to `/docs/xxx/`
docker run --rm -v /tmp/pdf:/d2p/pdf nuxnik/docusaurus-to-pdf -u https://https://docusaurus.io/docs/xxx

# Custom working (output) directory
docker run --rm -v /tmp/pdf:/d2p/pdf nuxnik/docusaurus-to-pdf -u https://https://docusaurus.io/docs --dest ./pdf-output

# Custom output file name
docker run --rm -v /tmp/pdf:/d2p/pdf nuxnik/docusaurus-to-pdf -u https://https://docusaurus.io/docs --output docs.pdf

# Compress the PDF file
docker run --rm -v /tmp/pdf:/d2p/pdf nuxnik/docusaurus-to-pdf -u https://https://docusaurus.io/docs --compress

# Add a rudmentary table of contents
docker run --rm -v /tmp/pdf:/d2p/pdf nuxnik/docusaurus-to-pdf -u https://https://docusaurus.io/docs --toc
```

## How it works

Like [mr-pdf](https://github.com/kohheepeace/mr-pdf), this package looks for the next pagination links on generated Docusaurus site. Collect them in a list and then pass the list to wkhtmltopdf to generate the PDF.

You can specify the CSS selector if you're using a custom Docusaurus theme:

```bash
npx docusaurus-wkhtmltopdf -u https://https://docusaurus.io/docs --selector 'nav.custom-pagination-item--next > a'
```
