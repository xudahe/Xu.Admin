<template>
  <div class="homepage" style="width: 100%;height: calc(100% - 0.6rem);">
    <marquee :width="wit" direction="left" align="middle" class="watherDiv">
      {{date}} 多云 27℃ 西北风2到3级!
    </marquee>
    <div class="warnDiv" style="height: 18px;overflow: hidden;">
      <div style="position: relative;" :style="{top: noticeTop + 'px'}" :class="{transitionTop: isActive}">
        <div :id="'Pro'+ind" v-for="(item,ind) in liquidWarn" :key="ind" class="botDiv" :style="{cursor: 'pointer'}">
          <div v-html="item" style="line-height: 18px;"></div>
        </div>
      </div>
    </div>
    <div id="homePage_Div" style="width: 100%;height: 100%;">
      <!-- 中间主体部分 -->
      <div class="homePageDiv" style="height: 100%;position: relative;overflow-y: hidden;width: 100%;">
          <Carousel v-model="overviewPage">
            <CarouselItem :key="inde" v-for="(item,inde) in maxPage">
               <!-- <component :is="item.classname"></component> -->
              <carouselPage1></carouselPage1>
            </CarouselItem>
          </Carousel>
      </div>
    </div>

  </div>
</template>
<script>
import bus from "../../../eventBus.js";

import carouselPage1 from "../component/publics/carouselPage1.vue";

export default {
    components: {
      carouselPage1
    },
    data() {
      return {
        overviewPage: 0,
        maxPage: [
          {id:1},
          {id:2},
          {id:3},
        ],

        time: null,

        date: '',
        liquidWarn: [],

        timer: null,
        noticeTop: 0, // 公告top值
        isActive: true, // 是否显示transitionTop动画
        wit: 0
      };
    },
    methods: {
      getWarnData() {
        let _this = this;
      
        for (let i = 0; i < 5; i++) {
            this.liquidWarn.push("<div>天气预报：<span class='liquidWarnRoad'>2020-08-18 多云 27℃ 西北风2到3级!</span></div>")
        }
        let index = 1;
        let list = JSON.parse(JSON.stringify(_this.liquidWarn));

        _this.timer = setInterval(() => {

          if ((index - 1) == _this.liquidWarn.length) {
            index = 1;
          }
          let dom = document.getElementsByClassName('botDiv');
          _this.liquidWarn.push(list[(index - 1)]);

          _this.isActive = true;
          _this.noticeTop = -18;

          setTimeout(function() {
            _this.isActive = false;
            _this.noticeTop = 0;
            _this.liquidWarn.splice(0, 1);
          }, 2500)
          index++;

        }, 5000);
      }

    },
    mounted() {
      var _this = this;

      this.$nextTick(() => {
        this.getWarnData();
      })
      let time = new Date();
      this.date = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + '时'
      let designSize = 1920; // 设计图尺寸
      let html = document.documentElement;
      let wW = html.clientWidth; // 窗口宽度
      let rem = wW * 100 / designSize;

      this.wit = 6.4 * rem
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    created() {
    }
  };
</script>

<style lang="less" scoped>
  @deep: ~'>>>';

  @{deep}.ivu-carousel {
    height: 100% !important;
    width: 100% !important;
  }
  @{deep}.ivu-carousel-list {
    height: 100% !important;
  }
  @{deep}.ivu-carousel-track {
    height: 100% !important;
  }
  @{deep}.ivu-carousel-arrow {
    background-color: rgb(83, 133, 152) !important;
  }
  @{deep}.ivu-carousel-arrow :hover {
    background-color: rgb(83, 133, 152) !important;
  }
  @{deep}.ivu-carousel-item{
    height: 100% !important;
  }

  .homepage {
    position: relative;

   

    .watherDiv {
      position: absolute;
      color: #ffde76;
      top: -0.1rem;
      left: 0.1rem;
      font-weight: bold;
    }

    .warnDiv {
      position: absolute;
      color: #ea4808;
      top: -0.08rem;
      right: 0.1rem;
      font-weight: bold;
    }
    .liquidWarnRoad{
      color: #fced32;
    }
  }

</style>
