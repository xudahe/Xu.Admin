<template>
  <div class="middlePageDiv" style="width: 100%;height: 100%;">
    <!-- 左侧 -->
    <div id="circleLeft" style="height: 100%;width: 25%;float: left;" class="fade-in-right2">
      <div class="UnitFrame fade-in-right1" style="height: 33.3%;float: left;width: 100%;">
        <div class="divTitle" style="position: relative;">
          <div class="UnitTitle">
            <span class="UnitTitleText">开机时长</span>
          </div>
          <div class="selectBackground" style="position: absolute;right: 0;top: -0.1rem;"></div>
        </div>
        <div id="content" style="width: 100%;height: calc(100% - 0.25rem);"></div>
      </div>
      <div class="UnitFrame fade-in-right1" style="height: 33.3%;float: left;width: 100%;">
        <div class="divTitle" style="position: relative;">
          <div class="UnitTitle">
            <span class="UnitTitleText">开机时长</span>
          </div>
          <div class="selectBackground" style="position: absolute;right: 0;top: -0.1rem;"></div>
        </div>
        <div id="content" style="width: 100%;height: calc(100% - 0.25rem);"></div>
      </div>
      <div class="UnitFrame fade-in-right1" style="height: 33.3%;float: left;width: 100%;">
        <div class="divTitle" style="position: relative;">
          <div class="UnitTitle">
            <span class="UnitTitleText">开机时长</span>
          </div>
          <div class="selectBackground" style="position: absolute;right: 0;top: -0.1rem;"></div>
        </div>
        <div id="content" style="width: 100%;height: calc(100% - 0.25rem);"></div>
      </div>
    </div>
    <!-- 中间 -->
    <div id="circleMiddle" style="height: 100%;width: 50%;float: left;"></div>
    <!-- 右侧 -->
    <div id="circleRight" style="height: 100%;width: 25%;float: left;" class="fade-in-left2">
      <div class="UnitFrame fade-in-left1" style="height: 33.3%;float: left;width: 100%;">
        <div class="divTitle" style="position: relative;">
          <div class="UnitTitle">
            <span class="UnitTitleText">开机时长</span>
          </div>
          <div class="selectBackground" style="position: absolute;right: 0;top: -0.1rem;"></div>
        </div>
        <div id="content" style="width: 100%;height: calc(100% - 0.25rem);"></div>
      </div>
      <div class="UnitFrame fade-in-left1" style="height: 33.3%;float: left;width: 100%;">
        <div class="divTitle" style="position: relative;">
          <div class="UnitTitle">
            <span class="UnitTitleText">开机时长</span>
          </div>
          <div class="selectBackground" style="position: absolute;right: 0;top: -0.1rem;"></div>
        </div>
        <div id="content" style="width: 100%;height: calc(100% - 0.25rem);"></div>
      </div>
      <div class="UnitFrame fade-in-left1" style="height: 33.3%;float: left;width: 100%;">
        <div class="divTitle" style="position: relative;">
          <div class="UnitTitle">
            <span class="UnitTitleText">开机时长</span>
          </div>
          <div class="selectBackground" style="position: absolute;right: 0;top: -0.1rem;"></div>
        </div>
        <div id="content" style="width: 100%;height: calc(100% - 0.25rem);"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "carouselPage2",
  components: {},
  data() {
    return {
      time: null
    };
  },
  methods: {},
  mounted() {
    var _this = this;
  },
  beforeDestroy() { }
};
</script>

<style lang="less" scoped>
.middlePageDiv {
  .selectBackground {
    // background: url(../../../../../static/img/newhome/01/标题装饰3.png)
    //   no-repeat;
    // background-size: 100% 100%;
    padding: 0 0.2rem;
  }

  .UnitTitleText {
    margin-left: 0.1rem;
  }
  .UnitTitle {
    font-size: 0.14rem;
    color: #ffffff;
    padding: 0.03rem 0;
    float: none;
    background-image: url(../../../../../static/img/newhome/01/bg_侧边标题.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
