<style>
.map-content {
  background: whitesmoke;
  border: 1px solid rgba(223, 226, 235, 0.8);
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
}

.toolbar_btn {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 998;
}

.toolbar_info {
  z-index: 998;
  position: absolute;
  left: 58px;
  top: 10px;
  height: 32px;
}

.searchbox {
  position: absolute;
  top: 0px;
  padding-left: 5px;
}

.esriPopupHidden {
  display: none;
}

.toolbar_btn {
  height: 33px;
  width: 40px;
}
</style>
<template>
  <div
    class="map-conent"
    :id="mapId"
    style="position: relative;border-radius: 0.1rem;"
  >
    <bottombar :datasource="currentscale"></bottombar>
  </div>
</template>

<script>
/*
 * 加载天地图
 * 天地图服务列表：http://lbs.tianditu.gov.cn/server/MapService.html
 */

import esriLoader from "esri-loader";
import { MapControl } from "./js/MapControl";
import mapconfig from "./js/mapconfig";

import bottombar from "../arcgis_map/child/bottombar";

var map, navToolbar;
export default {
  name: "arcgisMap",
  components: {
    bottombar
  },
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
        url: mapconfig.arcgisUrl, // 需使用的arcgis api版本地址
        css: true,
        // 添加dojo配置
        dojoConfig: {
          async: true,
          parseOnLoad: false,
          tlmSiblingOfDojo: false,
          packages: [
            {
              name: "extend",
              location: window.location.host + "../../../static/tdtLayer/" + mapconfig.maptype
              // location: "http://58.213.48.106/arcgis_js_api/library/3.27/3.27/ncam"
            }
          ]
        }
      };

      esriLoader.loadCss(mapconfig.esricss);
      esriLoader.loadCss(mapconfig.clarocss);
      esriLoader
        .loadModules(
          [
            "dojo/_base/event",
            "dojo/_base/connect",
            "dojo/parser",
            "dojo/on",
            "dojo/_base/Color",
            "esri/map",
            "esri/geometry/Extent",
            "esri/geometry/scaleUtils",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/layers/ArcGISDynamicMapServiceLayer",
            "esri/tasks/GeometryService",
            "esri/tasks/IdentifyTask",
            "esri/tasks/IdentifyParameters",
            "esri/toolbars/draw",
            "esri/toolbars/navigation",
            "esri/toolbars/edit",
            "dojo/dom-construct",
            "dojo/dom",
            "esri/config",
            "dojo/fx",
            "extend/TDTLayer",
            "extend/TDTAnnoLayer",
            "dojo/domReady!",
            "esri/geometry/Point",
            "esri/geometry/Polyline",
            "esri/geometry/Polygon"
          ],
          options
        )
        .then(
          ([
            event,
            connect,
            parser,
            on,
            Color,
            Map,
            Extent,
            scaleUtils,
            ArcGISTiledMapServiceLayer,
            ArcGISDynamicMapServiceLayer,
            GeometryService,
            IdentifyTask,
            IdentifyParameters,
            Draw,
            Navigation,
            Edit,
            domConstruct,
            dom,
            esriConfig,
            Fx,
            TDTLayer,
            TDTAnnoLayer,
            Point,
            Polyline,
            Polygon
          ]) => {
            //加载地图
            map = new Map(_this.mapId, {
              logo: false, // esri logo
              slider: false,
              showLabels: true,
              zoom: 10, // 缩放级别
              maxZoom: 18, // 最大缩放级别
            });

            let verLayer = new TDTLayer();
            map.addLayer(verLayer);
            var veranno = new TDTAnnoLayer();
            map.addLayer(veranno);

            var graphicLayer1 = new esri.layers.GraphicsLayer();
            graphicLayer1.id = "graphicLayer1";
            map.addLayer(graphicLayer1);
            MapControl.graphicLayers["gralyr1"] = graphicLayer1;

            var graphicLayer2 = new esri.layers.GraphicsLayer();
            graphicLayer2.id = "graphicLayer2";
            map.addLayer(graphicLayer2);
            MapControl.graphicLayers["gralyr2"] = graphicLayer2;

            var graphicLayer3 = new esri.layers.GraphicsLayer();
            graphicLayer3.id = "graphicLayer3";
            map.addLayer(graphicLayer3);
            MapControl.graphicLayers["gralyr3"] = graphicLayer3;

            map.on("load", initFunctionality());
            map.on("mouse-move", function(event) {
              event.scale = scaleUtils.getScale(map);
              _this.currentscale = {
                mapPoint: {
                  x: event.mapPoint.x,
                  y: event.mapPoint.y
                },
                scale: event.scale
              };
            });

            let navToolbar = new esri.toolbars.Navigation(map);
            let drawToolbar = new esri.toolbars.Draw(map);
            let editToolbar = new esri.toolbars.Edit(map);
            const geometryservice = new esri.tasks.GeometryService(
              mapconfig.GeometryService
            );

            function initFunctionality() {
              MapControl.map[_this.mapId] = map;
              MapControl.isLoad[_this.mapId] = true;
              MapControl.navToolbar[_this.mapId] = navToolbar;
              MapControl.drawToolbar[_this.mapId] = drawToolbar;
              MapControl.editToolbar[_this.mapId] = editToolbar;
              MapControl.GeometryService = geometryservice;

                let extent = mapconfig.maptype == "01" ? mapconfig.extent_01 : mapconfig.extent_02;
                let mapExtent = new esri.geometry.Extent(
                  extent.xmin,
                  extent.ymin,
                  extent.xmax,
                  extent.ymax,
                  map.spatialReference
                );
                map.setExtent(mapExtent);
            }
          }
        );
    }
  },
  mounted() {
    let _this = this;

    _this.createMap();
  }
};
</script>
