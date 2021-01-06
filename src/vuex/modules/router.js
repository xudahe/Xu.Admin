import {
  defaultRouter,
  addRouter
} from "@/router/index"

const routerData = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    setRouters: (state, routers) => {
      state.addRouters = routers // 保存动态路由用来addRouter
      state.routers = defaultRouter.concat(routers) // 所有有权限的路由表，用来生成菜单列表
      console.log(state)
    }
  },
  actions: {
    newRoutes({
      commit
    }, role) {
      //  通过递归路由表，删除掉没有权限的路由
      function eachSelect(routers, userRole) {
        for (let j = 0; j < routers.length; j++) {
          routers[j].name = dataList[routers[j].name] || routers[j].name;
          if (routers[j].meta && routers[j].meta.role.length && routers[j].meta.role.indexOf(userRole) === -1) {
            routers.splice(j, 1)
            j = j !== 0 ? j - 1 : j
          }
          if (routers[j].children && routers[j].children.length) {
            eachSelect(routers[j].children, userRole)
          }
        }
      }

      eachSelect(addRouter, role)
      commit('setRouters', addRouter)
    }
  }
}

//可以通过后端返回数据
var dataList = {
  "user_manager": "用户管理",
  "dept_manager": "部门管理",
  "role_manager": "角色管理",
  "menu_manager": "菜单管理",
  "picture_manager": "图片管理",
  "task_manager": "定时任务",
  "card": "卡片",
}

export default routerData
