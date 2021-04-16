<style>
.gisAMap {
  background: whitesmoke;
  border: 1px solid rgba(223, 226, 235, 0.8);
  width: 100%;
  height: 100%;
}

.esriPopupHidden {
  display: none;
}
</style>
<template>
  <div class="gisAMap" style="border-radius: 0.1rem;">
    <div id="mapDiv2D" style="width: 50%;height: 100%;float: left" />
    <div id="mapDiv3D" style="width: 50%;height: 100%;float: left" />
  </div>
</template>

<script>
/*
 * 高德地图服务
 */

import esriLoader from "esri-loader";
import {
  onlineAMapDigitalURL,
  onlineAMapSatelliteURL,
  onlineAMapAnooMarkerURL
} from "./js/config";

export default {
  name: "GisAMap",
  components: {},
  props: {
    mapId: {
      type: String,
      default: "mapbox"
    }
  },
  data() {
    return {
      currentscale: {}
    };
  },
  methods: {
    //加载地图
    createMap() {
      var _this = this;

      const options = {
        url: "https://js.arcgis.com/4.7/", // 需使用的arcgis api版本地址
        css: true
      };

      esriLoader
        .loadModules(
          [
            "esri/Map",
            "esri/config",
            "esri/request",
            "esri/Color",
            "esri/views/SceneView",
            "esri/widgets/LayerList",
            "esri/layers/BaseTileLayer",
            "esri/views/MapView",
            "dojo/domReady!"
          ],
          options
        )
        .then(
          ([
            Map,
            esriConfig,
            esriRequest,
            Color,
            SceneView,
            LayerList,
            BaseTileLayer,
            MapView
          ]) => {
            let TintLayer = BaseTileLayer.createSubclass({
              properties: {
                urlTemplate: null,
                tint: {
                  value: null,
                  type: Color
                }
              },

              getTileUrl: function (level, row, col) {
                return this.urlTemplate
                  .replace("{z}", level)
                  .replace("{x}", col)
                  .replace("{y}", row);
              },

              fetchTile: function (level, row, col) {
                var url = this.getTileUrl(level, row, col);

                return esriRequest(url, {
                  responseType: "image",
                  allowImageDataAccess: true
                }).then(
                  function (response) {
                    var image = response.data;
                    var width = this.tileInfo.size[0];
                    var height = this.tileInfo.size[0];

                    var canvas = document.createElement("canvas");
                    var context = canvas.getContext("2d");
                    canvas.width = width;
                    canvas.height = height;

                    context.drawImage(image, 0, 0, width, height);

                    return canvas;
                  }.bind(this)
                );
              }
            });

            //增加跨域配置
            esriConfig.request.corsEnabledServers.push(
              "webst01.is.autonavi.com"
            );

            let digitallLayer = new TintLayer({
              urlTemplate: onlineAMapDigitalURL,
              tint: new Color("#004FBB"),
              title: "地图"
            });
            let satelliteLayer = new TintLayer({
              urlTemplate: onlineAMapSatelliteURL,
              tint: new Color("#004FBB"),
              title: "影像"
            });
            let anooMarkerLayer = new TintLayer({
              urlTemplate: onlineAMapAnooMarkerURL,
              tint: new Color("#004FBB"),
              title: "标注"
            });
            let map = new Map({
              layers: [satelliteLayer, anooMarkerLayer]
            });

            //2d
            let view2D = new MapView({
              container: "mapDiv2D",
              map: map,
              center: [110.1, 23.8],
              zoom: 3
            });

            //3d
            let view3D = new SceneView({
              container: "mapDiv3D",
              map: map,
              center: [110.1, 23.8],
              zoom: 1
            });
          }
        );
    }
  },
  mounted() {
    let _this = this;

    _this.createMap();
  },
  beforeDestroy() { }
};
</script>
