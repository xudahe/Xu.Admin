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
 * 天地图服务
 * 参考地址：https://github.com/zhengjieWeb0520/react-arcgis
 */

import esriLoader from "esri-loader";
import { MapControl } from "./js/MapControl";
import mapconfig from "./js/mapconfig";
import {
  onlineTdtDigitalURL,
  onlineTdtSatelliteURL,
  onlineTdtAnooMarkerURL
} from "./js/config";

var map, navToolbar;
export default {
  name: "GisTdtMap",
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
        url: "https://js.arcgis.com/4.12/", // 需使用的arcgis api版本地址
        css: true
      };

      esriLoader
        .loadModules(
          [
            "esri/layers/WebTileLayer",
            "esri/Map",
            "esri/Basemap",
            "esri/widgets/BasemapToggle",
            "esri/views/SceneView",
            "esri/views/MapView"
          ],
          options
        )
        .then(
          ([WebTileLayer, Map, Basemap, BasemapToggle, SceneView, MapView]) => {
            var mapBaseLayer = new WebTileLayer({
              urlTemplate:
                "http://{subDomain}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=5003bc22120f9d66a3276a29bf4be1ed",
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              copyright: "天地图影像图"
            });

            var anoBaseLayer = new WebTileLayer({
              urlTemplate:
                "http://{subDomain}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=5003bc22120f9d66a3276a29bf4be1ed",
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              copyright: "天地图影像注记"
            });

            var imgBasemap = new Basemap({
              baseLayers: [mapBaseLayer, anoBaseLayer],
              title: "影像图",
              id: "img_w",
              thumbnailUrl:
                "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/0/0/0"
            });

            var mapBaseLayer_vec = new WebTileLayer({
              urlTemplate:
                "http://{subDomain}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=5003bc22120f9d66a3276a29bf4be1ed",
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              copyright: "天地图矢量图"
            });

            var anoBaseLayer_vec = new WebTileLayer({
              urlTemplate:
                "http://{subDomain}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=5003bc22120f9d66a3276a29bf4be1ed",
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              copyright: "天地图矢量注记"
            });

            var vecBasemap = new Basemap({
              baseLayers: [mapBaseLayer_vec, anoBaseLayer_vec],
              title: "矢量图",
              id: "cva_w",
              thumbnailUrl:
                "https://stamen-tiles.a.ssl.fastly.net/terrain/10/177/410.png"
            });

            var map = new Map({
              basemap: imgBasemap,
              ground: "world-elevation"
            });

            var view_3D = new SceneView({
              container: "mapDiv3D",
              map: map
            });
            view_3D.when(function() {
              var toggle = new BasemapToggle({
                titleVisible: true,
                view: view_3D,
                nextBasemap: vecBasemap
              });
              view_3D.ui.add(toggle, "bottom-right");
            });

            var view_2D = new MapView({
              container: "mapDiv2D",
              map: map
            });
            view_2D.when(function() {
              var toggle = new BasemapToggle({
                titleVisible: true,
                view: view_2D,
                nextBasemap: vecBasemap
              });
              view_2D.ui.add(toggle, "bottom-right");
            });
          }
        );
    }
  },
  mounted() {
    let _this = this;

    _this.createMap();
  },
  beforeDestroy() {
    MapControl.setMapClear();
  }
};
</script>
