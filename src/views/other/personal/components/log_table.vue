<template>
    <section>
      <el-card class="box-card">
        <!--工具条-->
        <v-header icon="md-podium" text="日志列表">
          <div slot="content"></div>
          <div style="text-align: right;">
            <!--快速查询字段-->
             <el-input v-model="filters.name" style="width:200px;padding-right: 5px;" placeholder="行为名称"></el-input>
            <!--操作按钮组-->
            <el-button type="primary" @click.native="getData">查询</el-button>
          </div>
        </v-header>
        <!--列表-->
        <e-table :table-data="tableData" :table-label="tableLabel" :now-page="nowPage" :now-size="nowSize"></e-table>
      </el-card>
    </section>
</template>

<script>
export default {
	data() {
		return {
			nowPage: 1,
			nowSize: 7,

      filters: {
          name: ""
      },
		  tableData: [],
      tableLabel: [
        { label: '操作人', param: 'user'},
        { label: 'Api', param: 'api'},
        { label: 'IP', param: 'ip'},
        { label: 'IP来源', param: 'address' },
        { label: '请求耗时', param: 'opTime' },
        { label: '请求时间', param: 'beginTime', sortable: true,
          formatter: row => {
            return (!row.beginTime || row.beginTime == '') ? '':this.$formatDate(new Date(row.beginTime), true);
          } 
        },
      ],
		};
	},
	methods: {
	  getAccessLogs(){
      let _this = this;
      this.$ajax(this.$apiSet.getAccessLogs)
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
    }
	
  },
  mounted(){
    this.getAccessLogs();
  }
};
</script>

<style></style>
