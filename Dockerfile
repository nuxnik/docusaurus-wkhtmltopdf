FROM surnet/alpine-wkhtmltopdf:3.16.2-0.12.6-small

# install extra dependencies
RUN apk add --no-cache \
  ghostscript \
  git \
  bash \
  yarn

# Install and build the project
RUN git clone https://github.com/nuxnik/docusaurus-wkhtmltopdf /d2p
WORKDIR /d2p
RUN yarn install

# Set the entry point
ENTRYPOINT ["/usr/bin/node", "index.js"]
