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
  GetUserByToken: { //根据Token获取用户信息
    url: '/api/User/GetInfoByToken',
    method: 'get'
  },
  GetUserInfo: { //获取用户列表信息
    url: '/api/User/Get',
    method: 'get'
  },
}

const DeptModule = {
  GetDeptInfo: {
    url: '/api/Dept/Get',
    method: 'get'
  },
}

const RoleModule = {
  GetRoleInfo: {
    url: '/api/Role/Get',
    method: 'get'
  },
  GetRoleByIds: {
    url: '/api/Role/GetByIds',
    method: 'get'
  },
}

const MenuModule = {
  GetMenuInfo: {
    url: '/api/Menu/Get',
    method: 'get'
  },
  GetMenuByIds: {
    url: '/api/Menu/GetByIds',
    method: 'get'
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
