FROM node:12-alpine AS BUILD_IMAGE

WORKDIR /app

COPY . ./

EXPOSE 3000

RUN npm install

RUN npm prune --production

FROM node:12-alpine

WORKDIR /app

COPY --from=BUILD_IMAGE /app ./

ENV PORT=3000

ENV DATABASE_NAME='qa'

ENV CONNECTION_URL=mongodb://appUser:ikea_bird_calls@172.31.35.247:27017

EXPOSE 3000

CMD [ "node", "src/app.js"]