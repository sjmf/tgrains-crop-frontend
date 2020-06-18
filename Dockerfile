FROM node:12-alpine as build

# Based on https://cli.vuejs.org/guide/deployment.html#docker-nginx
MAINTAINER Samantha Finnigan

WORKDIR /usr/src/app
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY ./ .
RUN npm run build

# Deploy
FROM nginx:alpine as production

COPY --from=build /usr/src/app/dist /var/www/html/
COPY ./conf/subsite.conf /etc/nginx/conf.d/default.conf
