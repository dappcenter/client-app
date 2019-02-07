FROM node:11.9.0-alpine

ADD ./dist/ssr-mat /app
WORKDIR /app
RUN npm install
CMD ["node","/app/index.js"]
