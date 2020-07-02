const LoginModule = {
  requestToken: {
    url: '/api/Login/GetJwtToken',
    method: 'get'
  },
  refreshToken: {
    url: '/api/Login/RefreshToken',
    method: 'get'
  },
}


const UserModule = {
  GetUserByToken: {
    url: '/api/User/Get',
    method: 'get'
  },
  GetUserInfo: {
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
}

const MenuModule = {
  GetMenuInfo: {
    url: '/api/Menu/Get',
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
