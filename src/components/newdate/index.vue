<template>
  <el-container id="box">
    <span id="showTime"></span>
  </el-container>
</template>

<script>
//创建一个函数来增加月日时小于10在前面加0
var padaDate = function(value) {
  return value < 10 ? "0" + value : value;
};
export default {
  name: "newDate",
  data() {
    return {
      date: new Date() //实时时间
    };
  },
  methods: {},
  created() {},
  mounted() {
    // 创建定时器更新最新的时间
    var _this = this;
    const timer = setInterval(function() {
      let dt = new Date();
      var y = dt.getFullYear();
      var mt = padaDate(dt.getMonth() + 1);
      var day = padaDate(dt.getDate());
      var h = padaDate(dt.getHours()); //获取时
      var m = padaDate(dt.getMinutes()); //获取分
      var s = padaDate(dt.getSeconds()); //获取秒
      document.getElementById("showTime").innerHTML =
        y + "-" + mt + "-" + day + " " + h + ":" + m + ":" + s;
    }, 1000);

    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  }
};
</script>
<style lang="scss" scoped>
#showTime {
  font-size: 0.12rem;
}
</style>
