const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    proxy: {
      '/apis': {
        target: 'http://127.0.0.1:8090',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        }
      },
      '/socket.io': {
        target: 'http://127.0.0.1:8090', // target host
        changeOrigin: true, // needed for virtual hosted sites
        logLevel: 'debug'
      },
      '/sockjs-node': {
        target: 'http://127.0.0.1:8090',
        ws: false,
        changeOrigin: true
      }
    }
  },
  transpileDependencies: true
})
