const webpack = require('webpack')
module.exports = {
  entry: {
    main: './src/main.js'
  }
  , target: 'electron'
  , output: {
    path: './build'
    , filename: '[name].js'
    // , publicPath: 'http://localhost:8080/build/'
  }
  , module: {
    loaders: [
      {
        test: /\.vue$/
        , loader: 'vue'
      }
      , {
        test: /\.js$/
        , exclude: /node_modules/
        , loader: 'babel'
      }
      , {
        test: /\.(png|jpg|gif)$/
        , loader: 'url'
        // , loader: 'file'
        , query: {
          name: '[name].[ext]?[hash]'
          // name: '[name].[ext]'
        }
      }
    ]
  }
  , babel: {
    presets: ['es2015', 'stage-0']
    , plugins: ['transform-runtime']
  }
  , plugins: [
    new webpack.HotModuleReplacementPlugin()
    // https://webpack.github.io/docs/configuration.html#target
    // 不应该用 ProvidePlugin 暴露 api， 设置 electron 模式更简单 _(:3 /_)_
    // , new webpack.ProvidePlugin({
    //   desktopCapturer: 'desktopCapturer'
    //   , ipcRenderer: 'ipcRenderer'
    //   , remote: 'remote'
    //   , webFrame: 'webFrame'
    //   , clipboard: 'clipboard'
    //   , crashReporter: 'crashReporter'
    //   , nativeImage: 'nativeImage'
    //   , screen: 'screen'
    //   , shell: 'shell'
    // })
    // , new webpack.optimize.CommonsChunkPlugin('common.js')
  ]
  , devtool: '#source-map'
}
