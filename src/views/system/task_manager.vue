<template>
  <section>
    <el-card class="box-card" shadow="hover">
      <!--工具条-->
      <v-header icon="md-podium" text="定时任务列表">
        <div slot="content"></div>
        <div style="text-align: right;">
          <!--快速查询字段-->
           <el-input v-model="filters.name" style="width:200px;padding-right: 5px;" placeholder="任务名称"></el-input>
          <!--操作按钮组-->
          <el-button type="primary" @click.native="getData">查询</el-button>
          <el-button type="primary" @click.native="handleAdd">新增</el-button>
        </div>
      </v-header>
  
      <!--列表-->
      <e-table :table-data="tableData" :table-label="tableLabel" :table-option="tableOption" :now-page="nowPage" :now-size="nowSize" @handleButton="handleButton" @handleSelectionChange="handleSelectionChange"></e-table>
    </el-card>

    <!--弹出界面-->
    <el-dialog :title="formTitle" :visible.sync="formVisible" v-model="formVisible" :close-on-click-modal="false" >
      <el-form :model="taskForm" label-width="100px" :rules="formRules" ref="taskForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="taskForm.jobName" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker type="date" placeholder="选择开始时间" v-model="taskForm.startTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="触发器类型" prop="triggerType">
              <el-select v-model="taskForm.triggerType" placeholder="请选择类型">
                <el-option label="simple" value="simple"></el-option>
                <el-option label="cron" value="cron"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-input v-model="taskForm.jobGroup" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker type="date" placeholder="选择结束时间" v-model="taskForm.endTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="间隔(Cron)" prop="cron" v-if="taskForm.triggerType == 'cron'">
              <el-input v-model="taskForm.cron" auto-complete="off" placeholder="如10分组执行一次：0/0 0/10***?"></el-input>
            </el-form-item>
            <el-form-item label="间隔(秒)" prop="intervalSecond" v-if="taskForm.triggerType == 'simple'">
              <el-input v-model="taskForm.intervalSecond" auto-complete="off" placeholder="如1分组执行一次: 60"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="taskForm.remark" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <a href="http://cron.qqe2.com/" target="_blank">cron在线生成</a>
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button type="primary" @click.native="handleSubmit" >提交</el-button>
      </div>
    </el-dialog>
  
  </section>
</template>

<script>

export default {
    name: 'task_manager',
    components: {  },
    data() {
        return {
            filters: {
                name: ""
            },
            tableData: [],
            tableLabel: [
              { label: '任务名称', param: 'jobName'},
              { label: '任务分组', param: 'jobGroup'},
              { label: '触发器类型', param: 'triggerType'},
              { label: '间隔(Cron)', param: 'cron'},
              { label: '执行间隔(秒)', param: 'intervalSecond'},
              { label: '最后执行时间', param: 'performTime', sortable: true, width:'160',
                formatter: row => {
                  return (!row.performTime || row.performTime == '') ? '':this.$formatDate(new Date(row.performTime), true);
                } 
              },
              { label: '运行状态', param: 'jobState', width:'80', 
                render: (h, params) => {
                  if (params.row.jobState == 1){
                    return h('el-tag', {
                        props: {
                          type: 'primary',
                          size: 'mini',
                        },
                        style: {
				  	             	cursor: 'pointer'
                        },
                        on: {
		                     	click: e => {
                            e.stopPropagation();
		                     		this.jobState(params.row)
		                    	}
		                    }
                    },'初始化')
                  }
                  else if (params.row.jobState == 2){
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
                            e.stopPropagation();
		               	     	  this.jobState(params.row)
		            	      	}
		            	      }
                    },'运行中')
                  }
                  else if (params.row.jobState == 3){
                    return h('el-tag', {
                        props: {
                          type: 'warning',
                          size: 'mini',
                        },
                        style: {
					              	cursor: 'pointer'
                        },
                        on: {
		                    	click: e => {
                            e.stopPropagation();
		                    		this.jobState(params.row)
		                    	}
		                    }
                    },'已暂停')
                  }
                },
              },
            ],
            tableOption: {
              label: '操作',
              width: '240',
              options: [
                { label: '编辑', type: 'primary', icon: '', methods: 'handleEdit' },
                { label: '删除', type: 'danger', icon: '', methods: 'handleDelete' },
                { label: '历史', type: 'info', icon: '', methods: 'handleHistory' },
              ]
            },

            nowPage: 1, // 当前页数
            nowSize: 10, // 当前页条数
        
            loading: false,
            sels: [], //列表选中列
    
            formTitle: '',
            formVisible: false, //界面是否显示
            formRules: {
                jobName: [{ required: true, message: '任务名称必填', trigger: 'blur' }],
                jobGroup: [{ required: true, message: '任务分组必填', trigger: 'blur' }],
                cron: [{ required: true, message: '间隔(Cron)必填', trigger: 'blur' }],
                intervalSecond: [{ required: true, message: '执行间隔时间必填', trigger: 'blur' }],
                triggerType: [{ required: true, message: '触发器类型', trigger: 'blur' }],
            },
            //界面数据
            taskForm: {
              id: 0,
              jobName: "",
              jobGroup: "",
              remark : "",
              startTime : "",
              endTime : "",
              triggerType : 'cron', //触发器类型
              cron : "",
              intervalSecond : "", //执行间隔时间
              JobState : "", //运行状态
              jobParams : "", //执行传参
              enabled : "",
            },
        }
    },
    methods: {
        getData() {
          let _this = this;
          this.loading = true;
          this.$ajax(this.$apiSet.getTasksQzInfo,{
              name: this.filters.name
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
        handleButton (val) {
          if(val.methods == 'handleEdit') this.handleEdit(val.index,val.row)
          if(val.methods == 'handleDelete') this.handleDelete(val.index,val.row)
          if(val.methods == 'handleHistory') this.handleHistory(val.index,val.row)
        },
        handleSelectionChange (val) {
          this.sels = sels;
        },
        //删除
        handleDelete(index, row) {
          let _this = this
          this.$showMsgBox({
             msg: `<p>是否删除【${row.deptName}】定时任务?</p>`,
             type: 'warning',
             isHTML: true
           }).then(() => {
              _this.$ajax(this.$apiSet.deleteTask,{
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
            this.taskForm = row;
        },
        //显示新增界面
        handleAdd() {
            this.formTitle = "新增";
            this.formVisible = true;
  
            this.taskForm = {
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
          let apiUrl = this.formTitle=='编辑' ? this.$apiSet.putTasksQz:this.$apiSet.postTasksQz;
          let _this = this;
          this.$ajax(apiUrl, this.taskForm)
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
        jobState(row){
            let apiUrl = "", state = ""; 
            switch (row.jobState) {
               case 1:
                 state = "启动";
                 apiUrl = this.$apiSet.getStartJob;
                 break;
               case 2:
                 state = "停止";
                 apiUrl = this.$apiSet.getStopJob;
                 break;
               case 3:
                 state = "重启";
                 apiUrl = this.$apiSet.getReCovery;
                 break;
              default:
                 break;
            }

            this.$showMsgBox({
              msg: `<p>是否${state + `【` + row.jobName}】任务?</p>`,
              type: 'warning',
              isHTML: true
            }).then(() => {
              _this.$ajax(apiUrl,{
                id: row.id,
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
        handleHistory(index, row){
           
        },
    },
    mounted() {
        this.getData();
  
    }
};
</script>

<style scoped>
</style>
