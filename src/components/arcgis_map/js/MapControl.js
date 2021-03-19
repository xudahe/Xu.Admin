/**
 * 地图管理
author: Yuankang
 *
 */

import * as esriLoader from 'esri-loader';
import bus from '../../../eventBus.js';
import * as transformUtils from './mapTran.js';
import mapconfig from './mapconfig'
export const MapControl = {};
const tips = require('../../../../static/img/map/tips.png');

/**
 * 地图是否加载完毕
 * @type {{}}
 */
MapControl.isLoad = {};

/**
 * 地图列表
 * @type {{}}
 */
MapControl.map = {};

/**
 * 地图工具
 * @type {{}}
 */
MapControl.navToolbar = {};

/**
 * 地图标绘层
 */
MapControl.graphicLayers = {};

/**
 * 地图编辑工具
 */
MapControl.editToolbar = {};

/**
 * Geometry服务
 */
MapControl.GeometryService = {};

MapControl.MenuForMap = {};

// MapControl.mapId = 'mapbox';

// identify点击事件
var identifyHandler;

/**
 * 地图绘制事件
 */
MapControl.drawToolbar = {};
var MouseMoveEventHandler;
var doSpaceDrawEventHandler;
var doAttMapDrawEventHandler;
/**
 * 地图点击事件
 */
var domapOnclickEventHandler;

var centerPoint;
/**
 * 设置初始化地图全图
 * @param mapId
 */
MapControl.setMapFull = function () {
  let map = MapControl.map.mapbox;
  let extent = mapconfig.extent;

  esriLoader.loadModules(
    ['esri/map', 'esri/geometry/Extent', 'esri/toolbars/navigation']).then(
    ([Map, Extent]) => {
      let mapExtent = new esri.geometry.Extent(
        extent.xmin,
        extent.ymin,
        extent.xmax,
        extent.ymax,
        map.spatialReference
      );
      map.setExtent(mapExtent);

      var navToolbar = MapControl.navToolbar.mapbox;
      navToolbar.deactivate();
    }
  ).catch(err => {
    console.error(err);
  })
};
MapControl.RefreshExtend = function () {
  let map = MapControl.map.mapbox;
  //  let cPoint = map.extent.getCenter();
  let extent = map.extent;
  let mapExtent = new esri.geometry.Extent(
    extent.xmin,
    extent.ymin,
    extent.xmax,
    extent.ymax,
    map.spatialReference
  );
  map.setExtent(mapExtent);
};
/**
 * 地图放大
 * @param mapId
 */
MapControl.setMapZoomIn = function () {
  esriLoader.loadModules(
    ['esri/map', 'esri/toolbars/navigation']).then(
    ([Map, Navigation]) => {
      var navToolbar = MapControl.navToolbar.mapbox;
      navToolbar.activate(esri.toolbars.Navigation.ZOOM_IN);
    }
  ).catch(err => {
    console.error(err);
  })
};

/**
 * 地图缩小
 * @param mapId
 */
MapControl.setMapZoomOut = function () {
  esriLoader.loadModules(
    ['esri/map', 'esri/toolbars/navigation']).then(
    ([Map, Navigation]) => {
      var navToolbar = MapControl.navToolbar.mapbox;
      navToolbar.activate(esri.toolbars.Navigation.ZOOM_OUT);
    }
  );
};

/**
 * 地图漫游
 * @param mapId
 */
MapControl.setMapPan = function () {
  esriLoader.loadModules(
    ['esri/map', 'esri/toolbars/navigation']).then(
    ([Map, Navigation]) => {
      var navToolbar = MapControl.navToolbar.mapbox;
      navToolbar.activate(esri.toolbars.Navigation.PAN);
    }
  ).catch(err => {
    console.error(err);
  })
};

/**
 * 清除
 * @param mapId
 */
MapControl.setMapClear = function (value) {
  if (value !== undefined) {
    if (value == 2) {
      MapControl.graphicLayers['gralyr4'].clear();
      MapControl.graphicLayers['gralyr5'].clear();
    } else if (value == 3) {
      MapControl.graphicLayers['gralyr3'].clear();
      MapControl.graphicLayers['gralyr4'].clear();
    } else if (value == 5) {
      MapControl.graphicLayers['gralyr5'].clear();
    } else if (value == 4) {
      MapControl.graphicLayers['gralyr1'].clear();
      MapControl.graphicLayers['gralyr2'].clear();
      MapControl.graphicLayers['gralyr3'].clear();
      MapControl.graphicLayers['gralyr4'].clear();
      MapControl.graphicLayers['gralyr5'].clear();
      MapControl.graphicLayers['gralyr6'].clear();
    } else if (value == 1) {
      MapControl.graphicLayers['gralyr2'].clear();
      MapControl.graphicLayers['gralyr3'].clear();
    }
  } else {
    MapControl.graphicLayers['gralyr1'].clear();
    MapControl.graphicLayers['gralyr2'].clear();
    MapControl.graphicLayers['gralyr3'].clear();
    MapControl.graphicLayers['gralyr4'].clear();
    MapControl.graphicLayers['gralyr5'].clear();
  }

  if (doSpaceDrawEventHandler !== undefined) {
    doSpaceDrawEventHandler.remove();
  }
  if (domapOnclickEventHandler !== undefined) {
    domapOnclickEventHandler.remove();
  }
  if (doAttMapDrawEventHandler !== undefined) {
    doAttMapDrawEventHandler.remove();
  }
  if (doMeasureEventHandler !== undefined) {
    doMeasureEventHandler.remove();
  }
  if (doLengthsCompleteHandler !== undefined) {
    doLengthsCompleteHandler.remove();
  }
  if (doAreasAndLengthsCompleteHandler !== undefined) {
    doAreasAndLengthsCompleteHandler.remove();
  }
  let toolbar = MapControl.drawToolbar.mapbox;
  if (toolbar) {
    toolbar.deactivate();
  }
  let editbar = MapControl.editToolbar.mapbox;
  if (editbar) {
    editbar.deactivate();
  }
  //if (MapControl.identifyHandler) {
  //  MapControl.identifyHandler.remove();
  //}
};
MapControl.identifyHandlerRemove = function () {
  if (MapControl.identifyHandler) {
    MapControl.identifyHandler.remove();
  }
}
/**
 *加载服务
 *@param mapId item
 */
MapControl.addservice = function (item) {
  let map = MapControl.map.mapbox;
  if (item.ISADD == 'true') {
    if (item.type == 'tiled') {
      let titleLayer = new esri.layers.ArcGISTiledMapServiceLayer(item.url);
      titleLayer.id = item.SERVICENAME;
      map.addLayer(titleLayer);
    } else if (item.type == 'dynamic') {
      let dynamicLayer = new esri.layers.ArcGISDynamicMapServiceLayer(item.url);
      dynamicLayer.id = item.SERVICENAME;
      map.addLayer(dynamicLayer);
    } else if (item.type == 'image') {
      let imageLayer = new esri.layers.ArcGISImageServiceLayer(item.url);
      imageLayer.id = item.SERVICENAME;
      map.addLayer(imageLayer);
    }
  } else {
    var curLyr = map.getLayer(item.SERVICENAME);
    if (curLyr) map.removeLayer(curLyr);
  }

  bus.$emit('refreshlyr');
};

/**
 *获取地图服务
 */
MapControl.GetMapLayers = function () {
  let map = MapControl.map.mapbox;
  return map.layerIds;

  // var layerInfo = [];
  // dojo.forEach(map.layerIds,function(id){
  //     var layer = map.getLayer(id);
  //     layerInfo.push('id: ' + layer.id + ' visible: ' + layer.visible + ' opacity: ' + layer.opacity + '<br />');
  // });
};

/**
 *改变地图服务顺序
 */
MapControl.changeLayer = function (item, newIndex) {
  let map = MapControl.map.mapbox;
  let allcount = map.layerIds.length;
  var selLyr = map.getLayer(item.serviceurl);
  if (selLyr) {
    var mapindex = allcount - newIndex - 1;
    map.reorderLayer(selLyr, mapindex);
  }

  //alert(map.layerIds);
};

/**
 *地图高亮显示
 */
MapControl.showGraphic = function (geo, issolid, layer, iscal, color) {
  esriLoader.loadModules(
    ['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(
    ([Point, Polyline, Polygon]) => {
      //MapControl.graphicLayers['gralyr1'].clear();
      let map = MapControl.map.mapbox;
      var symbol;
      var showExtent;
      switch (geo.type) {
        case 'point':
          geo = new Point(geo);
          var xMin = geo.x - 500;
          var yMin = geo.y - 500;
          var xMax = geo.x + 500;
          var yMax = geo.y + 500;
          showExtent = new esri.geometry.Extent(
            xMin,
            yMin,
            xMax,
            yMax,
            map.spatialReference
          );
          var symbol = new esri.symbol.SimpleMarkerSymbol(
            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
            10,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleLineSymbol.STYLE_CIRCLE,
              new dojo.Color([255, 87, 34, 5])
            ),
            new dojo.Color([255, 87, 34, 5.25])
          );
          break;
        case 'polyline':
          geo = new Polyline(geo);
          symbol = new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_DASH,
            new dojo.Color(color ? color : [255, 0, 0]),
            3
          );
          showExtent = geo.getExtent();
          break;
        case 'polygon':
          geo = new Polygon(geo);
          symbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(
              issolid == undefined || issolid == 10 ? esri.symbol.SimpleLineSymbol.STYLE_DASH : esri.symbol.SimpleFillSymbol.STYLE_SOLID,
              new dojo.Color(color ? color : [255, 0, 0, 0.8]),
              3
            ),
            new dojo.Color([30, 144, 255, 0.2])
          );
          showExtent = geo.getExtent();
          break;
        case 'extent':
          geo = new Polygon(geo);
          symbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleLineSymbol.STYLE_DASH,
              new dojo.Color(color ? color : [255, 0, 0]),
              3
            ),
            new dojo.Color([255, 87, 34, 0.35])
          );
          showExtent = geo.getExtent();
          break;
      }
      if (showExtent !== undefined) {
        var tempGra = new esri.Graphic(geo, symbol, null, null);
        if (layer == undefined) layer = 'gralyr3';
        MapControl.graphicLayers[layer].add(tempGra);
        if (iscal == undefined) map.setExtent(showExtent.expand(1.5));
      }
    }
  ).catch(err => {
    console.error(err);
  })
};

/**
 *地图定位
 */
MapControl.showExtent = function (geo, iscal) {
  esriLoader.loadModules(
    ['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(
    ([Point, Polyline, Polygon]) => {
      //MapControl.graphicLayers['gralyr1'].clear();
      let map = MapControl.map.mapbox;
      var symbol;
      var showExtent;
      if (geo.type == undefined) return;
      switch (geo.type) {
        case 'point':
          geo = new Point(geo);
          var xMin = geo.x - 500;
          var yMin = geo.y - 500;
          var xMax = geo.x + 500;
          var yMax = geo.y + 500;
          showExtent = new esri.geometry.Extent(
            xMin,
            yMin,
            xMax,
            yMax,
            map.spatialReference
          );
          break;
        case 'polyline':
          geo = new Polyline(geo);
          showExtent = geo.getExtent();
          break;
        case 'polygon':
          geo = new Polygon(geo);
          showExtent = geo.getExtent();
          break;
        case 'extent':
          geo = new Polygon(geo);
          showExtent = geo.getExtent();
          break;
      }
      if (showExtent !== undefined) {
        map.setExtent(showExtent.expand(iscal == undefined ? 1.5 : iscal));
      }
    }
  ).catch(err => {
    console.error(err);
  })
};

MapControl.SetExtent = function (x, y) {
  let map = MapControl.map.mapbox;
  //  let cPoint = map.extent.getCenter();
  let extent = map.extent;
  let mapExtent = new esri.geometry.Extent(
    extent.xmin - x,
    extent.ymin - y,
    extent.xmax + x,
    extent.ymax + y,
    map.spatialReference
  );
  map.setExtent(mapExtent);
};
/**
 * Geometry高亮显示
 */
MapControl.showGeometry = function (geo) {
  esriLoader.loadModules(
    ['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(
    ([Point, Polyline, Polygon]) => {
      MapControl.graphicLayers['gralyr3'].clear();
      let map = MapControl.map.mapbox;
      var symbol;
      var showExtent;
      switch (geo.type) {
        case 'point':
          geo = new Point(geo);
          var xMin = parseFloat(geo.x) + 50;
          var yMin = parseFloat(geo.y) + 50;
          var xMax = parseFloat(geo.x) + 50;
          var yMax = parseFloat(geo.y) + 50;
          showExtent = new esri.geometry.Extent(
            xMin,
            yMin,
            xMax,
            yMax,
            map.spatialReference
          );
          var symbol = new esri.symbol.SimpleMarkerSymbol(
            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
            10,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleLineSymbol.STYLE_CIRCLE,
              new dojo.Color([255, 87, 34, 5])
            ),
            new dojo.Color([255, 87, 34, 5.25])
          );
          break;
        case 'polyline':
          geo = new Polyline(geo);
          var symbol = new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new dojo.Color([255, 87, 34]),
            3
          );
          showExtent = geo.getExtent();
          break;
      }
      if (showExtent != undefined) {
        var tempGra = new esri.Graphic(geo, symbol, null, null);
        MapControl.graphicLayers['gralyr3'].add(tempGra);
        map.setExtent(showExtent.expand(1.5));
      }
    }
  ).catch(err => {
    console.error(err);
  })
};

/**
 *地图绘制
 */
MapControl.mapDraw = function (drawtype, isClear) {
  if (doSpaceDrawEventHandler != undefined) {
    doSpaceDrawEventHandler.remove();
  }
  let toolbar = MapControl.drawToolbar.mapbox;
  doSpaceDrawEventHandler = toolbar.on('draw-end', doSpaceDraw);

  if (drawtype == 'point') {
    toolbar.activate(esri.toolbars.Draw.POINT);
  } else if (drawtype == 'extent') {
    toolbar.activate(esri.toolbars.Draw.EXTENT);
  } else if (drawtype == 'polygon') {
    toolbar.activate(esri.toolbars.Draw.POLYGON);
  } else if (drawtype == 'polyline') {
    toolbar.activate(esri.toolbars.Draw.POLYLINE);
  } else if (drawtype == 'circle') {
    toolbar.activate(esri.toolbars.Draw.CIRCLE);
  } else if (drawtype == 'line') {
    toolbar.activate(esri.toolbars.Draw.LINE);
  }
  if (isClear == true) {
    MapControl.graphicLayers['gralyr1'].clear();
  }
};

MapControl.clearmapDraw = function () {
  MapControl.graphicLayers['gralyr1'].clear();
  if (doSpaceDrawEventHandler != undefined) {
    doSpaceDrawEventHandler.remove();
  }
};

function doSpaceDraw(gra) {
  let map = MapControl.map;
  if (doSpaceDrawEventHandler !== undefined) {
    doSpaceDrawEventHandler.remove();
  }
  let toolbar = MapControl.drawToolbar.mapbox;
  toolbar.deactivate();
  //根据图形的类型定义显示样式
  var geo = gra.geometry;
  var symbol;
  var geom = '';

  switch (geo.type) {
    case 'point':
      symbol = new esri.symbol.SimpleMarkerSymbol(
        esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
        10,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_CIRCLE,
          new dojo.Color([255, 87, 34, 5])
        ),
        new dojo.Color([255, 87, 34, 5.25])
      );
      geom = transformUtils.PointToWKT(geo);
      break;
    case 'polyline':
      symbol = new esri.symbol.SimpleLineSymbol(
        esri.symbol.SimpleLineSymbol.STYLE_DASH,
        new dojo.Color([255, 0, 0]),
        3
      );
      geom = transformUtils.LineToWKT(geo);
      // for (var i = 0; i < geo.paths[0].length; i++) {
      //     geom = geo.paths[0][i][0] + ' ' + geo.paths[0][i][1] + ',' + geom;
      // }
      // geom = 'LINESTRING (' + geom.substring(0, geom.length - 1) + ')';
      break;
    case 'polygon':
      symbol = new esri.symbol.SimpleFillSymbol(
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_DASH,
          new dojo.Color([255, 0, 0, 0.6]),
          3
        ),
        new dojo.Color([255, 255, 255, 0.2])
      );
      geom = MapControl.AgsToWkt(geo);
      break;
    case 'extent':
      symbol = new esri.symbol.SimpleFillSymbol(
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_DASH,
          new dojo.Color([255, 0, 0]),
          3
        ),
        new dojo.Color([255, 140, 0, 0.1])
      );
      geom =
        geo.xmin +
        ' ' +
        geo.ymin +
        ',' +
        geo.xmax +
        ' ' +
        geo.ymin +
        ',' +
        geo.xmax +
        ' ' +
        geo.ymax +
        ',' +
        geo.xmin +
        ' ' +
        geo.ymax +
        ',' +
        geo.xmin +
        ' ' +
        geo.ymin;
      geom = 'POLYGON ((' + geom + '))';
      break;
  }
  bus.$emit('mapDrawresult', geom);
  bus.$emit('PrintmapDrawresult', {
    gwkt: geom,
    gty: geo
  });
  var tempGra = new esri.Graphic(geo, symbol, null, null);
  MapControl.graphicLayers['gralyr1'].add(tempGra);
}


MapControl.DrawTool = function (drawtype) {
  if (doSpaceDrawEventHandler != undefined) {
    doSpaceDrawEventHandler.remove();
  }
  let toolbar = MapControl.drawToolbar.mapbox;
  doSpaceDrawEventHandler = toolbar.on('draw-end', getGeoms);

  if (drawtype == 'point') {
    toolbar.activate(esri.toolbars.Draw.POINT);
  } else if (drawtype == 'extent') {
    toolbar.activate(esri.toolbars.Draw.EXTENT);
  } else if (drawtype == 'polygon') {
    toolbar.activate(esri.toolbars.Draw.POLYGON);
  } else if (drawtype == 'polyline') {
    toolbar.activate(esri.toolbars.Draw.POLYLINE);
  } else if (drawtype == 'circle') {
    toolbar.activate(esri.toolbars.Draw.CIRCLE);
  } else if (drawtype == 'line') {
    toolbar.activate(esri.toolbars.Draw.LINE);
  }

  function getGeoms(gra) {
    esriLoader
      .loadModules([
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters"
      ])
      .then(([IdentifyTask, IdentifyParameters]) => {
        let map = MapControl.map.mapbox;
        let geo = gra.geometry;
        let symbol = new esri.symbol.SimpleFillSymbol(
          esri.symbol.SimpleFillSymbol.STYLE_SOLID,
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_DASH,
            new dojo.Color([255, 0, 0]),
            3
          ),
          new dojo.Color([255, 140, 0, 0.1])
        );
        let geom;
        if (geo.type == 'point') {
          let identifyTask = new IdentifyTask(
            mapconfig.arcgis_url_kxgh
          );
          let identifyParams = new IdentifyParameters();
          identifyParams.tolerance = 1;
          identifyParams.returnGeometry = true;
          identifyParams.layerOption =
            esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
          identifyParams.geometry = geo;
          identifyParams.mapExtent = map.extent;
          identifyTask.execute(identifyParams, results => {
            if (results.length > 0) {
              for (let i = 0; i < results.length; i++) {
                MapControl.showGraphic(
                  results[i].feature.geometry,
                  undefined,
                  "gralyr6"
                );
              }
            }

          });
        } else {
          switch (geo.type) {
            case 'polygon':
              geom = MapControl.AgsToWkt(geo);
              break;
            case 'extent':
              geom =
                geo.xmin +
                ' ' +
                geo.ymin +
                ',' +
                geo.xmax +
                ' ' +
                geo.ymin +
                ',' +
                geo.xmax +
                ' ' +
                geo.ymax +
                ',' +
                geo.xmin +
                ' ' +
                geo.ymax +
                ',' +
                geo.xmin +
                ' ' +
                geo.ymin;
              geom = 'POLYGON ((' + geom + '))';
              break;
          }
          var tempGra = new esri.Graphic(geo, symbol, null, null);
          MapControl.graphicLayers['gralyr6'].add(tempGra);
        }
        toolbar.deactivate()
        bus.$emit('mapDrawend', geom);
      })
      .catch(err => {
        console.error(err);
      });
  }
};

MapControl.GetPoint = function (drawtype) {
  if (doSpaceDrawEventHandler != undefined) {
    doSpaceDrawEventHandler.remove();
  }

  let toolbar = MapControl.drawToolbar.mapbox;
  doSpaceDrawEventHandler = toolbar.on('draw-end', function (gra) {
    let map = MapControl.map;
    if (doSpaceDrawEventHandler != undefined) {
      doSpaceDrawEventHandler.remove();
    }
    let toolbar = MapControl.drawToolbar.mapbox;
    toolbar.deactivate();
    var geo = gra.geometry;
    var symbol;
    switch (geo.type) {
      case 'point':
        symbol = new esri.symbol.SimpleMarkerSymbol(
          esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE,
          5,
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new dojo.Color([255, 0, 0]),
            1
          ),
          new dojo.Color([0, 255, 0, 0.35])
        );
        break;
    }
    bus.$emit('GetPoint', geo);
    var tempGra = new esri.Graphic(geo, symbol, null, null);
    MapControl.graphicLayers['gralyr1'].add(tempGra);
  });

  if (drawtype == 'point') {
    toolbar.activate(esri.toolbars.Draw.POINT);
  }
  MapControl.graphicLayers['gralyr1'].clear();
};

//立案绘制
MapControl.Draw = function (drawtype) {
  if (doSpaceDrawEventHandler != undefined) {
    doSpaceDrawEventHandler.remove();
  }

  let toolbar = MapControl.drawToolbar.mapbox;
  doSpaceDrawEventHandler = toolbar.on('draw-end', function (gra) {
    let map = MapControl.map.mapbox;
    if (doSpaceDrawEventHandler != undefined) {
      doSpaceDrawEventHandler.remove();
    }
    toolbar.deactivate();
    //根据图形的类型定义显示样式
    var geo = gra.geometry;
    var symbol;
    var geom = '';

    symbol = new esri.symbol.SimpleFillSymbol(
      esri.symbol.SimpleFillSymbol.STYLE_SOLID,
      new esri.symbol.SimpleLineSymbol(
        esri.symbol.SimpleLineSymbol.STYLE_DASH,
        new dojo.Color([255, 0, 0]),
        3
      ),
      new dojo.Color([255, 140, 0, 0.35])
    );
    bus.$emit('GetPolygonFromRemoteServer', geo);
    var tempGra = new esri.Graphic(geo, symbol, null, null);
    MapControl.graphicLayers['gralyr1'].add(tempGra);
  });

  toolbar.activate(esri.toolbars.Draw.POLYGON);

  MapControl.graphicLayers['gralyr1'].clear();
};
/**
 *wkt转化成arcgis对象
 */
MapControl.WktToAgs = function (wkt, spatialReference) {
  let map = MapControl.map.mapbox;
  var geo;
  if (wkt.indexOf('POINT') >= 0)
    geo = transformUtils.WktToPoint(wkt, spatialReference ? spatialReference : map.spatialReference);
  else if (wkt.indexOf('LINESTRING') == 0)
    geo = transformUtils.WktToPolyline(wkt, spatialReference ? spatialReference : map.spatialReference);
  else if (wkt.indexOf('MULTILINESTRING') == 0)
    geo = transformUtils.WktToMulyiPolyline(wkt, spatialReference ? spatialReference : map.spatialReference);
  else if (wkt.indexOf('POLYGON') == 0)
    geo = transformUtils.WktToPolygon(wkt, spatialReference ? spatialReference : map.spatialReference);
  else if (wkt.indexOf('MULTIPOLYGON') == 0) {
    geo = transformUtils.WktToMULTIPOLYGON(wkt, spatialReference ? spatialReference : map.spatialReference);
  }
  return geo;
};

/**
 *arcgis对象wkt
 */
MapControl.AgsToWkt = function (ags) {
  let map = MapControl.map.mapbox;
  var geo = ags;
  if (geo.type == 'point') {
    geo = transformUtils.PointToWKT(geo);
  } else if (geo.type == 'polyline') {
    geo = transformUtils.LineToWKT(geo);
  } else if (geo.type == 'polygon') {
    geo = transformUtils.PolygonToWKT(geo);
  }
  return geo;
};

/**
 *标注
 */
MapControl.AddMarker = function (name) {
  let map = MapControl.map.mapbox;
  let toolbar = MapControl.drawToolbar.mapbox;
  toolbar.activate(esri.toolbars.Draw.POINT);
  MapControl.graphicLayers['gralyr1'].clear();
  if (domapOnclickEventHandler != undefined) {
    domapOnclickEventHandler.remove();
  }
  domapOnclickEventHandler = toolbar.on('draw-end', function (gra) {
    if (domapOnclickEventHandler != undefined) {
      domapOnclickEventHandler.remove();
    }
    var geo = gra.geometry;
    MapControl.GetTxtSymbols(geo, name, 0, 40, '#495060');
    bus.$emit('AddMarker', geo);
    toolbar.deactivate();
  });
};

MapControl.showMarker = function (geo) {
  MapControl.graphicLayers['gralyr1'].clear();
  var iconPath =
    'M21.4,10.75C21.4,13.8596180857762 20.0672757983134,16.6579617557165 17.9418493492401,18.6050090555209 17.0443221066919,19.427210169498 16.4687497071909,20.1972502374357 15.4999997246083,21.0410002473414 15.1788168986504,21.3207401363281 14.6249997403403,21.947250257981 13.7499997560722,23.3847502748576 13.3436019926217,24.0524037632258 12.876040684451,24.9010880896574 12.4687497791082,25.666000300437 11.1874998021442,28.0722503285736 11.4538843799389,31.2910003676782 10.6874998111339,31.2910003676782 9.9311690792195,31.2910003676782 10.062499822371,28.2910003311315 8.96874984203587,25.7597503015333 8.58471596323839,24.8709861556588 8.03709726822865,23.8066075530583 7.56249986731934,23.1035002715558 6.71874988248939,21.8535002568804 6.01878656603682,21.3001083190566 5.71874990046874,21.0097502469744 4.74999991788621,20.0722502359682 4.15562035443328,19.2270786136257 3.17966875598971,18.2408347051012 1.27570825337479,16.3167951822706 0.0999999999999996,13.670698279192 0.0999999999999996,10.75 0.0999999999999996,4.86816741430205 4.86816741430205,0.0999999999999996 10.75,0.0999999999999996 16.631832585698,0.0999999999999996 21.4,4.86816741430205 21.4,10.75z';
  var system = new esri.symbol.SimpleMarkerSymbol();
  system.setPath(iconPath);
  system.setSize(30);
  system.setColor(new esri.Color('#FF0000'));
  system.setOffset(0, 15);

  var symbol = new esri.symbol.SimpleLineSymbol(
    esri.symbol.SimpleLineSymbol.STYLE_NULL,
    new dojo.Color([255, 0, 0]),
    0
  );
  system.setOutline(symbol);

  var graphic = new esri.Graphic(geo, system);
  // var symbol = esri.symbol.PictureMarkerSymbol('../assets/img/tips.png', 23, 30);
  // var tempGra = new esri.Graphic(geo, symbol);
  MapControl.graphicLayers['gralyr1'].add(graphic);
};
// 距离、面积测量操作
var doMeasureEventHandler;
var doLengthsCompleteHandler;
var doAreasAndLengthsCompleteHandler;
var length, lastpt, centerPoint;
MapControl.MeasureDraw = function (type) {
  if (doMeasureEventHandler != undefined) {
    doMeasureEventHandler.remove();
  }
  if (doLengthsCompleteHandler != undefined) {
    doLengthsCompleteHandler.remove();
  }
  if (doAreasAndLengthsCompleteHandler != undefined) {
    doAreasAndLengthsCompleteHandler.remove();
  }
  if (domapOnclickEventHandler != undefined) {
    domapOnclickEventHandler.remove();
  }
  let toolbar = MapControl.drawToolbar.mapbox;
  let geometryService = MapControl.GeometryService;
  doMeasureEventHandler = toolbar.on('draw-end', doMeasure);
  if (type == 'polyline') {
    length = 0;
    lastpt = null;
    toolbar.activate(esri.toolbars.Draw.POLYLINE);
    setupCustomTool('polyline');
  } else if (type == 'polygon') {
    toolbar.activate(esri.toolbars.Draw.POLYGON);
  }
};

//量算
function doMeasure(gra) {
  let map = MapControl.map.mapbox;
  let toolbar = MapControl.drawToolbar.mapbox;
  let geometryService = MapControl.GeometryService;
  var geometry = gra.geometry;
  esriLoader.loadModules(
    ['esri/tasks/AreasAndLengthsParameters']).then(
    ([AreasAndLengthsParameters]) => {
      switch (geometry.type) {
        case 'polygon':
          var symbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleLineSymbol.STYLE_SOLID,
              new dojo.Color([0, 0, 0]),
              2
            ),
            new dojo.Color([255, 0, 0, 0.25])
          );
          var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
          areasAndLengthParams.lengthUnit =
            esri.tasks.GeometryService.UNIT_FOOT;
          areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_METER;
          geometryService.simplify([geometry], function (simplifiedGeometries) {
            areasAndLengthParams.polygons = simplifiedGeometries;
            geometryService.areasAndLengths(
              areasAndLengthParams,
              outputAreaAndLength
            );
          });
          centerPoint = geometry.getCentroid();
          break;
      }
      var graphic = new esri.Graphic(geometry, symbol);
      MapControl.graphicLayers['gralyr1'].add(graphic);
    }
  ).catch(err => {
    console.error(err);
  })
}
var doonLengthsComplete;

function setupCustomTool(name) {
  let toolbar = MapControl.drawToolbar.mapbox;
  if (domapOnclickEventHandler !== undefined) {
    domapOnclickEventHandler.remove();
  }
  if (name == 'polyline') {
    let map = MapControl.map.mapbox;
    domapOnclickEventHandler = map.on('click', MapclickHandler);
    map.on('dbclick', stopMeasure);
  }
}

function stopMeasure() {
  if (doonLengthsComplete !== undefined) {
    doonLengthsComplete.remove();
  }
  toolbar.deactivate();
}

function MapclickHandler(e) {
  let map = MapControl.map.mapbox;
  let geometryService = MapControl.GeometryService;
  var pt = new esri.geometry.Point(
    e.mapPoint.x,
    e.mapPoint.y,
    map.spatialReference
  );
  esriLoader.loadModules(
    ['esri/tasks/LengthsParameters']).then(
    ([LengthsParameters]) => {
      if (lastpt != undefined) {
        var line = new esri.geometry.Polyline({
          spatialReference: map.spatialReference
        });
        line.addPath([lastpt, pt]);

        var symbol = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color([255, 0, 0]),
          2
        );
        MapControl.graphicLayers['gralyr1'].add(new esri.Graphic(line, symbol));

        var lengthParams = new esri.tasks.LengthsParameters();
        lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
        lengthParams.polylines = [line];
        lengthParams.geodesic = false;
        lengthParams.calculationType = 'geodesic';
        lengthParams.polylines[0].spatialReference = map.spatialReference;
        if (doonLengthsComplete !== undefined)
          dojo.disconnect(doonLengthsComplete);
        doonLengthsComplete = dojo.connect(
          geometryService,
          'onLengthsComplete',
          outputDistance
        );
        geometryService.lengths(lengthParams);
      }
      lastpt = pt;
      var marksymbol = new esri.symbol.SimpleMarkerSymbol(
        esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
        dojox.gfx.px2pt(12),
        new esri.symbol.SimpleLineSymbol()
        .setStyle(esri.symbol.SimpleLineSymbol.STYLE_SOLID)
        .setColor(new dojo.Color([255, 0, 0, 255])),
        new dojo.Color([0, 0, 0, 0], dojox.gfx.px2pt(1))
      );
      var graphic = new esri.Graphic(pt, marksymbol);
      MapControl.graphicLayers['gralyr1'].add(graphic);
    }
  ).catch(err => {
    console.error(err);
  })
}

function outputDistance(evtObj) {
  let map = MapControl.map.mapbox;
  let toolbar = MapControl.drawToolbar.mapbox;
  if (doLengthsCompleteHandler != undefined) {
    //doLengthsCompleteHandler.remove();
    dojo.disconnect(doLengthsCompleteHandler);
  }
  if (evtObj.lengths[0] < 0.5) {
    toolbar.deactivate();
    if (domapOnclickEventHandler != undefined) {
      domapOnclickEventHandler.remove();
    }
    return;
  }
  length += evtObj.lengths[0];
  var lengthValue;
  if (length >= 1000) {
    lengthValue = (length / 1000).toFixed(3) + '公里';
  } else {
    lengthValue = length.toFixed(3) + '米';
  }

  // var pmsTextBg = new esri.symbol.PictureMarkerSymbol(tips, 22, 20);

  // pmsTextBg.setOffset(40, -15);
  // var textLength = lengthValue.length;
  // pmsTextBg.setWidth(textLength * 10);
  // var bgGraphic = new esri.Graphic(lastpt, pmsTextBg);
  // MapControl.graphicLayers['gralyr1'].add(bgGraphic);//用来衬托文字白底的

  var font = new esri.symbol.Font();
  font.setSize('10pt');
  font.setFamily('微软雅黑');
  var text = new esri.symbol.TextSymbol(lengthValue);
  text.setFont(font);
  text.setColor(new dojo.Color([0, 0, 0, 255]));
  text.setOffset(40, -20);

  var labelGraphic = new esri.Graphic(lastpt, text);
  MapControl.graphicLayers['gralyr1'].add(labelGraphic);
}
//面积结果
function outputAreaAndLength(result) {
  if (doAreasAndLengthsCompleteHandler != undefined) {
    doAreasAndLengthsCompleteHandler.remove();
  }
  let map = MapControl.map.mapbox;
  let toolbar = MapControl.drawToolbar.mapbox;
  var area;
  var areaValue = result.areas[0];
  if (areaValue >= 1000000) {
    area = '面积：' + (result.areas[0] / 1000000).toFixed(3) + '平方公里';
  } else {
    area = '面积：' + result.areas[0].toFixed(3) + '平方米';
  }
  var font = new esri.symbol.Font(
    '12pt',
    esri.symbol.Font.VARIANT_NORMAL,
    esri.symbol.Font.WEIGHT_BOLD,
    '黑体'
  );
  var textSymbol = new esri.symbol.TextSymbol(
    area,
    font,
    new dojo.Color([0, 0, 0])
  );
  var labelPointGraphic = new esri.Graphic(centerPoint, textSymbol);
  MapControl.graphicLayers['gralyr1'].add(labelPointGraphic);
  toolbar.deactivate();
}

/*图层控制显示*/
MapControl.SetLayerVisible = function (uservisibleLayers) {
  esriLoader.loadModules(
    ['esri/map', 'esri/layers/ArcGISDynamicMapServiceLayer']).then(
    ([Map, ArcGISDynamicMapServiceLayer]) => {
      let map = MapControl.map.mapbox;
      if (uservisibleLayers) {
        for (var sitem in uservisibleLayers) {
          if (uservisibleLayers[sitem].serviceurl) {
            var sublay = map.getLayer(uservisibleLayers[sitem].serviceurl);
            if (!sublay) {
              continue;
            }
            if (uservisibleLayers[sitem].haschild == true) {
              let index = sublay.displayLevels.indexOf(uservisibleLayers[sitem].layerindex);
              if (uservisibleLayers[sitem].switchs) {
                if (index < 0)
                  sublay.displayLevels.push(uservisibleLayers[sitem].layerindex);
              } else {
                if (index > -1) {
                  sublay.displayLevels.splice(index, 1);
                }
              }
              sublay.setVisibleLayers(sublay.displayLevels);
            } else sublay.setVisibility(uservisibleLayers[sitem].switchs);
          }
        }
      }
    }
  ).catch(err => {
    console.error(err);
  })
};

/*批量图层加载，一直叠加，如果存在则不操作，*/
MapControl.SetLayerload = function (uservisibleLayers) {
  esriLoader.loadModules(
    [
      'esri/map',
      'esri/layers/ArcGISDynamicMapServiceLayer',
      'esri/layers/ArcGISTiledMapServiceLayer'
    ]).then(
    ([Map, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer]) => {
      let map = MapControl.map.mapbox;
      if (uservisibleLayers) {
        for (var sitem in uservisibleLayers) {
          var sublay = map.getLayer(uservisibleLayers[sitem].serviceurl);
          if (sublay == undefined) {
            if (uservisibleLayers[sitem].servicetype === 'dynamic') {
              sublay = new esri.layers.ArcGISDynamicMapServiceLayer(
                uservisibleLayers[sitem].serviceurl
              );
            } else {
              sublay = new esri.layers.ArcGISTiledMapServiceLayer(
                uservisibleLayers[sitem].serviceurl
              );
            }
            sublay.id = uservisibleLayers[sitem].serviceurl;
            sublay.opacity = uservisibleLayers[sitem].slider / 100;
            if (uservisibleLayers[sitem].haschild == true) {
              sublay.displayLevels = [Number(uservisibleLayers[sitem].layerindex)]
              sublay.setVisibleLayers(sublay.displayLevels);
            }
            map.addLayer(sublay);
          } else {
            if (uservisibleLayers[sitem].haschild == true) {
              if (sublay.displayLevels.indexOf(Number(uservisibleLayers[sitem].layerindex)) < 0) {
                sublay.displayLevels.push(Number(uservisibleLayers[sitem].layerindex));
                sublay.setVisibleLayers(sublay.displayLevels);
              }
            } else
              sublay.setVisibility(uservisibleLayers[sitem].switchs);
          }
        }
      }
    }
  ).catch(err => {
    console.error(err);
  })
};

/*地图与影像图切换 */
MapControl.SetLayerbaseload = function (uservisibleLayers) {
  esriLoader.loadModules(
    ['esri/map', 'esri/layers/ArcGISTiledMapServiceLayer', 'esri/layers/ArcGISDynamicMapServiceLayer']).then(
    ([Map, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer]) => {
      let map = MapControl.map.mapbox;
      console.log(uservisibleLayers)
      if (!uservisibleLayers) return;
      uservisibleLayers.forEach(element => {
        var sublay = map.getLayer(element.url);
        if (sublay && !element.isshow) {
          map.removeLayer(sublay); //移除图层
        } else if (element.isshow == true) {
          if (element.type == 'tiled') {
            sublay = new esri.layers.ArcGISTiledMapServiceLayer(element.url);
          }
          if (element.type == 'dynamic') {
            sublay = new esri.layers.ArcGISDynamicMapServiceLayer(element.url);
          }
          sublay.id = element.url;
          sublay.name = element.url;
          map.addLayer(sublay, 0); //加载图层
        }
      });
    }
  ).catch(err => {
    console.error(err);
  })
};

/*批量图层移除*/
MapControl.RemoveLayerVisible = function (uservisibleLayers) {
  let map = MapControl.map.mapbox;
  if (uservisibleLayers) {
    for (var sitem in uservisibleLayers) {
      if (uservisibleLayers[sitem].serviceurl) {
        var sublay = map.getLayer(uservisibleLayers[sitem].serviceurl);
        if (sublay) {
          if (uservisibleLayers[sitem].haschild == true) {
            let index = sublay.displayLevels.indexOf(Number(uservisibleLayers[sitem].layerindex));
            if (index > -1) {
              sublay.displayLevels.splice(index, 1);
              sublay.setVisibleLayers(sublay.displayLevels);
            }
            if (sublay.displayLevels.length == 0) map.removeLayer(sublay);
          } else
            map.removeLayer(sublay);
        }
      }
    }
  }
};

/*图层透明度设置*/
MapControl.transparency = function (uservisibleLayers) {
  var lay = uservisibleLayers.tmdtransparency / 100;
  esriLoader.loadModules(
    [
      'esri/map',
      'dojo/on',
      'dojo/dom',
      'dojo/_base/fx',
      'esri/layers/ArcGISTiledMapServiceLayer',
      'esri/geometry/Extent',
      'dojo/domReady!'
    ]).then(
    ([Map, on, dom, basefx, ArcGISTiledMapServiceLayer, Extent]) => {
      let map = MapControl.map.mapbox;
      var colorfullbasemap = map.getLayer(uservisibleLayers.serverurl);
      var graybasemapdiv = colorfullbasemap.getNode();
      basefx
        .animateProperty({
          node: graybasemapdiv,
          duration: 500,
          properties: {
            opacity: lay
          }
        })
        .play();
    }
  ).catch(err => {
    console.error(err);
  })
};

/*地图上弹出框*/
MapControl.topup = function (event) {
  var map = MapControl.map.mapbox;
  /*弹出框*/
  /*调整弹出框的大小*/
  if (event.resize) {
    map.infoWindow.resize(event.resize);
  }
  if (event.setTitle) {
    map.infoWindow.setTitle(event.setTitle);
  }
  if (event.setContent) {
    map.infoWindow.setContent(event.setContent);
  }

  if (event.geo) {
    if (event.geo.type == 'point') {
      map.infoWindow.show(event.geo);
    } else {
      /*取中心点*/
      map.infoWindow.show(event.geo.getExtent().getCenter());
    }
  }
  //显示位置 用于定位
  if (event.geo) {
    var showExtent;
    switch (event.geo.type) {
      case 'point':
        var xMin = parseFloat(event.geo.x) - 50;
        var yMin = parseFloat(event.geo.y) - 50;
        var xMax = parseFloat(event.geo.x) + 50;
        var yMax = parseFloat(event.geo.y) + 50;
        showExtent = new esri.geometry.Extent(
          xMin,
          yMin,
          xMax,
          yMax,
          map.spatialReference
        );
        break;
      case 'polyline':
        showExtent = event.geo.getExtent();
        break;
      case 'polygon':
        showExtent = event.geo.getExtent();
        break;
      case 'extent':
        showExtent = event.geo.getExtent();
        break;
    }
    if (showExtent != undefined) {
      map.setExtent(showExtent.expand(1.5));
    }
  }
};

/*截屏*/
MapControl.screenshots = function (uservisibleLayers) {
  var app = {};
  esriLoader.loadModules(
    [
      'esri/map',
      'esri/dijit/Print',
      'esri/tasks/PrintTask',
      'esri/tasks/PrintParameters',
      'esri/tasks/PrintTemplate',
      'esri/symbols/TextSymbol',
      'esri/symbols/Font',
      'esri/graphic',
      'esri/geometry/Point',
      'esri/symbols/SimpleMarkerSymbol',
      'esri/symbols/SimpleLineSymbol',
      'esri/Color',
      'dojo/domReady!'
    ]).then(
    ([
      Map,
      Print,
      PrintTask,
      PrintParameters,
      PrintTemplate,
      TextSymbol,
      Font,
      Graphic,
      Point,
      SimpleMarkerSymbol,
      SimpleLineSymbol,
      Color
    ]) => {
      var printUrl =
        'http://10.10.31.180:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';
      var printTask = new PrintTask(printUrl);
      var template = new PrintTemplate();
      template.exportOptions = {
        width: 800,
        height: 600,
        dpi: 96
      };
      template.format = 'PDF';
      template.layout = 'MAP_ONLY';
      template.preserveScale = false;
      var params = new PrintParameters();
      params.map = MapControl.map.mapbox;
      params.template = template;
      printTask.execute(params, function (evt) {
        window.open(evt.url, '_blank');
      });
    }
  ).catch(err => {
    console.error(err);
  })
};

/*图层控制显示根据属性*/
MapControl.SetLayerVisibleByProperty = function (uservisibleLayers) {
  esriLoader.loadModules(
    ['esri/map', 'esri/layers/ArcGISDynamicMapServiceLayer']).then(
    ([Map, ArcGISDynamicMapServiceLayer]) => {
      let map = MapControl.map.mapbox;
      try {
        if (uservisibleLayers) {
          if (uservisibleLayers.SERVERURL) {
            var sublay = map.getLayer(uservisibleLayers.SERVERURL);
            if (!sublay) {
              sublay = new esri.layers.ArcGISDynamicMapServiceLayer(
                uservisibleLayers.SERVERURL
              );
              sublay.id = uservisibleLayers.SERVERURL;
              sublay.name = uservisibleLayers.SERVERURL;
              map.addLayer(sublay);
            }

            sublay.setVisibility(true);

            if (
              uservisibleLayers.layerDefint &&
              uservisibleLayers.layerDefint.length > 0
            ) {
              sublay.setLayerDefinitions(uservisibleLayers.layerDefint);
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  ).catch(err => {
    console.error(err);
  })
};

MapControl.PostionToPolygon = function (geo) {
  esriLoader.loadModules(
      ['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon'])
    .then(([Point, Polyline, Polygon]) => {
      let map = MapControl.map.mapbox;
      var esrgeo = new Polygon(geo);
      var showExtent = esrgeo.getExtent();
      if (showExtent != undefined) {
        map.setExtent(showExtent.expand(1.5));
      }
    }).catch(err => {
      console.error(err);
    })
};

//点击查询
MapControl.QueryByPoint = function (_Self) {
  let map = MapControl.map.mapbox0;
  MapControl.identifyHandler = map.on('click', function (geo) {
    if (_Self.$parent.$router.currentRoute.name !== 'idenfitysplit') {
      //优先打开Identify窗口
      _Self.$parent.$router.replace({
        name: 'idenfitysplit',
        params: {
          name: 'idenfitysplit',
          menuname: '查询结果'
        }
      });
      _Self.$parent.title_name = '查询结果';
    }
    //获取全部图层名称
    var LayerName = '';
    var LayerData = [];
    var InitialLayer =
      _Self.$store.state.userdata.MapServices[0].children[0].children;
    for (let i = 0; i < InitialLayer.length; i++) {
      var treeNode1 = InitialLayer[i];
      for (let j = 0; j < treeNode1.children.length; j++) {
        var treeNode2 = treeNode1.children[j];
        LayerData.push(treeNode1.title + '_' + treeNode2.title);
      }
    }
    LayerName = LayerData.toString().replace(/[,]/g, '|');

    var data = {
      Privilege: _Self.$store.state.userdata.USER_PRIVILEGE,
      RoleID: _Self.$store.state.userdata.AOTHOR_ID,
      UserID: _Self.$store.state.userdata.USER_CODE,
      UserName: _Self.$store.state.userdata.USER_NAME,
      FunctionName: 'idenfitysplit',
      isIdentify: '1',
      DataType: '管点|管线|井室线',
      LayerName: LayerName,
      DSDX: '2',
      Public: '2',
      GeometryObjID: '',
      GeometryString: 'Point (' + geo.mapPoint.x + ' ' + geo.mapPoint.y + ')',
      BufferDistances: '1',
      WhereCase: '',
      Auth: _Self.$store.state.Auth
    };
    _Self.$http
      .post(
        mapconfig.webservices + 'BDataQuery/DataQuery.ashx?cmd=GetFeatureCount',
        data
      )
      .then(function (response) {
        if (response.data.success == true) {
          var result = response.data.source;
          bus.$emit('idenfitysplit', result);
        } else {
          _Self.$Message.error('未查询到要素!');
        }
      });
  });
};

//添加气球标注(X,Y)文字标注偏移量（默认可以认为是0,13）
MapControl.GetTxtSymbols = function (geo, num, X, Y, color) {
  var iconPath =
    'M21.4,10.75C21.4,13.8596180857762 20.0672757983134,16.6579617557165 17.9418493492401,18.6050090555209 17.0443221066919,19.427210169498 16.4687497071909,20.1972502374357 15.4999997246083,21.0410002473414 15.1788168986504,21.3207401363281 14.6249997403403,21.947250257981 13.7499997560722,23.3847502748576 13.3436019926217,24.0524037632258 12.876040684451,24.9010880896574 12.4687497791082,25.666000300437 11.1874998021442,28.0722503285736 11.4538843799389,31.2910003676782 10.6874998111339,31.2910003676782 9.9311690792195,31.2910003676782 10.062499822371,28.2910003311315 8.96874984203587,25.7597503015333 8.58471596323839,24.8709861556588 8.03709726822865,23.8066075530583 7.56249986731934,23.1035002715558 6.71874988248939,21.8535002568804 6.01878656603682,21.3001083190566 5.71874990046874,21.0097502469744 4.74999991788621,20.0722502359682 4.15562035443328,19.2270786136257 3.17966875598971,18.2408347051012 1.27570825337479,16.3167951822706 0.0999999999999996,13.670698279192 0.0999999999999996,10.75 0.0999999999999996,4.86816741430205 4.86816741430205,0.0999999999999996 10.75,0.0999999999999996 16.631832585698,0.0999999999999996 21.4,4.86816741430205 21.4,10.75z';
  var system = new esri.symbol.SimpleMarkerSymbol();
  system.setPath(iconPath);
  system.setSize(30);
  system.setColor(new esri.Color('#FF0000'));
  system.setOffset(0, 15);

  var symbol = new esri.symbol.SimpleLineSymbol(
    esri.symbol.SimpleLineSymbol.STYLE_NULL,
    new dojo.Color([255, 0, 0]),
    0
  );
  system.setOutline(symbol);

  var graphic = new esri.Graphic(geo, system);
  graphic.setAttributes({
    id: num
  });
  MapControl.graphicLayers['gralyr2'].add(graphic);
  var txtSym = new esri.symbol.TextSymbol();
  txtSym.setAlign(esri.symbol.TextSymbol.ALIGN_MIDDLE);
  txtSym.setText(num);
  txtSym.setColor(new esri.Color(color)); //"#f7f7f7"
  txtSym.setOffset(X, Y);
  var font = new esri.symbol.Font();
  font.setSize('14px');
  font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
  font.setFamily('微软雅黑');
  txtSym.setFont(font);
  var graphic1 = new esri.Graphic(geo, txtSym);
  MapControl.graphicLayers['gralyr2'].add(graphic1);
};

//添加气球标注(X,Y)文字标注偏移量（默认可以认为是0,13）
MapControl.GetTxtSymbolsMarker = function (geo, num, X, Y, color) {
  var txtSym = new esri.symbol.TextSymbol();
  txtSym.setAlign(esri.symbol.TextSymbol.ALIGN_MIDDLE);
  txtSym.setText(num);
  txtSym.setColor(new esri.Color(color)); //"#f7f7f7"
  txtSym.setOffset(X, Y);
  var font = new esri.symbol.Font();
  font.setSize('14px');
  font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
  font.setFamily('微软雅黑');
  txtSym.setFont(font);
  var graphic1 = new esri.Graphic(geo, txtSym);
  MapControl.graphicLayers['gralyr2'].add(graphic1);
};

//添加气球标注(X,Y)文字标注偏移量（默认可以认为是0,13）
MapControl.GetTxtSymbols2Polygon = function (geo, num, X, Y, icon) {
  esriLoader.loadModules(
    ['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(([Point, Polyline, Polygon]) => {
    //MapControl.graphicLayers['gralyr1'].clear();
    let map = MapControl.map.mapbox;
    var symbol;
    var showExtent;
    if (geo) {
      switch (geo.type) {
        case 'point':
          geo = new Point(geo);
          var xMin = parseFloat(geo.x) + 50;
          var yMin = parseFloat(geo.y) + 50;
          var xMax = parseFloat(geo.x) + 50;
          var yMax = parseFloat(geo.y) + 50;
          showExtent = new esri.geometry.Extent(
            xMin,
            yMin,
            xMax,
            yMax,
            map.spatialReference
          );
          var symbol = new esri.symbol.SimpleMarkerSymbol(
            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
            10,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleLineSymbol.STYLE_CIRCLE,
              new dojo.Color([255, 87, 34, 5])
            ),
            new dojo.Color([255, 87, 34, 5.25])
          );
          break;
        case 'polyline':
          geo = new Polyline(geo);
          symbol = new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_DASH,
            new dojo.Color([255, 0, 0]),
            3
          );
          showExtent = geo.getExtent();
          break;
        case 'polygon':
          geo = new Polygon(geo);
          symbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleLineSymbol.STYLE_DASH,
              new dojo.Color([0, 125, 125]),
              3
            ),
            new dojo.Color([0, 87, 34, 0.15])
          );
          showExtent = geo.getExtent();
          break;
        case 'extent':
          geo = new Polygon(geo);
          symbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleLineSymbol.STYLE_DASH,
              new dojo.Color([255, 0, 0]),
              3
            ),
            new dojo.Color([0, 87, 34, 0.15])
          );
          showExtent = geo.getExtent();
          break;
      }
      if (showExtent != undefined) {
        var tempGra = new esri.Graphic(geo, symbol, null, null);
        MapControl.graphicLayers['gralyr2'].add(tempGra);
        let pointwkt = 'POINT ( ' + (showExtent.xmax + showExtent.xmin) / 2 + ' ' + (showExtent.ymax + showExtent.ymin) / 2 + ')';
        let point = MapControl.WktToAgs(pointwkt);
        if (icon == undefined) MapControl.GetTxtSymbols(point, num, X, Y, '#f7f7f7');
        else MapControl.GetTxtSymbolsMarker(point, num, X, Y, 'black');
      }
    }
  }).catch(err => {
    console.error(err);
  })
};

//通用添加Graphic到地图

/*   let obj = {
    geometry: geo,
    symbol: {
      type: '', //SimpleMarkerSymbol 或者 PictureMarkerSymbol
      image: 'marker.png', //图片名称，带文件后缀(类型为PictureMarkerSymbol)
      color: [255, 87, 34,5], //符号颜色,RGB值和透明度(SimpleMarkerSymbol)
      size: 10, //符号大小(SimpleMarkerSymbol)
      height: 23, //图片高度(类型为PictureMarkerSymbol)
      width: 30, //图片宽度(类型为PictureMarkerSymbol)
      style: 'dash'(虚线), 'solid'(实线)
    },
    isClear:false, //是否清除当前地图元素
    InfoTemplate:{}, //气泡元素(可选)
    attributes:{
      guid: '' //绘制对象的guid
    }, //元素属性(可选)
    layer: 'gralyr1'
  } */

MapControl.addGraphic = function ($graphic) {
  let map = MapControl.map.mapbox;
  let geometry = $graphic.geometry;
  let symbol = $graphic.symbol;
  switch (geometry.type) {
    case 'point':
      geometry = new esri.geometry.Point(geometry);
      if (symbol.type == 'SimpleMarkerSymbol') {
        symbol = new esri.symbol.SimpleMarkerSymbol(
          esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
          symbol.size,
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_CIRCLE,
            new dojo.Color(symbol.color)
          ),
          new dojo.Color(symbol.color)
        );
      } else if (symbol.type == 'PictureMarkerSymbol') {
        symbol = new esri.symbol.PictureMarkerSymbol(
          '../../../static/img/map/' + symbol.image,
          symbol.height,
          symbol.width
        );
      }
      break;
    case 'polyline':
      geometry = new esri.geometry.Polyline(geometry);
      if (symbol.style == 'dash') {
        symbol = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_DASH,
          new dojo.Color(symbol.color),
          symbol.size
        );
      } else if (symbol.style == 'solid') {
        symbol = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color(symbol.color),
          symbol.size
        );
      } else {
        symbol = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new dojo.Color(symbol.color),
          symbol.size
        );
      }
      break;
    case 'polygon':
      geometry = new esri.geometry.Polygon(geometry);
      symbol = new esri.symbol.SimpleFillSymbol(
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_DASH,
          new dojo.Color(symbol.dashcolor),
          symbol.size
        ),
        new dojo.Color(symbol.color)
      );
      break;
    case 'extent':
      geometry = new esri.geometry.Polygon(geometry);
      break;
  }
  let gra = new esri.Graphic(geometry, symbol, null, null);
  if ($graphic.isClear == true) {
    MapControl.setMapClear();
  }
  //MapControl.AddPop(gra, $graphic.InfoTemplate)
  MapControl.graphicLayers[$graphic.layer].add(gra);
};

//添加标注
MapControl.addLabel = function (point, content, R, G, B, layer) {
  // var pmsTextBg = new esri.symbol.PictureMarkerSymbol(
  //   tips,
  //   22,
  //   20
  // );
  // pmsTextBg.setOffset(0, 20);
  // var textLength = content.length;
  // pmsTextBg.setWidth(textLength * 20);
  // var bgGraphic = new esri.Graphic(point, pmsTextBg);
  // MapControl.graphicLayers['gralyr1'].add(bgGraphic);
  // var font = new esri.symbol.Font();
  // font.setSize('12pt');
  // font.setFamily('微软雅黑');
  // var text = new esri.symbol.TextSymbol(content);
  // text.setFont(font);
  // text.setColor(new dojo.Color([0, 0, 0, 255]));
  // text.setOffset(0, 15);
  // var labelGraphic = new esri.Graphic(point, text);

  var font = new esri.symbol.Font()
  font.setSize('9pt');
  font.setFamily('微软雅黑');
  font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
  var textSymbol = new esri.symbol.TextSymbol(
    content,
    font,
    new dojo.Color([R == undefined ? 255 : R, G == undefined ? 255 : G, B == undefined ? 255 : 0])
  );
  var labelPointGraphic = new esri.Graphic(point, textSymbol);
  MapControl.graphicLayers[layer == undefined ? 'gralyr2' : layer].add(labelPointGraphic);
};

//添加地图右键菜单
MapControl.MenuForGraphics = function () {
  esriLoader.loadModules(
    [
      'esri/map',
      'esri/geometry/Point',
      'esri/geometry/Polygon',
      'esri/toolbars/draw',
      'esri/toolbars/edit',
      'esri/symbols/SimpleMarkerSymbol',
      'esri/symbols/SimpleLineSymbol',
      'esri/symbols/SimpleFillSymbol',
      'esri/graphic',
      'esri/geometry/jsonUtils',
      'esri/Color',
      'dojo/parser',
      'dijit/Menu',
      'dijit/MenuItem',
      'dijit/MenuSeparator',
      'dijit/form/Button',
      'dijit/layout/BorderContainer',
      'dijit/layout/ContentPane',
      'dojo/domReady!'
    ]).then(
    ([
      Map,
      Point,
      Polygon,
      Draw,
      Edit,
      SimpleMarkerSymbol,
      SimpleLineSymbol,
      SimpleFillSymbol,
      Graphic,
      geometryJsonUtils,
      Color,
      parser,
      Menu,
      MenuItem,
      MenuSeparator
    ]) => {
      let map = MapControl.map.mapbox;
      let editbar = MapControl.editToolbar.mapbox;
      let ctxMenuForMap = new Menu({
        onOpen: function (box) {
          if (editbar) {
            editbar.deactivate();
          }
        }
      });
      MapControl.MenuForMap = ctxMenuForMap;
      ctxMenuForMap.startup();
      ctxMenuForMap.bindDomNode(map.container);
    }
  ).catch(err => {
    console.error(err);
  })
};

//添加气泡
MapControl.AddPop = function (graphic, template) {
  esriLoader.loadModules(
    [
      'esri/dijit/Popup',
      'esri/dijit/PopupTemplate',
      'esri/InfoTemplate',
      'dojo/dom-construct',
      'dojo/dom',
      'dojo/on',
      'dojo/domReady!'
    ]).then(
    ([Popup, PopupTemplate, InfoTemplate, domConstruct, dom, on, domAttr]) => {
      let map = MapControl.map.mapbox;
      var infoTemplate = new InfoTemplate();

      infoTemplate.setTitle('巡查人员');

      infoTemplate.setContent(template);

      graphic.setInfoTemplate(infoTemplate);
    }
  ).catch(err => {
    console.error(err);
  })
};
//支持多个气泡显示
MapControl.CreatGraphicsLayerWithMTip = function (
  info,
  func,
  ctemplate,
  cGraphicslayer
) {
  esriLoader.loadModules(
    [
      'esri/dijit/Popup',
      'esri/layers/graphics',
      'esri/dijit/PopupTemplate',
      'esri/InfoTemplate',
      'ncam/PopupExtended',
      'esri/graphic',
      'esri/geometry/Point',
      'esri/symbols/SimpleMarkerSymbol',
      'dojo/dom-construct',
      'dojo/_base/lang',
      'dojo/dom',
      'dojo/on',
      'dojo/domReady!'
    ]).then(
    ([
      Popup,
      GraphicsLayer,
      PopupTemplate,
      InfoTemplate,
      PopupExtended,
      Graphic,
      Point,
      SimpleMarkerSymbol,
      domConstruct,
      lang,
      dom,
      on,
      domAttr
    ]) => {
      let map = MapControl.map.mapbox;
      let data = info;
      var customGraphics = map.getLayer('customGraphics');
      if (customGraphics) {
        map.removeLayer(customGraphics);
      }
      if (!cGraphicslayer) {
        cGraphicslayer = new esri.layers.GraphicsLayer({
          id: 'customGraphics'
        });
        map.addLayer(cGraphicslayer);
        for (var i = 0, len = data.length; i < len; i++) {
          var d = data[i];
          var p = new Point(d.x, d.y, map.spatialReference);
          var symbol = new esri.symbol.PictureMarkerSymbol(
            '../../../static/img/map/' + data[i].gra.symbol.image,
            data[i].gra.symbol.width,
            data[i].gra.symbol.height
          );
          var graphic = new Graphic(p, symbol, lang.clone(d), null);
          var t_actions = [];
          for (var j = 0; j < func.length; j++) {
            var $func = func[j].funcname;
            t_actions.push({
              text: func[j].text,
              className: func[j].className,
              title: func[j].title,
              click: function (feature) {
                $func(feature);
              }
            });
          }
          var template = new PopupTemplate({
            title: ctemplate.title,
            fieldInfos: ctemplate.fieldInfos,
            extended: {
              actions: t_actions
            }
          });
          graphic.setInfoTemplate(template);
          graphic.infoTemplate.setContent(ctemplate.content);
          cGraphicslayer.add(graphic);
        }
      }

      var extendedPopup = new PopupExtended({
          extended: {
            themeClass: 'light',
            draggable: false,
            defaultWidth: 100,
            hideOnOffClick: true,
            multiple: true,
            smallStyleWidthBreak: 768
          },
          highlight: true,
          titleInBody: true
        },
        dojo.create('div')
      );
      extendedPopup.setMap(map);
      map.infoWindow = extendedPopup;
      for (var i = 0; i < cGraphicslayer.graphics.length; i++) {
        var d = cGraphicslayer.graphics[i];
        var loc = map.toScreen(d.geometry);
        map.infoWindow.setFeatures([cGraphicslayer.graphics[i]]);
        map.infoWindow.show(loc);
      }
    }
  ).catch(err => {
    console.error(err);
  })
};

MapControl.closePopups = function () {
  let map = MapControl.map.mapbox;
  var tempLength = map.infoWindow.openPopups.length;
  for (var i = 0; i < tempLength; i++) {
    map.infoWindow.openPopups[i].hide();
  }
};

//多面融合成mutlipolygon或者mutlilinestring
MapControl.mergemultipolygon = function (geometrystr) {
  if (geometrystr) {
    let value = 'MULTIPOLYGON (';
    geometrystr.forEach(data => {
      if (data.geostr.indexOf('LINESTRING') > -1) {
        value += data.geostr.replace('MULTILINESTRING  ', '').replace('LINESTRING  ', '').replace('((', '(').replace('))', ')') + ',';
        value = value.replace('MULTIPOLYGON', 'MULTILINESTRING').replace('( (', '((');
      } else
        value +=
        data.geostr
        .replace('MULTIPOLYGON ', '')
        .replace('POLYGON ', '')
        .replace('(((', '((')
        .replace(')))', '))') + ',';
    });
    if (value.lastIndexOf(',') == value.length - 1) {
      value = value.substring(0, value.length - 1);
    }
    value += ')';
    return value;
  } else return '';
};

//多面融合成polygon或者mutlilinestring
MapControl.mergepolygon = function (geometrystr) {
  if (geometrystr) {
    let value = 'POLYGON (';
    geometrystr.forEach(data => {
      if (data.geostr.indexOf('POLYLINE') > -1) {
        value += data.geostr.replace('POLYLINE (', '').replace('))', ')') + ',';
        value = value.replace('POLYGON', 'POLYLINE');
      } else
        value += data.geostr.replace('POLYGON (', '').replace('))', ')') + ',';
    });
    if (value.lastIndexOf(',') == value.length - 1) {
      value = value.substring(0, value.length - 1);
    }
    value += ')';
    return value;
  } else return '';
};

//绘制缓冲半径
MapControl.ShowGeometryBuffer = function (geom, buffer) {
  var distance = buffer;
  var map = MapControl.map.mapbox;
  esriLoader.loadModules(
    [
      'esri/tasks/BufferParameters',
      'esri/SpatialReference',
      'esri/tasks/GeometryService',
      'esri/geometry/Point',
      'esri/geometry/Polyline',
      'esri/geometry/Polygon'
    ]).then(([

    BufferParameters,
    SpatialReference,
    GeometryService,
    Point,
    Polyline,
    Polygon
  ]) => {
    var geometryService = new GeometryService(mapconfig.GeometryService);
    var params = new BufferParameters();
    if (geom.type == 'point') {
      geom = new Point(geom);
    } else if (geom.type == 'polyline') {
      geom = new Polyline(geom);
    } else if (geom.type == 'polygon') {
      geom = new Polygon(geom);
    }
    params.geometries = [geom];
    params.distances = [distance];
    params.unit = GeometryService.UNIT_METER;
    params.outSpatialReference = map.spatialReference;
    geometryService.buffer(params, function (results) {
      var symbol = new esri.symbol.SimpleFillSymbol(
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_DASH,
          new dojo.Color([255, 0, 0]),
          3
        ),
        new dojo.Color([0, 0, 0, 0.15])
      );
      var graphic = new esri.Graphic(results[0], symbol);
      MapControl.graphicLayers['gralyr2'].add(graphic);
      var polygon = MapControl.AgsToWkt(results[0]);
      return polygon;
      // var showExtent = new Polygon(results[0]);
      // var Extent = showExtent.getExtent();
      // map.setExtent(Extent);
    });
  }).catch(err => {
    console.error(err);
  })
};

//自定义弹出窗口
MapControl.showInfoWindow = function (mpcenter, listdata, contents) {
  esriLoader.loadModules(["esri/dijit/Popup",
    "esri/layers/graphics",
    "esri/dijit/InfoWindow",
    "esri/graphic",
    "esri/geometry/Point",
    "esri/InfoTemplate",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/on",
    "dojo/domReady!"
  ]).then(([Popup, graphics, InfoWinow, graphic, Point, InfoTemplate, SimpleFillSymbol, SimpleLineSymbol, Color,
    domConstruct, dom, on, domAttr
  ]) => {
    let map = MapControl.map.mapbox;

    // var highlightSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
    //   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    //     new Color([255, 0, 0]), 1),
    //   new Color([125, 125, 125, 0.35]));
    // var t = "<b>面积: </b>${面积:NumberFormat}平方公里<br/>" + "<b>管控级别: </b>${主体功能}<br/>" + "<b>补偿金额: </b>${补偿金额}万元<br/>" + "<b>红线类型: </b>${类型:NumberFormat}<br/>"+ "<b>责任主体: </b>${区属}政府<br/>"+
    // "<div style='display:block;float:left;margin-right:29px;'></div>"+
    // "<div style='display:block;float:right;'><a href='##' onclick='redLine_zyfx_Click(\""+evt.graphic.attributes.名称+"\")' >建设现状</a><i>|</i><a href='##' onclick='shouslfjqpage_hx()'>资金使用情况</a></div>";
    // var t = "<b>面积: </b>${面积:NumberFormat}平方公里<br/>";<sup class="ivu-badge-count ivu-badge-count-alone" style="box-shadow: 0 0 0 1px transparent;background: transparent;cursor: pointer;" onclick="closePop()">X</sup>
    map.infoWindow.setTitle('详情');
    if (contents && contents != '') {

      map.infoWindow.setContent(contents);
    } else {
      // var content = '<div style="color:#333"><p style="color:#fff;position: relative;top: -5px;">详情</p><span class="ivu-badge" style="position: absolute;top:2px;right: 12px; " > <i data-v-394040b0="" class="ivu-icon ivu-icon-ios-close-empty" style="font-size: 26px;color:#FFF;cursor: pointer;"  onclick="closePop()"></i></span>';
      var content = '<div style="background-color: #fff;overflow:auto;"><table  cellpadding="0" cellspacing="0" border="0"><tbody>'
      if (listdata && listdata.length > 0) {
        for (var i = 0; i < listdata.length; i++) {
          if (listdata[i].name.toLowerCase() == "objectid") {
            content += '<tr style="height:25px; white-space: wrap;overflow: hidden;border:1px solid #f1f1f1;display: none;"></tr>'
          } else {
            content += '<tr style="height:25px; white-space: wrap;overflow: hidden;border:1px solid #f1f1f1;"><td style="border-right:1px solid #f1f1f1;border-bottom:1px solid #f1f1f1;"><div style="width:80px;white-space: initial;font-weight: 600;padding-left: 5px">' + listdata[i].name + '</div></td>'
            content += '<td style="border-right:1px solid #f1f1f1;border-bottom:1px solid #f1f1f1;"> <div style="overflow: hidden;white-space: wrap;text-overflow: ellipsis;padding-left:5px">' + listdata[i].value + '</div></td></tr>'
          }

          // content += "<b>" + listdata[i].name + ": </b>" + listdata[i].value + "<br/>";
        }
      }
      content += "</tbody></table>"
      content += "</div></div>"
      // dojo.string.substitute(),可以处理通配符形式
      // var highlightGraphic = new esri.Graphic(evt.graphic.geometry, highlightSymbol);
      // var obj = new Object();
      // obj.GETTYPE = 'HX';
      // highlightGraphic.setAttributes(obj);
      // map.graphics.add(highlightGraphic); // 将图标加入图形中

      //map.infoWindow.setTitle('详情');
      map.infoWindow.setContent(content);
    }
    //alert(mpcenter.x+","+mpcenter.y);
    var cPoint = new esri.geometry.Point(mpcenter.x, mpcenter.y, map.spatialReference);
    var loc = map.toScreen(cPoint);
    map.infoWindow.show(cPoint);
    map.centerAt(cPoint);
    //map.centerAndZoom(cPoint,7);
    //setTimeout(function(){

    //},200)

    var x = document.getElementsByName('hlmonitoringTab');
    if (x.length > 0) {
      for (var i = 0; i < x.length; i++) {
        var obj = x[i];
        x[i].onclick = function (obj) {

          var z = document.getElementsByName('hlmonitoringTab');
          for (var j = 0; j < z.length; j++) {
            z[j].className = "ivu-tabs-tab";
          }
          obj.currentTarget.className = "ivu-tabs-tab ivu-tabs-tab-active ivu-tabs-tab-focused";

          var pid = obj.currentTarget.attributes.tab.value;
          var tabs = ["tab1", "tab2"];
          for (var j = 0; j < 2; j++) {
            if (tabs[j] == pid) {
              document.getElementById(tabs[j]).style.display = "block";
            } else {
              document.getElementById(tabs[j]).style.display = "none";
            }
          }
        }
      }
    }

    window.closePop = function () {
      map.infoWindow.hide()
      MapControl.setMapClear(1)
    }
  }).catch(err => {
    console.error(err);
  })
}

function openSheet(name) {
  let url =
    mapconfig.webip + "jbgh/sheetjs/sheet.html#" + name;
  let iWidth = 1150; //弹出窗口的宽度;
  let iHeight = 650; //弹出窗口的高度;
  let iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
  let iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
  window.open(
    url,
    "newwindow",
    "height=" +
    iHeight +
    ", width=" +
    iWidth +
    ", top=" +
    iTop +
    ", left=" +
    iLeft +
    ", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
  );
}

//自定义弹出窗口
MapControl._showInfoWindow = function (mpcenter, listdata, contents) {
  esriLoader.loadModules(["esri/dijit/Popup",
    "esri/layers/graphics",
    "esri/dijit/InfoWindow",
    "esri/graphic",
    "esri/geometry/Point",
    "esri/InfoTemplate",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/on",
    "dojo/domReady!"
  ]).then(([Popup, graphics, InfoWinow, graphic, Point, InfoTemplate, SimpleFillSymbol, SimpleLineSymbol, Color,
    domConstruct, dom, on, domAttr
  ]) => {
    let map = MapControl.map.mapbox;
    map.infoWindow.setTitle('详情');
    if (contents && contents != '') {
      map.infoWindow.setContent(contents);
    } else {
      var content = '<div style="background-color: #fff;overflow:auto;"><table  cellpadding="0" cellspacing="0" border="0"><tbody>'
      if (listdata && listdata.length > 0) {
        for (var i = 0; i < listdata.length; i++) {
          if (listdata[i].name.toLowerCase() == "objectid") {
            content += '<tr style="height:25px; white-space: wrap;overflow: hidden;border:1px solid #f1f1f1;display: none;"></tr>'
          } else if (listdata[i].name == '项目名称') {
            content += '<tr style="height:25px; white-space: wrap;overflow: hidden;border:1px solid #f1f1f1;"><td style="border-right:1px solid #f1f1f1;border-bottom:1px solid #f1f1f1;"><div style="width:80px;white-space: initial;font-weight: 600;padding-left: 5px">' + listdata[i].name + '</div></td>'
            content += '<td style="border-right:1px solid #f1f1f1;border-bottom:1px solid #f1f1f1;"> <div style="overflow: hidden;white-space: wrap;text-overflow: ellipsis;padding-left:5px"><a href="javacript:void(0);" id="Sheet0" value="">' + listdata[i].value + '</a></div></td></tr>'
          } else {
            content += '<tr style="height:25px; white-space: wrap;overflow: hidden;border:1px solid #f1f1f1;"><td style="border-right:1px solid #f1f1f1;border-bottom:1px solid #f1f1f1;"><div style="width:80px;white-space: initial;font-weight: 600;padding-left: 5px">' + listdata[i].name + '</div></td>'
            content += '<td style="border-right:1px solid #f1f1f1;border-bottom:1px solid #f1f1f1;"> <div style="overflow: hidden;white-space: wrap;text-overflow: ellipsis;padding-left:5px">' + listdata[i].value + '</div></td></tr>'
          }
        }
      }
      content += "</tbody></table>"
      content += "</div></div>"
      map.infoWindow.setContent(content);
      window.jQuery('#Sheet0').click((ele) => {
        let url =
          mapconfig.webip + "jbgh/sheetjs/sheet.html#" + ele.toElement.innerText;
        let iWidth = 1150; //弹出窗口的宽度;
        let iHeight = 650; //弹出窗口的高度;
        let iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
        let iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
        window.open(
          url,
          ele.toElement.innerText + "项目扫尾一表清",
          "height=" +
          iHeight +
          ", width=" +
          iWidth +
          ", top=" +
          iTop +
          ", left=" +
          iLeft +
          ", toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
        );
      })
    }
    var cPoint = new esri.geometry.Point(mpcenter.x, mpcenter.y, map.spatialReference);
    var loc = map.toScreen(cPoint);
    map.infoWindow.show(cPoint);
    map.centerAt(cPoint);
    var x = document.getElementsByName('hlmonitoringTab');
    if (x.length > 0) {
      for (var i = 0; i < x.length; i++) {
        var obj = x[i];
        x[i].onclick = function (obj) {

          var z = document.getElementsByName('hlmonitoringTab');
          for (var j = 0; j < z.length; j++) {
            z[j].className = "ivu-tabs-tab";
          }
          obj.currentTarget.className = "ivu-tabs-tab ivu-tabs-tab-active ivu-tabs-tab-focused";

          var pid = obj.currentTarget.attributes.tab.value;
          var tabs = ["tab1", "tab2"];
          for (var j = 0; j < 2; j++) {
            if (tabs[j] == pid) {
              document.getElementById(tabs[j]).style.display = "block";
            } else {
              document.getElementById(tabs[j]).style.display = "none";
            }
          }
        }
      }
    }
    window.closePop = function () {
      map.infoWindow.hide()
      MapControl.setMapClear(1)
    }
  }).catch(err => {
    console.error(err);
  })
}
//根据地图比例尺计算容差值返回范围面
MapControl.identify = function (isremove) {
  if (MapControl.identifyHandler) MapControl.identifyHandler.remove();
  esriLoader.loadModules(
    ['esri/geometry/scaleUtils']).then((
    [scaleUtils]) => {
    const map = MapControl.map.mapbox;
    const scale = scaleUtils.getScale(map);
    const PPI = 96
    let Resolution = scale / (PPI / 0.0254)
    MapControl.identifyHandler = map.on("click", function (geo) {
      let x = geo.mapPoint.x
      let y = geo.mapPoint.y
      let xmin = x - Resolution * 10 //如果加载地图是经纬度，把 Resolution * 10 替换位 0.000005
      let xmax = x + Resolution * 10
      let ymin = y - Resolution * 10
      let ymax = y + Resolution * 10
      let geom = 'POLYGON ((' + xmin + ' ' + ymin + ',' + xmax + ' ' + ymin + ',' + xmax + ' ' + ymax + ',' + xmin + ' ' + ymax + ',' + xmin + ' ' + ymin + '))';
      if (isremove == undefined) MapControl.identifyHandler.remove()
      bus.$emit('identify', geom);
    });
  }).catch(err => {
    console.error(err);
  })
};

MapControl.multipolygonExtent = function (geolist) {
  var maxX = 0,
    maxY = 0,
    minX = 0,
    minY = 0;
  for (let i = 0; i < geolist.length; i++) {
    let geom = MapControl.WktToAgs(geolist[i].geostr);
    let event = geom.getExtent();
    if (i == 0) {
      maxX = parseFloat(event.xmax);
      maxY = parseFloat(event.ymax);
      minX = parseFloat(event.xmin);
      minY = parseFloat(event.ymin);
    }
    if (maxX < parseFloat(event.xmax)) {
      maxX = parseFloat(event.xmax);
    }
    if (maxY < parseFloat(event.ymax)) {
      maxY = parseFloat(event.ymax);
    }
    if (minX > parseFloat(event.xmin)) {
      minX = parseFloat(event.xmin);
    }
    if (minY > parseFloat(event.ymin)) {
      minY = parseFloat(event.ymin);
    }
  }
  if (geolist.length > 0) {
    let map = MapControl.map.mapbox;
    var xMin = parseFloat(minX) - 300;
    var yMin = parseFloat(minY) - 300;
    var xMax = parseFloat(maxX) + 300;
    var yMax = parseFloat(maxY) + 300;
    var showExtent = new esri.geometry.Extent(
      xMin,
      yMin,
      xMax,
      yMax,
      map.spatialReference
    );
    map.setExtent(showExtent.expand(1.5));
  }
};


//根据地图比例尺计算容差值返回点坐标
MapControl.identifypoint = function () {
  esriLoader.loadModules(
      ['esri/geometry/scaleUtils']).then(
      ([scaleUtils]) => {
        const map = MapControl.map.mapbox;
        const scale = scaleUtils.getScale(map);
        const PPI = 96
        let Resolution = scale / (PPI / 0.0254)
        MapControl.identifyHandler = map.on("click", function (geo) {
          let x = geo.mapPoint.x
          let y = geo.mapPoint.y
          let geom = 'POINT  ( ' + x + ' ' + y + ')';
          MapControl.identifyHandler.remove()
          bus.$emit('identifypoint', geom);
        });
      }
    )
    .catch(err => {
      console.error(err);
    })
};

//拾取已加载的所有服务
MapControl.identifyAllServices = function (_this) {
  MapControl.setMapClear();
  MapControl.identifyHandlerRemove();
  esriLoader
    .loadModules([
      "esri/tasks/IdentifyTask",
      "esri/tasks/IdentifyParameters"
    ])
    .then(([IdentifyTask, IdentifyParameters]) => {
      let map = MapControl.map.mapbox;
      var identifyParams = new esri.tasks.IdentifyParameters();
      _this.$store.state.identifyvalue = [];
      MapControl.identifyHandler = map.on("click", function (geo) {
        identifyParams.tolerance = 1;
        identifyParams.returnGeometry = true;
        identifyParams.layerOption =
          esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
        identifyParams.geometry = geo.mapPoint;
        identifyParams.mapExtent = map.extent;
        let serviceslist = map.layerIds;
        for (let i = 1; i < serviceslist.length; i++) {
          new esri.tasks.IdentifyTask(serviceslist[i]).execute(identifyParams, function (results) {
            bus.$emit("identifyAllServices", results);
            if (results.length != 0) {
              _this.$store.state.identifyvalue = results;
              _this.$parent.$router.replace({
                name: 'idenfity',
                params: {
                  name: 'idenfity',
                  menuname: '查询结果'
                }
              });
              _this.$parent.title_name = '查询结果';
            }
          });
        }
      });
    })
    .catch(err => {
      console.error(err);
    });
};

MapControl.addToolTip = function (infoTem, point) {
  esriLoader.loadModules(["esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/Font",
    "esri/symbols/TextSymbol",
    "esri/geometry/Point",
    "esri/graphic",
    "dojo/_base/Color",
    "dojo/dom",
    "dojo/on",
    "dojo/domReady!"
  ]).then(([SimpleLineSymbol, SimpleMarkerSymbol, SimpleFillSymbol, Font, TextSymbol, Point, Graphic, Color, dom, on]) => {
    MapControl.graphicLayers['gralyr1'].clear();
    var fontsize = 14;
    var radius = 6;
    infoTem = infoTem + "";

    var bglineSymbol = new SimpleLineSymbol("solid", new Color([17, 91, 122, 1]), 1);
    var width = (MapControl.chkstrlen(infoTem)) * 0.6 * (fontsize + 1);
    var height = fontsize * 1.6;

    //设置背景框的大小
    var path = "M0" + " " + radius + "L0" + " " + (height - radius) + "Q0" + " " + height + " " + radius + " " + height + "L" + (width - radius) + " " + height + "Q" + width + " " + height + " " + width + " " + (height - radius) + "L" + width + " " + radius + "Q" + width + " " + "0" + " " + (width - radius) + " " + "0L" + radius + " " + "0Q0" + " " + "0" + " " + "0" + " " + radius;
    var bgSymbol = new SimpleMarkerSymbol();
    bgSymbol.setPath(path);
    bgSymbol.setColor(new Color([17, 91, 122, 0.7]));
    bgSymbol.setOutline(bglineSymbol);

    var size = Math.max(height, width);
    bgSymbol.setSize(size);
    bgSymbol.xoffset = 60;
    bgSymbol.yoffset = 0;
    var bgGraphic = new Graphic(point, bgSymbol);
    MapControl.graphicLayers['gralyr1'].add(bgGraphic);

    var font = new Font(fontsize + "px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_LIGHTER);
    var textSymbol = new TextSymbol(infoTem, font.setWeight(Font.WEIGHT_BOLD), new Color([122, 122, 122, 1]));
    textSymbol.setOffset(60, -5);
    textSymbol.setColor(new Color([255, 255, 255, 0.7]));
    var tempGra = new Graphic(point, textSymbol, null, null);
    MapControl.graphicLayers['gralyr1'].add(tempGra);

    // var txtColor = '#f7f7f7',
    //   sysColor = '#03a1e2';
    // var fontsize = 14;
    // var radius = 6;
    // var infoTem = item.czfs;
    // var width = (MapControl.chkstrlen(infoTem)) * 0.5 * (fontsize + 1) - 10;
    // var height = fontsize * 1.6;

    // var path = "M0" + " " + radius + "L0" + " " + (height - radius) + "Q0" + " " + height + " " + radius + " " + height + "L" + (width - radius) + " " + height + "Q" + width + " " + height + " " + width + " " + (height - radius) + "L" + width + " " + radius + "Q" + width + " " + "0" + " " + (width - radius) + " " + "0L" + radius + " " + "0Q0" + " " + "0" + " " + "0" + " " + radius;
    // var bgSymbol = new esri.symbol.SimpleMarkerSymbol();
    // bgSymbol.setPath(path);
    // bgSymbol.setColor(new esri.Color(sysColor));
    // bgSymbol.setSize(Math.max(height, width));
    // bgSymbol.setOffset(0, 20);

    // var bgGraphic = new esri.Graphic(wkt, bgSymbol);
    // MapControl.graphicLayers['gralyr3'].add(bgGraphic);

    // var txtSym = new esri.symbol.TextSymbol();
    // txtSym.setAlign(esri.symbol.TextSymbol.ALIGN_MIDDLE);
    // txtSym.setText(infoTem);
    // txtSym.setColor(new esri.Color(txtColor));
    // txtSym.setOffset(0, 16);

    // var font = new esri.symbol.Font();
    // font.setSize('12px');
    // font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
    // font.setFamily('微软雅黑');
    // txtSym.setFont(font);
    // txtSym.setOffset(0, 16); //字体偏移

    // var graphic1 = new esri.Graphic(wkt, txtSym);
    // // graphic1.setAttributes(item);
    // MapControl.graphicLayers['gralyr3'].add(graphic1);
  });
};

//获取包含汉字字符串长度
MapControl.chkstrlen = function (str) {
  var strlen = 0;
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
      strlen += 2;
    else
      strlen++;
  }
  return strlen;
}
