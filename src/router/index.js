import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Login from "@/views/login/index"
import Layout from "@/views/layout/index"
import bigScreen from "@/components/bigScreen/view/home"
import homePage from "@/components/bigScreen/view/homePage"
import application from "@/components/bigScreen/view/application"
import platform from "@/components/bigScreen/view/platform"

//路由懒加载：减少首次加载时从服务器请求的组件，当路由被访问时，再从服务器请求对应组件。

//使用动态的import()语法,不是必须加载的组件使用懒加载
const
  Home = () => import('@/views/home/index'),
  personal = () => import('@/views/other/personal/index'),
  Error_500 = () => import('@/views/other/error/500'),
  Error_403 = () => import('@/views/other/error/403'),
  Error_404 = () => import('@/views/other/error/404')

//异步挂载的路由
const operation_routes = getRoutes(require.context('@/views/operation', true, /\.vue$/));
const system_routes = getRoutes(require.context('@/views/system', true, /\.vue$/));
const tools_routes = getRoutes(require.context('@/views/tools', true, /\.vue$/));
const list_page = getRoutes(require.context('@/views/pages', true, /\.vue$/));

let addRouter = [{
  path: "/index",
  iconCls: "el-icon-tickets", // 图标样式class
  name: "系统设置",
  component: Layout,
  children: operation_routes.concat(system_routes).concat(tools_routes).concat(list_page)
}];

//自动注册路由
function getRoutes(req) {
  let routes = req.keys().map(val => {
    // 获取组件配置
    const componentConfig = req(val);
    // 剥去文件名开头的 `./` 和`.vue`结尾的扩展名
    const componentName = val.replace(/^\.\//, '').replace(/\.vue$/, '');
    // 全局注册组件
    const name = componentConfig.default.name;

    const component = Vue.component(
      name,
      // 如果这个组件选项是通过 `export default` 导出的，那么就会优先使用 `.default`，否则回退到使用模块的根。
      componentConfig.default || componentConfig
    );
    return {
      path: '/' + name,
      name: name,
      component,
      children: []
    }
  });

  return routes;
}

//默认路由
let defaultRouter = [{
    path: '/login',
    name: 'login',
    meta: {
      title: "登录"
    },
    hidden: true,
    component: Login,
    children: []
  },
  {
    path: "/",
    meta: {
      title: "重定向"
    },
    redirect: "/home", //默认重定向到首页
    hidden: true,
    children: []
  },
  {
    path: "/index",
    name: '主页',
    meta: {
      title: "主页"
    },
    iconCls: "fa fa-dashboard", // 图标样式class
    component: Layout,
    children: [{
        path: "/home",
        name: "首页",
        component: Home,
        children: []
      },
      {
        path: "/personal",
        name: "个人中心",
        component: personal,
        children: [],
        // keepAlive: true,  //缓存页面，也可使用<keep-alive></keep-alive>
      }
    ]
  },
  {
    path: "/403",
    name: "403",
    component: Error_403,
    children: []
  },
  {
    path: "/404",
    name: "404",
    component: Error_404,
    children: []
  },
  {
    path: "/500",
    name: "500",
    component: Error_500,
    children: []
  },
  {
    path: '/platform',
    name: 'platform',
    hidden: true,
    component: platform,
    children: []
  },
  {
    path: '/bigScreen',
    name: 'bigScreen',
    meta: {
      title: "大屏"
    },
    hidden: true,
    component: bigScreen,
    children: [{
        path: '/homePage',
        name: 'homePage',
        meta: {
          title: "综合"
        },
        hidden: true,
        component: homePage,
        children: []
      },
      {
        path: '/application',
        name: 'application',
        hidden: true,
        component: application,
        children: []
      },
    ]
  }
]

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

export default new Router({
  // mode: 'history',
  routes: defaultRouter
})
export {
  defaultRouter,
  addRouter
}
