# Docusaurus PDF Generator Using WKHTMLTOPDF

Note: This is a fork and complete re-write of [docusaurus-prince-pdf](https://github.com/signcl/docusaurus-prince-pdf). It has been re-purposed to use wkhtmltopdf instead of Prince PDF. This project is a work in progress, use at your own discretion!

[![npm version](https://img.shields.io/npm/v/docusaurus-wkhtmltopdf.svg?style=flat)](https://www.npmjs.com/package/docusaurus-wkhtmltopdf)

Extract rendered data from Docusaurus and generate PDF, the hard way

## Usage

Install [Wkhtmltopdf](https://wkhtmltopdf.org) first.

Run the following commands to generate PDF:

```bash
# Genrate PDF from specific site under `docs` scope
npx docusaurus-wkhtmltopdf -u https://meshtastic.org/docs/getting-started

# Change generating scope to `/docs/xxx/`
npx docusaurus-wkhtmltopdf -u https://meshtastic.org/docs/xxx

# Custom working (output) directory
npx docusaurus-wkhtmltopdf -u https://meshtastic.org/docs/getting-started --dest ./pdf-output

# Custom output file name
npx docusaurus-wkhtmltopdf -u https://meshtastic.org/docs/getting-started --output docs.pdf
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

## How it works

Like [mr-pdf](https://github.com/kohheepeace/mr-pdf), this package looks for the next pagination links on generated Docusaurus site. Collect them in a list and then pass the list to wkhtmltopdf to generate the PDF.

You can specify the CSS selector if you're using custom Docusaurus theme:

```bash
npx docusaurus-wkhtmltopdf -u https://meshtastic.org/docs/getting-started --selector 'nav.custom-pagination-item--next > a'
```
