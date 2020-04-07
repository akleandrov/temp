FROM node:13
WORKDIR /usr/src/app
ENV TINI_VERSION='v0.18.0'
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
COPY package*.json ./
RUN npm i --production=true &&   chmod +x /tini
COPY . .
ENTRYPOINT ["/tini", "--"]
CMD ["node", "src/index.js" ]