import {defaultRouter, addRouter} from "@/router/index"

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
    newRoutes ({commit}, role) {
      //  通过递归路由表，删除掉没有权限的路由
      function eachSelect(routers, userRole) {
        for (let j = 0; j < routers.length; j++) {
          routers[j].name = getTitle(routers[j].name)
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
var dataList = [
  { title: "用户管理", name: "user_manager" },
  { title: "部门管理", name: "dept_manager" },
  { title: "角色管理", name: "role_manager" },
  { title: "菜单管理", name: "menu_manager" },
  { title: "字典管理", name: "dictionary_manager" },
  { title: "操作日志", name: "operation_log" },
  { title: "异常日志", name: "exception_log" },
  { title: "权限日志", name: "authority_log" },
  { title: "图片管理", name: "picture_manager" },
  { title: "定时任务", name: "mission_manager" },
]

function getTitle(value) {
  let dt = dataList.filter(val => val.name == value);
  if (dt.length >0 && dt != undefined)
    return  dt[0].title
  else
    return value
}

export default routerData
