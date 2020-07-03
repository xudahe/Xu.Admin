import store from "../store"
import router from '../modules/router';

export default {
  state: {
    info: "" // 每次刷新都要通过token请求个人信息来筛选动态路由
  },
  mutations: {
    getInfo (state, info) {
      state.info = info
    },
  },
  actions: {
    getInfo ({commit}, token) {
      commit("getInfo", token)
    },
  }
}
