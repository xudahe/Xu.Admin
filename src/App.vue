<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>

import Cookies from "js-cookie";
export default {
  name: "app",
  components: {},
    data() {
        return {
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
      window.addEventListener(
        "hashchange",
        () => {
          var currentPath = window.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath);
          }
        },
        false
      );
    }
  },

  //生命周期函数--实例销毁之前调用
  //假设有三个页面，分别为A、B、C页面，其中B页面定义了beforeDestroy生命周期函数。
  //页面执行顺序是A -> B -> C,当从B到C时，beforeDestroy 函数会执行，但由B点击浏览器返回按钮时返回A时，beforeDestroy 不触发。
  beforeDestroy() {
    
  },
  created() {
  },
  methods: {

  }
};
</script>


<style lang="scss">
  #app {
    height: 100%;
    width: 100%;
  }
</style>
