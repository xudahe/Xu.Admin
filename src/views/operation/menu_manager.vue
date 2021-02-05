<template>
  <div class="menu_manager card_css">
    <el-card class="box-card" shadow="hover">
      <!--工具条-->
      <v-header icon="md-podium" text="菜单列表">
        <div slot="content"></div>
        <div style="text-align: right;">
          <!--快速查询字段-->
          <el-input v-model="filters.name"  style="width:160px;padding-right: 5px;" placeholder="菜单名称"></el-input>
          <!--快速查询字段-->
          <el-select v-model="filters.parentId" style="width:160px !important;padding-right: 5px;" placeholder="父级菜单" filterable clearable>
            <el-option v-for="(item,index) in parentData" :key="index" :label="item.menuName" :value="item.id"></el-option>
          </el-select>
          <!--操作按钮组-->
          <el-button type="primary" icon="el-icon-search" circle @click.native="searchData"></el-button>
          <el-button type="primary" icon="el-icon-plus" circle @click.native="plusData"></el-button>
          <el-button type="primary" icon="el-icon-refresh" circle @click.native="refreshData"></el-button>
        </div>
      </v-header>
  
      <!--列表-->
      <e-table :table-data="tableData" :table-label="tableLabel" :table-option="tableOption" :now-page="nowPage" :now-size="nowSize" @handleButton="handleButton" @handleSelectionChange="handleSelectionChange"></e-table>
    </el-card>
      
    <!--弹出界面-->
    <el-dialog :title="formTitle" :visible.sync="formVisible" v-model="formVisible" :close-on-click-modal="false" >
      <el-form :model="menuForm" label-width="80px" :rules="formRules" ref="menuForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="组件名称" prop="className">
              <el-input v-model="menuForm.className" autocomplete="off" placeholder="请输入组件名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="系统名称" prop="systemName">
              <el-select v-model="menuForm.systemName" placeholder="请选择系统名称">
                <el-option label="应用" value="应用"></el-option>
                <el-option label="大屏" value="大屏"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="加载方式" prop="loadWay">
              <el-select v-model="menuForm.loadWay" placeholder="请选择系统名称">
                <el-option label="右侧" value="右侧"></el-option>
                <el-option label="顶部" value="顶部"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="缓存组件" prop="cache">
              <el-radio-group v-model="menuForm.cache">
                <el-radio :label="true">要缓存</el-radio>
                <el-radio :label="false">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" autocomplete="off" placeholder="请输入菜单名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="父级菜单" prop="parentId">
              <el-select v-model="menuForm.parentId" placeholder="请选择父级菜单" filterable clearable>
                <el-option :label="item.menuName" :value="item.id" :key="index" v-for="(item,index) in parentData"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="加载序号" prop="index">
              <el-input v-model="menuForm.index" autocomplete="off" placeholder="请输入加载序号" clearable></el-input>
            </el-form-item>
            <el-form-item label="菜单状态" prop="enabled">
              <el-radio-group v-model="menuForm.enabled">
                <el-radio :label="false">正常</el-radio>
                <el-radio :label="true">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover placement="bottom-start" width="400" trigger="click" @show="$refs['iconSelect'].reset()">
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="menuForm.icon" placeholder="点击选择图标" readonly>
                  <svg-icon v-if="menuForm.icon" slot="prefix" :icon-class="menuForm.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                  <i slot="suffix" class="el-icon-circle-close el-input__icon" v-if="menuForm.icon" style="cursor: pointer" @click="menuForm.icon=''"/>
                </el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="menuForm.remark" autocomplete="off" type="textarea"></el-input>
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
    name: 'menu_manager',
    data() {
        return {
            filters: {
                name: "",
                parentId: "",
            },
            parentData: [],
            tableData: [],
            tableLabel: [
              { label: '标识', param: 'id',width: '60',},
              // { label: '系统名称', param: 'systemName'},
              { label: '组件名称', param: 'className'},
              { label: '菜单名称', param: 'menuName'},
              { label: '父级菜单', param: 'parentName'},
              { label: '备注', param: 'remark' },
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
    
            loading: false,
            sels: {}, //列表选中列

            nowPage: 1, // 当前页数
            nowSize: 15, // 当前页条数
    
            formTitle: '',
            formVisible: false, //界面是否显示
            formRules: {
              // className: [{ required: true, message: "请输入菜单类名", trigger: "blur" }],
              // menuName: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
            },
            //界面数据
            menuForm: {
              id: 0,
              systemName: '',
              className: '',
              menuName: '',
              icon: '',
              parentId: '',
              loadWay: '',
              index: '',
              enabled: false,
              remark: '',
              cache:'',
            }
        }
    },
    methods: {
        //获取菜单列表
        searchData() {
          let _this = this;
          this.$ajax(this.$apiSet.getMenuInfo,{
              menuName: this.filters.name,
              parentId: this.filters.parentId,
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
        getParentData() {
          let _this = this;
          this.$ajax(this.$apiSet.getMenuInfo)
            .then(res => {
                if (!res.data.success) {
                    _this.$errorMsg(res.data.message)
                } else {
                    _this.parentData = res.data.response.filter(val => val.parentId == null);
				       	}
            })
            .catch(err => {})
        },
        handleButton (val) {
          if(val.methods == 'handleEdit') this.handleEdit(val.index,val.row)
          if(val.methods == 'handleDelete') this.handleDelete(val.index,val.row)
        },
        handleSelectionChange (val) {
          this.sels = val;
        },
        disable(row){
          let _this = this;
          this.$showMsgBox({
            msg: `<p>是否${row.enabled ? `启用`:`禁用`}【${row.menuName}】菜单?</p>`,
            type: 'warning',
            isHTML: true
          }).then(() => {
            _this.$ajax(this.$apiSet.disableMenu,{
                id: row.id,
                falg: !row.enabled
            }).then(res => {
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
        handleDelete(index, row) {
          let _this = this
          this.$ajax(this.$apiSet.deleteMenu,{
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
        //显示编辑界面
        handleEdit(index, row) {
          this.formTitle = "编辑";
          this.formVisible = true;
          this.menuForm = Object.assign({},row);
        },
        //显示新增界面
        plusData() {
            this.formTitle = "新增";
            this.formVisible = true;

            this.menuForm = {
              id: 0,
              systemName: '应用',
              className: '',
              menuName: '',
              icon: '',
              parentId: '',
              loadWay: '',
              index: '',
              enabled: false,
              remark: '',
              cache:'',
            };
        },
        // 选择icon
        selected(name) {
          this.menuForm.icon = name;
        },
        handleSubmit:debounce(function() {
          if(this.menuForm.className.slice(0,1) != "/"){
            this.menuForm.className = "/"+this.menuForm.className;
          }
          this.menuForm.icon = "el-icon-edit-outline"; //图标暂时写死
          
          if(this.$isNull(this.menuForm.className)) 
            return this.$warnMsg("组件名称不能为空！")
          if(this.$isNull(this.menuForm.menuName)) 
            return this.$warnMsg("菜单名称不能为空！")
          
          let apiUrl = this.formTitle=='编辑' ? this.$apiSet.putMenu:this.$apiSet.postMenu;
          let _this = this;
          this.$ajax(apiUrl, this.menuForm)
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
          this.$loading.showLoading()
          this.searchData();
          this.getParentData();
        },
    },
    mounted() {
      this.refreshData();
    }
};
</script>

<style scoped>
.menu_manager{
  height: 100%;
  width: 100%;
}
</style>
