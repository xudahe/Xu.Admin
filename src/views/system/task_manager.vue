<template>
  <div class="task_manager card_css">
    <el-card class="box-card" shadow="hover">
      <!--工具条-->
      <v-header icon="md-podium" text="定时任务列表">
        <div slot="content"></div>
        <div style="text-align: right;">
          <!--快速查询字段-->
           <el-input v-model="filters.name" style="width:200px;padding-right: 5px;" placeholder="任务名称"></el-input>
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
      <el-form :model="taskForm" label-width="100px" :rules="formRules" ref="taskForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="taskForm.jobName" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="触发器类型" prop="triggerType">
              <el-select v-model="taskForm.triggerType" placeholder="请选择类型">
                <el-option label="simple" value="simple"></el-option>
                <el-option label="cron" value="cron"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="间隔(Cron)" prop="cron" v-if="taskForm.triggerType == 'cron'">
              <!-- <el-input v-model="taskForm.cron" autocomplete="off" placeholder="如10分组执行一次：0/0 0/10***?"></el-input> -->
              <el-popover placement="bottom-start" trigger="click" style="width:60%;">
                <cron ref="cronSelect" :value="taskForm.cron" :isResult="false" v-model="taskForm.cron"/>
                <el-input slot="reference" v-model="taskForm.cron" placeholder="Cron表达式" readonly></el-input>
              </el-popover>
            </el-form-item>
            <el-form-item label="间隔(秒)" prop="intervalSecond" v-if="taskForm.triggerType == 'simple'">
              <el-input v-model="taskForm.intervalSecond" autocomplete="off" placeholder="如1分钟执行一次: 60"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组" prop="jobGroup">
              <el-input v-model="taskForm.jobGroup" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker type="date" placeholder="选择开始时间" v-model="taskForm.startTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker type="date" placeholder="选择结束时间" v-model="taskForm.endTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="taskForm.remark" autocomplete="off" type="textarea"></el-input>
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
  
  </div>
</template>

<script>
import {debounce} from '@/api/control/index.js'

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
                  return this.$formatDate(new Date(row.performTime), true);
                } 
              },
              { label: '运行状态', param: 'jobStatus', width:'80', 
                render: (h, params) => {
                  if (params.row.jobStatus == 1){
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
		                     		this.jobStatus(params.row)
		                    	}
		                    }
                    },'未启动')
                  }
                  else if (params.row.jobStatus == 2){
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
		               	     	  this.jobStatus(params.row)
		            	      	}
		            	      }
                    },'运行中')
                  }
                  else if (params.row.jobStatus == 3){
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
		                    		this.jobStatus(params.row)
		                    	}
		                    }
                    },'已停止')
                  }
                },
              },
            ],
            tableOption: {
              label: '操作',
              width: '240',
              options: [
                { label: '', type: 'primary', icon: 'el-icon-edit', methods: 'handleEdit' },
                { label: '', type: 'danger', icon: 'el-icon-delete', methods: 'handleDelete' },
                { label: '', type: 'info', icon: 'el-icon-document', methods: 'handleHistory' },
              ]
            },

            nowPage: 1, // 当前页数
            nowSize: 15, // 当前页条数
        
            sels: {}, //列表选中列
            timer: null,
    
            formTitle: '',
            formVisible: false, //界面是否显示
            formRules: {
                jobName: [{ required: true, message: '任务名称必填', trigger: 'blur' }],
                jobGroup: [{ required: true, message: '任务分组必填', trigger: 'blur' }],
                cron: [{ required: true, message: 'Cron表达式必填', trigger: 'blur' }],
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
              jobStatus : 1, //运行状态
              enabled : "",
            },
        }
    },
    methods: {
      refreshData(){
        this.$loading.showLoading()
        this.searchData();
      },
      searchData() {
        let _this = this;
      
        this.$ajax(this.$apiSet.getTasksQzInfo,{
            name: this.filters.name
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
      handleButton(val) {
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
                  _this.$errorMsg(res.data.message)
              } else {
                  _this.searchData();
                  _this.$successMsg(res.data.message)
			        }
            })
            .catch(err => {})
         }).catch(()=>{});
      },
      //显示编辑界面
      handleEdit(index, row) {
          this.formTitle = "编辑";
          this.formVisible = true;
          this.taskForm = Object.assign({},row);
      },
      //显示新增界面
      plusData() {
          this.formTitle = "新增";
          this.formVisible = true;
  
          this.taskForm = {
            id: 0,
            jobName: "",
            jobGroup: "",
            remark : "",
            startTime : "",
            endTime : "",
            triggerType : 'cron', //触发器类型
            cron : "",
            intervalSecond : "", //执行间隔时间
            jobStatus : 1, //运行状态
            enabled : "",
          };
      },
      handleSubmit: debounce(function() {
        if(this.taskForm.triggerType == 'cron')  this.taskForm.intervalSecond = ''
        if(this.taskForm.triggerType == 'simple')  this.taskForm.cron = ''

        let apiUrl = this.formTitle=='编辑' ? this.$apiSet.putTasksQz:this.$apiSet.postTasksQz;
        let _this = this;
        this.$ajax(apiUrl, this.taskForm)
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
      jobStatus(row){
        let _this = this;
        let apiUrl = "", state = ""; 
        switch (row.jobStatus) {
          case 1: //未启动
            state = "启动";
            apiUrl = this.$apiSet.getStartJob;
            break;
          case 2: //运行中
            state = "停止";
            apiUrl = this.$apiSet.getStopJob;
            break;
          case 3: //已停止
            state = "重启";
            apiUrl = this.$apiSet.getReCovery;
            break;
        }

        this.$ajax(apiUrl,{
          id: row.id,
        }).then(res => {
            if (!res.data.success) {
                 _this.$errorMsg(res.data.message)
            } else {
                _this.searchData();
                _this.$successMsg(res.data.message)
			      }
         })
         .catch(err => {})
      },
      handleHistory(index, row){
        console.info(row.tasksLog)
      },
    },
    mounted() {
      let _this = this;
      this.refreshData();
    },
    destroyed(){
      clearInterval(this.timer);
    },
    beforeDestroy(){
      clearInterval(this.timer);
    },
};
</script>

<style scoped>
.task_manager{
  height: 100%;
  width: 100%;
}
</style>
