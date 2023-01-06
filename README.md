# Docusaurus PDF Generator Using WKHTMLTOPDF

[![npm version](https://img.shields.io/npm/v/docusaurus-wkhtmltopdf.svg?style=flat)](https://www.npmjs.com/package/docusaurus-wkhtmltopdf)

Extract rendered data from Docusaurus and generate PDF, the hard way. Please note that [Wkhtmltopdf](https://wkhtmltopdf.org) and [Ghostscript](https://www.ghostscript.com/) must be installed and reachable in your PATH variable for this software to work. However, [Ghostscript](https://www.ghostscript.com/) is optional and is only required if you wish to compress the generated PDF files.

## Command Help

This project offers the following options and flags:
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
      --stdout            Stream PDF to stdout
      --quiet             silence console output.
  -h, --help              Show help                                    [boolean]
```

## Standard Usage

Before getting started, install [Wkhtmltopdf](https://wkhtmltopdf.org). [Ghostscript](https://www.ghostscript.com/) is optional. If you prefer to skip installation of node, wkhtmltopdf and ghostscript on your machine see [Docker Usage](#docker-usage) below.

Here are a few examples of this software in action. Run the following commands to generate your PDFs:

```bash
# Genrate PDF from specific site under `docs` scope
npx docusaurus-wkhtmltopdf -u https://https://docusaurus.io/docs

# Example with more flags: create table of contents, compress the file, and pipe to stdout
npx docusaurus-wkhtmltopdf -u https://https://docusaurus.io/docs --compress --toc --stdout > documentation.pdf
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

## Docker Usage

The docker image comes with a working environment so no other external software is needed. Here are a few examples of this software in action. Run the following commands to generate your desired PDF:

```bash
# Generate PDF from specific site under `docs` scope. Please note that the folder with the generated file can be found in /tmp/pdf
docker run --rm -v /tmp/pdf:/d2p/pdf nuxnik/docusaurus-to-pdf -u https://https://docusaurus.io/docs

# Let's use some more flags: create table of contents, compress the file, and pipe from stdout to documentation.pdf
docker run --rm nuxnik/docusaurus-to-pdf -u https://https://docusaurus.io/docs --toc --compress --stdout > documentation.pdf
```

## Modifications

Like [mr-pdf](https://github.com/kohheepeace/mr-pdf), this package looks for the next pagination links on generated Docusaurus site. Collect them in a list and then pass the list to wkhtmltopdf to generate the PDF. You can specify the CSS selector if you're using a custom Docusaurus theme:

```bash
npx docusaurus-wkhtmltopdf -u https://https://docusaurus.io/docs --selector 'nav.custom-pagination-item--next > a'
```
You can also customize the CSS of the pages which are scraped by the crawler by modifying "print.css" file located in the project root. This CSS file is applied to the pages before being processed through Wkhtmltopdf. Depending on how this file is modified, will change the overall look of the generated PDF file.
