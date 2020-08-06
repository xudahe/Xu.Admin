<template>
  <section>
    <el-row :gutter="10">
      <el-col :sm="24" :md="18">
        <el-card class="box-card" shadow="hover">
          <!--工具条-->
          <v-header icon="md-podium" text="角色列表">
            <div slot="content"></div>
            <div style="text-align: right;">
              <!--快速查询字段-->
               <el-input v-model="filters.name" style="width:200px;padding-right: 5px;" placeholder="角色名称"></el-input>
              <!--操作按钮组-->
              <el-button type="primary" @click.native="getData">查询</el-button>
              <el-button type="primary" @click.native="handleAdd">新增</el-button>
            </div>
          </v-header>
          <!--列表-->
          <e-table :table-data="tableData" :table-label="tableLabel" :table-option="tableOption" :now-page="nowPage" :now-size="nowSize" @handleRowClick="handleRowClick"  @handleButton="handleButton" @handleSortChange="handleSortChange" @handleSelectionChange="handleSelectionChange"></e-table>
        </el-card>
      </el-col>
      <el-col :sm="24" :md="6">
        <el-card class="box-card card-gutter-sm" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="header">{{sels.roleName}}&nbsp;-&nbsp;菜单分配</span>
            <el-button type="primary" style="float: right; padding: 5px 10px" :disabled="!showButton" @click.native="saveMenu">
              <i class="el-icon-check el-icon--left"></i>保存
            </el-button>
          </div>
          <div class="tree-box"> 
            <el-tree ref="menu" :data="menus" :default-checked-keys="menuIds" :props="defaultProps" default-expand-all show-checkbox node-key="id" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--弹出界面-->
    <el-dialog :title="formTitle" :visible.sync="formVisible" v-model="formVisible" :close-on-click-modal="false" >
      <el-form :model="roleForm" label-width="80px" :rules="formRules" ref="roleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="roleForm.remark" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色编码" prop="roleCode">
              <el-input v-model="roleForm.roleCode" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="enabled">
              <el-radio-group v-model="roleForm.enabled">
                <el-radio :label="false">正常</el-radio>
                <el-radio :label="true">禁用</el-radio>
              </el-radio-group>
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
    name: 'role_manager',
    data() {
        return {
            filters: {
                name: ""
            },
            tableData: [],
            tableLabel: [
              { label: '角色编码', param: 'roleCode'},
              { label: '角色名称', param: 'roleName'},
              // { label: '备注', param: 'remark' },
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
            sels: [], //列表选中列
    
            formTitle: '',
            formVisible: false, //界面是否显示
            formRules: {
              roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }],
            },
            //界面数据
            roleForm: {
              id: 0,
              roleName: "",
              roleCode: "",
              remark: '',
              enabled: false
            },

            showButton: false, //菜单配置保存按钮
            menus: this.$store.getters.menus,
            menuIds: [],
            defaultProps: {
              children: "children",
              label: "menuName"
            },
    
        }
    },
    methods: {
        //获取角色列表
        getData () {
          let _this = this;
          this.loading = true;
          this.$ajax(this.$apiSet.getRoleInfo)
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
        handleButton (val) {
          if(val.methods == 'handleEdit') this.handleEdit(val.index,val.row)
          if(val.methods == 'handleDelete') this.handleDelete(val.index,val.row)
        },
        handleRowClick (val) {
          this.sels = val;
          this.showButton = true;
          this.initialMenuCheck(val);
        },
        handleSortChange (val) {
          
        },
        handleSelectionChange (val) {
          this.sels = val;
        },
        disable(row){
          let _this = this;
          this.$showMsgBox({
            msg: `<p>是否${row.enabled ? `启用`:`禁用` + `【` + row.roleName}】角色?</p>`,
            type: 'warning',
            isHTML: true
          }).then(() => {
            _this.$ajax(this.$apiSet.disableRole,{
                id: row.id,
                falg: !row.enabled
            }).then(res => {
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
        handleDelete(index, row) {
          let _this = this;
          this.$showMsgBox({
            msg: `<p>是否删除【${row.roleName}】角色?</p>`,
            type: 'warning',
            isHTML: true
          }).then(() => {
            _this.$ajax(this.$apiSet.deleteRole,{
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
        // 初始化菜单选中
        initialMenuCheck(item) {
          item.menus.forEach((val, ind) => {
            let add = true;
            for (let i = 0; i < item.menus.length; i++) {
              if (val.id === item.menus[i].parentId) {
                add = false;
                break;
              }
            }
            if (add) {
              this.menuIds.push(val.id);
            }
          });
        },
        //菜单绑定
        saveMenu() {
          let menuIds = [];
          // 得到半选的父节点数据，保存起来
          this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
            debugger
            menuIds.push({id: data.id});
          });
          // 得到已选中的 key 值
          this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
            debugger
            menuIds.push({id: data.id});
          });
          
          console.log(menuIds)
          this.roleForm = this.sels
          this.roleForm.menuIds = menuIds.join(',')
          
          this.formTitle = "编辑"
          this.handleSubmit()
        },
        //显示编辑界面
        handleEdit(index, row) {
            this.formTitle = "编辑";
            this.formVisible = true;
            this.roleForm = row;
        },
        //显示新增界面
        handleAdd() {
            this.formTitle = "新增";
            this.formVisible = true;
  
            this.roleForm = {
              id: 0,
              roleName: "",
              roleCode: "",
              remark: '',
              enabled: false
            };
        },
        handleSubmit() {
          let _this = this;
          let apiUrl = this.formTitle=='编辑' ? this.$apiSet.putRole:this.$apiSet.postRole;
          this.$ajax(apiUrl, this.roleForm)
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
    }
};
</script>

<style scoped>
</style>
