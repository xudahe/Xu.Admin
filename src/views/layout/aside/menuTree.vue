<template>
  <div class="menu-bug-warp">
    <template v-for="(item,index) in menuData" v-if="!item.enabled">
      <el-submenu v-if="item.children.length > 0" :index="index+''" :key="index">
        <template slot="title">
          <i :class="item.icon?item.icon:[fa,fa-file]"></i>
          <span slot="title">{{item.menuName }}</span>
        </template>
        <menu-tree :menuData="item.children"></menu-tree>
      </el-submenu>

      <el-menu-item v-else :index="item.className" :key="index">
        <i :class="item.icon?item.icon:[fa,fa-file]"></i>
        <span slot="title">{{ item.menuName }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "menuTree",
  props: ["menuData"]
}
</script>
