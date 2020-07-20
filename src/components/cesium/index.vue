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
  left: 45px;
  top: 10px;
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
  <div id="cesiumContainer" style="height:100%;width:100%;float:right">
    <div :class="classObject" id="cesiumToolBar">
      <Button-group v-show="isshow!=0">
        <Tooltip v-for="(child,index) in toolslist" :key="index" :content="child.title">
          <Button size="small" style="height: 32px;width: 32px;" @click="toolbar(child.name)" :style='{"margin-left":index==0?"0px":"4px"}' @mouseenter.native="moveindex=index" @mouseleave.native="moveindex=-1">
            <!-- <font-awesome-icon icon="print" size="lg" />-->
            <img :src="moveindex==index?child.pathheightpng:child.pathpng" style="margin-top: 4px;" />
          </Button>
        </Tooltip>
      </Button-group>
    </div>
    <component :is="current_com" :ref="current_ref"></component>
  </div>
</template>
<script>
import { cesiumInstance } from "../../api/cesium/cesiumInstance";
import cesiumTools from "../../api/cesium/cesiumTools";
import {modelHelper} from "../../api/cesium/modelHelper";
import providercontrol from "./modules/providercontrol";
export default {
  name: "cesiumMap",
  components: {
    providercontrol
  },
  computed: {
    isshow() {
      return this.$store.state.isCesium;
    },
    classObject() {
      return {
        toolbar_infos: this.$store.getters.isCesium == 1,
        toolbar_inforight: this.$store.getters.isCesium == 2
      };
    }
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
    toolbar(type) {
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
          this.current_com = "providercontrol";
          this.current_ref = "providercontrol";
          break;
        case "identify":
          cesiumTools.pick(cesiumInstance.viewer);
          break;
      }
    },
    getLayers() {
      this.$http.get("./static/3dlayer.json").then(response => {
        let data = response.data.Providers;
        debugger
        cesiumInstance.layers = data;
      });
    }
  }
};
</script>