<!-- 文件编辑组件 -->
<template>
  <div class="content-edit">
    <el-input class="file-title" v-model="currentTitle" placeholder="请输入标题" />
    <mavon-editor v-bind="$attrs" v-on="$listeners" class="markdown-wrapper" />
  </div>
</template>

<!-- 
   v-bind="$attrs"：传递所有属性
   v-on="$listeners"：传递所有方法
 -->

<script>
export default {
  name: "FileEdit",
  props: {
    title: String
  },
  data() {
    return {
      currentTitle: this.title
    };
  },
  watch: {
    title: {
      handler: function (newVal, oldVal) {
        this.currentTitle = newVal;
      },
      deep: true
    },
    currentTitle: {
      handler: function (newVal, oldVal) {
        this.$emit("update:title", newVal);
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.content-edit {
  height: 100%;
  width: 100%;
  .file-title {
    padding-left: 5px;
    height: 56px;
    line-height: 56px;
    font-size: 18px;
    font-weight: 500;

    /deep/ .el-input__inner {
      height: inherit;
      line-height: inherit;
      font-weight: inherit;
      border: none;
    }
  }

  .markdown-wrapper {
    height: calc(100% - 56px);

    &.fullscreen {
      height: 100%;
    }
  }
}
</style>
