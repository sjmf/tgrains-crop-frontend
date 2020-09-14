// vue.config.js

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
            },
            '/comment': {
                target:  'http://localhost:8000',
            }
        }
    }
}
