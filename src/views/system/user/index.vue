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
                    <e-table :table-data="tableData" :table-label="tableLabel" :table-option="tableOption" :now-page="nowPage" :now-size="nowSize" @handleRowClick="handleRowClick" @handleButton="handleButton" @handleSortChange="handleSortChange" @handleSelectionChange="handleSelectionChange"></e-table>
                </el-card>
            </el-col>
            <el-col :sm="24" :md="6">
                <el-card class="box-card card-gutter-sm" shadow="hover">
                  <div slot="header" class="clearfix">
                    <span class="header">{{sels.LoginName}}&nbsp;-&nbsp;角色分配</span>
                    <el-button type="primary" style="float: right; padding: 5px 10px" :disabled="!showButton" @click.native="saveRole">
                        <i class="el-icon-check el-icon--left"></i>保存
                    </el-button>
                  </div>
                  <div class="tree-box"> 
                    <el-tree ref="role" :data="roles" :default-checked-keys="roleIds" :props="defaultProps" default-expand-all show-checkbox node-key="id" />
                  </div>
                </el-card>
            </el-col>
        </el-row>

        <!--弹出界面-->
        <el-dialog :title="formTitle" :visible.sync="formVisible" v-model="formVisible" :close-on-click-modal="false">
            <el-form :model="userForm" label-width="80px" :rules="formUsers" ref="userForm">
                <el-row style="padding:0 10px;">
                    <el-col :span="12">
                        <el-form-item label="登录名" prop="LoginName">
                            <el-input v-model="userForm.LoginName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="RealName">
                            <el-input v-model="userForm.RealName" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="出生日期">
                            <el-date-picker type="date" placeholder="选择出生日期" v-model="userForm.Birth"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="联系方式" prop="Mobile">
                            <el-input v-model="userForm.Mobile" placeholder="请填写联系方式" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密码" prop="LoginPwd">
                            <el-input v-model="userForm.LoginPwd" show-password  auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="DeptName">
                            <el-select v-model="userForm.DeptName" placeholder="请选择所属部门">
                                <el-option label="财务部" value="1"></el-option>
                                <el-option label="市场部" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="性别" prop="Sex">
                            <el-radio-group v-model="userForm.Sex">
                                <el-radio class="radio" :label="1">男</el-radio>
                                <el-radio class="radio" :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="状态" prop="Enabled">
                          <el-radio-group v-model="userForm.Enabled">
                            <el-radio :label="1">正常</el-radio>
                            <el-radio :label="0">禁用</el-radio>
                          </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="地址">
                            <el-input v-model="userForm.Address" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="Remark">
                          <el-input v-model="userForm.Remark" auto-complete="off" type="textarea"></el-input>
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
            tableData: [
                {LoginName:'鱼',RealName:'张三',DeptName:'市场部',CreateTime:'',Enabled:true}
            ],
            tableLabel: [
                { label: '登录名', param: 'LoginName'},
                { label: '用户名', param: 'RealName' },
                { label: '所属部门', param: 'DeptName',width:'200' },
                { label: '创建时间', param: 'CreateTime', sortable: true,
                    formatter: row => {
                        return (!row.CreateTime || row.CreateTime == '') ? '':this.$formatDate(new Date(row.CreateTime), true);
                    } 
                },
                { label: '状态', param: 'Enabled', 
                    render: (h, params) => {
                        if (params.row.Enabled){
                            return h('el-tag', {
                                props: {
                                    type: 'success',
                                    size: 'mini',
                                },
                            },'正常')
                        }
                        else {
                            return h('el-tag', {
                                props: {
                                    type: 'danger',
                                    size: 'mini',
                                },
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
    
            listLoading: false,
            sels: [],//列表选中列
            
            roleFormVisible: false, //绑定页面是否显示
            roleLoading: false,
            
            formTitle: '',
            formVisible: false, //界面是否显示
            formUsers: {
                LoginName: [
                    {required: true, message: '请输入登录名', trigger: 'blur'}
                ],
                RealName: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                LoginPwd: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ],
                Birth: [
                    {required: true, message: '请填写生日', trigger: 'blur'}
                ]
            },
            //界面数据
            userForm: {
                id: 0,
                LoginName: '',
                LoginPwd: '',
                RealName: '',
                DeptName: '',
                Mobile: '',
                Sex: -1,
                Birth: '',
                Addres: '',
                Enabled: 1,
                remark: ''
            },

            showButton: false, //菜单配置保存按钮
            roles: [],
            roleIds: [],
            defaultProps: {
              children: "children",
              label: "name"
            },
        }
    },
    methods: {
        //获取用户列表
        getData () {
            // this.listLoading = true;
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
        handleSortChange (val) {

        },
        handleSelectionChange (val) {
            this.sels = val;
        },
        //删除
        handleDelete (index, row) {
            this.$showMsgBox({
              msg: `<p>是否删除${row.RealName}用户?</p>`,
              type: 'warning',
              isHTML: true
            }).then(() => {
              
            });
        },
        // 初始化角色选中
        initialRoleCheck(item) {
          item.roles.forEach((val, ind) => {
            let add = true;
            for (let i = 0; i < item.roles.length; i++) {
              if (val.id === item.roles[i].parentId) {
                add = false;
                break;
              }
            }
            if (add) {
              this.roleIds.push(val.id);
            }
          });
        },
        //角色绑定
        saveRole() {
          const role = { id: this.roleId, roles: [] };
          // 得到半选的父节点数据，保存起来
          this.$refs.role.getHalfCheckedNodes().forEach(function(data, index) {
            const permission = { id: data.id };
            role.roles.push(permission);
          });
          // 得到已选中的 key 值
          this.$refs.role.getCheckedKeys().forEach(function(data, index) {
            const permission = { id: data };
            role.roles.push(permission);
          });
        },
        //显示编辑界面
        handleEdit (index, row) {
            this.formTitle = "编辑";
            this.formVisible = true;
            this.roleForm = row;
        },
        //显示新增界面
        handleAdd() {
            this.formTitle = "新增";
            this.formVisible = true;
            this.userForm = {
                id: 0,
                uLoginName: '',
                uRealName: '',
                uLoginPWD: '',
                sex: -1,
                birth: '',
                address: '',
                remark: ''
            };
        },
        handleSubmit () {
            
        },
    },
    mounted() {
        this.getData();
    }
}

</script>

<style scoped>

</style>
