<template>
<div style="height:100%;width:100%;" class="test1 bgActive collapse simple_page">
			<div style="padding: 0.05rem;height: 100%;">
				
        <div style="overflow: auto;height: calc(100% - 0.4rem);" class="borderdiv">
          <div :class="index==selectId?'bgActiveT':'bgActiveF bgActive'" style="padding-left: 0.05rem;padding-top: 0.05rem;margin-top: 0.05rem; cursor:pointer;position: relative;" 
          @click="goto(item,index)" v-for="(item,index) in tableList" :key="index" :id="index">
						<div style="display: inline-block;width:100%; height: 0.2rem;">
							<div class="row at-row no-gutter" style="width: 32px;float: left;position: relative;">
								<div class="circle" />
								<label style="font-size: 0.12rem;position: absolute; top:0%;left:20%; color:white; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" v-if="index+1 ==10">{{index+1}}</label>
								<label style="font-size: 0.12rem;position: absolute; top:0%;left: 32%; color:white; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" v-else>{{index+1}}</label>
							</div>
							<label style="font-family: '微软雅黑';float: left; font-size: 0.12rem;color: #fff;font-weight: bolder;">{{item.title}}</label>
							<i class="icon icon-map-pin" style="float:right;color: #2d8cf0;"></i>
						</div>
						<div style="float: left;cursor: pointer;">
							<img :src='require("../../../../static/img/暂无图片.png")' v-viewer style="width: 0.5rem;height: 0.55rem;"/>
						</div>
						<div style="display: inline-block;cursor: pointer;width: calc(100% - 0.7rem);padding-left: 0.05rem;">
							<Row>
								<Col span="24">
							    <span class="resultLable">字段名称：</span>
					  	    <span :title="item.title" class="rsultValue">{{item.title}}</span>
								</Col>
								<Col span="24">
							   	<span class="resultLable">字段名称：</span>
							   	<span :title="item.title" class="rsultValue">{{item.title}}</span>
								</Col>
								<Col span="24">
								  <span class="resultLable">字段名称：</span>
						   	  <span :title="item.title" class="rsultValue">{{item.title}}</span>
								</Col>
							</Row>
						</div>
					</div>
				</div>

				<div class="row at-row flex-end" style="padding-top: 0.1rem;">
					<Page simple show-total :current="page.current" :total="page.total" @on-change="changePage" size="small" style="padding-right: 0.1rem;float: right;"></Page>
					<span style="color:#fff;font-size: 0.12rem; float: left;padding-left: 0.1rem;">共{{page.total}}条</span>
				</div>
			</div>
	</div>
</template>

<script>
import bus from "../../../eventBus.js";

export default {
    components: {

    },
    data() {
      return {
        page: {
			  	pageSize: 10, //每页记录数
			  	current: 1, //当前页码
          total: 0,
          pageList: [
            {title:"某某"},
            {title:"某某"},
            {title:"某某"},
            {title:"某某"},
            {title:"某某"},
          ],
        },
				selectId: -1, //已选择的编号

        titlename: '缩略图',
        tableList: [],

      };
    },
    methods: {
      goto(item, ID) {
        this.selectId = ID;
      },
      changePage(index) {
        this.page.current = index;
        this.page.total = this.page.pageList.length;

        var _start = (index - 1) * this.page.pageSize;
        var _end = index * this.page.pageSize;
        this.tableList = this.page.pageList.slice(_start, _end);
      },
      loadData(){
        this.changePage(1)
      }
    },
    mounted() {
      var _this = this;

      this.loadData()
    },
    beforeDestroy() {
   
    },
    created() {
    }
  };
</script>

<style lang="less">
.test1 {
  .circle {
    margin-left: 5px;
    width: 18px;
    height: 18px;
    border-radius: 9px;
    background: red;
    vertical-align: bottom;
  }
  
  .resultLable {
    font-size: 0.12rem;
    color: rgba(255, 255, 255, 0.5);
    display: block;
    width: 0.6rem;
    overflow: hidden;
    white-space: nowrap;
    float: left;
    text-align: left;
    padding-left: 0.05rem;
  }
  
  .rsultValue {
    font-size: 0.12rem;
    color: #fff;
    margin-left: 5px;
    display: block;
    float: left;
    text-align: left;
  
    width: 0.8rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
