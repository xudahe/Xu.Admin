<style scoped>
.map-content {
  background: whitesmoke;
  border: 1px solid rgba(223, 226, 235, 0.8);
  width: 100%;
  height: 100%;
}

.toolbar_info {
  z-index: 100;
  position: absolute;
  left: 8px;
  top: 10px;
  height: 32px;
}

ivu-tabs ivu-tabs-card .app-right-bottom {
  z-index: 4;
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.shi {
  width: 50px;
  height: 50px;
  position: absolute;
  top: calc(50% - 25px);
  left: calc(50% - 25px);
  font-size: 50px;
  color: red;
  z-index: 99999;
  text-align: center;
  line-height: 50px;
  font-weight: 100;
}

#mapType {
  cursor: pointer;
  -webkit-transition: all 0.4s ease;
  transition: all 0.4s ease;
  background-color: rgba(249, 248, 248, 0);
}

#mapType:hover {
  width: 120px;
  background-color: rgba(249, 248, 248, 0.8);
}

#mapType:hover .earth {
  right: 60px;
}
#mapType:hover .scape {
  right: 120px;
}

#mapType .mapTypeCard {
  height: 36px;
  width: 53px;
  position: absolute;
  border-radius: 2px;
  bottom: 5px;
  box-sizing: border-box;
  background: url("../../../static/img/map/maptype.png");
  -webkit-transition: all 0.4s ease;
  transition: all 0.4s ease;
}

.mapTypeCard.active {
  border: 1px solid #3385ff;
}

#mapType .mapTypeCard.active span,
#mapType .mapTypeCard:hover span {
  background-color: #3385ff;
}

#mapType .mapTypeCard span {
  position: absolute;
  bottom: 0;
  right: 0;
  display: inline-block;
  font-size: 12px;
  height: 12px;
  line-height: 12px;
  color: #fff;
  border-top-left-radius: 2px;
}

#mapType .mapTypeCard:hover {
  border: 1px solid #3385ff;
}

#mapType .earth {
  right: 0px;
  z-index: 1;
}
#mapType .normal {
  z-index: 2;
  background-position: 0 0;
  right: 0px;
}

#mapType .earth {
  background-position: 0 -181px;
}

.esriMapContainer {
  height: 100%;
  width: 100%;
}
</style>
<template>
  <div :id="id" @mouseover="getmapid">
    <div id="mapType">
      <div
        class="mapTypeCard normal active"
        id="baselayer0"
        @click="getLayer('baselayer0')"
        title="地图"
      >
        <span>地图</span>
      </div>
      <div
        class="mapTypeCard earth"
        id="imagelayer0"
        @click="getLayer('imagelayer0')"
        title="影像"
      >
        <span>影像</span>
      </div>
    </div>
    <div
      style="position: absolute;z-index: 3;bottom: 10px;margin-left: 10px;font-size: 16px;font-weight: bolder;"
    >
      {{ this.$store.state.mapitemsload[id][0].servicename }}
    </div>
  </div>
</template>
<script>
import esriLoader from "esri-loader";
import bus from "../../eventBus.js";
import { MapControl } from "../arcgis_map/js/MapControl";
import mapconfig from "../arcgis_map/js/mapconfig";

var map, navToolbar;
export default {
  props: {
    id: String,
    mapType: {
      type: String,
      default: "tiled"
    }
  },
  data() {
    return {
      spin: true,
      value: "",
      icon: "chevron-left",
      numb: 0,
      isshow: true,
      info: "展开工具栏",
      MouseMove: false,
      SearchColumns: [
        {
          title: "title",
          key: "title"
        }
      ],
      SearchResult: [],
      mapIDs: [],
      mapObjs: [],
      dataset: []
      // loading: true
    };
  },
  methods: {
    createMap() {
      var that = this;
      const options = {
        url: mapconfig.jsapi
      };
      esriLoader.loadCss(mapconfig.esricss);
      esriLoader.loadCss(mapconfig.clarocss);
      esriLoader
        .loadModules(
          [
            "esri/map",
            "esri/geometry/Extent",
            "esri/geometry/scaleUtils",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/layers/ArcGISDynamicMapServiceLayer"
          ],
          options
        )
        .then(
          ([
            Map,
            Extent,
            scaleUtils,
            ArcGISTiledMapServiceLayer,
            ArcGISDynamicMapServiceLayer
          ]) => {
            map = new esri.Map(that.id, {
              logo: false,
              slider: false
            });
            const basemapurl = mapconfig.basemap;
            const basemaplayer = new esri.layers.ArcGISTiledMapServiceLayer(
              basemapurl
            );
            basemaplayer.id = basemapurl;
            map.addLayer(basemaplayer); //添加底图
            map.on("load", initFunctionality);
            map.on("mouse-move", function(event) {
              event.scale = scaleUtils.getScale(map);
              bus.$emit("showCoord", event);
            });
            map.on("extent-change", function(evt) {
              that.$emit("ExtentChange", { event: evt.extent, id: that.id });
            });
            function initFunctionality(value) {
              let mapId = value.map.id;
              MapControl.map[mapId] = value.map;
              let extent = mapconfig.extent;
              that.loadlayer(mapId);
              let mapExtent = new esri.geometry.Extent(
                extent.xmin,
                extent.ymin,
                extent.xmax,
                extent.ymax,
                map.spatialReference
              );
              value.map.setExtent(mapExtent);
            }
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    getmapid() {
      bus.$emit("getmapid", this.id);
    },
    //各分屏加载图层
    loadlayer(id) {
      for (let layer in this.$store.state.mapitemsload) {
        if (id == layer) {
          MapControl.MapAddSplit(id, this.$store.state.mapitemsload[layer]);
        }
      }
    },
    //地图影像切换
    getLayer(id) {
      if (id == "imagelayer0") {
        MapControl.SetLayerbaseloadsplit([
          { url: mapconfig.basemap, isshow: false },
          { url: mapconfig.basemapview, isshow: true }
        ]);
        document.getElementById("imagelayer0").style.zIndex = 2;
        document.getElementById("baselayer0").style.zIndex = 1;
      } else if (id == "baselayer0") {
        MapControl.SetLayerbaseloadsplit([
          { url: mapconfig.basemap, isshow: true },
          { url: mapconfig.basemapview, isshow: false }
        ]);
        document.getElementById("imagelayer0").style.zIndex = 1;
        document.getElementById("baselayer0").style.zIndex = 2;
      }
    },
    identify(id) {
      var _this = this;
      esriLoader
        .loadModules([
          "esri/tasks/IdentifyTask",
          "esri/tasks/IdentifyParameters"
        ])
        .then(([IdentifyTask, IdentifyParameters]) => {
          let map = MapControl.map[id];
          map.graphics.clear();
          let tasknum = 0;
          let identifyHandler = map.on("click", function(geo) {
            //显示Loading遮罩
            document.getElementById("imgProcessing").style.display = "block";
            let geom = geo;
            let temp = [];
            for (var i = 0; i < _this.$store.state.mapitemslayers.length; i++) {
              var identifyTask = new esri.tasks.IdentifyTask(
                _this.$store.state.mapitemslayers[i].serviceurl
              );
              let mapid = _this.$parent.items[i];
              let servicename =
                _this.$store.state.mapitemslayers[i].servicename;
              let haschild = _this.$store.state.mapitemslayers[i].haschild;
              var identifyParams = new esri.tasks.IdentifyParameters();
              identifyParams.tolerance = 1;
              identifyParams.returnGeometry = true;
              identifyParams.layerOption =
                esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
              identifyParams.geometry = geom.mapPoint;
              identifyParams.mapExtent = map.extent;
              identifyTask.execute(identifyParams, function(results) {
                tasknum += 1;
                document.getElementById("imgProcessing").style.display = "none";
                if (results.length !== 0) {
                  temp.push({
                    id: mapid,
                    name: servicename,
                    results: results,
                    haschild: haschild
                  });
                  // for (var i = 0; i < _this.dataset.length; i++) {
                  //   _this.dataset[i].title = _this.dataset[i].layerName
                  // }
                  //console.log(results)
                  //MapControl.showGraphic(results[0].feature.geometry)
                  // let attributes = results[0].feature.attributes
                  // for (var x in attributes) {
                  //   _this.valuedata.push({ name: x, value: attributes[x] })
                  // }
                }
                if (tasknum == _this.$store.state.mapitemslayers.length) {
                  bus.$emit("showDialog", temp);
                }
              });
            }
            identifyHandler.remove();
          });
          //
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  mounted() {
    this.createMap();
  }
};
</script>
