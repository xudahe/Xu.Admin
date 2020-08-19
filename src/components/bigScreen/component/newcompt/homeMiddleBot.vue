<template>
	<div  style="width: 100%;height: 100%;">
		<component :is="componentdiv"></component>
	</div>
</template>

<script>
import bus from "../../../../eventBus.js";

export default {
  name: "homeMiddleBot",
  components: {
    // riverBot,
    // pipeBot,
    // purificationBot,
    // dispatchBot,
	  // overviewBot
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
  computed: {
    componentdiv() {
      let divname = "";
    //   switch (this.typename) {
    //     case "河道":
    //       divname = riverBot;
    //       break;
    //     case "管网":
    //       divname = pipeBot;
    //       break;
    //     case "净水站":
    //       divname = purificationBot;
    //       break;
    //     case "泵站":
    //       divname = dispatchBot;
    //       break;
		// case "总览":
		//   divname = overviewBot;
		//   break;
    //   }
      return divname;
    }
  },
  methods: {},
  mounted() {
    var _this = this;
  }
};
</script>

<style lang="less" scoped>
</style>
