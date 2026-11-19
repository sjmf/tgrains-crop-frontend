FROM node:26-alpine AS build
LABEL maintainer="Samantha Finnigan"

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# To enable versionHash reloading of Vuex state
# Build using `docker build --build-arg VUE_APP_GIT_HASH=$(git rev-parse --short HEAD) .`
# Or with docker-compose: https://stackoverflow.com/a/50734388/1681205
ARG VUE_APP_GIT_HASH
ENV VUE_APP_GIT_HASH=${VUE_APP_GIT_HASH}

# Copy files and build app
COPY ./ .
RUN npm run build

# Deploy
FROM nginx:1.31.9-alpine AS production

COPY --from=build /usr/src/app/dist /var/www/html/
COPY ./conf/subsite.conf /etc/nginx/conf.d/default.conf
