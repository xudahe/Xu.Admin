// 1、为什么选择axios？
// 使用axios可以统一做请求 - 响应拦截， 例如响应时我们将响应信息拦截起来， 判断状态码， 从而弹出报错信息
// 设定请求超时, 例如3000ms未响应则停止请求
// 基于promise, 可以很方便地使用then或者catch来处理请求
// 自动转换json数据

// 2、 qs主要有两个方法：  因为后端不能接收JSON格式的数据传送，只能接收传统JQ的那种数据
// 方法一： 将对象序列化成URL的形式，以&进行拼接（拼接是由底层处理， 无需手动操作）
// qs.stringify() 转换成查询字符串
// 方法二： 将序列化的内容拆分成一个个单一的对象
// qs.parse() 转换成json对象

//Object.assign 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
//注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。

// Promise有三种状态
// pending: 等待中，或者进行中，表示还没有得到结果
// resolved: 已经完成，表示得到了我们想要的结果，可以继续往下执行
// rejected: 也表示得到结果，但是由于结果并非我们所愿，因此拒绝执(用catch捕获异常)

import axios from 'axios' //ajax请求
import qs from 'qs'
import Vue from 'vue'

import store from "@/vuex/store"
import router from '../../router/index'
import apiSetting from "./apiSetting"

//POST传参序列化(添加request请求拦截器)
axios.interceptors.request.use(config => {
  var curTime = new Date()
  var expiretime = new Date(Date.parse(store.state.tokenExpire))

  if (store.state.token && (curTime < expiretime && store.state.tokenExpire)) {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = "Bearer " + store.state.token;
  }

  saveRefreshtime();

  return config
}, error => {
  return Promise.reject(error)
})

//返回状态判断(添加response响应拦截器)
axios.interceptors.response.use(response => {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    response.data = JSON.parse(response.request.responseText)
  }
  return response
}, error => {

  // 超时请求处理
  var originalRequest = error.config;
  if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !originalRequest._retry) {

    Vue.prototype.$message({
      message: '请求超时！',
      type: 'error'
    });

    originalRequest._retry = true
    return null;
  }

  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求';
        break;
      case 401:
        var curTime = new Date()
        var refreshtime = new Date(Date.parse(window.localStorage.refreshtime))
        // 在用户操作的活跃期内
        if (window.localStorage.refreshtime && (curTime <= refreshtime)) {
          // 直接将整个请求 return 出去，不然的话，请求会晚于当前请求，无法达到刷新操作 
          return httpServer(apiSetting.refreshToken, {
            token: window.localStorage.Token
          }).then(res => {
              if (res.success == true) {
                Vue.prototype.$message({
                  message: 'refreshToken success! loading data...',
                  type: 'success'
                });

                store.commit("saveToken", res.token);

                var curTime = new Date();
                var expiredate = new Date(curTime.setSeconds(curTime.getSeconds() + res.expires_in));
                store.commit("saveTokenExpire", expiredate);

                error.config.__isRetryRequest = true;
                error.config.headers.Authorization = 'Bearer ' + res.token;
                return axios(error.config); //这里就是重新进行一次请求， error.config 包含了当前请求的所有信息             
              } else {
                ToLogin() // 刷新token失败,清除token信息并跳转到登录页面
              }
            },
            error => {
              ToLogin() // 刷新token失败,清除token信息并跳转到登录页面
            }
          );

        } else {
          // 返回 401，并且不知用户操作活跃期内 清除token信息并跳转到登录页面
          error.message = '未授权，请重新登录';
          ToLogin()
        }
        break;
      case 403: //无权限
        error.message = '拒绝访问，请重新登录';
        ToLogin();
        break;
      case 404:
        error.message = '请求错误,未找到该资源';
        break;
      case 405:
        error.message = '请求方法未允许';
        break;
      case 408:
        error.message = '请求超时';
        break;
      case 429: //ip限流
        error.message = '刷新次数过多，请稍事休息重试';
        break;
      case 500:
        error.message = '服务器端出错';
        break;
      case 501:
        error.message = '网络未实现';
        break;
      case 502:
        error.message = '网络错误';
        break;
      case 503:
        error.message = '服务不可用';
        break;
      case 504:
        error.message = '网络超时';
        break;
      case 505:
        error.message = 'http版本不支持该请求';
        break;
      default:
        error.message = `未知错误${error.response.status}`;
    }
  } else {
    error.message = "连接到服务器失败";
  }

  Vue.prototype.$message({
    message: error.message,
    type: 'error'
  });

  return Promise.reject(error);
})

//参考：https://blog.csdn.net/qq_42553082/article/details/84072301
const httpServer = (opts, data) => {
  let Public = { //公共参数  
  }

  let httpDefaultOpts = { //http默认配置  
    method: opts.method,
    baseURL: 'http://localhost:1081', //配置后端接口地址
    url: opts.url,
    timeout: 300000, //响应时间
    params: Object.assign(Public, data),
    // data: Object.assign(Public, data),
    // data: qs.stringify(Object.assign(Public, data))
  }

  if (opts.method == 'get' || opts.method == 'delete') {
    // 默认application/x-www-form-urlencoded请求格式
    delete httpDefaultOpts.data
  } else if (opts.method == 'post') {
    // multipart/form-data请求格式
    httpDefaultOpts.data = qs.stringify(data)
    delete httpDefaultOpts.params
  } else if (opts.method == 'other' || opts.method == 'put') {
    // application/json请求格式
    httpDefaultOpts.method = opts.method == 'other' ? 'post' : 'put'
    httpDefaultOpts.headers = {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/json; charset=UTF-8"
    }
    httpDefaultOpts.data = Object.assign(Public, data)
    delete httpDefaultOpts.params
  }

  let promise = new Promise(function (resolve, reject) {
    axios(httpDefaultOpts).then(
      (res) => {
        resolve(res)
      }
    ).catch(
      (res) => {
        reject(res)
      }
    )

  })
  return promise
}

const ToLogin = params => {
  store.commit("saveToken", "");
  store.commit("saveTokenExpire", "");

  router.replace({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath
    }
  });

  window.location.reload()

};

//当执行操作时更新刷新时间，这个的作用主要是记录当前用户的操作活跃期，当在这个活跃期内，就可以滑动更新，如果超过了这个时期，就跳转到登录页
export const saveRefreshtime = params => {
  let nowtime = new Date();
  let lastRefreshtime = window.localStorage.refreshtime ? new Date(window.localStorage.refreshtime) : new Date(-1); //最后刷新时间，当用户操作的时候，实时更新最后的刷新时间，保证用户活跃时间一直有效
  let expiretime = new Date(Date.parse(window.localStorage.TokenExpire))

  //refreshCount 滑动系数：就是你自定义的用户的停止活跃时间段，比如你想用户最大的休眠时间是20分钟，用户可以最多20分钟内不进行操作，
  //如果20分钟后，再操作，就跳转到登录页，如果20分钟内，继续操作，那继续更新时间，休眠时间还是以当前时间 + 20分钟。
  let refreshCount = 1;
  if (lastRefreshtime >= nowtime) {
    lastRefreshtime = nowtime > expiretime ? nowtime : expiretime;
    lastRefreshtime.setMinutes(lastRefreshtime.getMinutes() + refreshCount);
    window.localStorage.refreshtime = lastRefreshtime;
  } else {
    window.localStorage.refreshtime = new Date(-1);
  }
};

export default httpServer
