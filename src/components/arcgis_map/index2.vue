<style lang="less">
.map-content {
  background: whitesmoke;
  border: 1px solid rgba(223, 226, 235, 0.8);
  width: 100%;
  height: 100%;
}

.toolbar_btn {
  height: 33px;
  width: 40px;
}

.app-right-bottom {
  z-index: 4;
  position: absolute;
  bottom: 10px;
  right: 10px;

  #mapType {
    height: 46px;
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
    top: 5px;
    box-sizing: border-box;
    border: 1px solid rgba(153, 153, 153, 0.42);
    background: url(../../../static/img/map/maptype.png);
    -webkit-transition: all 0.4s ease;
    transition: all 0.4s ease;
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
  #mapType .threeD {
    right: 0px;
    z-index: 0;
  }
  #mapType:hover .threeD {
    right: 120px;
  }
  #mapType .threeD {
    background-position: 0 -362px;
  }
}
</style>
<template>
  <div class="map-content" :id="mapId" style="position: relative;border-radius: 0.1rem;">
    <bottombar :datasource="currentscale"></bottombar>

    <div class="app-right-bottom">
      <div id="mapType">
        <div class="mapTypeCard normal" id="wu1" @click="getLayer('wu1')" title="地图">
          <span>地图</span>
        </div>
        <div class="mapTypeCard earth" id="wu2" @click="getLayer('wu2')" title="影像">
          <span>影像</span>
        </div>
        <div class="mapTypeCard threeD" id="wu3" @click="getLayer('wu3')" title="三维">
          <span>三维</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
 * 天地图服务
 * 天地图服务Api：http://lbs.tianditu.gov.cn/server/MapService.html
 */

import esriLoader from "esri-loader";
import { MapControl } from "./js/MapControl";
import mapconfig from "./js/mapconfig";

import bottombar from "../arcgis_map/child/bottombar";

var map, navToolbar;
export default {
  name: "GisTdtMap",
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
  watch: {
    currentscale: {
      handler: function (val, oldVal) {
        if (val.mapPoint.x != undefined && val.mapPoint.y != undefined && val.mapPoint != undefined) {
          var scale = parseInt(val.scale)
          if (scale % 2) {
            scale = scale + 1
          }
          this.$store.state.user.mapscale = scale;
        }
      },
      deep: true,
    },
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
              maxZoom: 18 // 最大缩放级别
            });

            let verLayer = new TDTLayer();
            verLayer.id = "tdtLayer";
            map.addLayer(verLayer);
            var veranno = new TDTAnnoLayer();
            veranno.id = "tdtAnnoLayer";
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

            var graphicLayer4 = new esri.layers.GraphicsLayer();
            graphicLayer4.id = "graphicLayer4";
            map.addLayer(graphicLayer4);
            MapControl.graphicLayers["gralyr4"] = graphicLayer4;

            var graphicLayer5 = new esri.layers.GraphicsLayer();
            graphicLayer5.id = "graphicLayer5";
            map.addLayer(graphicLayer5);
            MapControl.graphicLayers["gralyr5"] = graphicLayer5;

            map.on("load", initFunctionality()); //地图对象加载完成后执行该方法
            map.on("mouse-move", function (event) {
              event.scale = scaleUtils.getScale(map);
              _this.currentscale = {
                mapPoint: {
                  x: event.mapPoint.x,
                  y: event.mapPoint.y
                },
                scale: event.scale
              }
            }); //绑定鼠标在地图上移动事件
            map.on("zoom-end", function (event) {
              event.scale = scaleUtils.getScale(map);
              _this.currentscale = {
                mapPoint: {
                  x: event.mapPoint.x,
                  y: event.mapPoint.y
                },
                scale: event.scale
              }
            });//绑定地图缩放事件

            this.map_layer(); //添加轨迹图层

            let navToolbar = new esri.toolbars.Navigation(map);
            let drawToolbar = new esri.toolbars.Draw(map);
            let editToolbar = new esri.toolbars.Edit(map);
            const geometryservice = new esri.tasks.GeometryService(
              mapconfig.GeometryService
            );

            function initFunctionality() {
              _this.$store.state.map.mapload = true;

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

              //css滤镜 修改地图样式
              // document.getElementById("mapbox_tdtLayer").style.filter =
              //   "contrast(75%) sepia(100%) invert(100%) brightness(170%) hue-rotate(2deg) saturate(200%)";
              // document.getElementById("mapbox_tdtAnnoLayer").style.filter =
              //   "contrast(75%) sepia(100%) invert(100%) brightness(170%) hue-rotate(2deg) saturate(200%)";
            }
          }
        );
    },
    map_layer() {
      let map = MapControl.map[MapControl.mapId];
      if (map.addLayer(lineLayer) == undefined) {
        MapControl.lineSymbol = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color("red"),
          5
        );
        MapControl.pointSymbol = new esri.symbol.SimpleMarkerSymbol(
          esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
          5,
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new dojo.Color([255, 0, 0]),
            1
          ),
          new dojo.Color([255, 0, 0, 1])
        );

        var lineLayer = new esri.layers.GraphicsLayer({
          id: "lineLayer"
        });
        var carLayer = new esri.layers.GraphicsLayer({
          id: "carLayer"
        });
        map.addLayer(lineLayer);
        map.addLayer(carLayer);
      }
    },
    getLayer(id) {
      if (id == "wu2") {
        MapControl.SetLayerbaseload([
          {
            url: "", //基础底图
            isshow: false
          },
          {
            url: "", //影像底图
            isshow: true
          }
        ]);
        document.getElementById("wu2").style.zIndex = 2;
        document.getElementById("wu1").style.zIndex = 1;
      } else if (id == "wu1") {
        MapControl.SetLayerbaseload([
          {
            url: "", //基础底图
            isshow: true
          },
          {
            url: "", //影像底图
            isshow: false
          }
        ]);
        document.getElementById("wu2").style.zIndex = 1;
        document.getElementById("wu1").style.zIndex = 2;
      }
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
