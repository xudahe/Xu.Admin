<template>
  <div class="mapMiddle" style="height: 100%">

    <div v-show="!showTown" class="mapImg scale-in" :style="{top: topHeight+'px'}">
      <img :src="mapImg" style="width: 100%;height: 100%;position: absolute;" />

      <img v-show="itemhover == 1" :src="bzPoint" class="bzPoint" />
      <img v-show="itemhover == 1" :src="bzPointBg" class="bzPointBg" />

      <img v-show="!(itemhover == 1)" :src="bzPointBg" class="bzpoint" />

      <div :key="'text'+inde" v-for="(item,inde) in TextList" :class="[item.classname,'mapText']" @click="location(item)" :style="{color:itemhover == item.id ? '#ffffff' : ''}">
        <div v-html="item.name"></div>
      </div>

      <img v-show="!(itemhover == index)" :key="'point'+index" v-for="(item,index) in pointList" :src="point" :class="[item.classname, 'mapPoint']" @click="getFlow(item,index,true)" />
      <img v-show="itemhover == indev" :key="'pointsel'+indev" v-for="(item,indev) in pointList" :src="wscPoint" :class="[item.classname_sel, 'wscPoint']" @click="showTown1(item)" />
      <img v-show="itemhover == inde" :key="'mapsel'+inde" v-for="(item,inde) in pointList" :src="item.img_sel" :class="[item.imgClassName, 'img_sel']" />
    </div>
    <div v-if="showTown" class="mapTownImg scale-in">
      <town_qy></town_qy>
    </div>

    <img :src="imgSmall" class="imgSmall" @click="showTown = false" />

  </div>
</template>

<script>

import town_qy from "./town_qy.vue";
export default {
  components: {
    town_qy
  },
  data() {
    return {

      mapImg: "../../../../../static/img/lshome/map.png",
      mapImgT: "../../../../../static/img/lshome/map_sel.png",
      wscPoint: "../../../../../static/img/lshome/ic_污水处理厂.png",
      bzPoint: "../../../../../static/img/lshome/lshomeMore/ic_泵站.png",
      bzPointBg: "../../../../../static/img/lshome/lshomeMore/bg_ic_泵站.png",
      point: "../../../../../static/img/lshome/ic_定位_nor.png",
      imgSmall: "../../../../../static/img/lshome/缩略图.png",
      mapTopImg: "../../../../../static/img/lshome/bg_顶部选项.png",
      line: "../../../../../static/img/lshome/lshomeMore/路线.png",
      moreBg: "../../../../../static/img/lshome/legend-bg.png",
      moreCir: "../../../../../static/img/lshome/legend-circle.png",
      morePsh: "../../../../../static/img/lshome/ic_检查井.png",
      qyTown: "../../../../../static/img/lshome/map_sel.png",

      showTown: false,

      topHeight: 0,

      TextList: [
        {
          name: '观峰路泵站',
          classname: 'gflText',
          id: 11
        },
        {
          name: '拓塘镇<br/>污水处理厂<br/><span class="waterSpan">0.25万吨/日</span>',
          classname: 'ttText',
          id: 0
        },
        {
          name: '秦源<br/>污水处理厂<br/><span class="waterSpan">11万吨/日</span>',
          classname: 'qyText',
          id: 1
        },
        {
          name: '东屏镇<br/>污水处理厂<br/><span class="waterSpan">0.25万吨/日</span>',
          classname: 'dpText',
          id: 2
        },
        {
          name: '石湫镇<br/>污水处理厂<br/><span class="waterSpan">0.20万吨/日</span>',
          classname: 'sqText',
          id: 3
        },
        {
          name: '洪蓝镇<br/>污水处理厂<br/><span class="waterSpan">0.20万吨/日</span>',
          classname: 'hlText',
          id: 4
        },
        {
          name: '和凤镇<br/>污水处理厂<br/><span class="waterSpan">0.20万吨/日</span>',
          classname: 'hfText',
          id: 5
        },
        {
          name: '晶桥镇<br/>污水处理厂<br/><span class="waterSpan">0.20万吨/日</span>',
          classname: 'jqText',
          id: 6
        },
        {
          name: '白马镇<br/>污水处理厂<br/><span class="waterSpan">0.20万吨/日</span>',
          classname: 'bmText',
          id: 7
        }
      ],
      pointList: [
        {
          classname: 'ttPoint',
          parames: [],
          classname_sel: 'ttPoint_sel',
          img_sel: '../../../../../static/img/lshome/lshomeMore/map_拓塘镇_sel.png',
          imgClassName: 'ttMap_sel',
          id: 13
        },
        {
          classname: 'qyPoint',
          parames: ['LSQY_In', 'LSQY_Out'],
          classname_sel: 'qyPoint_sel',
          img_sel: '../../../../../static/img/lshome/map_sel.png',
          imgClassName: 'qyMap_sel',
          id: 14
        },
        {
          classname: 'dpPoint',
          parames: ['LSDP_IN', 'LSDP_Out'],
          classname_sel: 'dpPoint_sel',
          img_sel: '../../../../../static/img/lshome/lshomeMore/map_东屏镇_sel.png',
          imgClassName: 'dpMap_sel',
          id: 17
        },
        {
          classname: 'sqPoint',
          parames: ['LSXZ_IN', 'LSXZ_Out'],
          classname_sel: 'sqPoint_sel',
          img_sel: '../../../../../static/img/lshome/lshomeMore/map_石湫镇_sel.png',
          imgClassName: 'sqMap_sel',
          id: 20
        },
        {
          classname: 'hlPoint',
          parames: ['LSHL_IN', 'LSHL_Out'],
          classname_sel: 'hlPoint_sel',
          img_sel: '../../../../../static/img/lshome/lshomeMore/map_洪蓝镇_sel.png',
          imgClassName: 'hlMap_sel',
          id: 15
        },
        {
          classname: 'hfPoint',
          parames: ['LSHF_IN', 'LSHF_Out'],
          classname_sel: 'hfPoint_sel',
          img_sel: '../../../../../static/img/lshome/lshomeMore/map_和风镇_sel.png',
          imgClassName: 'hfMap_sel',
          id: 18
        },
        {
          classname: 'jqPoint',
          parames: ['LSJQ_IN', 'LSJQ_Out'],
          classname_sel: 'jqPoint_sel',
          img_sel: '../../../../../static/img/lshome/lshomeMore/map_晶桥镇_sel.png',
          imgClassName: 'jqMap_sel',
          id: 19
        },
        {
          classname: 'bmPoint',
          parames: ['LSBM_IN', 'LSBM_Out'],
          classname_sel: 'bmPoint_sel',
          img_sel: '../../../../../static/img/lshome/lshomeMore/map_白马镇_sel.png',
          imgClassName: 'bmMap_sel',
          id: 16
        },
      ],
      itemhover: null,
      events: {
        handleEvent: function (event) {
          if (event.type == 'resize') {
            this.resizeHeight()
          }
        },
        resizeHeight: (e) => {
          // 逻辑代码
          let hei = document.getElementsByClassName('mapMiddle')[0].offsetHeight;
          let hei1 = document.getElementsByClassName('mapImg')[0].offsetHeight;
          this.topHeight = Math.abs((hei - hei1) / 2)

        },
      }
    };
  },
  computed: {

  },
  methods: {
    location() {

    },
    getFlow(item, index, type) {
      debugger
      var _this = this;
      _this.itemhover = index;
    },
    showTown1(item) {
      let _this = true;
      if (item.classname == 'qyPoint') {
        this.showTown = true;
        // bus.$emit("showBotm", false)
      }
    },
  },
  mounted() {
    var _this = this;

    this.$nextTick(() => {
      let hei = document.getElementsByClassName('mapMiddle')[0].offsetHeight;
      let hei1 = document.getElementsByClassName('mapImg')[0].offsetHeight;

      _this.topHeight = Math.abs((hei - hei1) / 2)

    })
    window.addEventListener('resize', this.events, false);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.events, false);
  }
};
</script>


<style lang="less">
.mapMiddle {
  .mapImg {
    width: calc(~"6.64rem * 0.8");
    height: calc(~"5.97rem * 0.8");
    position: relative;
    left: calc(~"(100% - (6.64rem * 0.8))/2");
    // top: calc(~"(abs((5.97rem * 0.8) - (100% - 0.58rem) - 0.68rem)/2)");
  }

  .mapTownImg {
    width: calc(~"6.94rem * 1");
    height: calc(~"6.57rem * 1");
    position: relative;
    left: calc(~"(100% - (6.94rem * 1))/2");
    // top: calc(~"(abs((5.97rem * 0.8) - (100% - 0.58rem) - 0.68rem)/2)");
  }

  .map_sel {
    width: calc(~"2.65rem * 0.8");
    height: calc(~"2.19rem * 0.8");
    position: absolute;
    left: 1.83rem;
    top: 0.83rem;
  }

  .wscPoint {
    width: calc(~"1.07rem * 0.8");
    position: absolute;
    z-index: 3;
    // left: 1.83rem;
    // top: 0.58rem;
  }

  .img_sel {
    position: absolute;
  }

  .bzPoint {
    width: calc(~"1.07rem * 0.8");
    position: absolute;
    left: 2.7rem;
    top: 1.5rem;
    z-index: 3;
  }

  .line {
    width: calc(~"1.13rem * 0.8");
    height: calc(~"1.28rem * 0.8");
    position: absolute;
    left: 2.2rem;
    top: 1.1rem;
  }

  .bzPointBg {
    width: calc(~"0.6rem * 0.8");
    position: absolute;
    left: calc(~"2.7rem + (1.07rem * 0.8 - 0.6rem * 0.8) / 2");
    top: calc(~"1.5rem + (1.14rem * 0.8 - 0.48rem * 0.8) - 0.12rem");
    z-index: 3;
  }

  .bzPoint_sy {
    width: calc(~"1.07rem * 0.8");
    position: absolute;
    left: 3.1rem;
    top: 1.1rem;
    z-index: 3;
  }

  .bzPointBg_sy {
    width: calc(~"0.6rem * 0.8");
    position: absolute;
    left: calc(~"2.7rem + (1.07rem * 0.8 - 0.6rem * 0.8) / 2 + 0.4rem");
    top: calc(~"1.5rem + (1.14rem * 0.8 - 0.48rem * 0.8) - 0.5rem");
    z-index: 3;
  }

  .bzpoint {
    width: calc(~"0.32rem * 0.8");
    position: absolute;
    left: 3rem;
    top: 2rem;
    z-index: 3;
  }

  .mapText {
    font-family: "lsmap";
    color: rgba(255, 255, 255, 0.5);
    position: absolute;
    font-size: 0.14rem;
    line-height: 1;
    cursor: pointer;
    z-index: 3;
  }

  .mapText:hover {
    color: #ffffff;
  }

  .qyPoint {
    left: 2.15rem;
    top: 1rem;
  }

  .qyPoint_sel {
    left: calc(~"2.15rem - (1.07rem * 0.8)/2 + (0.32rem * 0.8)/2");
    top: calc(~"1rem - (1.14rem * 0.8)/2 + (0.32rem * 0.8)/2");
  }

  .qyText {
    left: 2.4rem;
    top: 0.85rem;
  }

  .jlljText {
    left: 2.3rem;
    top: 1.9rem;
  }

  .gflText {
    left: 3.3rem;
    top: 1.9rem;
  }

  .syljText {
    left: 3.7rem;
    top: 1.5rem;
  }

  .ttText {
    left: 1.3rem;
    top: 0.55rem;
  }

  .ttPoint {
    left: 1.5rem;
    top: 0.68rem;
  }

  .ttPoint_sel {
    left: calc(~"1.5rem - (1.07rem * 0.8)/2 + (0.32rem * 0.8)/2");
    top: calc(~"0.68rem - (1.14rem * 0.8)/2 + (0.32rem * 0.8)/2");
  }

  .dpText {
    left: 2.8rem;
    top: 0.3rem;
  }

  .dpPoint {
    left: 2.6rem;
    top: 0.56rem;
  }

  .dpPoint_sel {
    left: calc(~"2.6rem - (1.07rem * 0.8)/2 + (0.32rem * 0.8)/2");
    top: calc(~"0.56rem - (1.14rem * 0.8)/2 + (0.32rem * 0.8)/2");
  }

  .sqText {
    left: 1rem;
    top: 2.9rem;
  }

  .sqPoint {
    left: 1.1rem;
    top: 2.58rem;
  }

  .sqPoint_sel {
    left: calc(~"1.1rem - (1.07rem * 0.8)/2 + (0.32rem * 0.8)/2");
    top: calc(~"2.58rem - (1.14rem * 0.8)/2 + (0.32rem * 0.8)/2");
  }

  .hlText {
    left: 1.9rem;
    top: 2.2rem;
  }

  .hlPoint {
    left: 1.6rem;
    top: 2.2rem;
  }

  .hlPoint_sel {
    left: calc(~"1.6rem - (1.07rem * 0.8)/2 + (0.32rem * 0.8)/2");
    top: calc(~"2.2rem - (1.14rem * 0.8)/2 + (0.32rem * 0.8)/2");
  }

  .hfText {
    left: 1.9rem;
    top: 3.6rem;
  }

  .hfPoint {
    left: 2.1rem;
    top: 3.3rem;
  }

  .hfPoint_sel {
    left: calc(~"2.1rem - (1.07rem * 0.8)/2 + (0.32rem * 0.8)/2");
    top: calc(~"3.3rem - (1.14rem * 0.8)/2 + (0.32rem * 0.8)/2");
  }

  .jqText {
    left: 3.1rem;
    top: 3.1rem;
  }

  .jqPoint {
    left: 3.1rem;
    top: 2.8rem;
  }

  .jqPoint_sel {
    left: calc(~"3.1rem - (1.07rem * 0.8)/2 + (0.32rem * 0.8)/2");
    top: calc(~"2.8rem - (1.14rem * 0.8)/2 + (0.32rem * 0.8)/2");
  }

  .bmText {
    left: 3.9rem;
    top: 2.5rem;
  }

  .bmPoint {
    left: 3.62rem;
    top: 2.5rem;
  }

  .bmPoint_sel {
    left: calc(~"3.62rem - (1.07rem * 0.8)/2 + (0.32rem * 0.8)/2");
    top: calc(~"2.5rem - (1.14rem * 0.8)/2 + (0.32rem * 0.8)/2");
  }

  .mapPoint {
    position: absolute;
    width: calc(~"0.32rem * 0.8");
    cursor: pointer;
    z-index: 3;
  }

  .imgSmall {
    position: absolute;
    bottom: 0;
    right: 0;
    width: calc(~"1.62rem * 0.8");
  }

  .qyMap_sel {
    width: calc(~"2.65rem * 0.8");
    height: calc(~"2.19rem * 0.8");
    left: 1.83rem;
    top: 0.83rem;
  }

  .ttMap_sel {
    width: calc(~"1.76rem * 0.8");
    height: calc(~"1.42rem * 0.8");
    left: 0.95rem;
    top: 0.14rem;
  }

  .dpMap_sel {
    width: calc(~"2.97rem * 0.8");
    height: calc(~"1.99rem * 0.8");
    left: 2rem;
    top: 0.12rem;
  }

  .sqMap_sel {
    width: calc(~"2.28rem * 0.8");
    height: calc(~"3.5rem * 0.8");
    left: 0.25rem;
    top: 1.05rem;
  }

  .hlMap_sel {
    width: calc(~"2.35rem * 0.8");
    height: calc(~"2rem * 0.8");
    left: 1.21rem;
    top: 1.45rem;
  }

  .hfMap_sel {
    width: calc(~"2.16rem * 0.8");
    height: calc(~"1.85rem * 0.8");
    left: 1.36rem;
    top: 2.84rem;
  }

  .jqMap_sel {
    width: calc(~"2.79rem * 0.8");
    height: calc(~"2.18rem * 0.8");
    left: 2.11rem;
    top: 2.22rem;
  }

  .bmMap_sel {
    width: calc(~"2.17rem * 0.8");
    height: calc(~"2.59rem * 0.8");
    left: 3.32rem;
    top: 1.06rem;
  }

  .waterSpan {
    color: #85ff9a;
    font-size: 0.12rem;
  }
}
</style>
