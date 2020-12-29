import {
  Loading
} from 'element-ui'

// loading框设置局部刷新，且所有请求完成后关闭loading框

let loading
let loadingCount = 0 // 声明一个对象用于存储请求个数

const startLoading = (options = {}) => {
  loading = Loading.service({
    lock: true,
    text: "正在加载 . . .",
    background: 'rgba(0, 0, 0, 0.3)',
    spinner: 'el-icon-loading', //加载图标
    target: document.querySelector('.elmain'), //设置加载动画区域
    customClass: 'mask', // 遮罩层新增类名
    ...options,
  })
}

const endLoading = () => {
  loading.close()
}

export const showLoading = (options) => {
  if (loadingCount === 0) {
    startLoading(options)
  }
  loadingCount += 1
}

export const hideLoading = () => {
  if (loadingCount <= 0) {
    return
  }
  loadingCount -= 1
  if (loadingCount === 0) {
    endLoading()
  }
}

export default function (Vue) {
  //添加全局API
  Vue.prototype.$loading = {
    showLoading,
    hideLoading
  }
}
