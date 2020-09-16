import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex);
import layout from './modules/layout';
import router from './modules/router';
import user   from './modules/user';
import error from './modules/error'

const store=new Vuex.Store({
    state:{
        token: null,
        tokenExpire: null,
        drag_com: "",
        drag_ref: "",
        G_MapActionFlag: 1,
    },
    // 执行同步操作改变state   this.$store.commit("saveToken", data)
    mutations: {
        saveToken(state, data) {   //保存 token 到 store和本地中
            state.token = data;
            window.localStorage.setItem("Token", data);
        },
        saveTokenExpire(state, data) {
            state.tokenExpire = data;
            window.localStorage.setItem("TokenExpire", data);
        },
    },
    mounted() {
        
    },
    modules: {
        layout,
        router,
        user,
        error
    },
    // 执行异步操作改变state   this.$store.dispatch("saveToken", data);
    actions: {
        saveToken ({commit}, token) {
          return new Promise((resolve, reject) => {
            commit("saveToken", token)
            resolve()
          })
        }
    },
    getters: {
        token: state => state.token,
        addRouters: state => state.router.addRouters,
        routers: state => state.router.routers,
        info: state => state.user.info,
        logoShow: state => state.layout.logoShow,
        isCollapse: state => state.layout.isCollapse,
        uniquerouter: state => state.layout.uniquerouter,
        tabnavBox: state => state.layout.tabnavBox,
        rightNav: state => state.layout.rightNav,
        errorLogList: state => state.error.errorLogList,
      },
})

export default store; 