<template>
  <section>
    <el-card class="box-card" shadow="hover">
      <!--工具条-->
      <v-header icon="md-podium" text="部门列表">
        <div slot="content"></div>
        <div style="text-align: right;">
          <!--快速查询字段-->
           <el-input v-model="filters.name" style="width:200px;padding-right: 5px;" placeholder="部门名称"></el-input>
          <!--操作按钮组-->
          <el-button type="primary" icon="el-icon-search" circle @click.native="getData"></el-button>
          <el-button type="primary" icon="el-icon-plus" circle @click.native="handleAdd"></el-button>
        </div>
      </v-header>
  
      <!--列表-->
      <e-table :table-data="tableData" :table-label="tableLabel" :table-option="tableOption" :now-page="nowPage" :now-size="nowSize" @handleButton="handleButton" @handleSelectionChange="handleSelectionChange"></e-table>
    </el-card>

    <!--弹出界面-->
    <el-dialog :title="formTitle" :visible.sync="formVisible" v-model="formVisible" :close-on-click-modal="false" >
      <el-form :model="deptForm" label-width="80px" :rules="formRules" ref="deptForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="deptForm.deptName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="deptUser">
              <el-select v-model="deptForm.deptUser" placeholder="请选择父级菜单">
                <el-option label="无" value=""></el-option>
                <el-option :label="item.realName" :value="item.id" :key="index" v-for="(item,index) in userData"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="deptForm.remark" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门编码" prop="deptCode">
              <el-input v-model="deptForm.deptCode" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="上级部门" prop="parentDept">
              <el-input v-model="deptForm.parentDept" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="enabled">
              <el-radio-group v-model="deptForm.enabled">
                <el-radio :label="false">正常</el-radio>
                <el-radio :label="true">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button type="primary" @click.native="handleSubmit" >提交</el-button>
      </div>
    </el-dialog>
  
  </section>
</template>

<script>

export default {
    name: 'dept_manager',
    components: {  },
    data() {
        return {
            filters: {
                name: ""
            },
            tableData: [],
            tableLabel: [
              { label: '部门编码', param: 'deptCode'},
              { label: '部门名称', param: 'deptName'},
              { label: '部门负责人', param: 'deptUser'},
              { label: '备注', param: 'remark' },
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
              width: '160',
              options: [
                { label: '', type: 'primary', icon: 'el-icon-edit', methods: 'handleEdit' },
                { label: '', type: 'danger', icon: 'el-icon-delete', methods: 'handleDelete' },
              ]
            },

            nowPage: 1, // 当前页数
            nowSize: 10, // 当前页条数
        
            loading: false,
            sels: [], //列表选中列
    
            formTitle: '',
            formVisible: false, //界面是否显示
            formRules: {
              deptName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
            },
            //界面数据
            deptForm: {
                id: 0,
                deptCode: "",
                deptName: "",
                deptUser: "",
                parentDept: "",
                remark: '',
                enabled: false
            },
            userData: [],
    
        }
    },
    methods: {
        //获取部门列表
        getData() {
          let _this = this;
          this.loading = true;
          this.$ajax(this.$apiSet.getDeptInfo,{
              deptName: this.filters.name
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
        getUserData () {
          let _this = this;
          this.$ajax(this.$apiSet.getUserInfo)
            .then(res => {
              if (!res.data.success) {
                _this.$message({
                  message: res.data.message,
                  type: 'error'
                });
              } else {
                  _this.userData = res.data.response;
				      }
            })
            .catch(err => {})
        },
        handleButton (val) {
          if(val.methods == 'handleEdit') this.handleEdit(val.index,val.row)
          if(val.methods == 'handleDelete') this.handleDelete(val.index,val.row)
        },
        handleSelectionChange (val) {
          this.sels = sels;
        },
        disable(row){
          let _this = this;
          this.$showMsgBox({
            msg: `<p>是否${row.enabled ? `启用`:`禁用` + `【` + row.deptName}】部门?</p>`,
            type: 'warning',
            isHTML: true
          }).then(() => {
            _this.$ajax(this.$apiSet.disableDept,{
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
          let _this = this
          this.$showMsgBox({
             msg: `<p>是否删除【${row.deptName}】部门?</p>`,
             type: 'warning',
             isHTML: true
           }).then(() => {
              _this.$ajax(this.$apiSet.deleteDept,{
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
        //显示编辑界面
        handleEdit(index, row) {
            this.formTitle = "编辑";
            this.formVisible = true;
            this.deptForm = row;
        },
        //显示新增界面
        handleAdd() {
            this.formTitle = "新增";
            this.formVisible = true;
  
            this.deptForm = {
              id: 0,
              deptCode: "",
              deptName: "",
              deptUser: "",
              parentDept: "",
              remark: '',
              enabled: false
            };
        },
        handleSubmit: function() {
          let apiUrl = this.formTitle=='编辑' ? this.$apiSet.putDept:this.$apiSet.postDept;
          let _this = this;
          this.$ajax(apiUrl, this.deptForm)
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
        this.getUserData();
  
    }
};
</script>

<style scoped>
</style>
