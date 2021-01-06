<!-- 左侧文件列表组件 -->
<template>
  <div style="height: 100%;">
    <div class="file-search">
      <el-input placeholder="搜索内容..." v-model="filterText"></el-input>
      <el-dropdown style="margin-left:5px;">
        <el-button type="primary" icon="el-icon-circle-plus-outline" circle />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="createFile"
            >新建笔记</el-dropdown-item
          >
          <el-dropdown-item divided @click.native="importFile"
            >导入文件</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-scrollbar
      class="scrollbar-list"
      wrap-class="scrollbar-wrapper"
      :noresize="false"
      tag="ul"
    >
      <li
        v-for="(item, index) in fileList"
        :key="index"
        :class="selectIndex == index ? 'file-item color' : 'file-item'"
        @click="selectClick(item, index)"
        @mouseenter="item.showTool = true"
        @mouseleave="item.showTool = false"
      >
        <i class="el-icon-document" style="font-size:15px;margin-right:3px;" />
        <p class="item-title">{{ item.title }}</p>
        <p class="item-time" v-if="!item.showTool">
          {{ item.time | formatDate("yyyy-mm-dd") }}
        </p>
        <p class="item-tool" v-else>
          <i
            class="el-icon-delete icon"
            style="font-size:17px"
            @click.stop="clickDel(item)"
          />
        </p>
      </li>
    </el-scrollbar>
  </div>
</template>

<!--
  mouseover 和 mouseout 是根据鼠标事件的target进行触发的，是一种精确触发。当为某一组件(如div)设置这两个事件时，当事件的target是该组件时，就会触发mouseover，但是当鼠标划到该组件的子组件上时，因为target改变了，所以就触发了 mouseout 事件，这往往就会造成页面元素的闪烁。
  mouseenter 和 mouseleave 是根据组件在页面的范围(坐标)进行触发的。不管组件中是否有子组件，只要鼠标进入到组件的范围内，就可以触发mouseenter事件，离开范围，则触发mouseleave事件。
-->

<script>
export default {
  name: "FileList",
  props: {
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterText: "",
      showDel: false,
      selectIndex: -1
    };
  },
  methods: {
    createFile() {
      this.$emit("createFile");
    },
    importFile() {
      this.$emit("importFile");
    },
    selectClick(item, index) {
      this.selectIndex = index;
      this.$emit("selectItem", item);
    },
    clickDel(item) {}
  }
};
</script>

<style lang="less" scoped>
.file-search {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  background: #daecfe;

  .el-dropdown {
    .el-button--small {
      margin-left: 10px;
      padding: 6px;
      font-size: 14px;
      border-radius: 30%;
    }
  }
}

.scrollbar-list {
  height: calc(100% - 60px);
  user-select: none;
  .file-item {
    display: flex;
    align-items: center;
    height: 55px;
    border-bottom: 1px solid #eaeefb;
    padding: 0 10px;
    cursor: pointer;

    .item-icon {
      margin-left: 20px;
      margin-right: 12px;
    }

    .item-title {
      flex: 1;
      margin-right: 5px;
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .item-time {
      font-size: 12px;
      padding-right: 10px;
    }
    .item-tool {
      font-size: 12px;
      padding-right: 10px;
    }
  }
  .color,
  .file-item:hover {
    background-color: rgb(236, 245, 255);
  }
}
</style>
