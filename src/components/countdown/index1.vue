<template>
  <div id="countdown">
    <div class="svg-count">
      <svg
        class="svg-circle"
        :viewbox="'0 0 ' + circle.width + ' ' + circle.width"
      >
        <circle
          :cx="svgRadius"
          :cy="svgRadius"
          :r="radius"
          fill="#ccc"
          stroke="#409eff"
          :stroke-width="circle.strokeWidth"
        ></circle>
        <circle
          :cx="svgRadius"
          :cy="svgRadius"
          :r="radius"
          fill="transparent"
          stroke="#ff0000"
          class="alert-sec-circle"
          :class="{ transiton0: second == countType }"
          :stroke-width="circle.strokeWidth + 1"
          stroke-linecap="round"
          :transform="'rotate(-90 ' + svgRadius + ' ' + svgRadius + ')'"
          :stroke-dasharray="perimeter"
          :stroke-dashoffset="countTime"
        ></circle>
      </svg>
      <div class="count-number">{{ second }}</div>
    </div>
  </div>
</template>

<script>

/**
 * svg倒计时效果
 */
export default {
  name: "countdown",
  data() {
    return {
      second: 10, // second与countType 两个参数需要一致
      countType: 10,
      circle: {
        width: 100,
        strokeWidth: 4
      }
    };
  },
  computed: {
    //圆形进度比
    countTime() {
      return Math.round(
        ((this.second < 0 ? 0 : this.second) / this.countType) *
          this.perimeter -
          this.perimeter
      );
    },
    // 圆的周长
    perimeter() {
      return 2 * Math.PI * this.radius;
    },
    // 半径
    svgRadius() {
      return this.circle.width / 2;
    },
    // 边框半径
    radius() {
      return this.circle.width / 2 - this.circle.strokeWidth;
    }
  },
  mounted() {
    let timer = setInterval(() => {
      this.second--;
      if (this.second < 0) this.second = this.countType;
    }, 1000);

    this.$once("hook:beforeDestroy", () => {
      this.second = this.countType;
      clearInterval(timer);
    });
  }
};
</script>

<style lang="less">
#countdown {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.svg-count {
  position: relative;
  width: 100px;
  height: 100px;
}
.svg-circle {
  width: 100px;
  height: 100px;
}
.count-number {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  line-height: 100px;
  text-align: center;
  color: #fff;
  font-size: 66px;
}
.alert-sec-circle {
  transition: stroke-dashoffset 1s linear;
}
</style>
