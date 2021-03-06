//import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import layout from './modules/layout';
import router from './modules/router';
import user from './modules/user';
import map from './modules/map';
import error from './modules/error'

const store = new Vuex.Store({
  state: {
    token: null,
    tokenExpire: null,

    //缓存组件，该值是组件中定义的name值，include 名称匹配的组件会被缓存，exclude 名称匹配的组件不被缓存。
    cachedViews: ["t-gdmap", "t-arcgisMap", "t-tinymce", "t-echartMap", "paper"],

    drag_com: "",
    drag_ref: "",
    weather: [], //天气数据
  },
  // 执行同步操作改变state   this.$store.commit("saveToken", data)
  mutations: {
    saveToken(state, data) { //保存 token 到 store和本地中
      state.token = data;
      window.localStorage.setItem("Token", data);
    },
    saveTokenExpire(state, data) {
      state.tokenExpire = data;
      window.localStorage.setItem("TokenExpire", data);
    },
    saveWeather(state, data) {
      state.weather = data;
    },
  },
  mounted() {

  },
  modules: {
    layout,
    router,
    user,
    map,
    error
  },
  // 执行异步操作，但不能直接改变state   this.$store.dispatch("saveToken", data);
  actions: {
    saveToken({
      commit
    }, token) {
      return new Promise((resolve, reject) => {
        commit("saveToken", token)
        resolve()
      })
    }
  },
  // Getters相当于vue中的computed计算属性，getter的返回值根据它的依赖被缓存起来，且只有当它的依赖值发生改变时才会重新计算。
  // Getters可以用于监听，state中的值的变化，返回计算后的结果。
  getters: {
    token: state => state.token,
    addRouters: state => state.router.addRouters,
    cachedViews: state => state.cachedViews,
    routers: state => state.router.routers,
    info: state => state.user.info,
    isCollapse: state => state.layout.isCollapse,
    uniquerouter: state => state.layout.uniquerouter,
    tabnavBox: state => state.layout.tabnavBox,
    openNav: state => state.layout.openNav, //当前打开tab面包屑
    errorLogList: state => state.error.errorLogList,
  },
})

export default store;
