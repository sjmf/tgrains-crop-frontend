// vue.config.js

module.exports = {
    devServer: {
        proxy: {
            '/api': {
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
