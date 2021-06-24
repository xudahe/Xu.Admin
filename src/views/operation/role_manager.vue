<!-- 
  1、xs，小于768px
  2、sm，大于等于768px
  3、md，大于等于992px
  4、lg，大于等于1200px
  5、xl，大于等于1920px
  <el-row :gutter="10">
    <el-col :xs="8" :sm="6" :md="4" :lg="3"></el-col>
    <el-col :xs="4" :sm="6" :md="8" :lg="9"></el-col>
    <el-col :xs="4" :sm="6" :md="8" :lg="9"></el-col>
    <el-col :xs="8" :sm="6" :md="4" :lg="3"></el-col>
  </el-row>
-->
<template>
  <div class="role_manager card_css">
    <el-row :gutter="10" style="height:100%;">
      <el-col :sm="24" :md="19" style="height:100%;">
        <el-card class="box-card" shadow="hover">
          <!--工具条-->
          <v-header icon="md-podium" text="角色列表">
            <div slot="content"></div>
            <div style="text-align: right;">
              <!--快速查询字段-->
              <el-input v-model="filters.name" style="width:160px;padding-right: 5px;" placeholder="角色名称"></el-input>
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
            <div slot="content">{{sels.roleName}}</div>
            <div style="text-align: right;">
              <el-tooltip content="保存">
                <el-button type="primary" icon="el-icon-check" circle :disabled="!showButton" @click.native="saveMenu">
                </el-button>
              </el-tooltip>
            </div>
          </v-header>

          <div class="tree-box">
            <el-tree ref="menutree" :data="menuData" :check-strictly="checkStrictly" :props="defaultProps" @node-click="nodeclick" default-expand-all show-checkbox node-key="id" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--弹出界面-->
    <el-dialog :title="formTitle" :visible.sync="formVisible" v-model="formVisible" :close-on-click-modal="false">
      <el-form :model="roleForm" label-width="80px" :rules="formRules" ref="roleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="roleForm.remark" autocomplete="off" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色编码" prop="roleCode">
              <el-input v-model="roleForm.roleCode" autocomplete="off"></el-input>
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

  </div>
</template>

<script>
import { debounce } from '@/api/control/index.js'

export default {
  name: 'role_manager',
  data() {
    return {
      filters: {
        name: ""
      },

      tableData: [],
      tableLabel: [
        { label: '角色编码', param: 'roleCode' },
        { label: '角色名称', param: 'roleName' },
        // { label: '备注', param: 'remark' },
        {
          label: '更新时间', param: 'createTime', sortable: true, width: '160',
          formatter: row => {
            return this.$formatDate(new Date(this.$isNull(row.modifyTime) ? row.createTime : row.modifyTime), true);
          }
        },
        {
          label: '状态', param: 'enabled', width: '80',
          render: (h, params) => {
            if (!params.row.enabled) {
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
              }, '正常')
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
              }, '禁用')
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
      sels: {}, //列表选中列

      formTitle: '',
      formVisible: false, //界面是否显示
      formRules: {
        // roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }],
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
      menuData: [],
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "menuName",
        disabled: "enabled"
      },

    }
  },
  methods: {
    //获取角色列表
    searchData() {
      let _this = this;
      this.$ajax(this.$apiSet.getRoleInfo, {
        roleName: this.filters.name
      }).then(res => {
        _this.$loading.hideLoading();
        if (!res.data.success) {
          _this.$errorMsg(res.data.message)
        } else {
          _this.tableData = res.data.response;
        }
      }).catch(err => { })
    },
    getMenuData() {
      let _this = this;
      this.$ajax(this.$apiSet.getMenuByIds)
        .then(res => {
          if (!res.data.success) {
            _this.$errorMsg(res.data.message)
          } else {
            _this.menuData = res.data.response;
          }
        }).catch(err => { })
    },
    handleButton(val) {
      if (val.methods == 'handleEdit') this.handleEdit(val.index, val.row)
      if (val.methods == 'handleDelete') this.handleDelete(val.index, val.row)
    },
    handleRowClick(val) {
      this.sels = val;
      this.showButton = true;
      this.initialMenuCheck(val);
    },
    handleSelectionChange(val) {
      this.sels = val;
    },
    disable(row) {
      let _this = this;
      this.$showMsgBox({
        msg: `<p>是否${row.enabled ? `启用` : `禁用`}【${row.roleName}】角色?</p>`,
        type: 'warning',
        isHTML: true
      }).then(() => {
        _this.$ajax(this.$apiSet.disableRole, {
          id: row.id,
          falg: !row.enabled
        }).then(res => {
          if (!res.data.success) {
            _this.$errorMsg(res.data.message)
          } else {
            _this.searchData();
            _this.$successMsg(res.data.message)
          }
        }).catch(err => { })
      }).catch(() => { });
    },
    //删除
    handleDelete(index, row) {
      let _this = this;
      this.$ajax(this.$apiSet.deleteRole, {
        id: row.id
      }).then(res => {
        if (!res.data.success) {
          _this.$errorMsg(res.data.message)
        } else {
          _this.searchData();
          _this.$successMsg(res.data.message)
        }
      }).catch(err => { })
    },
    // 初始化菜单选中
    initialMenuCheck(item) {
      let _this = this;
      this.$refs.menutree.setCheckedNodes([])
      // this.$refs.menutree.setCheckedKeys(item.menuIds ? item.menuIds.split(','):[])

      //item.menuIds前提时guid集合，才用下面方法，如果是id集合则用上面注释的方法
      if (!this.$isNull(item.menuIds)) {
        this.$ajax(this.$apiSet.getMenuInfo, {
          ids: item.menuIds,
        }).then(res => {
          if (res.data.success) {
            this.checkStrictly = true  //重点：给树节点赋值之前 先设置为true
            this.$nextTick(() => {
              this.$refs.menutree.setCheckedNodes(res.data.response) //给树节点赋值
              this.checkStrictly = false //重点： 赋值完成后 设置为false
            })
          }
        }).catch(err => { })
      }
    },
    nodeclick(data, node) {
      node.checked = !(node.checked)
    },
    //菜单绑定
    saveMenu() {
      // let ids = this.$refs.menutree.getCheckedKeys().concat(this.$refs.menutree.getHalfCheckedKeys())
      let ids = this.$refs.menutree.getCheckedNodes(false, true).map(item => item.guid)

      this.roleForm = this.sels
      this.roleForm.menuIds = ids.join(',')

      this.formTitle = "菜单绑定"
      this.handleSubmit()
    },
    //显示编辑界面
    handleEdit(index, row) {
      this.formTitle = "编辑";
      this.formVisible = true;
      this.roleForm = Object.assign({}, row);
    },
    //显示新增界面
    plusData() {
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
    handleSubmit: debounce(function () {
      if (this.$isNull(this.roleForm.roleName))
        return this.$warnMsg("角色名称不能为空！")

      let _this = this;
      let apiUrl = this.formTitle != '编辑' ? this.$apiSet.putRole : this.$apiSet.postRole;
      this.$ajax(apiUrl, this.roleForm)
        .then(res => {
          if (!res.data.success) {
            _this.$errorMsg(res.data.message)
          } else {
            _this.formVisible = false;
            _this.searchData();
            if (_this.formTitle == "菜单绑定")
              _this.$successMsg("菜单绑定成功，请重新登录！")
            else
              _this.$successMsg(res.data.message)
          }
        }).catch(err => { })
    }, 2000),
    refreshData() {
      let _this = this;

      this.sels = {}
      this.$loading.showLoading()
      this.searchData();
      this.getMenuData();

      this.$nextTick(() => {
        _this.$refs.menutree.setCheckedKeys([])
      })
    },
  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style scoped>
.role_manager {
  height: 100%;
  width: 100%;
}
.role_manager .tree-box {
  height: calc(100% - 50px);
  overflow: auto;
}
</style>
