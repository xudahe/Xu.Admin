<template>
  <section>
    <el-card class="box-card" shadow="hover">
      <!--工具条-->
      <v-header icon="md-podium" text="菜单列表">
        <div slot="content"></div>
        <div style="text-align: right;">
          <!--快速查询字段-->
          <el-input v-model="filters.name"  style="width:200px;padding-right: 5px;" placeholder="菜单名称"></el-input>
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
      <el-form :model="menuForm" label-width="80px" :rules="formRules" ref="menuForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单类名" prop="ClassName">
              <el-input v-model="menuForm.ClassName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="系统名称" prop="SystemName">
              <el-select v-model="menuForm.SystemName" placeholder="请选择系统名称">
                <el-option label="应用系统" value="应用系统"></el-option>
                <el-option label="大屏系统" value="大屏系统"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图标" prop="Icon">
              <el-popover placement="bottom-start" width="400" trigger="click" @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="menuForm.Icon" placeholder="点击选择图标" readonly>
                  <svg-icon v-if="menuForm.Icon" slot="prefix" :icon-class="menuForm.Icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                  <i slot="suffix" class="el-icon-circle-close el-input__icon" v-if="menuForm.Icon" style="cursor: pointer" @click="menuForm.Icon=''"/>
                </el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="加载方式" prop="LoadWay">
              <el-select v-model="menuForm.LoadWay" placeholder="请选择系统名称">
                <el-option label="右侧" value="右侧"></el-option>
                <el-option label="顶部" value="顶部"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="MenuName">
              <el-input v-model="menuForm.MenuName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="父级菜单" prop="ParentName">
              <el-select v-model="menuForm.ParentName" placeholder="请选择父级菜单">
                <el-option label="无" value="无"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="序号" prop="Index">
              <el-input v-model="menuForm.Index" auto-complete="off" placeholder="请填写序号"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="Enabled">
              <el-radio-group v-model="menuForm.Enabled">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="Remark">
              <el-input v-model="menuForm.Remark" auto-complete="off" type="textarea"></el-input>
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
    name: 'menu_manager',
    data() {
        return {
            filters: {
                name: ""
            },
            tableData: [],
            tableLabel: [
              { label: '系统名称', param: 'SystemName'},
              { label: '菜单类名', param: 'ClassName'},
              { label: '菜单名称', param: 'MenuName'},
              { label: '父级菜单', param: 'ParentName'},
              { label: '备注', param: 'Remark' },
              { label: '创建时间', param: 'CreateTime', sortable: true,
                formatter: row => {
                  return (!row.CreateTime || row.CreateTime == '') ? '':this.$formatDate(new Date(row.CreateTime), true);
                } 
              },
              { label: '状态', param: 'Enabled', 
                    render: (h, parms) => {
                        if (params.row.Enabled == true){
                            return h('el-tag', {
                                props: {
                                    type: 'success',
                                    size: 'mini',
                                },
                            }, '正常')
                        }
                        else {
                            return h('el-tag', {
                                props: {
                                    type: 'danger',
                                    size: 'mini',
                                },
                            }, '禁用')
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
    
            listLoading: false,
            sels: [], //列表选中列

            nowPage: 1, // 当前页数
            nowSize: 10, // 当前页条数
    
            formTitle: '',
            formVisible: false, //界面是否显示
            formRules: {
              ClassName: [{ required: true, message: "请输入菜单类名", trigger: "blur" }],
              MenuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
            },
            //界面数据
            menuForm: {
                Id: 0,
                SystemName: "应用系统",
                ClassName: '',
                MenuName: '',
                Icon: '',
                ParentName: '',
                LoadWay: '',
                Index: '',
                Enabled: 1,
                Remark: '',
            }
    
        }
    },
    methods: {
        //获取菜单列表
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
          this.sels = val;
        },
        //删除
        handleDelete(index, row) {
          this.$showMsgBox({
             msg: `<p>是否删除${row.MenuName}菜单?</p>`,
             type: 'warning',
             isHTML: true
           }).then(() => {
             
           });
        },
        //显示编辑界面
        handleEdit(index, row) {
            this.formTitle = "编辑";
            this.formVisible = true;
            this.menuForm = row;
        },
        //显示新增界面
        handleAdd() {
            this.formTitle = "新增";
            this.formVisible = true;
        },
        // 选择icon
        selected(name) {
          this.menuForm.Icon = name;
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
