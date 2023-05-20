FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

# CHANGE
ENV HOST='0.0.0.0'
ENV PORT='8081'
EXPOSE 8081

ENTRYPOINT ["node", ".output/server/index.mjs"]
