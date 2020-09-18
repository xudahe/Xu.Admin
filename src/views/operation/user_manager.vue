<template>
    <section>
        <el-row :gutter="10">
           <el-col :sm="24" :md="18">
                <el-card class="box-card" shadow="hover">
                    <!--工具条-->
                    <v-header icon="md-podium" text="用户列表">
                      <div slot="content"></div>
                      <div style="text-align: right;">
                        <!--快速查询字段-->
                        <el-input v-model="filters.name"  style="width:200px;padding-right: 5px;" placeholder="用户名/登录名"></el-input>
                        <!--操作按钮组-->
                        <el-button type="primary" ghost @click.native="getData">查询</el-button>
                        <el-button type="primary" ghost @click.native="handleAdd">新增</el-button>
                        <el-dropdown style="margin-left:5px;">
                          <el-button type="primary">
                            更多<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>导出</el-dropdown-item>
                            <el-dropdown-item>导出</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </v-header>
              
                    <!--列表-->
                    <e-table :table-data="tableData" :table-label="tableLabel" :table-option="tableOption" :now-page="nowPage" :now-size="nowSize" @handleRowClick="handleRowClick" @handleButton="handleButton" @handleSelectionChange="handleSelectionChange"></e-table>
                </el-card>
            </el-col>
            <el-col :sm="24" :md="6">
                <el-card class="box-card card-gutter-sm" shadow="hover">
                  <div slot="header" class="clearfix">
                    <span class="header">{{sels.loginName}}&nbsp;--&nbsp;角色分配</span>
                    <el-button type="primary" style="float: right; padding: 5px 10px" :disabled="!showButton" @click.native="saveRole">
                        <i class="el-icon-check el-icon--left"></i>保存
                    </el-button>
                  </div>
                  <div class="tree-box"> 
                    <el-tree ref="role" :data="roleData" :default-checked-keys="roleIds" :props="defaultProps" default-expand-all show-checkbox node-key="id" />
                  </div>
                </el-card>
            </el-col>
        </el-row>

        <!--弹出界面-->
        <el-dialog :title="formTitle" :visible.sync="formVisible" v-model="formVisible" :close-on-click-modal="false">
            <el-form :model="userForm" label-width="80px" :rules="formUsers" ref="userForm">
                <el-row style="padding:0 10px;">
                    <el-col :span="12">
                        <el-form-item label="登录名" prop="loginName">
                            <el-input v-model="userForm.loginName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="realName">
                            <el-input v-model="userForm.realName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="出生日期">
                            <el-date-picker type="date" placeholder="选择出生日期" v-model="userForm.birth"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="联系方式" prop="mobile">
                            <el-input v-model="userForm.mobile" placeholder="请填写联系方式" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密码" prop="loginPwd">
                            <el-input v-model="userForm.loginPwd" show-password  auto-complete="off" :disabled="formTitle=='编辑'?true:false"></el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="deptName">
                            <el-select v-model="userForm.deptName" placeholder="请选择所属部门">
                                <el-option label="财务部" value="1"></el-option>
                                <el-option label="技术部" value="2"></el-option>
                                <el-option label="市场部" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="userForm.sex">
                                <el-radio class="radio" :label="1">男</el-radio>
                                <el-radio class="radio" :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="状态" prop="enabled">
                          <el-radio-group v-model="userForm.enabled">
                            <el-radio :label="false">正常</el-radio>
                            <el-radio :label="true">禁用</el-radio>
                          </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="地址">
                            <el-input v-model="userForm.address" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="userForm.remark" auto-complete="off" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="handleSubmit">提交</el-button>
            </div>
        </el-dialog>
    
    </section>
</template>

<script>

export default {
    name: 'user_manager',
    data() {
        return {
            filters: {
                name: ''
            },
            tableData: [],
            tableLabel: [
                { label: '登录名', param: 'loginName'},
                { label: '用户名', param: 'realName' },
                { label: '所属部门', param: 'deptName'},
                { label: '创建时间', param: 'createTime', sortable: true, width:'160',
                    formatter: row => {
                        return (!row.createTime || row.createTime == '') ? '':this.$formatDate(new Date(row.createTime), true);
                    } 
                },
                { label: '状态', param: 'enabled', width:'80', 
                    render: (h, params) => {
                        if (!params.row.enabled){
                            return h('el-tag', {
                                props: {
                                    type: 'success',
                                    size: 'mini',
                                },
                                style: {
									cursor: 'pointer'
                                },
                                on: {
		              				click: e => {
                                        e.stopPropagation(); //阻止row-click事件冒泡
		              					this.disable(params.row)
		              				}
		              			}
                            },'正常')
                        }
                        else {
                            return h('el-tag', {
                                props: {
                                    type: 'danger',
                                    size: 'mini',
                                },
                                style: {
									cursor: 'pointer'
                                },
                                on: {
		              				click: e => {
                                        e.stopPropagation(); //阻止row-click事件冒泡
		              					this.disable(params.row)
		              				}
		              			}
                            },'禁用')
                        }
                    },
                },
            ],
            tableOption: {
              label: '操作',
              width: '200',
              options: [
                { label: '编辑', type: 'primary', icon: '', methods: 'handleEdit' },
                { label: '删除', type: 'danger', icon: '', methods: 'handleDelete' },
              ]
            },

            nowPage: 1, // 当前页数
            nowSize: 10, // 当前页条数
    
            loading: false,
            sels: [],//列表选中列
            
            formTitle: '',
            formVisible: false, //界面是否显示
            formUsers: {
                loginName: [
                    {required: true, message: '请输入登录名', trigger: 'blur'}
                ],
                realName: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                loginPwd: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],
                birth: [
                    {required: true, message: '请填写生日', trigger: 'blur'}
                ]
            },
            //界面数据
            userForm: {
                id: 0,
                loginName: '',
                loginPwd: '',
                realName: '',
                deptName: '',
                mobile: '',
                sex: -1,
                birth: '',
                addres: '',
                enabled: false,
                remark: ''
            },

            showButton: false, //菜单配置保存按钮
            roleData: [],
            roleIds: [],
            defaultProps: {
              children: "children",
              label: "roleName"
            },
        }
    },
    methods: {
        //获取用户列表
        getData () {
            let _this = this;
            this.loading = true;
            this.$ajax(this.$apiSet.getUserInfo,{
                    key: this.filters.name
                })
                .then(res => {
                    if (!res.data.success) {
                        _this.$message({
                            message: res.data.message,
                            type: 'error'
                        });
                    } else {
                        _this.loading = false;
                        _this.tableData = res.data.response;
					}
                })
                .catch(err => {})
        },
        getRoleData() {
          let _this = this;
          this.$ajax(this.$apiSet.getRoleInfo)
            .then(res => {
                if (!res.data.success) {
                    _this.$message({
                        message: res.data.message,
                        type: 'error'
                    });
                } else {
                    _this.roleData = res.data.response;
				}
            })
            .catch(err => {})
        },
        handleButton (val) {
          if(val.methods == 'handleEdit') this.handleEdit(val.index,val.row)
          if(val.methods == 'handleDelete') this.handleDelete(val.index,val.row)
        },
        handleRowClick (val) {
          this.sels = val;
          this.showButton = true;
          this.initialRoleCheck(val);
        },
        handleSelectionChange (val) {
            this.sels = val;
        },
        disable(row){
            let _this = this;
            this.$showMsgBox({
              msg: `<p>是否${row.enabled ? `启用`:`禁用` + `【` + row.realName}】用户?</p>`,
              type: 'warning',
              isHTML: true
            }).then(() => {
                _this.$ajax(this.$apiSet.disableUser,{
                        id: row.id,
                        falg: !row.enabled
                    }) .then(res => {
                        if (!res.data.success) {
                            _this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        } else {
                            _this.getData();
                            _this.$message({
                                message: res.data.message,
                                type: 'success'
                            });
				    	}
                    })
                    .catch(err => {})
            }).catch(()=>{});
        },
        //删除
        handleDelete (index, row) {
            let _this = this;
            this.$showMsgBox({
              msg: `<p>是否删除【${row.realName}】用户?</p>`,
              type: 'warning',
              isHTML: true
            }).then(() => {
                _this.$ajax(this.$apiSet.deleteUesr,{
                        id: row.id
                    }) .then(res => {
                        if (!res.data.success) {
                            _this.$message({
                                message: res.data.message,
                                type: 'error'
                            });
                        } else {
                            _this.getData();
                            _this.$message({
                                message: res.data.message,
                                type: 'success'
                            });
				    	}
                    })
                    .catch(err => {})
            }).catch(()=>{});
        },
        // 初始化角色选中
        initialRoleCheck(item) {
            this.roleIds = item.roleIds.split(',')
        },
        //角色绑定
        saveRole() {
          let roleIds = [];
          
          // 得到已选中的 key 值
          this.$refs.role.getCheckedKeys().forEach(function(data, index) {
            roleIds.push(data);
          });
          
          this.userForm = this.sels
          this.userForm.roleIds = roleIds.join(',')
          
          this.formTitle = "编辑"
          this.handleSubmit()
        },
        //显示编辑界面
        handleEdit (index, row) {
            this.formTitle = "编辑";
            this.formVisible = true;
            this.userForm = row;
        },
        //显示新增界面
        handleAdd() {
            this.formTitle = "新增";
            this.formVisible = true;
            this.userForm = {
                id: 0,
                loginName: '',
                loginPwd: '',
                realName: '',
                deptName: '',
                mobile: '',
                sex: -1,
                birth: '',
                addres: '',
                enabled: false,
                remark: ''
            };
        },
        handleSubmit () {
            let apiUrl = this.formTitle=='编辑' ? this.$apiSet.putUser:this.$apiSet.postUser;
            let _this = this;
            this.$ajax(apiUrl, this.userForm)
                .then(res => {
                    if (!res.data.success) {
                        _this.$message({
                            message: res.data.message,
                            type: 'error'
                        });
                    } else {
                        _this.formVisible = false;
                        _this.getData();

                        _this.$message({
                            message: res.data.message,
                            type: 'success'
                        });
					}
                })
                .catch(err => {})
        },
    },
    mounted() {
        this.getData();
        this.getRoleData();
    }
}

</script>

<style scoped>

</style>
