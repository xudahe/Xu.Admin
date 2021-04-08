<template>
  <div id="slide" style="margin-top:10px;">
    <slide-verify
      ref="slideblock"
      @success="onSuccess"
      @again="onAgain"
      @fulfilled="onFulfilled"
      @fail="onFail"
      @refresh="onRefresh"
      :imgs="imgs"
      :accuracy="accuracy"
    ></slide-verify>
    <div>{{ msg }}</div>
    <verify></verify>
  </div>
</template>

<script>
import verify from "./verify";

export default {
  components: { verify },
  data() {
    return {
      msg: "",
      imgs: [
        require("../../../static/img/slide/img.jpg"),
        require("../../../static/img/slide/img1.jpg"),
        require("../../../static/img/slide/img2.jpg"),
        require("../../../static/img/slide/img3.jpg"),
        require("../../../static/img/slide/img4.jpg"),
        require("../../../static/img/slide/img5.jpg")
      ],
      accuracy: 2 // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
    };
  },
  methods: {
    onSuccess(times) {
      console.log("验证通过");
      this.msg = `验证通过, 耗时${(times / 1000).toFixed(1)}s`;
    },
    onFail() {
      console.log("验证不通过");
      this.msg = "";
    },
    onRefresh() {
      console.log("点击了刷新小图标");
      this.msg = "";
    },
    onFulfilled() {
      console.log("刷新成功啦！");
    },
    onAgain() {
      console.log("检测到非人为操作的哦！");
      this.msg = "try again";
      // 刷新
      this.handleClick();
    },
    handleClick() {
      this.$refs.slideblock.reset(); //重置
      this.msg = "";
    }
  }
};
</script>

<style>
.btn {
  margin-top: 20px;
  outline: 0;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  color: #fff;
  background-color: #1890ff;
  cursor: pointer;
}
.btn:active {
  box-shadow: 1px 5px 0 rgba(0, 0, 0, 0.1) inset;
}
</style>
