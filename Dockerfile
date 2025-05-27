FROM node:20 as builder

RUN npm i -g pnpm

ADD ./ /app
WORKDIR /app

RUN pnpm i
RUN pnpm build:nuxt


FROM node:20-slim

RUN mkdir /app
COPY --from=builder /app/server/nuxt3/.output /app/
WORKDIR /app

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "/app/server/index.mjs"]

