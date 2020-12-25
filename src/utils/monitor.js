/**
 * @description 数据采集
 * @description 链接：https://juejin.im/post/6844903998412029959#heading-2
 */

function monitorInit() {
  const monitor = {
    // 数据上传地址
    url: '',
    // 性能信息
    performance: {},
    // 资源信息
    resources: {},
    // 错误信息
    errors: [],
    // 用户信息
    user: {
      // 屏幕宽度
      screen: screen.width,
      // 屏幕高度
      height: screen.height,
      // 浏览器平台
      platform: navigator.platform,
      // 浏览器的用户代理信息
      userAgent: navigator.userAgent,
      // 浏览器用户界面的语言
      language: navigator.language,
    },
    // 手动添加错误
    addError(error) {
      const obj = {}
      const {
        type,
        msg,
        url,
        row,
        col
      } = error
      if (type) obj.type = type
      if (msg) obj.msg = msg
      if (url) obj.url = url
      if (row) obj.row = row
      if (col) obj.col = col
      obj.time = new Date().getTime()
      monitor.errors.push(obj)
    },
    // 重置 monitor 对象
    reset() {
      window.performance && window.performance.clearResourceTimings()
      monitor.performance = getPerformance()
      monitor.resources = getResources()
      monitor.errors = []
    },
    // 清空 error 信息
    clearError() {
      monitor.errors = []
    },
  }

  // 获取性能信息
  const getPerformance = () => {
    if (!window.performance) return

    // window.performance 接口可以获取到当前页面中与性能相关的信息
    const timing = window.performance.timing
    const performance = {
      // 重定向耗时
      redirect: timing.redirectEnd - timing.redirectStart,
      // 白屏时间
      whiteScreen: whiteScreen,
      // DOM 渲染耗时
      dom: timing.domComplete - timing.domLoading,
      // 页面加载耗时
      load: timing.loadEventEnd - timing.navigationStart,
      // 页面卸载耗时
      unload: timing.unloadEventEnd - timing.unloadEventStart,
      // 请求耗时
      request: timing.responseEnd - timing.requestStart,
      // 获取性能信息时当前时间
      time: new Date().getTime(),
    }

    return performance
  }

  // 获取资源信息
  const getResources = () => {
    if (!window.performance) return

    // 获取相关资源（js、css、img...）的加载时间，它会返回页面当前所加载的所有资源。
    const data = window.performance.getEntriesByType('resource')
    const resource = {
      xmlhttprequest: [],
      css: [],
      other: [],
      script: [],
      img: [],
      link: [],
      fetch: [],
      // 获取资源信息时当前时间
      time: new Date().getTime(),
    }

    data.forEach(item => {
      const arry = resource[item.initiatorType]
      arry && arry.push({
        // 资源的名称
        name: item.name,
        // 资源加载耗时
        duration: item.duration.toFixed(2),
        // 资源大小
        size: item.transferSize,
        // 资源所用协议
        protocol: item.nextHopProtocol,
      })
    })

    return resource
  }

  //页面加载完成后获取性能数据，尽量不要对页面性能造成影响。
  window.onload = () => {
    // 在浏览器空闲时间获取性能及资源信息 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        monitor.performance = getPerformance()
        monitor.resources = getResources()
        console.log('页面性能信息')
        console.log(monitor.performance)
        console.log('页面资源信息')
        console.log(monitor.resources)
      })
    } else {
      setTimeout(() => {
        monitor.performance = getPerformance()
        monitor.resources = getResources()
        console.log('页面性能信息')
        console.log(monitor.performance)
        console.log('页面资源信息')
        console.log(monitor.resources)
      }, 0)
    }
  }

  // 捕获资源加载失败错误 js css img...
  addEventListener('error', e => {
    const target = e.target
    if (target != window) {
      monitor.errors.push({
        type: target.localName,
        url: target.src || target.href,
        msg: (target.src || target.href) + ' is load error',
        // 错误发生的时间
        time: new Date().getTime(),
      })

      console.log('所有的错误信息')
      console.log(monitor.errors)
    }
  }, true)

  // 监听 js 错误
  window.onerror = function (msg, url, row, col, error) {
    monitor.errors.push({
      type: 'javascript', // 错误类型
      row: row, // 发生错误时的代码行数
      col: col, // 发生错误时的代码列数
      msg: error && error.stack ? error.stack : msg, // 错误信息
      url: url, // 错误文件
      time: new Date().getTime(), // 错误发生的时间
    })

    console.log('所有的错误信息')
    console.log(monitor.errors)
  }

  // 监听 promise 错误 缺点是获取不到行数数据
  addEventListener('unhandledrejection', e => {
    monitor.errors.push({
      type: 'promise',
      msg: (e.reason && e.reason.msg) || e.reason || '',
      // 错误发生的时间
      time: new Date().getTime(),
    })

    console.log('所有的错误信息')
    console.log(monitor.errors)
  })

  return monitor
}

export default {
  monitorInit
}
