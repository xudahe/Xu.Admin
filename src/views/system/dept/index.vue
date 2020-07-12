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
          <el-button type="primary" @click.native="getData">查询</el-button>
          <el-button type="primary" @click.native="handleAdd">新增</el-button>
        </div>
      </v-header>
  
      <!--列表-->
      <e-table :table-data="tableData" :table-label="tableLabel" :table-option="tableOption" :now-page="nowPage" :now-size="nowSize" @handleButton="handleButton" @handleSortChange="handleSortChange" @handleSelectionChange="handleSelectionChange"></e-table>
    </el-card>

    <!--弹出界面-->
    <el-dialog :title="formTitle" :visible.sync="formVisible" v-model="formVisible" :close-on-click-modal="false" >
      <el-form :model="deptForm" label-width="80px" :rules="formRules" ref="deptForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="DeptName">
              <el-input v-model="deptForm.DeptName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="DeptManager">
              <el-input v-model="deptForm.DeptManager" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="Remark">
              <el-input v-model="deptForm.Remark" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门编码" prop="DeptCode">
              <el-input v-model="deptForm.DeptCode" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="上级部门" prop="ParentDept">
              <el-input v-model="deptForm.ParentDept" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="Enabled">
              <el-radio-group v-model="deptForm.Enabled">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
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
            tableData: [
              {DeptCode:'鱼',DeptName:'king',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:true},
              {DeptCode:'猫',DeptName:'tangmu',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
              {DeptCode:'鼠',DeptName:'tuoni',DeptUser:'市场部',Remark:"",CreateTime: new Date(),Enabled:false},
            ],
            tableLabel: [
              { label: '部门编码', param: 'DeptCode'},
              { label: '部门名称', param: 'DeptName'},
              { label: '部门负责人', param: 'DeptUser'},
              { label: '备注', param: 'Remark' },
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
              DeptName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
            },
            //界面数据
            deptForm: {
                Id: 0,
                DeptCode: "",
                DeptName: "",
                DeptManager: "",
                ParentDept: "",
                Remark: '',
                Enabled: 1
            }
    
        }
    },
    methods: {
        //获取部门列表
        getData() {
            let _this = this;
            // this.listLoading = true;
        },
        handleButton (val) {
          if(val.methods == 'handleEdit') this.handleEdit(val.index,val.row)
          if(val.methods == 'handleDelete') this.handleDelete(val.index,val.row)
        },
        handleSortChange (val) {

        },
        handleSelectionChange (val) {
          this.sels = sels;
        },
        //删除
        handleDelete(index, row) {
          this.$showMsgBox({
             msg: `<p>是否删除${row.DeptName}?</p>`,
             type: 'warning',
             isHTML: true
           }).then(() => {
             
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
              CreateBy: "",
              DeptCode: "",
              DeptName: "",
              DeptUser: "",
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
