import router from "./index"
import store from "../vuex/store"
import { saveRefreshtime } from '@/api/axios/index';

//导入进度条插件 -- npm install --save nprogress
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

// 配置NProgress进度条选项 —— 动画效果
NProgress.configure({ ease: 'ease', speed: 500 })

// 全局路由拦截-进入页面前执行
router.beforeEach((to, from, next) => {
  NProgress.start(); //显示进度条
  
  saveRefreshtime(); //刷新Token时间
 
  if (store.getters.token) {
    if (to.path === "/login") {
      next({path: "/"})
    } else {
      if (!store.getters.info) {
        !(async function getAddRouters () {
          // 省略 axios 请求代码 通过 token 向后台请求用户权限等信息
          let user = JSON.parse(window.localStorage.user ? window.localStorage.user : null);
          let roles = JSON.parse(window.localStorage.role ? window.localStorage.role : null);
          let menus = JSON.parse(window.localStorage.menu ? window.localStorage.menu : null);

          await store.dispatch("getInfo", {
            user: [],
            roles: [],
            menus: [
                  {
                    id:1, name: "系统管理", alone: false, hidden: false, iconCls: "fa fa-dashboard",
                    children: [
                      { id:1, name: "用户管理", path: "/user_manager", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                      { id:2, name: "部门管理", path: "/dept_manager", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                      { id:3, name: "角色管理", path: "/role_manager", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                      { id:4, name: "菜单管理", path: "/menu_manager", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                    ]
                  },
                  {
                    id:7, name: "日志管理", alone: false, hidden: false, iconCls: "fa fa-dashboard",
                    children: [
                      { id:8, name: "操作日志", path: "/operation_log", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                      { id:9, name: "异常日志", path: "/exception_log", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                      { id:10, name: "权限日志", path: "/authority_log", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                    ]
                  },
                  {
                    id:11, name: "系统工具", alone: false, hidden: false, iconCls: "fa fa-dashboard",
                    children: [
                      { id:12, name: "图片管理", path: "/picture_manager", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                      { id:13, name: "定时任务", path: "/mission_manager", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                    ]
                  },
                  {
                    id:14, name: "常用工具", alone: false, hidden: false, iconCls: "fa fa-dashboard",
                    children: [
                      { id:15, name: "tinymce", path: "/v-tinymce", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                      { id:16, name: "markdown", path: "/v-markdown", iconCls:"el-icon-edit-outline", hidden:false, children:[]},
                    ]
                  }
            ]
          })
          
          await store.dispatch("newRoutes", store.getters.info.role)
          router.addRoutes(store.getters.addRouters)  //动态添加路由
          next({path: to.path})
        }())
      } else {
        next()
      }
    }
  } else {
    if (to.path === "/login") {
      next()
    } else { 
      next({path: "/login"})
    }
    
  }
})

// 全局后置钩子-常用于结束动画等
router.afterEach(() => {  
  NProgress.done() //完成进度(进度条消失)
})

// 路由跳转前都是会经过beforeEach，而beforeEach可以通过next来控制到底去哪个路由。根据这个特性我们就可以在beforeEach中设置一些条件来控制路由的重定向。
// to: Route: 即将要进入的目标路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参