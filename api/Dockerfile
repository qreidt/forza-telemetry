FROM node:20-alpine AS BUILD

WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci --loglevel=error

COPY . .
RUN npm run build

FROM node:20-alpine

ARG APP_KEY=uI0h9k1IRD3LryoM53ieoYxU6aZ2VY1U
RUN apk --no-cache add dumb-init

EXPOSE 3333
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3333
ENV APP_KEY=$APP_KEY
ENV DB_CONNECTION=sqlite
ENV DRIVE_DISK=local
ENV MONGO_DB_URI="mongodb://localhost:27017"

WORKDIR /app

COPY --from=BUILD /app/build .
RUN npm ci --omit=dev --loglevel=error

RUN mkdir ./tmp && touch ./tmp/db.sqlite3
RUN node ace migration:run --force

CMD ["dumb-init", "node", "server.js"]
