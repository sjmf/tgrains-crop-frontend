// vue.config.js

// eslint-disable-next-line no-unused-vars
const {gitDescribe, gitDescribeSync} = require('git-describe');
process.env.VUE_APP_GIT_HASH = gitDescribeSync().hash

module.exports = {
    devServer: {
        proxy: {
            '/model': {
                target:  'http://localhost:8000',
                //changeOrigin: true
                //port: 8000,
            },
            '/strings': {
                target:  'http://localhost:8000',
            },
            '/status': {
                target:  'http://localhost:8000',
            }
        }
    }
}
