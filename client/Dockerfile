FROM node:20-alpine AS BUILD

WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm i

COPY . .
RUN npm run build


FROM nginx:stable-alpine
COPY --from=BUILD /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]