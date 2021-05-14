<template>
  <div class="pumpInfo" style="width:100%;height: 100%;">
    <div style="height: 100%;float: left;width: 0.2rem;">
      <div class="imgReturn" @click="returnPump">
        <div style="position: relative;top: 43%;">
          <Icon size='32' color="#fff" style="cursor: pointer;opacity: 0;" type="ios-undo" title="返回" />
        </div>
      </div>
    </div>

    <div id="homePage_Div" style="width: calc(100% - 0.25rem);height: 100%;margin-left:0.25rem;">
      <div id="circleLeft" style="height: 100%;width:25%;float: left;">
        <div style="height:40%;width:100%;margin-bottom: 0.05rem;" class="fade-in-right1 background">
        </div>
        <div style="height:calc(60% - 0.05rem);width:100%;" class="fade-in-right2 background">
        </div>
      </div>

      <div id="circleMiddle" style="height: 100%;width:50%;float: left;padding:0 0.05rem;">
        <div class="pumpname">{{detailitem.pumpname}}</div>
        <div style="height: calc(75% - 0.60rem);margin-top: 0.2rem;margin-bottom: 0.05rem;">
          <!-- 泵站组态图 -->
          <component :is="componentName" :detailitem="detailitem"></component>
        </div>
        <div style="height:25%;" class="fade-in-up background_botm">
        </div>
      </div>

      <div id="circleRight" style="height: 100%;width: 25%;float: left;">
        <div style="height:40%;width:100%;margin-bottom: 0.05rem;" class="fade-in-left1 background">
        </div>
        <div style="height:calc(60% - 0.05rem);width:100%;" class="fade-in-left2 background">
        </div>
      </div>
    </div>

  </div>
</template>


<script>

export default {
  name: "pumpInfo",
  components: {},
  data() {
    return {
      componentName: "",
    };
  },
  props: {
    detailitem: Object
  },
  watch: {
    detailitem(newVal, oldVal) {

    },
    deep: true
  },
  mounted() {
    this.imglist = this.imglist2;

  },
  methods: {
    returnPump() {
      this.$emit("returnPump");
    },

  },
  beforeDestroy() {
  },
  created() {

  }
};
</script>

<style lang="less">
.background {
  background: url("../../../../../static/img/newhome/04/2.png") no-repeat;
  background-size: 100% 99%;
  padding: 0.1rem !important;
}

.background_botm {
  background: url("../../../../../static/img/newhome/04/4.png") no-repeat;
  background-size: 100% 100%;
  padding: 0.1rem !important;
}

.tablegojs {
  background: rgba(1, 11, 120, 0.6);
  width: 100%;
  border: 0;
  tr,
  td {
    border: 0;
  }
  .td_title {
    font-size: 0.16rem;
    font-family: "微软雅黑";
    white-space: normal;
    color: #fff;
    text-align: center;
    font-weight: 100;
  }

  .td_value {
    font-size: 0.16rem;
    color: #fff;
    text-align: center;
    font-weight: normal;
    line-height: 0rem;
  }
}

.pumpname {
  background: url("../../../../../static/img/pump/统计标题背景.png");
  width: 3.4rem;
  height: 0.3rem;
  line-height: 0.3rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #ffffff;
  font-size: 0.22rem;
  font-weight: bold;
  position: relative;
  left: calc(~"(100% - 3.40rem) / 2");
  text-align: center;
  top: 0.1rem;
}

.imgReturn {
  display: inline-block;
  height: 100%;
  width: 100%;
  background-image: url("../../../../../static/img/newhome/侧边展开(左).png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  left: 0rem;
}
</style>
