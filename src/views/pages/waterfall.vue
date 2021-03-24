<template>
  <waterfall></waterfall>
</template>

<script>
import waterfall from "../../components/waterfall/index1.vue";

export default {
  name: "t-waterfall",
  components: { waterfall },
  data() {
    return {
      imgArr: [
        // require("../../../../static/二供设备/泵站模型/空1.png"),
        // require("../../../../static/二供设备/泵站模型/空2.png"),
        // require("../../../../static/二供设备/泵站模型/液位仪红.png")
      ],
      imgCount: 0
    };
  },
  mounted() {
    this.loading();
  },
  methods: {
    //预加载图片
    loading() {
      var imgArr = this.imgArr;
      var imgCount = this.imgCount;
      for (let img of imgArr) {
        let imgage = new Image();
        imgage.src = img;
        imgage.onload = () => {
          imgCount++;
          this.imgCount = parseInt((imgCount / imgArr.length) * 100); //// 计算图片加载的百分数
        };
      }
    }
  }
};
</script>

<style scoped></style>
