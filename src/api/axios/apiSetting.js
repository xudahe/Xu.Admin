const LoginModule = {
  requestToken: { //获取Token
    url: '/api/Login/GetJwtToken',
    method: 'get'
  },
  refreshToken: { //请求刷新Token
    url: '/api/Login/RefreshToken',
    method: 'get'
  },
}

const UserModule = {
  getUserByToken: { //根据Token获取用户信息
    url: '/api/User/GetInfoByToken',
    method: 'get'
  },
  getUserInfo: { //获取用户数据
    url: '/api/User/Get',
    method: 'get'
  }, 
  postUser: { //添加用户
    url: '/api/User/Post',
    method: 'post'
  },
  putUser: { //更新用户
    url: '/api/User/Put',
    method: 'put'
  },
  disableUser: { //禁用用户
    url: '/api/User/Disable',
    method: 'delete'
  },
  deleteUesr: { //删除用户
    url: '/api/User/Delete',
    method: 'delete'
  },
}

const DeptModule = {
  getDeptInfo: { //获取部门数据
    url: '/api/Dept/Get',
    method: 'get'
  },
  postDept: { //添加部门
    url: '/api/Dept/Post',
    method: 'post'
  },
  putDept: { //更新部门
    url: '/api/Dept/Put',
    method: 'put'
  },
  disableDept: { //禁用部门
    url: '/api/Dept/Disable',
    method: 'delete'
  },
  deleteDept: { //删除部门
    url: '/api/Dept/Delete',
    method: 'delete'
  },
}

const RoleModule = {
  getRoleInfo: { //获取角色数据
    url: '/api/Role/Get',
    method: 'get'
  },
  postRole: { //添加角色
    url: '/api/Role/Post',
    method: 'post'
  },
  putRole: { //更新角色
    url: '/api/Role/Put',
    method: 'put'
  },
  disableRole: { //禁用角色
    url: '/api/Role/Disable',
    method: 'delete'
  },
  deleteRole: { //删除角色
    url: '/api/Role/Delete',
    method: 'delete'
  },
}

const MenuModule = {
  getMenuInfo: { //获取菜单数据(列表)
    url: '/api/Menu/Get',
    method: 'get'
  },
  getMenuByIds: { //根据菜单数据(树状)
    url: '/api/Menu/GetByIds',
    method: 'get'
  },
  postMenu: { //添加菜单
    url: '/api/Menu/Post',
    method: 'post'
  },
  putMenu: { //更新菜单
    url: '/api/Menu/Put',
    method: 'put'
  },
  disableMenu: { //禁用菜单
    url: '/api/Menu/Disable',
    method: 'delete'
  },
  deleteMenu: { //删除菜单
    url: '/api/Menu/Delete',
    method: 'delete'
  },
}

const TasksQzModule = {
  getTasksQzInfo: { //获取全部定时任务数据
    url: '/api/TasksQz/Get',
    method: 'get'
  },
  postTasksQz: { //添加定时任务
    url: '/api/TasksQz/Post',
    method: 'post'
  },
  putTasksQz: { //更新定时任务
    url: '/api/TasksQz/Put',
    method: 'put'
  },
  getReCovery: { //重启定时任务
    url: '/api/TasksQz/ReCovery',
    method: 'get'
  },
  getStartJob: { //启动定时任务
    url: '/api/TasksQz/StartJob',
    method: 'get'
  },
  getStopJob: { //停止定时任务
    url: '/api/TasksQz/StopJob',
    method: 'get'
  },
  deleteTask: { //删除定时任务
    url: '/api/TasksQz/Delete',
    method: 'delete'
  },
}

const logModule = {
  getAccessLogs: {
    url: '/api/Monitor/GetAccessLogs',
    method: 'get'
  },
}

const ApiSetting = {
  ...LoginModule,
  ...UserModule,
  ...DeptModule,
  ...RoleModule,
  ...MenuModule,
  ...TasksQzModule,
  ...logModule,
}

export default ApiSetting
