<template>
    <div class="user_manager card_css">
        <el-row :gutter="10" style="height:100%;">
            <el-col :sm="24" :md="19" style="height:100%;">
                <el-card class="box-card" shadow="hover">
                    <!--工具条-->
                    <v-header icon="md-podium" text="用户列表">
                      <div slot="content"></div>
                      <div style="text-align: right;">
                        <!--快速查询字段-->
                        <el-input v-model="filters.name"  style="width:160px;padding-right: 5px;" placeholder="用户名/登录名"></el-input>
                        <!--操作按钮组-->
                        <el-button type="primary" icon="el-icon-search" circle @click.native="searchData"></el-button>
                        <el-button type="primary" icon="el-icon-plus" circle @click.native="plusData"></el-button>
                        <el-button type="primary" icon="el-icon-refresh" circle @click.native="refreshData"></el-button>
                      </div>
                    </v-header>
              
                    <!--列表-->
                    <e-table :table-data="tableData" :table-label="tableLabel" :table-option="tableOption" :now-page="nowPage" :now-size="nowSize" @handleRowClick="handleRowClick" @handleButton="handleButton" @handleSelectionChange="handleSelectionChange"></e-table>
                </el-card>
            </el-col>
            <el-col :sm="24" :md="5" style="height:100%;">
                <el-card class="box-card" shadow="hover">
                    <v-header text="角色分配">
                      <div slot="content">{{sels.loginName}}</div>
                      <div style="text-align: right;">
                        <el-tooltip content="保存">
                            <el-button type="primary" icon="el-icon-check" circle :disabled="!showButton" @click.native="saveRole">
                            </el-button>
                        </el-tooltip>
                      </div>
                    </v-header>

                  <div class="tree-box"> 
                    <el-tree ref="roletree" :data="roleData" :props="defaultProps" @node-click="nodeclick" default-expand-all show-checkbox node-key="id" />
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
                            <el-input v-model="userForm.loginName" autocomplete="off" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="用户名" prop="realName">
                            <el-input v-model="userForm.realName" autocomplete="off" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="出生日期">
                            <el-date-picker type="date" placeholder="选择出生日期" v-model="userForm.birth"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="联系方式" prop="mobile">
                            <el-input v-model="userForm.mobile" placeholder="请填写联系方式" autocomplete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密码" prop="loginPwd">
                            <el-input v-model="userForm.loginPwd" show-password  autocomplete="off" :disabled="formTitle=='编辑'?true:false" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="deptId">
                            <el-select v-model="userForm.deptId" placeholder="请选择所属部门" filterable clearable>
                                <el-option label="财务部" value="1"></el-option>
                                <el-option label="开发部" value="2"></el-option>
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
                            <el-input v-model="userForm.address" autocomplete="off" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="userForm.remark" autocomplete="off" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="formVisible = false">取消</el-button>
                <el-button type="primary" @click.native="handleSubmit">提交</el-button>
            </div>
        </el-dialog>
    
    </div>
</template>

<script>
import {debounce} from '@/api/control/index.js'

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
                { label: '所属部门', param: 'deptId'},
                { label: '更新时间', param: 'createTime', sortable: true, width:'160',
                    formatter: row => {
                        return this.$formatDate(new Date(this.$isNull(row.modifyTime) ? row.createTime:row.modifyTime), true);
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
              width: '160',
              options: [
                { label: '', type: 'primary', icon: 'el-icon-edit', methods: 'handleEdit' },
                { label: '', type: 'danger', icon: 'el-icon-delete', methods: 'handleDelete' },
              ]
            },

            nowPage: 1, // 当前页数
            nowSize: 15, // 当前页条数
    
            loading: false,
            sels: {},//列表选中列
            
            formTitle: '',
            formVisible: false, //界面是否显示
            formUsers: {
                loginName: [{required: true, message: '请输入登录名', trigger: 'blur'}],
                realName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                loginPwd: [{required: true, message: '请输入密码', trigger: 'blur'}],
                birth: [{required: true, message: '请填写生日', trigger: 'blur'}]
            },
            //界面数据
            userForm: {
                id: 0,
                loginName: '',
                loginPwd: '',
                realName: '',
                deptId: '',
                mobile: '',
                sex: -1,
                birth: '',
                addres: '',
                enabled: false,
                remark: ''
            },

            showButton: false, //菜单配置保存按钮
            roleData: [],
            defaultProps: {
              children: "children",
              label: "roleName"
            },
        }
    },
    methods: {
        //获取用户列表
        searchData () {
            let _this = this;
            this.$ajax(this.$apiSet.getUserInfo,{
                    key: this.filters.name
                })
                .then(res => {
                    _this.$loading.hideLoading();
                    if (!res.data.success) {
                        _this.$errorMsg(res.data.message)
                    } else {
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
                    _this.$errorMsg(res.data.message)
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
              msg: `<p>是否${row.enabled ? `启用`:`禁用`}【${row.realName}】用户?</p>`,
              type: 'warning',
              isHTML: true
            }).then(() => {
                _this.$ajax(this.$apiSet.disableUser,{
                        id: row.id,
                        falg: !row.enabled
                    }) .then(res => {
                        if (!res.data.success) {
                            _this.$errorMsg(res.data.message)
                        } else {
                            _this.searchData();
                            _this.$successMsg(res.data.message)
				    	}
                    })
                    .catch(err => {})
            }).catch(()=>{});
        },
        //删除
        handleDelete (index, row) {
            let _this = this;
            this.$ajax(this.$apiSet.deleteUesr,{
                    id: row.id
                }) .then(res => {
                    if (!res.data.success) {
                        _this.$errorMsg(res.data.message)
                    } else {
                        _this.searchData();
                        _this.$successMsg(res.data.message)
			    	}
                })
                .catch(err => {})
        },
        // 初始化角色选中
        initialRoleCheck(item) {
            let _this = this;
            this.$refs.roletree.setCheckedKeys([])
            // this.$refs.roletree.setCheckedKeys(item.roleIds ? item.roleIds.split(','):[])
            
            //item.menuIds前提时guid集合，才用下面方法，如果是id集合则用上面注释的方法
            if(!this.$isNull(item.roleIds)){
              this.$ajax(this.$apiSet.getRoleInfo,{
                  ids: item.roleIds,
                })
                .then(res => {
                  if (res.data.success) {
                    let ids = res.data.response.map(item=>item.id);

                    this.checkStrictly = true  //重点：给树节点赋值之前 先设置为true
                    this.$nextTick(() => {
                      this.$refs.roletree.setCheckedKeys(ids) //给树节点赋值
                      this.checkStrictly = false //重点： 赋值完成后 设置为false
                    })
                  }
                })
                .catch(err => {})
            }


        },
        nodeclick(data, node) {
          node.checked = !(node.checked)
        },
        //角色绑定
        saveRole() {
            // let ids = this.$refs.roletree.getCheckedKeys().concat(this.$refs.roletree.getHalfCheckedKeys())
            let ids = this.$refs.roletree.getCheckedNodes(false,true).map(item=> item.guid)

            this.userForm = this.sels
            this.userForm.roleIds = ids.join(',')
    
            this.formTitle = "编辑"
            this.handleSubmit()
        },
        //显示编辑界面
        handleEdit (index, row) {
            this.formTitle = "编辑";
            this.formVisible = true;
            this.userForm = Object.assign({},row);
        },
        //显示新增界面
        plusData() {
            this.formTitle = "新增";
            this.formVisible = true;
            this.userForm = {
                id: 0,
                loginName: '',
                loginPwd: '',
                realName: '',
                deptId: '',
                mobile: '',
                sex: -1,
                birth: '',
                addres: '',
                enabled: false,
                remark: ''
            };
        },
        handleSubmit:debounce(function() {
            if(this.$isNull(this.userForm.loginName)) 
                return this.$warnMsg("用户名不能为空！")
            if(this.$isNull(this.userForm.loginPwd)) 
                return this.$warnMsg("密码不能为空！")

            let apiUrl = this.formTitle=='编辑' ? this.$apiSet.putUser:this.$apiSet.postUser;
            let _this = this;
            this.$ajax(apiUrl, this.userForm)
                .then(res => {
                    if (!res.data.success) {
                        _this.$errorMsg(res.data.message)
                    } else {
                        _this.formVisible = false;
                        _this.searchData();
                        _this.$successMsg(res.data.message)
					}
                })
                .catch(err => {})
        },2000),
        refreshData(){
            let _this = this;

            this.sels = {}
            this.$loading.showLoading()
            this.searchData();
            this.getRoleData();

            this.$nextTick(()=>{
                this.$refs.roletree.setCheckedKeys([])
            })
        },
    },
    mounted() {
        this.refreshData();
    }
}

</script>

<style scoped>
.user_manager{
  height: 100%;
  width: 100%;
}
.user_manager .tree-box {
  height: calc(100% - 50px);
  overflow: auto;
}
</style>
