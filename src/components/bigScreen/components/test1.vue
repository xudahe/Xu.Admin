<template>
  <div style="height:100%;width:100%;" class="test1 bgActive collapse simple_page">
    <div style="padding: 0.05rem;height: 100%;">
      <div style="overflow: auto;height: calc(100% - 0.4rem);" class="borderdiv">
        <div :class="index == selectId ? 'bgActiveT' : 'bgActiveF bgActive'" style="padding:0.05rem;margin-bottom: 0.05rem;cursor:pointer;position: relative;" @click="goto(item, index)" v-for="(item, index) in tableList" :key="index" :id="index">
          <div style="display: inline-block;width:100%; height: 0.2rem;">
            <div class="row at-row no-gutter" style="width: 32px;float: left;position: relative;">
              <div class="circle" />
              <label style="font-size: 0.12rem;position: absolute; top:0%;left:20%; color:white; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" v-if="index + 1 == 10">{{ index + 1 }}</label>
              <label style="font-size: 0.12rem;position: absolute; top:0%;left: 32%; color:white; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" v-else>{{ index + 1 }}</label>
            </div>
            <label style="font-family: '微软雅黑';float: left; font-size: 0.12rem;color: #fff;font-weight: bolder;">{{ item.title }}</label>
            <i class="icon icon-map-pin" style="float:right;color: #2d8cf0;"></i>
          </div>
          <div style="float: left;cursor: pointer;">
            <img :src="require('../../../../static/img/暂无图片.png')" v-viewer style="width: 0.5rem;height: 0.55rem;" />
          </div>
          <div style="display: inline-block;cursor: pointer;width: calc(100% - 0.7rem);padding-left: 0.05rem;">
            <Row>
              <Col span="24">
              <span class="resultLable">字段名称：</span>
              <span :title="item.title" class="rsultValue">{{
                  item.title
                }}</span>
              </Col>
              <Col span="24">
              <span class="resultLable">字段名称：</span>
              <span :title="item.title" class="rsultValue">{{
                  item.title
                }}</span>
              </Col>
              <Col span="24">
              <span class="resultLable">字段名称：</span>
              <span :title="item.title" class="rsultValue">{{
                  item.title
                }}</span>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <div class="row at-row flex-end" style="padding-top: 0.1rem;">
        <Page simple show-total :current="page.current" :total="page.total" @on-change="changePage" size="small" style="padding-right: 0.1rem;float: right;"></Page>
        <span style="color:#fff;font-size: 0.12rem;padding-left: 0.1rem;">共{{ page.total }}条</span>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../../../eventBus.js";
import { MapControl } from "../../arcgis_map/js/MapControl.js";

export default {
  components: {},
  data() {
    return {
      page: {
        pageSize: 10, //每页记录数
        current: 1, //当前页码
        total: 0,
        pageList: [
          { id: 1, title: "某某1", x: "118.75596318", y: "32.04079632" },
          { id: 2, title: "某某2", x: "118.80705517", y: "32.10048969" },
          { id: 3, title: "某某3", x: "118.80566318", y: "32.10449283" },
          { id: 4, title: "某某4", x: "118.80070507", y: "32.10006197" },
          { id: 5, title: "某某5", x: "118.79423849", y: "32.09702295" },
          { id: 6, title: "某某6", x: "118.89153772", y: "32.05832442" },
          { id: 7, title: "某某7", x: "118.89252052", y: "32.05729316" }
        ]
      },
      selectId: -1, //已选择的编号

      titlename: "缩略图",
      tableList: []
    };
  },
  methods: {
    goto(item, ID) {
      this.selectId = ID;

      let map = MapControl.map[MapControl.mapId];
      let geometry = "POINT(" + item.x + " " + item.y + ")";
      let geo = MapControl.WktToAgs(geometry);

      var xMin = parseFloat(geo.x) - 0.000005;
      var yMin = parseFloat(geo.y) - 0.000005;
      var xMax = parseFloat(geo.x) + 0.000005;
      var yMax = parseFloat(geo.y) + 0.000005;
      var showExtent = new esri.geometry.Extent(
        xMin,
        yMin,
        xMax,
        yMax,
        map.spatialReference
      );
      map.setExtent(showExtent.expand(0));

      var gralyr1 = MapControl.graphicLayers["gralyr1"];
      var gralyrList = gralyr1.graphics;
      for (var k = 0; k < gralyrList.length; k++) {
        var url = gralyrList[k].symbol.url;
        if (url == "../../../static/img/map/ic_flowmeter_online2.png") {
          gralyrList[k].symbol.url =
            "../../../static/img/map/ic_flowmeter_online1.png";
          gralyr1.redraw();
        }
      }

      for (var l = 0; l < gralyrList.length; l++) {
        var url = gralyrList[l].symbol.url;
        if (gralyrList[l].attributes.id == item.id) {
          gralyrList[l].symbol.url =
            "../../../static/img/map/ic_flowmeter_online2.png";
          gralyr1.redraw();
        }
      }

      // bus.$emit("rightDetail","test1",item,item.title)
      // bus.$emit("leftDetail","test1",item,item.title)
      bus.$emit("botmDetail", "test1", item, item.title);
    },
    changePage(index) {
      this.page.current = index;
      this.page.total = this.page.pageList.length;

      var _start = (index - 1) * this.page.pageSize;
      var _end = index * this.page.pageSize;
      this.tableList = this.page.pageList.slice(_start, _end);
    },
    loadData() {
      let _this = this;
      this.changePage(1);

      let datalist = JSON.parse(JSON.stringify(this.page.pageList));
      datalist.forEach(item => {
        item.geometry = "POINT(" + item.x + " " + item.y + ")";
        let shape = MapControl.WktToAgs(item.geometry);
        var obj = {
          geometry: shape,
          symbol: {
            type: "PictureMarkerSymbol", //SimpleMarkerSymbol 或者 PictureMarkerSymbol
            image: "ic_flowmeter_online1.png", //图片名称，带文件后缀(类型为PictureMarkerSymbol)
            height: 27, //图片高度(类型为PictureMarkerSymbol)
            width: 27 //图片宽度(类型为PictureMarkerSymbol)
          },
          isClear: false, //是否清除当前地图元素f
          attributes: item, //元素属性(可选)
          layer: "gralyr1",
          isdeviation: false
        };
        MapControl.addGraphic(obj);
      });

      var gralyr3 = MapControl.graphicLayers["gralyr1"];
      gralyr3.onClick = function (val) {
        let value = val.graphic.attributes;

        let map = MapControl.map[MapControl.mapId];
        let geo = MapControl.WktToAgs(value.geometry);
        var xMin = parseFloat(geo.x) - 1;
        var yMin = parseFloat(geo.y) - 1;
        var xMax = parseFloat(geo.x) + 1;
        var yMax = parseFloat(geo.y) + 1;
        var showExtent = new esri.geometry.Extent(
          xMin,
          yMin,
          xMax,
          yMax,
          map.spatialReference
        );
        map.setExtent(showExtent.expand(0));
      };
    }
  },
  mounted() {
    var _this = this;
    this.loadData();
  },
  beforeDestroy() {
    MapControl.setMapClear();
  },
};
</script>

<style lang="less">
.test1 {
  .circle {
    margin-left: 5px;
    width: 18px;
    height: 18px;
    border-radius: 9px;
    background: red;
    vertical-align: bottom;
  }

  .resultLable {
    font-size: 0.12rem;
    color: rgba(255, 255, 255, 0.5);
    display: block;
    width: 0.6rem;
    overflow: hidden;
    white-space: nowrap;
    float: left;
    text-align: left;
    padding-left: 0.05rem;
  }

  .rsultValue {
    font-size: 0.12rem;
    color: #fff;
    margin-left: 5px;
    display: block;
    float: left;
    text-align: left;

    width: 0.8rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
