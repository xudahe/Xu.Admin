<template>
  <div class="homeMiddleTop" style="width: 100%;height: 100%;">
    <div class="mapTop">
      <Row>
        <template v-for="(item, index) in drainageObj">
          <Col :span="colNum" style="padding-left: 0.1rem;" :key="index">
          <img :src="mapTopImg" class="topImgBg" />
          <img :src="item.img" class="topImg" />
          <div style="display: inline-block;margin-left: 0.1rem;">
            <div class="topName">{{ item.name }}</div>
            <div class="topValue">{{ item.value }}</div>
            <div class="topUnit">{{ item.unit }}</div>
          </div>
          </Col>
        </template>
      </Row>
    </div>
    <div class="mapContent" style="width:100%;height:calc(100% - 0.05rem);position: relative;">
      <arcgisMap></arcgisMap>
    </div>
  </div>
</template>

<script>
import arcgisMap from "../../../../components/arcgis_map/index2";
export default {
  name: "homeMiddleTop",
  components: { arcgisMap },
  data() {
    return {
      colNum: 1,
      mapTopImg: "../../../../static/img/newhome/icon/bg_顶部选项.png",
      drainageObj: [
        {
          name: "检查井",
          value: 12,
          unit: "座",
          img: "../../../../static/img/newhome/icon/ic_检查井.png"
        },
        {
          name: "污水管",
          value: parseFloat(218).toFixed(1),
          unit: "公里",
          img: "../../../../static/img/newhome/icon/ic_检查井.png"
        },
        {
          name: "雨水管",
          value: parseFloat(343).toFixed(1),
          unit: "公里",
          img: "../../../../static/img/newhome/icon/ic_检查井.png"
        },
        {
          name: "节点井",
          value: 12,
          unit: "个",
          img: "../../../../static/img/newhome/icon/ic_检查井.png"
        }
      ]
    };
  },
  methods: {},
  mounted() {
    var _this = this;
    this.colNum = Number(24 / this.drainageObj.length);
  }
};
</script>

<style lang="less" scoped>
.homeMiddleTop {
  .mapTop {
    height: 0.45rem;
    overflow-y: hidden;
    position: absolute;
    width: 100%;
    z-index: 9;
    top: 0.1rem;
  }

  .topImgBg {
    width: 90%;
    height: 100%;
    position: absolute;
  }
  .topImg {
    width: 0.25rem;
    height: 0.25rem;
    margin-left: 0.15rem;
  }
  .topName {
    color: #68a2eb;
    // display: inline-block;
    position: relative;
    font-size: 0.12rem;
    font-weight: bold;
  }
  .topValue {
    color: #ffe400;
    display: inline-block;
    position: relative;
    font-size: 0.14rem;
    font-weight: bold;
  }
  .topUnit {
    color: #ffe400;
    display: inline-block;
    position: relative;
    font-size: 0.12rem;
  }
}
</style>
