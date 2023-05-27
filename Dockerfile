# 1. Build the app using build env
FROM node:latest AS build-env
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install -g pnpm
RUN pnpm install -P --frozen-lockfile
RUN pnpm build

# 1. Build the app using minimal alpine env
FROM node:lts-alpine
ENV NODE_ENV prod

WORKDIR /usr/src/app

USER node
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
CMD [ "node", "dist/main.js" ]