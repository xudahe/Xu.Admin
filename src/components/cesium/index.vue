<style scoped>

#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
  background: whitesmoke;
  border: 1px solid rgba(223, 226, 235, 0.8);
}

.toolbar_btn {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 999;
}

.toolbar_info {
  z-index: 999;
  position: absolute;
  left: 58px;
  top: 10px;
  height: 32px;
}

.toolbar_btn {
  height: 33px;
  width: 40px;
}

</style>
<template>
  <!-- Cesium 容器 -->
  <div id="cesiumContainer">
    <div class='toolbar_info' v-show='isshow' id='toolbar_info'>
      <Button-group size="large">
        <Tooltip content="清除">
          <Button @click='toolbar("clear")'>
            <font-awesome-icon icon="eraser" size="lg" />
          </Button>
        </Tooltip>
        <Tooltip content="距离测量">
          <Button @click='toolbar("measureLine")'>
            <font-awesome-icon icon="ruler-horizontal" size="lg" />
          </Button>
        </Tooltip>
        <Tooltip content="面积测量">
          <Button @click='toolbar("measureArea")'>
            <font-awesome-icon icon="ruler-combined" size="lg" />
          </Button>
        </Tooltip>
        <Tooltip content="信息查询">
          <Button @click='toolbar("identify")'>
            <font-awesome-icon :icon="['far', 'hand-point-up']" size="lg" />
          </Button>
        </Tooltip>
        <Tooltip content="书签管理">
          <Button @click='toolbar("bookmark")'>
            <font-awesome-icon icon="bookmark" size="lg" />
          </Button>
        </Tooltip>
        <Tooltip content="图层管理">
          <Button @click='toolbar("layerManage")'>
            <font-awesome-icon icon="map" size="lg" />
          </Button>
        </Tooltip>
      </Button-group>
    </div>
    <div class='toolbar_btn' id='toolbar_btn'>
      <Tooltip :content="info" placement="right">
        <Button @click='clickToolbar'>
          <font-awesome-icon icon="angle-left" size="lg" />
        </Button>
      </Tooltip>
    </div>
    <component :is="current_com" :ref="current_ref"></component>
    <span id="mes" style="position: absolute; top: 95%; left: 5px;z-index: 2;color: white;"></span>
  </div>
</template>

<script>
/**
 * @description  3dmap 球体封装
 */

import {cesiumInstance} from "./js/cesiumInstance";
import cesiumTools from "./js/cesiumTools";
import {modelHelper} from "./js/modelHelper";
import layerManage from "./child/layerManage";

export default {
  name: "cesiumMap",
  components: {
    layerManage
  },
  computed: {
   
  },
  data() {
    return {
      querylist: false,
      icon: 'chevron-left',
      numb: 0,
      isshow: true,
      info: '展开工具栏',
      MouseMove: false,
      queryData: [],
      queryValue: '',
      queryAuto: false,
      queryBtn: true,
      SearchResult: [],

      cesiumInstance: {},
      camera: {
        position: {
          longitude: 118.6454021931,
          latitude: 32.0682197451,
          height: 100
        },
        heading: 360,
        pitch: 90,
        roll: 0
      },
      animation: false,
      alpha: 1,
      brightness: 1,
      contrast: 1,
      current_com: "",
      current_ref: ""
    };
  },
  mounted() {
    this.initmap();
    this.getLayers();
  },
  methods: {
    initmap(){
      cesiumTools.createScene();
      modelHelper.VCesViewer=cesiumInstance.viewer;
      modelHelper.InitEarthEvent(this);
    },
    clickToolbar() {
      var divwith = document.getElementById('toolbar_info')
      var but = document.getElementById('toolbar_btn')
      var _this = this
      this.queryAuto = false
      this.queryBtn = true
      if (_this.numb == 1) {
        _this.numb = 0
        _this.icon = 'chevron-left'
        _this.isshow = true
        _this.info = '关闭工具栏'
        _this.queryValue = ''
        _this.SearchResult = []
        MapControl.setMapClear()
      } else {
        _this.numb = 1
        _this.icon = 'settings'
        _this.isshow = false
        _this.info = '展开工具栏'
      }
    },
    toolbar(type) {
      switch (type) {
        case "clear":
          this.$store.state.G_MapActionFlag = 0;
          cesiumTools.clearEntities(cesiumInstance.viewer);
          break;
        case "measureLine":
          this.$store.state.G_MapActionFlag = 3;
          //cesiumTools.measureLineSpace(cesiumInstance.viewer, null);
          break;
        case "measureArea":
          this.$store.state.G_MapActionFlag = 4;
          // cesiumTools.measureAreaSpace(cesiumInstance.viewer, null);
          break;
        case "layerManage":
          this.getLayers();
          this.current_com = this.current_com !='' ? "":layerManage;
          this.current_ref = this.current_com !='' ? "":layerManage;
          break;
        case "bookmark":
       
          break;
        case "identify":
          cesiumTools.pick(cesiumInstance.viewer);
          break;
      }
    },
    getLayers() {
      this.$http.get("../../../static/data/cesium/3Dlayer.json").then(res => {
        let data = res.data.Providers;
        cesiumInstance.layers = data;
      });
    }
  }
};
</script>