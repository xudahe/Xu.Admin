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
  getUserInfo: { //获取全部用户
    url: '/api/User/Get',
    method: 'get'
  }, 
  getUserByIds: { //根据用户Ids查询用户列表
    url: '/api/User/GetByIds',
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
  getDeptInfo: { //获取全部部门
    url: '/api/Dept/Get',
    method: 'get'
  },
  getDeptByIds: { //根据部门Ids查询部门列表
    url: '/api/Dept/GetByIds',
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
  getRoleInfo: { //获取全部角色
    url: '/api/Role/Get',
    method: 'get'
  },
  getRoleByIds: { //根据角色Ids查询角色列表
    url: '/api/Role/GetByIds',
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
  getMenuInfo: { //获取全部菜单
    url: '/api/Menu/Get',
    method: 'get'
  },
  getMenuByIds: { //根据菜单Ids查询菜单列表
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
  ...logModule,
}

export default ApiSetting
