import router from "./index"
import store from "../vuex/store"
import {
  saveRefreshtime
} from '@/api/axios/index';

//导入进度条插件 -- npm install --save nprogress
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

// 配置NProgress进度条选项 —— 动画效果
NProgress.configure({
  ease: 'ease',
  speed: 500
})

// 全局路由拦截-进入页面前执行
router.beforeEach((to, from, next) => {
  NProgress.start(); //显示进度条

  if (!validataToken()) {
    next()
  }
  
  if (store.getters.token) {
    if (to.path === "/login") {
      next()
    } else {
      if (store.getters.info == "") {
        getAddRouters()
        next({
          path: to.path
        })
      } else {
        next()
      }
    }
  } else {
    if (to.path === "/login") {
      next()
    } else {
      next({
        path: "/login"
      })
    }
  }
})

// 全局后置钩子-常用于结束动画等
router.afterEach(() => {
  NProgress.done() //完成进度(进度条消失)
})

//验证Token
async function validataToken() {
  var curTime = new Date()
  var refreshtime = new Date(Date.parse(window.localStorage.refreshtime))
  // 如果在用户操作的活跃期内，刷新Token过期时间
  if (window.localStorage.refreshtime && (curTime <= refreshtime)) {
    saveRefreshtime(); //刷新Token过期时间

    if (!store.state.token) {
      store.commit("saveToken", window.localStorage.Token)
    }
    if (!store.state.tokenExpire) {
      store.commit("saveTokenExpire", window.localStorage.TokenExpire)
    }

    return true
  } else {
    return false
  }
}

async function getAddRouters() {
  // 省略 axios 请求代码 通过 token 向后台请求用户权限等信息
  let userInfo = JSON.parse(window.localStorage.userInfo ? window.localStorage.userInfo : null);
  let roleInfo = JSON.parse(window.localStorage.roleInfo ? window.localStorage.roleInfo : null);
  let menuInfo = JSON.parse(window.localStorage.menuInfo ? window.localStorage.menuInfo : null);

  await store.dispatch("getInfo", {
    userinfo: userInfo,
    roleinfo: roleInfo,
    menuinfo: menuInfo ||
    [
        {
          id:0, menuName: "系统管理", enabled: false, icon: "fa fa-dashboard",
          children: [
            { id:1, menuName: "用户管理", className: "/user_manager", icon:"el-icon-edit-outline", enabled:false, children:[]},
            { id:2, menuName: "部门管理", className: "/dept_manager", icon:"el-icon-edit-outline", enabled:false, children:[]},
            { id:3, menuName: "角色管理", className: "/role_manager", icon:"el-icon-edit-outline", enabled:false, children:[]},
            { id:4, menuName: "菜单管理", className: "/menu_manager", icon:"el-icon-edit-outline", enabled:false, children:[]},
          ] 
        },
        {
          id:11, menuName: "系统工具", enabled: false, icon: "fa fa-dashboard",
          children: [
            { id:12, menuName: "图片管理", className: "/picture_manager", icon:"el-icon-edit-outline", enabled:false, children:[]},
            { id:13, menuName: "定时任务", className: "/task_manager", icon:"el-icon-edit-outline", enabled:false, children:[]},
            { id:13, menuName: "通信管理", className: "/signalr", icon:"el-icon-edit-outline", enabled:false, children:[]},
          ]
        },
        {
          id:91, menuName: "组件页面", enabled: false, icon: "fa fa-dashboard",
          children: [
            { id:15, menuName: "tinymce", className: "/t-tinymce", icon:"el-icon-edit-outline", enabled:false, children:[]},
            { id:16, menuName: "markdown", className: "/t-markdown", icon:"el-icon-edit-outline", enabled:false, children:[]},
            { id:17, menuName: "handsontable", className: "/t-handsontable", icon:"el-icon-edit-outline", enabled:false, children:[]},
            { id:18, menuName: "baseMap", className: "/t-baseMap", icon:"el-icon-edit-outline", enabled:false, children:[]},
            { id:19, menuName: "card", className: "/card", icon:"el-icon-edit-outline", enabled:false, children:[]},
            { id:20, menuName: "paper", className: "/paper", icon:"el-icon-edit-outline", enabled:false, children:[]},
          ]
        }
    ]
  })

  await store.dispatch("newRoutes", store.getters.info.roleinfo)
  router.addRoutes(store.getters.addRouters) //动态添加路由
}

// 路由跳转前都是会经过beforeEach，而beforeEach可以通过next来控制到底去哪个路由。根据这个特性我们就可以在beforeEach中设置一些条件来控制路由的重定向。
// to: Route: 即将要进入的目标路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参
