module.exports = {
    devServer: {
        proxy: {
            '/model': {
                target:  'http://localhost:8000',
                //changeOrigin: true
                //port: 8000,
            },
            '/echo': {
                target:  'http://localhost:8000',
            }
        },
        /*headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }*/
    }
}
