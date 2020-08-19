import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Login from "@/views/login/index"
import Layout from "@/views/layout/index"
import BigScreen from "@/components/bigScreen/view/home"
import homePage from "@/components/bigScreen/view/homePage"
import application1 from "@/components/bigScreen/view/application1"
import application2 from "@/components/bigScreen/view/application2"

//使用动态的import()语法,不是必须加载的组件使用懒加载
const
  Home = () => import('@/views/home/index'),
  personal = () => import('@/views/personal/index'),
  Error_500 = () => import('@/views/error/500'),
  Error_403 = () => import('@/views/error/403'),
  Error_404 = () => import('@/views/error/404')

//自动注册路由
function getRoutes(req) { 
  let routes = req.keys().map(val => {
    // 获取组件配置
    const componentConfig = req(val);
    // 剥去文件名开头的 `./` 和`.vue`结尾的扩展名
    const componentName = val.replace(/^\.\//,'').replace(/\.vue$/,'');
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
      children:[]
    }
  });

  return routes;
}

//默认路由
let defaultRouter = [
  {
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
    redirect: "/home",
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
    children: [
      {
        path: "/home",
        name: "首页",
        component: Home,
        children: []
      },
      {
        path: "/personal",
        name:"个人中心",
        component: personal,
        children: []
      }
    ]
  },
  {
    path: "/403",
    name:"403",
    component: Error_403,
    children: []
  },
  {
    path: "/404",
    name:"404",
    component: Error_404,
    children: []
  },
  {
    path: "/500",
    name:"500",
    component: Error_500,
    children: []
  },
  {
    path: '/bigScreen',
    name: 'bigScreen',
    meta: {
      title: "大屏"
    },
    hidden: true,
    component: BigScreen,
    children: [
      {
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
        path: '/application1',
        name: 'application1',
        hidden: true,
        component: application1,
        children: []
      },
      {
        path: '/application2',
        name: 'application2',
        hidden: true,
        component: application2,
        children: []
      }
    ]
  }
]

//异步挂载的路由
const system_routes = getRoutes(require.context('@/views/system', true, /index\.vue$/));
const tools_routes = getRoutes(require.context('@/views/tools', true, /index\.vue$/));
const log_routes = getRoutes(require.context('@/views/log', true, /index\.vue$/));
let addRouter = [
  {
    path: "/",
    iconCls: "el-icon-tickets", // 图标样式class
    name: "系统设置",
    component: Layout,
    children: system_routes.concat(tools_routes).concat(log_routes)
  }
];

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
export { defaultRouter, addRouter }

