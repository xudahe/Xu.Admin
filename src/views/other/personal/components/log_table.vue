<template>
  <div class="log_table">
      <el-Divider>
        <span >操作日志</span>
      </el-Divider>
      <e-table :table-data="tableData" :table-label="tableLabel" :now-page="nowPage" :now-size="nowSize"></e-table>
  </div>
</template>

<script>
export default {
	data() {
		return {
			nowPage: 1,
			nowSize: 7,

		  tableData: [],
      tableLabel: [
        { label: '操作人', param: 'user'},
        { label: '请求地址', param: 'url'},
        { label: '客户端IP', param: 'clientIP'},
        // { label: 'IP来源', param: 'address' },
        // { label: '请求耗时', param: 'opTime' },
        { label: '请求时间', param: 'beginTime',
          formatter: row => {
            return this.$formatDate(new Date(row.beginTime), true);
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
                _this.$errorMsg(res.data.message)
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

<style>
.log_table{
  height: 100%;
  width: 100%;
}
</style>
