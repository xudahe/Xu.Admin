<template>
  <div style="width: 100%;height: 100%;">
    <component :is="componentdiv"></component>
  </div>
</template>

<script>
import bus from "../../../../eventBus.js";

export default {
  name: "homeMiddleTop",
  components: { 

   },
  props: {
    typename: {
      type: String,
      default() {
        return "河道";
      }
    }
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {
    var _this = this;
  },
  computed: {
    componentdiv() {
      let divname = "";
   
      return divname;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
