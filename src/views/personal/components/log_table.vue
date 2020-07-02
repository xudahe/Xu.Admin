<template>
    <section>
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
    </section>
</template>

<script>
export default {
	data() {
		return {
			nowPage: 1,
			nowSize: 10,

      filters: {
          name: ""
      },
		  tableData: [
        {description:'GLY1',requestIp:'管理员1',address:'',CreateTime:new Date(),time:''},
        {description:'GLY2',requestIp:'管理员2',address:'',CreateTime:new Date(),time:''}
      ],
      tableLabel: [
        { label: '行为', param: 'description'},
        { label: 'IP', param: 'requestIp'},
        { label: 'IP来源', param: 'address' },
        { label: '请求耗时', param: 'time' },
        { label: '创建时间', param: 'CreateTime', sortable: true,
          formatter: row => {
            return (!row.CreateTime || row.CreateTime == '') ? '':this.$formatDate(new Date(row.CreateTime), true);
          } 
        },
      ],
		};
	},
	methods: {
	
	
	}
};
</script>

<style></style>
