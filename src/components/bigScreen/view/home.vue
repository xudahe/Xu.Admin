<!-- 入口页面 -->
<template>
  <div id="homemain" style="height: 100%;width: 100%;">
    <header1></header1>
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import header1 from "../components/header.vue";
import NavConfig from "../router/nav.configCompent.yml";

export default {
  components: {
    header1
  },
  watch: {
    $route(to, from) { }
  },
  mounted() {
    this.$router.push({
      name: "homePage",
      query: {
        id: 11
      }
    });
  },
  data() {
    return {};
  },
  beforeDestroy() { },
  methods: {
    //注册组件
    regeisterComponent(NavConfig) {
      Object.keys(NavConfig).forEach((lang, idx) => {
        const pageNavs = NavConfig[lang];

        pageNavs.forEach(nav => {
          nav.groups && nav.groups.forEach(group => {
            group.items.forEach(item => {
              if (item.details) {
                item.details.forEach(detail => {
                  if (detail.pages) {
                    detail.pages.forEach(page => {
                      Vue.component(page.name, function (resolve) {
                        require([`@/${nav.name}/${group.name}/${item.name}/${detail.name}/${page.name}.vue`], resolve);
                      });
                    });
                  }
                  else {
                    Vue.component(detail.name, function (resolve) {
                      require([`@/${nav.name}/${group.name}/${item.name}/${detail.name}.vue`], resolve);
                    });
                  }
                });
              } else {
                Vue.component(item.name, function (resolve) {
                  require([`@/${nav.name}/${group.name}/${item.name}.vue`], resolve);
                });
              }
            });
          });
        });
      });
    }
  },
  created() {
    // 开始注册组件
    this.regeisterComponent(NavConfig);
  }
};
</script>
<style lang="less" scoped>
#homemain {
  background-image: url("../../../../static/img/newhome/04/bg.png");
  background-size: 100% 100%;
}
</style>
