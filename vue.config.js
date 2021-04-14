module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  publicPath: './',
  devServer: {
    open: true,
    compress: true,
    proxy: {
      [process.env.VUE_APP_API]: {
        target: 'http://172.165.207.162:8000',
        // target: 'http://172.165.208.41:8000',
        // target: 'http://promotiondataback.thelian.cn',
        // target: 'http://172.165.206.5:8000',
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  }
}
