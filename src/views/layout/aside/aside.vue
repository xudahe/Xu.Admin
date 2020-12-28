<template>
  <div>
    <el-aside id="asideNav">
      <div class="logo-name" @click="changeScreen">
        <p v-if="$store.getters.isCollapse">XU</p>
        <p v-else>vue-Admin</p>
      </div>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical"
        @select="selectmenu"
        mode="vertical"
        :collapse="$store.getters.isCollapse"
        :router="$store.getters.uniquerouter"
        :unique-opened="$store.getters.uniquerouter"
        :collapse-transition="true"
      >
        <menu-tree :menuData="$store.getters.info.menuinfo"></menu-tree>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import menuTree from "./menuTree";

export default {
  name: "asideNav",
  components: {
    menuTree
  },
  watch: {
    // 监听浏览器直接输入路由，将此路由添加到tabnavBox
    "$route.path": function(val) {
      this.selectmenu(val);
    }
  },
  methods: {
    selectmenu(key) {
      let router = this.$store.getters.routers;
      let name = "";

      let navTitle = function(path, routerARR) {
        for (let i = 0; i < routerARR.length; i++) {
          if (routerARR[i].children.length > 0 || routerARR[i].path === path) {
            if (
              routerARR[i].path === path &&
              routerARR[i].children.length < 1
            ) {
              name = routerARR[i].name;
              break;
            }
            navTitle(path, routerARR[i].children);
          }
        }
        return name;
      };
      this.$store.dispatch("addTab", {
        title: navTitle(key, router),
        path: key
      });
    },
    changeScreen() {
      this.$router.push({ path: "/platform" });
    }
  }
};
</script>

<style lang="scss">
$top: top;
$bottom: bottom;
$left: left;
$right: right;
%w100 {
  width: 100%;
}

%h100 {
  height: 100%;
}

%cursor {
  cursor: pointer;
}

@mixin set-value($side, $value) {
  @each $prop in $leftright {
    #{$side}-#{$prop}: $value;
  }
}

#asideNav {
  width: auto !important;
  display: flex;
  flex-direction: column;
  border-right: solid 1px #e6e6e6;
  .logo-name {
    // background-color: #03152a !important;
    @extend %w100;
    font-weight: 300;
    z-index: 999;
    p {
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      color: #5e6d82;
    }
  }
  .logo-name p {
    cursor: pointer;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    @extend %h100;
    overflow-y: scroll;
    overflow-x: enabled;
  }
  .el-menu {
    flex: 1;
    overflow: inherit;
    border-right: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .fa {
      vertical-align: middle;
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
    }
  }
}
</style>
