<template>
  <div class="v-header">
    <div class="v-left-text" v-if="text != ''">
      <Icon size="20" :type="icon" v-if="icon != ''" />
      <span>{{ text }}</span>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <div class="v-right-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "v-header",
  props: {
    icon: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="less" scoped>
.v-header {
  display: flex;
  padding-bottom: 5px;
  border-bottom: 1px solid #dcdee2;
  .v-left-text {
    cursor: pointer;
    padding-left: 5px;
    margin-top: 5px;
    font-weight: bold;
    font-size: 0.15rem;
    color: #57a3f3;
    white-space: nowrap;
    > span {
      position: relative;
    }
  }
  .content {
    padding-left: 10px;
    padding: 6px 0 0 10px;
  }
  .v-right-content {
    flex: 1;
  }
}
</style>
