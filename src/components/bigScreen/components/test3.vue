<template>
  <div style="height:100%;width:100%;" class="test3 bgActive collapse simple_page">
    <div style="padding: 0.05rem;height: 100%;">

      <div class="mulist" style="padding-bottom: 0.05rem;">
        <template v-for="(item,key,index) in monitypes">
          <div :key='index' :class="currentmtype==key?'selectedwaters':'unselectedwaters'" @click='selecttype(key,item)'>
            <a :class="currentmtype==key?'selectedA':'selectedB'" style="display: block;">{{item.name}}</a>
          </div>
        </template>
      </div>

      <div style="overflow: auto;height: calc(100% - 0.65rem);" class="borderdiv">
        <div :class="index==selectId?'bgActiveT':'bgActiveF bgActive'" style="padding:0.05rem;margin-bottom: 0.05rem;cursor:pointer;position: relative;" @click="goto(item,index)" v-for="(item,index) in tableList" :key="index" :id="index">
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
            <img :src='require("../../../../static/img/暂无图片.png")' v-viewer style="width: 0.5rem;height: 0.55rem;" />
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
        <span style="color:#fff;font-size: 0.12rem;padding-left: 0.1rem;">共{{page.total}}条</span>
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
      currentmtype: '',
      monitypes: [
        {
          name: "流量",
          datalist: [],
        },
        {
          name: "水表",
          datalist: [],
        },
        {
          name: "液位",
          datalist: [],
        },
        {
          name: "压力",
          datalist: [],
        },
      ],
      page: {
        pageSize: 10, //每页记录数
        current: 1, //当前页码
        total: 0,
        pageList: [
          { title: "某某1" },
          { title: "某某2" },
          { title: "某某3" },
          { title: "某某4" },
          { title: "某某5" },
          { title: "某某6" },
          { title: "某某7" },
        ],
      },
      selectId: -1, //已选择的编号

      titlename: '缩略图',
      tableList: [],

    };
  },
  methods: {
    selecttype(indx, item) {
      this.currentmtype = indx; //tab页样式

      this.list = item.datalist;
      this.changePage(1);
    },
    changePage(index) {
      this.page.current = index;
      this.page.total = this.page.pageList.length;

      var _start = (index - 1) * this.page.pageSize;
      var _end = index * this.page.pageSize;
      this.tableList = this.page.pageList.slice(_start, _end);
    },
    goto(item, index) {

    }

  },
  mounted() {
    var _this = this;
    this.changePage(1);

  },
  beforeDestroy() {

  },
  created() {
  }
};
</script>

<style lang="less">
.test3 {
  .mulist a {
    text-align: center;
    font-size: 0.12rem;
    box-sizing: border-box;
    display: inline-block;
    white-space: nowrap;
    height: 0.25rem;
    line-height: 0.25rem;
    color: #0394fa;
  }

  .mulist .selectedA {
    color: #fff !important;
    background: none;
    font-size: 0.14rem;
  }

  .mulist .selectedB {
    color: #42c823 !important;
    background: none;
    font-size: 0.14rem;
  }

  .mulist .selectedwaters {
    color: #fff;
    width: 0.5rem;
    display: inline-block;
    cursor: pointer;
    background-image: url(../../../../static/img/newhome/icon/中-选中小.png);
    background-size: 100% 100%;
  }

  .mulist .unselectedwaters {
    display: inline-block;
    width: 0.5rem;
    cursor: pointer;
    background-image: none;
  }

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
