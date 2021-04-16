<!--净水站-->
<template>
  <div class="waterStation bgActive simple_page" style="height: 100%;;">
    <div style="padding: 0.05rem;overflow: auto;height: calc(100% - 0.4rem);" class="borderdiv">
      <div v-for="(item,index) in tableList" :key='index' style="padding:0.05rem; cursor:pointer;overflow: hidden;height:0.5rem;margin: 0.05rem;position: relative;" @click='expandlist(item,index)' :class="index==selectId?'bgActiveT':'bgActiveF'">
        <div style="float: left;position: relative;margin-left: 0.05rem;">
          <img src="../../../../../static/img/map/ic_waterquality1.png" style="height: 0.3rem;margin-top: 0.05rem;" />
        </div>
        <div class="navtrans-navlist-title" style="position: relative;float: left; line-height: 0.4rem;height: 0.4rem;color: #fff;padding: 0 0.1rem;">
          <span style="float: left;">{{item.name}}</span>
        </div>
      </div>
    </div>

    <div class="row at-row flex-end" style="padding-top: 0.1rem;">
      <Page simple show-total :current="page.current" :total="page.total" @on-change="changePage" size="small" style="padding-right: 0.1rem;float: right;"></Page>
      <span style="color:#fff;font-size: 0.12rem;padding-left: 0.1rem;">共{{ page.total }}条</span>
    </div>
  </div>

  </div>
</template>
<script>
import bus from '../../../../eventBus.js';

export default {
  data() {
    return {
      tableList: [],
      selectId: -1,

      page: {
        pageSize: 10, //每页记录数
        current: 1, //当前页码
        total: 0,
        pageList: [
          { name: "名称名称1", id: 1 },
          { name: "名称名称2", id: 2 },
          { name: "名称名称3", id: 3 },
        ]
      },
    }
  },
  mounted() {
    this.GetJSZ();
  },
  methods: {
    GetJSZ() {
      this.changePage(1)
    },
    //分页
    changePage(index) {
      this.page.current = index;
      this.page.total = this.page.pageList.length;

      var _start = (index - 1) * this.page.pageSize;
      var _end = index * this.page.pageSize;
      this.tableList = this.page.pageList.slice(_start, _end);
    },
    expandlist(item, index) {
      this.selectId = index;

      bus.$emit("showDetail", { left: 'waterStationLeft', right: 'waterStationRight' }, item)
    }
  },
};
</script>
<style lang="less" scoped>
</style>