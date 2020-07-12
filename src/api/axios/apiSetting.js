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
  getUserInfo: { //获取全部角色并分页
    url: '/api/User/Get',
    method: 'get'
  }, 
  getUserByIds: { //根据用户Ids查询用户列表
    url: '/api/User/GetByIds',
    method: 'get'
  },
  getUserByAdd: { //添加用户
    url: '/api/User/Post',
    method: 'post'
  },
  getUserByUpdate: { //更新用户
    url: '/api/User/Put',
    method: 'put'
  },
  getUserByDisable: { //禁用用户
    url: '/api/User/Disable',
    method: 'put'
  },
  getUserByDelete: { //删除用户
    url: '/api/User/Delete',
    method: 'delete'
  },
}

const DeptModule = {
  getDeptInfo: { //获取全部部门并分页
    url: '/api/Dept/Get',
    method: 'get'
  },
  getDeptByIds: { //根据部门Ids查询部门列表
    url: '/api/Dept/GetByIds',
    method: 'get'
  },
  getDeptByAdd: { //添加部门
    url: '/api/Dept/Post',
    method: 'post'
  },
  getDeptByUpdate: { //更新部门
    url: '/api/Dept/Put',
    method: 'put'
  },
  getDeptByDisable: { //禁用部门
    url: '/api/Dept/Disable',
    method: 'put'
  },
  getDeptByDelete: { //删除部门
    url: '/api/Dept/Delete',
    method: 'delete'
  },
}

const RoleModule = {
  getRoleInfo: { //获取全部角色并分页
    url: '/api/Role/Get',
    method: 'get'
  },
  getRoleByIds: { //根据角色Ids查询角色列表
    url: '/api/Role/GetByIds',
    method: 'get'
  },
  getRoleByAdd: { //添加角色
    url: '/api/Role/Post',
    method: 'post'
  },
  getRoleByUpdate: { //更新角色
    url: '/api/Role/Put',
    method: 'put'
  },
  getRoleByDisable: { //禁用角色
    url: '/api/Role/Disable',
    method: 'put'
  },
  getRoleByDelete: { //删除角色
    url: '/api/Role/Delete',
    method: 'delete'
  },
}

const MenuModule = {
  getMenuInfo: { //获取全部菜单并分页
    url: '/api/Menu/Get',
    method: 'get'
  },
  getMenuByIds: { //根据菜单Ids查询菜单列表
    url: '/api/Menu/GetByIds',
    method: 'get'
  },
  getMenuByAdd: { //添加菜单
    url: '/api/Menu/Post',
    method: 'post'
  },
  getMenuByUpdate: { //更新菜单
    url: '/api/Menu/Put',
    method: 'put'
  },
  getMenuByDisable: { //禁用菜单
    url: '/api/Menu/Disable',
    method: 'put'
  },
  getMenuByDelete: { //删除菜单
    url: '/api/Menu/Delete',
    method: 'delete'
  },
}

const ApiSetting = {
  ...LoginModule,
  ...UserModule,
  ...DeptModule,
  ...RoleModule,
  ...MenuModule,
}

export default ApiSetting
