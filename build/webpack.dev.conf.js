'use strict'
const utils = require('./utils') //封装了一些方法的工具
const webpack = require('webpack') //使用 webpack
const config = require('../config')  //使用 config/index.js
const merge = require('webpack-merge') //使用 webpack 配置合并插件
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf') // 加载 webpack.base.conf
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 使用 html-webpack-plugin 插件，这个插件可以帮我们自动生成 html 并且注入到 .html 文件中
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin') //https://www.npmjs.com/package/friendly-errors-webpack-plugin,可以识别某些类别的Webpack错误并进行清理，聚合和优先排序
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

// 将我们 webpack.dev.conf.js 的配置和 webpack.base.conf.js 的配置合并
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })  // 使用 styleLoaders
  },
  // cheap-module-eval-source-map is faster for development
  // 使用 #cheap-module-eval-source-map 模式作为开发辅助调试工具
  // 具体配置请参考https://doc.webpack-china.org/configuration/devtool/
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
     // definePlugin 接收字符串插入到代码当中, 需要的话可以写上 JS 的字符串
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    // HotModule 插件在页面进行变更的时候只会重回对应的页面模块，不会重绘整个 html 文件
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    //https://doc.webpack-china.org/plugins/no-emit-on-errors-plugin/
    //在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // 将 index.html 作为入口，注入 html 代码后生成 index.html文件
    //https://doc.webpack-china.org/plugins/html-webpack-plugin/ webpack插件列表(中文)
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      favicon: path.resolve('src/assets/favicon.ico'), // 引入图片地址
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
