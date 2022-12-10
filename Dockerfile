#FROM icr.io/codeengine/node:12-alpine
FROM node:16-alpine
COPY package.json .
RUN npm install
RUN mkdir public
COPY public/ public/
COPY server.js .
COPY tracer.js .
EXPOSE 8080
CMD [ "node", "--require ./tracer.js", "server.js" ]
