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
  <div class="map-conent"  :id='mapId' style="position: relative;border-radius: 0.1rem;">
    <div class='toolbar_info' v-show='isshow' id='toolbar_info'>
      <Button-group size="large">
        <Tooltip content="放大" :transfer="true">
          <Button @click='toolbar("zoomin")'>
            <i class="fa fa-plus"></i>
          </Button>
        </Tooltip>
        <Tooltip content="缩小">
          <Button @click='toolbar("zoomout")'>
            <i class="fa fa-minus"></i>
          </Button>
        </Tooltip>
        <Tooltip content="平移">
          <Button @click='toolbar("pan")'>
            <i class="fa fa-arrows"></i>
          </Button>
        </Tooltip>
        <Tooltip content="清除">
          <Button @click='toolbar("clear")'>
            <i class="fa fa-eraser"></i>
          </Button>
        </Tooltip>
        <Tooltip content="距离测量">
          <Button @click='toolbar("polyline")'>
            <i class="fa fa-compress"></i>
          </Button>
        </Tooltip>
        <Tooltip content="面积测量">
          <Button @click='toolbar("polygon")'>
            <i class="fa fa-square-o"></i>
          </Button>
        </Tooltip>
        <Tooltip content="信息查询">
          <Button @click='toolbar("idenfity")'>
            <i class="fa fa-hand-o-up"></i>
          </Button>
        </Tooltip>
        <Tooltip content="书签管理">
          <Button @click='toolbar("bookmark")'>
            <i class="fa fa-bookmark-o"></i>
          </Button>
        </Tooltip>
        <Tooltip content="图层管理">
          <Button @click='toolbar("layermanage")'>
            <i class="fa fa-map-o"></i>
          </Button>
        </Tooltip>
        <Tooltip content="快速定位" class="searchbox" :disabled="!queryAuto">
          <Button @click='queryAuto = !queryAuto' v-show='queryAuto'>
            <i class="fa fa-search"></i>
          </Button>
          <Input v-model="queryValue" search enter-button placeholder="请输入定位关键字" v-show='!queryAuto' @on-search='searchhandle' style="width: 200px"/>
        </Tooltip>
      </Button-group>
    </div>
    <div class='toolbar_btn' id='toolbar_btn'>
      <Tooltip :content="info" placement="right">
        <Button @click='clickToolbar'>
          <i class="fa fa-angle-left" v-if='isshow'></i>
          <i class="fa fa-angle-right" v-else></i>
        </Button>
      </Tooltip>
    </div>
    <component :is="current_com" :ref="current_ref"></component>
    <bottombar :datasource='currentscale'></bottombar>
  </div>
</template>
<script>
import esriLoader from 'esri-loader'
import { MapControl } from "../map/js/MapControl";
import mapconfig from '../map/js/mapconfig';
import layermanage from '../map/child/layerManage'
import bottombar from "../map/child/bottombar";

var map, navToolbar
export default {
  name: 'baseMap',
  components: {
    layermanage,
    bottombar
  },
  props: {
    mapId: {
      type: String,
      default: 'mapbox'
    },
  },
  data() {
    return {
      icon: 'chevron-left',
      numb: 0,
      isshow: true,
      info: '展开工具栏',
      queryData: [],
      queryValue: '',
      queryAuto: true,
    
      current_com: '',
      current_ref: '',
      currentscale: {},
    }
  },
  methods: {
    searchhandle(){
      console.log(this.queryValue)
    },
    //加载图层
    createMap() {
      var _this = this;
      const options = {
        url: mapconfig.jsapi
      }
      esriLoader.loadCss(mapconfig.esricss)
      esriLoader.loadCss(mapconfig.clarocss)
      esriLoader
        .loadModules(
          [
            'esri/map',
            'esri/geometry/Extent',
            'esri/geometry/scaleUtils',
            'esri/layers/ArcGISTiledMapServiceLayer',
            'esri/layers/ArcGISDynamicMapServiceLayer',
            'esri/toolbars/draw',
            'esri/toolbars/navigation',
            'esri/toolbars/edit',
            'esri/config',
            'esri/dijit/Scalebar',
            'dojo/i18n!esri/nls/jsapi',
            'dojo/domReady!'
          ],
          options
        )
        .then(
          ([
            Map, // 地图模块
            Extent, // 范围模块
            scaleUtils,
            ArcGISTiledMapServiceLayer,
            ArcGISDynamicMapServiceLayer,
            Draw, //画图模块
            Navigation,
            Edit,
            esriConfig,
            Scalebar, //比例尺模块
            bundle
          ]) => {
            
            //加载地图
            map = new Map(_this.mapId, {
              logo: false,
              slider: false,
              showLabels: true
            })

            const basemapurl = mapconfig.basemap
            const basemaplayer = new esri.layers.ArcGISTiledMapServiceLayer(
              basemapurl
            )
            basemaplayer.id = basemapurl
            map.addLayer(basemaplayer) //添加底图

            var graphicLayer1 = new esri.layers.GraphicsLayer()
            graphicLayer1.id = 'graphicLayer1'
            map.addLayer(graphicLayer1)
            MapControl.graphicLayers['gralyr1'] = graphicLayer1

            var graphicLayer2 = new esri.layers.GraphicsLayer()
            graphicLayer2.id = 'graphicLayer2'
            map.addLayer(graphicLayer2)
            MapControl.graphicLayers['gralyr2'] = graphicLayer2

            var graphicLayer3 = new esri.layers.GraphicsLayer()
            graphicLayer3.id = 'graphicLayer3'
            map.addLayer(graphicLayer3)
            MapControl.graphicLayers['gralyr3'] = graphicLayer3

            map.on('load', initFunctionality)
            map.on('mouse-move', function(event) {
                event.scale = scaleUtils.getScale(map)
                _this.currentscale = {
                  mapPoint: {
                    x: event.mapPoint.x,
                    y: event.mapPoint.y
                  },
                  scale: event.scale
                };
            })

            let navToolbar = new esri.toolbars.Navigation(map)
            let drawToolbar = new esri.toolbars.Draw(map)
            let editToolbar = new esri.toolbars.Edit(map)
            const geometryservice = new esri.tasks.GeometryService(
              mapconfig.GeometryService
            )

            function initFunctionality() {
              MapControl.map[_this.mapId] = map
              MapControl.isLoad[_this.mapId] = true
              MapControl.navToolbar[_this.mapId] = navToolbar
              MapControl.drawToolbar[_this.mapId] = drawToolbar
              MapControl.editToolbar[_this.mapId] = editToolbar
              MapControl.GeometryService = geometryservice
      
              let extent = mapconfig.extent
              let mapExtent = new esri.geometry.Extent(
                extent.xmin,
                extent.ymin,
                extent.xmax,
                extent.ymax,
                map.spatialReference
              )
              map.setExtent(mapExtent)
            }
        
          }
        )
    },
    clickToolbar() {
      var divwith = document.getElementById('toolbar_info')
      var but = document.getElementById('toolbar_btn')
      var _this = this
      if (_this.numb == 1) {
        _this.numb = 0
        _this.icon = 'chevron-left'
        _this.isshow = true
        _this.info = '关闭工具栏'
        MapControl.setMapClear()
      } else {
        _this.numb = 1
        _this.icon = 'settings'
        _this.isshow = false
        _this.info = '展开工具栏'
      }
    },
    toolbar(val) {
      if (MapControl.identifyHandler !== undefined) {
        MapControl.identifyHandler.remove()
      }
      switch (val) {
        case 'zoomin':
          MapControl.setMapZoomIn()
          break
        case 'zoomout':
          MapControl.setMapZoomOut()
          break
        case 'pan':
          MapControl.setMapPan()
          break
        case 'clear':
          MapControl.setMapClear()
          break
        case 'idenfity':
          MapControl.setMapClear()
          var _this = this
          MapControl.QueryByPoint(_this)
          break
        case 'bookmark':
          MapControl.setMapClear()
          var rightbar = document.getElementById('rightbar')
          if (rightbar) {
            rightbar.style.display = 'block'
          }
          this.$parent.title_name = '书签管理'
          this.$parent.$router.replace({
            name: 'bookmark',
            params: { name: 'bookmark', menuname: '书签管理' }
          })
          this.$parent.showDialog = false
          break
        case 'polyline':
          MapControl.MeasureDraw('polyline')
          break
        case 'polygon':
          MapControl.MeasureDraw('polygon')
          break
        case 'layermanage':
          this.current_com = layermanage
          this.current_ref = layermanage
          break
        case 'importdata':
          break
      }
    },
  },
  mounted() {
    let _this = this;
    
    _this.createMap()
  }
}
</script>