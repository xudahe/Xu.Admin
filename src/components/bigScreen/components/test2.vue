<template>
  <div style="height:100%;width:100%;" class="test2 bgActive collapse simple_page">
    <div style="padding: 0.05rem;height: 100%;">

      <div style="overflow: auto;height: calc(100% - 0.4rem);" class="borderdiv">
        <Collapse accordion>
          <template v-for="(item,index) in tableList">
            <Panel style="margin:0.05rem;font-size: 0.12rem;font-weight: bold;" :key="index" :name="item.title+index">
              {{item.title}} &nbsp;&nbsp;
              <div style="float:right;margin-right:0.1rem;font-size: 0.12rem;">
                <span>3(台)</span>
              </div>
              <div slot="content" v-for="(itema,indev) in item.children" :key='indev'>
                <div style="cursor:pointer;overflow: hidden;position: relative;padding-left: 0.05rem;" @click='expandlist(indev,itema,index)' :class="indev+'a'+index==selectId?'bgActiveT':'bgActiveF'">
                  <div style="float: left;cursor: pointer;">
                    <img :src='require("../../../../static/img/暂无图片.png")' v-viewer style="width: 0.5rem;height: 0.55rem;" />
                  </div>
                  <div style="display: inline-block;cursor: pointer;width: calc(100% - 0.7rem);padding-left: 0.05rem;">
                    <Row>
                      <Col span="24">
                      <span class="resultLable">字段名称</span>
                      <span :title="itema.name" class="rsultValue">{{itema.name}}</span>
                      </Col>
                      <Col span="24">
                      <span class="resultLable">字段名称：</span>
                      <span :title="itema.name" class="rsultValue">{{itema.name}}</span>
                      </Col>
                      <Col span="24">
                      <span class="resultLable">字段名称</span>
                      <span :title="itema.name" class="rsultValue">{{itema.name}}</span>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Panel>
          </template>
        </Collapse>
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
      page: {
        pageSize: 10, //每页记录数
        current: 1, //当前页码
        total: 0,
        pageList: [
          { title: "某某1", children: [{ name: "某某1" }] },
          { title: "某某2", children: [{ name: "某某2" }] },
          { title: "某某3", children: [{ name: "某某3" }] },
          { title: "某某4", children: [{ name: "某某4" }] },
          { title: "某某5", children: [{ name: "某某5" }] },
          { title: "某某6", children: [{ name: "某某6" }] },
          { title: "某某7", children: [{ name: "某某7" }] },
        ],
      },
      selectId: '', //已选择的编号

      titlename: '缩略图',
      tableList: [],
    };
  },
  methods: {
    expandlist(index, item, indev) {
      this.selectId = index + "a" + indev;

      let listClass = document.getElementsByClassName('ivu-collapse-header');
      for (let i = 0; i < listClass.length; i++) {
        if (i == indev) {
          listClass[i].classList.remove('bgActiveT');
          listClass[i].classList.remove('bgActiveF');
          listClass[i].classList.add('bgActiveT');
        } else {
          listClass[i].classList.remove('bgActiveT');
          listClass[i].classList.remove('bgActiveF');
          listClass[i].classList.add('bgActiveF');
        }
      }

      // bus.$emit("rightDetail","test1",item,item.name)
      bus.$emit("leftDetail", "test1", item, item.name)
      // bus.$emit("botmDetail","test1",item,item.name)
    },
    changePage(index) {
      this.page.current = index;
      this.page.total = this.page.pageList.length;

      var _start = (index - 1) * this.page.pageSize;
      var _end = index * this.page.pageSize;
      this.tableList = this.page.pageList.slice(_start, _end);
    },
    loadData() {
      this.changePage(1)

      let listClass = document.getElementsByClassName('ivu-collapse-header');
      setTimeout(function () {
        for (let i = 0; i < listClass.length; i++) {
          listClass[i].classList.remove('bgActive');
          listClass[i].classList.remove('bgActiveF');
          setTimeout(function () {
            listClass[i].classList.add('bgActiveF');
          }, 100)
        }
      }, 500)
    },
  },
  mounted() {
    var _this = this;

    this.loadData()
  },
  beforeDestroy() {

  },
};
</script>

<style lang="less">
.test2 {
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
