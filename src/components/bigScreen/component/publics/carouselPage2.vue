<template>
  <div class="middlePageDiv" style="width: 100%;height: 100%;">
    <!-- 左侧 -->
    <div
      id="circleLeft"
      style="height: 100%;width: 25%;float: left;"
      class="fade-in-right2"
    >
      <div
        class="UnitFrame fade-in-right1"
        style="height: 25%;float: left;width: 100%;"
      >
        <div class="UnitDiv UnitDiv_bg6"></div>
      </div>
      <div
        class="UnitFrame fade-in-right1"
        style="height: 25%;float: left;width: 100%;"
      >
        <div class="UnitDiv UnitDiv_bg6"></div>
      </div>
      <div
        class="UnitFrame fade-in-right1"
        style="height: 50%;float: left;width: 100%;"
      >
        <div class="UnitDiv UnitDiv_bg3"></div>
      </div>
    </div>
    <!-- 中间 -->
    <div id="circleMiddle" style="height: 100%;width: 50%;float: left;"></div>
    <!-- 右侧 -->
    <div
      id="circleRight"
      style="height: 100%;width: 25%;float: left;"
      class="fade-in-left2"
    ></div>
  </div>
</template>
<script>
export default {
  name: "carouselPage2",
  components: {},
  data() {
    return {
      time: null,
    };
  },
  methods: {},
  mounted() {
    var _this = this;
  },
  beforeDestroy() {}
};
</script>

<style lang="less" scoped>

</style>
