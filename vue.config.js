// vue.config.js

module.exports = {
    devServer: {
        proxy: {
            '/model': {
                target:  'http://127.0.0.1:8000',
                //changeOrigin: true
                //port: 8000,
            },
            '/strings': {
                target:  'http://127.0.0.1:8000',
            },
            '/status': {
                target:  'http://127.0.0.1:8000',
            },
            '/comment': {
                target:  'http://127.0.0.1:8000',
            },
            '/reply': {
                target:  'http://127.0.0.1:8000',
            },
            '/tags': {
                target:  'http://127.0.0.1:8000',
            },
            '/state': {
                target:  'http://127.0.0.1:8000',
            },
            '/fork': {
                target:  'http://127.0.0.1:8000'
            }
        }
    },

    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "TGRAINS Crop Model";
                return args;
            })
    }
}
