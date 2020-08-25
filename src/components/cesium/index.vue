<style scoped>
.toolbar_btn {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 999;
  height: 33px;
  width: 40px;
}

.toolbar_infos {
  z-index: 100;
  position: absolute;
  /* left: 0px; */
  top: 5px;
  height: 32px;
}

.toolbar_inforight {
  z-index: 999;
  position: absolute;
  right: 20px;
  top: 10px;
  height: 32px;
}
#cesiumContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

</style>
<template>
  <!-- Cesium 容器 -->
  <div id="cesiumContainer" style="height:100%;width:100%;position: relative;">
    <div class="toolbar_infos" id="cesiumToolBar">
      <el-button-group>
        <el-tooltip v-for="(child,index) in toolslist" :key="index" :content="child.title">
          <el-button :title="child.title" size="small" style="height: 32px;width: 32px;margin-left:4px;" @click="toolbar(index,child.name)" @mouseenter.native="moveindex=index" @mouseleave.native="moveindex=-1">
            <img :src="moveindex==index?child.pathheightpng:child.pathpng" style="margin-left: -8px;"/>
          </el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <component :is="current_com" :ref="current_ref"></component>
    <span id="mes" style="position: absolute; top: 95%; left: 5px;z-index: 2;color: white;"></span>
  </div>
</template>

<script>
/**
 * @description  3dmap 球体封装
 */

import { cesiumInstance } from "./js/cesiumInstance";
import cesiumTools from "./js/cesiumTools";
import {modelHelper} from "./js/modelHelper";
import providercontrol from "./child/providercontrol";

export default {
  name: "cesiumMap",
  components: {
    providercontrol
  },
  computed: {
   
  },
  data() {
    return {
      toolslist: [
        {
          name: "identify",
          title: "拾取模型",
          icon: "信息查询.png",
          pathpng: require("../../assets/img/menuimg/信息查询.png"),
          pathheightpng: require("../../assets/img/menulightimg/信息查询.png")
        },
        {
          name: "measureDistance",
          title: "距离测量",
          icon: "距离测量.png",
          pathpng: require("../../assets/img/menuimg/距离测量.png"),
          pathheightpng: require("../../assets/img/menulightimg/距离测量.png")
        },
        {
          name: "measureArea",
          title: "面积测量",
          icon: "面积测量.png",
          pathpng: require("../../assets/img/menuimg/面积测量.png"),
          pathheightpng: require("../../assets/img/menulightimg/面积测量.png")
        },
        {
          name: "layermanage",
          title: "图层控制",
          icon: "图层控制.png",
          pathpng: require("../../assets/img/menuimg/图层控制.png"),
          pathheightpng: require("../../assets/img/menulightimg/图层控制.png")
        },
        {
          name: "clear",
          title: "清除",
          icon: "清空.png",
          pathpng: require("../../assets/img/menuimg/清空.png"),
          pathheightpng: require("../../assets/img/menulightimg/清空.png")
        }
      ],
      moveindex: -1,

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
    toolbar(index,type) {
      switch (type) {
        case "clear":
          this.$store.state.G_MapActionFlag = 0;
          cesiumTools.clearEntities(cesiumInstance.viewer);
          break;
        case "measureDistance":
          this.$store.state.G_MapActionFlag = 3;
          //cesiumTools.measureLineSpace(cesiumInstance.viewer, null);
          break;
        case "measureArea":
          this.$store.state.G_MapActionFlag = 4;
          // cesiumTools.measureAreaSpace(cesiumInstance.viewer, null);
          break;
        case "layermanage":
          this.getLayers();
          this.current_com = this.current_com !='' ? "":"providercontrol";
          this.current_ref = this.current_com !='' ? "":"providercontrol";
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