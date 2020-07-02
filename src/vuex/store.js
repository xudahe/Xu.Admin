import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex);
import layout from './modules/layout';
import router from './modules/router';
import role   from './modules/role';
import error from './modules/error'

const store=new Vuex.Store({
    state:{
        theme: '001', //主题样式

        token: null,
        tokenExpire: null,
    },
    mutations: {
        saveToken(state, data) {   //保存 token 到 store和本地中
            state.token = data;
            window.localStorage.setItem("Token", data);
        },
        saveTokenExpire(state, data) {
            state.tokenExpire = data;
            window.localStorage.setItem("TokenExpire", data);
        },

        templatesMu(state, val) {
            try{
                if (val) {
                    state.theme = val;
                }
            }catch(e){

            }
        },
        
    },
    mounted() {
        
    },
    modules: {
        layout,
        router,
        role,
        error
    },
    actions: {
        saveToken ({commit}, token) {
          return new Promise((resolve, reject) => {
            commit("saveToken", token)
            resolve()
          })
        }
    },
    getters: {
        templates: state => state.theme,
        addRouters: state => state.router.addRouters,
        routers: state => state.router.routers,
        info: state => state.role.info,
        menus: state=> state.role.info.menus,
        logoShow: state => state.layout.logoShow,
        isCollapse: state => state.layout.isCollapse,
        uniquerouter: state => state.layout.uniquerouter,
        tabnavBox: state => state.layout.tabnavBox,
        visible: state => state.layout.visible,
        left: state => state.layout.left,
        top: state => state.layout.top,
        rightNav: state => state.layout.rightNav,
        errorLogList: state => state.error.errorLogList,
      },
})

export default store; 