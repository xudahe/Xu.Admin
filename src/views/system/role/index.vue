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
            <span class="header">{{sels.RoleName}}&nbsp;-&nbsp;菜单分配</span>
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
            <el-form-item label="角色名称" prop="RoleName">
              <el-input v-model="roleForm.RoleName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="Remark">
              <el-input v-model="roleForm.Remark" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色编码" prop="RoleCode">
              <el-input v-model="roleForm.RoleCode" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="Enabled">
              <el-radio-group v-model="roleForm.Enabled">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
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
            tableData: [
              {RoleCode:'GLY1',RoleName:'管理员1',CreateTime:new Date(),Enabled:true},
              {RoleCode:'GLY2',RoleName:'管理员2',CreateTime:new Date(),Enabled:true}
            ],
            tableLabel: [
              // { label: '角色编码', param: 'RoleCode'},
              { label: '角色名称', param: 'RoleName'},
              // { label: '备注', param: 'Remark' },
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
            sels: [], //列表选中列
    
            formTitle: '',
            formVisible: false, //界面是否显示
            formRules: {
              RoleName: [{ required: true, message: "请输入角色名", trigger: "blur" }],
            },
            //界面数据
            roleForm: {
                Id: 0,
                RoleName: "",
                RoleCode: "",
                Remark: '',
                Enabled: 1
            },

            showButton: false, //菜单配置保存按钮
            menus: this.$store.getters.menus,
            menuIds: [],
            defaultProps: {
              children: "children",
              label: "name"
            },
    
        }
    },
    methods: {
        //获取角色列表
        getData() {
          let _this = this;
          // this.listLoading = true;
  
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
        //删除
        handleDelete(index, row) {
          this.$showMsgBox({
              msg: `<p>是否删除${row.RoleName}角色?</p>`,
              type: 'warning',
              isHTML: true
            }).then(() => {
              
            });
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
          const role = { id: this.roleId, menus: [] };
          // 得到半选的父节点数据，保存起来
          this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
            const permission = { id: data.id };
            role.menus.push(permission);
          });
          // 得到已选中的 key 值
          this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
            const permission = { id: data };
            role.menus.push(permission);
          });
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
              CreateBy: "",
              Name: "",
              Remark: '',
              Enabled: ""
            };
        },
        handleSubmit: function() {
            let _this = this;
          
        },
    },
    mounted() {
      this.getData();
    }
};
</script>

<style scoped>
</style>
