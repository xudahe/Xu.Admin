'use strict'
const path = require('path') // 使用 NodeJS 自带的文件路径插件
const utils = require('./utils') //封装了一些方法的工具
const config = require('../config') //使用 config/index.js
const vueLoaderConfig = require('./vue-loader.conf') //使用vue-loader.conf

// 拼接我们的工作区路径为一个绝对路径
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}



module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: ['babel-polyfill', './src/main.js'], // 编译文件入口
  // entry: {
  //   app: './src/main.js' 
  // },
  output: {
    path: config.build.assetsRoot, //使用chonfig/index.js中build的assetsRoot作为输出根路径
    filename: '[name].js',  //编译输入的文件名
    publicPath: process.env.NODE_ENV === 'production' ?  // 正式发布环境下编译输出的发布路径
      config.build.assetsPublicPath : config.dev.assetsPublicPath,
    sourcePrefix: ' ' //正确缩进多行字符串
  },
  amd: {
    toUrlUndefined: true //添加amd模式支持
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],   // 自动补全的扩展名,能够使用户在引入模块时不带扩展
    alias: {    // 默认路径代理，例如 import Vue from 'vue$'，会自动到 'vue/dist/vue.esm.js'中寻找
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.yml$/,
        loader: 'json-loader!yaml-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')], //只处理除此文件夹之外的所以 svg
        options: {
          limit: 10000, //字节
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')], //只处理你指定文件夹下面的 svg
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ],
    unknownContextCritical: /^.\/.*$/,  //打印载入特定库时候的警告
    unknownContextCritical: false   //解决Error: Cannot find module "."
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
