'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path') //使用Node自带的文件路径插件


module.exports = {

  // 开发环境
  dev: {

    // Paths
    assetsSubDirectory: 'static',  // 编译输出的二级目录
    assetsPublicPath: '/',  // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
    proxyTable: {
        '/api': { //替换代理地址名称
          target: 'http://localhost:1081', //代理地址 
          changeOrigin: true, //可否跨域 
          pathRewrite: { 
            '^/api': '' //路径重写 
            } 
        } 
    },  //https://github.com/chimurai/http-proxy-middleware, // 配置方式, 需要 proxyTable 代理的接口（可跨域）http://vuejs-templates.github.io/webpack/proxy.html

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // // 运行测试页面的端口,can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false, //是否自动打开浏览器
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true  // 是否开启 cssSourceMap
  },

  // 生产环境配置
  build: {
    // 使用 config/prod.env.js 中定义的编译环境


    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),  // 编译注入的 index.html 文件,必须是本地的绝对路径

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),  // 编译输出的静态资源根路径
    assetsSubDirectory: 'static', // 编译输出的二级目录
    assetsPublicPath: './',  // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名

    /**
     * Source Maps
     */

    productionSourceMap: false, //生成用于生产构建的源映射, 在开发完成上线打包的时候，就要关闭这个开关，一方面能减少代码包的大小，另一方面也有利于系统安全。
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true, // 是否开启 gzip
    productionGzipExtensions: ['js', 'css', 'svg'], // 需要使用 gzip 压缩的文件扩展名

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
     //一个实用工具,用于分析项目的依赖关系https://www.npmjs.com/package/webpack-bundle-analyzer
    bundleAnalyzerReport: process.env.npm_config_report 
  }
}
