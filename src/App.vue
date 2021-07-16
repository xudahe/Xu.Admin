<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { location } from "@/utils/location";

export default {
  name: "app",
  components: {},
  data() {
    return {};
  },
  watch: {
    $route(to, from) {
      console.log(to)
    }
  },
  mounted() {
    // document.getElementById('app').style.width = window.innerWidth + 'px';
    // document.getElementById('app').style.height = window.innerHeight + 'px';

    // window.addEventListener("resize", function() {
    //   document.getElementById("app").style.width = window.innerWidth + "px";
    //   document.getElementById("app").style.height = window.innerHeight + "px";
    // });


    function checkIE() {
      return (
        "-ms-scroll-limit" in document.documentElement.style &&
        "-ms-ime-align" in document.documentElement.style
      );
    }
    if (checkIE()) {
      //①当URL的片段标识符更改时，将触发hashchange事件（跟在#符号后面的URL部分，包括#符号）
      //②hashchange事件触发时，事件对象会有hash改变前的URL（e.oldURL）和hash改变后的URL（e.newURL）两个属性：
      window.addEventListener(
        "hashchange",
        e => {
          var currentPath = window.location.hash.slice(1);
          if (currentPath!="" && this.$route.path !== currentPath) {
            this.$router.push(currentPath);
          }
        },
        false
      );
    }
  },
  async created() {
    if (window.AMap && window.AMapUI) {
      await location.initMap("map-container"); //获取当前客户端位置
    }
  },
  //生命周期函数--实例销毁之前调用
  beforeDestroy() {
    /**
     * 假设有三个页面，分别为A、B、C页面，其中B页面定义了beforeDestroy生命周期函数。
     * 页面执行顺序是A -> B -> C,当从B到C时，beforeDestroy 函数会执行，但由B点击浏览器返回按钮时返回A时，beforeDestroy 不触发。
     */
  }
};

/**
 *（1）window.location.href  得到的是完整的URL
 *    比如：window.location.href = ' www.baidu.com'
 *（2）window.location.hash  得到的是锚链接
 *    比如：window.location.hash= ' #all'
 *（3）window.location.search得到的是URL‘？’号后面的字符串部分
 *    比如：window.location.search= ' ?username=aaa&age=10'
 */
</script>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
}
</style>
