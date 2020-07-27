// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from "./vuex/store"

//全局注册事件eventBus
// Vue.prototype.$eventBus = new Vue();

//api模块初始化。引用第三方插件
import '@/initial/modules'

//全局过滤器初始化。在如下路径文件下全局注册过滤器即可。
import filters from '@/initial/filter/index'
// 全局注册过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })

//全局指令初始化。在如下路径文件下全局注册指令即可。
import directives from '@/initial/directives/index'
// 全局注册指令
Object.keys(directives).forEach(key => {
    Vue.directive(key, {
      // 只调用一次，指令第一次绑定到元素时调用
      bind: directives[key].bind || (() => {}),
      // 被绑定元素插入父节点时调用
      inserted: directives[key].inserted || (() => {}),
      // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前
      update: directives[key].update || (() => {}),
      // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
      componentUpdated: directives[key].componentUpdated || (() => {}),
      // 只调用一次，指令与元素解绑时调用
      unbind: directives[key].unbind || (() => {})
    })
  })

//全局组件初始化。最终读取src/components下的所有index.vue文件进行组件注册。
//注意：自动注册组件依赖组件名称，因此，请在封装组件时给组件加上name字段。
const req = require.context('@/components', true, /index\.vue$/)
//全局注册组件
req.keys().forEach(val => {
    const component = req(val).default
    Vue.component(component.name, component)
  })


import promise from 'es6-promise' //兼容IE
promise.polyfill()

import echarts from 'echarts' 
import './router/intercept.js' //路由拦截

//图片点击放大预览
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

Vue.use(Vuex)
Vue.prototype.$echarts = echarts;
Vue.prototype.$store = store

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

