# crop-frontend

## Full documentation on this system can be found at https://tgrains.bitbucket.io/

This repository contains the frontend code for the TGRAINS Crop Modelling tool.

The frontend is written in [vue.js](https://vuejs.org/), using the [Vuex](https://vuex.vuejs.org/) state management pattern. REST API calls are handled using [Axios](https://github.com/axios/axios).


## Developing

First step is to install the NPM dependencies. Use this command: 

```
npm install
```


### Building for development
`npm run serve` will run a development server which supports hot code reloading. Set the following environment variable to tell the app to override the reload hash:

```
VUE_APP_GIT_HASH=testing
```

 (this exists so that when a new version of the code is pushed to the production server, the Vuex store will be reloaded from default).

I quite like JetBrains WebStorm for development, but you can use whatever IDE you like by configuring it to run this command as the 'run' command.


### Building for production

Production builds with minification can be done using:

```
npm run build
```

This repository is set up to automatically run a container build with [Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/), which builds the code to a docker container and pushes it to DockerHub. The URL for the repository is: 

https://hub.docker.com/repository/docker/samfinnigan/tgrains-cropmodel-frontend

Bitbucket limits build minutes to 50 a month. You probably only want to push to the master branch when building for production. To build the code on your local machine, use instead `docker build`. See the `bitbucket-pipelines.yml` for a detailed build script.


### Lint and fix files
```
npm run lint
```

