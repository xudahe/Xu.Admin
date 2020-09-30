/**
 * 地图管理
 */

import esriLoader from 'esri-loader';
import bus from '../../../eventBus.js'
import * as transformUtils from './mapTran'
import mapconfig from './mapconfig'
export const MapControl = {};

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

MapControl.mapId = 'mapbox';

// identify点击事件
var identifyHandler;

/**
 * 地图绘制事件
 */
MapControl.drawToolbar = {};
var MouseMoveEventHandler
var doSpaceDrawEventHandler;
var doAttMapDrawEventHandler;
/**
 * 地图点击事件
 */
var domapOnclickEventHandler;

var centerPoint;
var DymcMapHids = [];
// 关闭图层
MapControl.hiddDymcMapHidden = function() {
    if (DymcMapHids) {
        for (let d in DymcMapHids) {
            if (DymcMapHids[d]) {
                DymcMapHids[d].setVisibility(false)
            }
        }
        DymcMapHids.length = 0;
    }
}
// 打开某个图层
MapControl.showDymcMap = function(serverid) {
        if (serverid) {
            let map = MapControl.map[MapControl.mapId];
            if (map) {
                var tesmserv = map.getLayer(serverid)
                if (tesmserv) {
                    tesmserv.setVisibility(true)
                    DymcMapHids.push(tesmserv);
                }
            }
        }
    }
    /**
     * 设置初始化地图全图
     * @param mapId
     */
MapControl.setMapFull = function() {
    let map = MapControl.map[MapControl.mapId];
    let extent = mapconfig.extent;

    esriLoader.loadModules(['esri/map', 'esri/geometry/Extent', 'esri/toolbars/navigation']).then(([Map, Extent]) => {
        let mapExtent = new esri.geometry.Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, map.spatialReference);
        map.setExtent(mapExtent);

        var navToolbar = MapControl.navToolbar.mapbox;
        navToolbar.deactivate();
    });
};

MapControl.RefreshExtend = function() {
    let map = MapControl.map[MapControl.mapId];
    //  let cPoint = map.extent.getCenter();
    let extent = map.extent;
    let mapExtent = new esri.geometry.Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, map.spatialReference);
    map.setExtent(mapExtent);
    // map.centerAt(cPoint);
    // esriLoader.loadModules(['esri/map', 'esri/geometry/Extent', 'esri/toolbars/navigation']).then(([Map, Extent]) => {


    //   // var navToolbar = MapControl.navToolbar.mapbox;
    //   // navToolbar.deactivate();
    // });
};

/**
 * 地图放大
 * @param mapId
 */
MapControl.setMapZoomIn = function() {
    esriLoader.loadModules(['esri/map', 'esri/toolbars/navigation', ]).then(([Map, Navigation]) => {
        var navToolbar = MapControl.navToolbar.mapbox;
        navToolbar.activate(esri.toolbars.Navigation.ZOOM_IN);
    });
};

/**
 * 地图缩小
 * @param mapId
 */
MapControl.setMapZoomOut = function() {
    esriLoader.loadModules(['esri/map', 'esri/toolbars/navigation', ]).then(([Map, Navigation]) => {
        var navToolbar = MapControl.navToolbar.mapbox;
        navToolbar.activate(esri.toolbars.Navigation.ZOOM_OUT);
    });
};

/**
 * 地图漫游
 * @param mapId
 */
MapControl.setMapPan = function() {
    esriLoader.loadModules(['esri/map', 'esri/toolbars/navigation', ]).then(([Map, Navigation]) => {
        var navToolbar = MapControl.navToolbar.mapbox;
        navToolbar.activate(esri.toolbars.Navigation.PAN);
    });
};


MapControl.UninstallLayerload = function(uservisibleLayers) {
    esriLoader.loadModules(['esri/map', 'esri/layers/ArcGISTiledMapServiceLayer', ]).then(([Map, ArcGISTiledMapServiceLayer]) => {
        let map = MapControl.map[MapControl.mapId];
        if (!uservisibleLayers) return;
        uservisibleLayers.forEach(element => {
            var sublay = map.getLayer(element.id);
            if (sublay) {
                map.removeLayer(sublay); //移除图层
            }
        });
    })

};

/**
 * 清除
 * @param mapId
 */
MapControl.setMapClear = function(value) {
    let map = MapControl.map[MapControl.mapId];
    if (value != undefined) {
        if (value == 1) {
            if (MapControl.graphicLayers['gralyr2'])
                MapControl.graphicLayers['gralyr2'].clear();
            if (MapControl.graphicLayers['gralyr3'])
                MapControl.graphicLayers['gralyr3'].clear();
            if (map.getLayer("lineLayer") != undefined) {
                map.getLayer("lineLayer").clear();
            }
            if (map.getLayer("carLayer") != undefined) {
                map.getLayer("carLayer").clear();
            }
        } else if (value != 2) {
            if (MapControl.graphicLayers['gralyr4'])
                MapControl.graphicLayers['gralyr4'].clear();
            if (map.getLayer("lineLayer") != undefined) {
                map.getLayer("lineLayer").clear();
            }
            if (map.getLayer("carLayer") != undefined) {
                map.getLayer("carLayer").clear();
            }
        } else if (value == 2) {
            if (MapControl.graphicLayers['gralyr3'])
                MapControl.graphicLayers['gralyr3'].clear();
            if (MapControl.graphicLayers['gralyr4'])
                MapControl.graphicLayers['gralyr4'].clear();
            if (map.getLayer("lineLayer") != undefined) {
                map.getLayer("lineLayer").clear();
            }
            if (map.getLayer("carLayer") != undefined) {
                map.getLayer("carLayer").clear();
            }
        }
    } else {
        if (MapControl.graphicLayers['gralyr4'] != undefined) {
            MapControl.graphicLayers['gralyr4'].clear();
        }
        if (MapControl.graphicLayers['gralyr1'] != undefined) {
            MapControl.graphicLayers['gralyr1'].clear();
            MapControl.graphicLayers['gralyr2'].clear();
            MapControl.graphicLayers['gralyr3'].clear();
            MapControl.graphicLayers['gralyr5'].clear();
        }
        if (map.getLayer("lineLayer") != undefined) {
            map.getLayer("lineLayer").clear();
        }
        if (map.getLayer("carLayer") != undefined) {
            map.getLayer("carLayer").clear();
        }
    }

    if (MapControl.map[MapControl.mapId] && MapControl.map[MapControl.mapId].graphics != undefined) {
        MapControl.map[MapControl.mapId].graphics.clear();
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
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
    if (toolbar) {
        toolbar.deactivate();
    }
    let editbar = MapControl.editToolbar.mapbox;
    if (editbar) {
        editbar.deactivate();
    }
    if (map) {

        map.infoWindow.hide();
    }
};
//定位
MapControl.PointTo = function(x, y) {
        esriLoader.loadModules(['esri/map', 'esri/geometry/Point']).then(([Map, Point]) => {
            let map = MapControl.map[MapControl.mapId];
            // var xMin = parseFloat(x) - 0.005;
            // var yMin = parseFloat(y) - 0.005;
            // var xMax = parseFloat(x) + 0.005;
            // var yMax = parseFloat(y) + 0.005;
            // var showExtent = new esri.geometry.Extent(xMin, yMin, xMax, yMax, map.spatialReference);
            // map.setExtent(showExtent.expand(0.1));
            map.centerAndZoom(new Point(x, y), 7);

        })

    }
    /**
     *加载服务
     *@param mapId item
     */
MapControl.addservice = function(item) {
    let map = MapControl.map[MapControl.mapId];
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
        if (curLyr)
            map.removeLayer(curLyr);
    }

    bus.$emit('refreshlyr');
};

/**
 *获取地图服务
 */
MapControl.GetMapLayers = function() {
    let map = MapControl.map[MapControl.mapId];
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
MapControl.changeLayer = function(allcount, item, oldIndex, newIndex) {
    let map = MapControl.map[MapControl.mapId];
    var selLyr = map.getLayer(item.SERVICENAME);
    if (selLyr) {
        var mapindex = allcount - newIndex;
        map.reorderLayer(selLyr, mapindex);
    }

    //alert(map.layerIds);
};

/**
 *地图高亮显示
 */
MapControl.showGraphic = function(geo, isshowExtent, gralyr,areaType) {
    esriLoader.loadModules(['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(([Point, Polyline, Polygon]) => {
        let map = MapControl.map[MapControl.mapId];
        var symbol;
        var showExtent;
        switch (geo.type) {
            case 'point':
                geo = new Point(geo);
                var xMin = parseFloat(geo.x) - 50;
                var yMin = parseFloat(geo.y) - 50;
                var xMax = parseFloat(geo.x) + 50;
                var yMax = parseFloat(geo.y) + 50;
                showExtent = new esri.geometry.Extent(xMin, yMin, xMax, yMax, map.spatialReference);
                var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_CIRCLE, new dojo.Color([255, 87, 34, 5])), new dojo.Color([255, 87, 34, 5.25]));
                break;
            case 'polyline':
                geo = new Polyline(geo);
                symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 255, 255]), 3);
				var xMin = parseFloat(geo.x) - 50;
				var yMin = parseFloat(geo.y) - 50;
				var xMax = parseFloat(geo.x) + 50;
				var yMax = parseFloat(geo.y) + 50;
				showExtent = new esri.geometry.Extent(xMin, yMin, xMax, yMax, map.spatialReference);
                break;
            case 'polygon':
                geo = new Polygon(geo);
				if(areaType==1){
					symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([0, 255, 255]), 3), new dojo.Color([0, 0, 0, 0]));
				}else{
					symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([0, 255, 255]), 3), new dojo.Color([0, 0, 0, 0.35]));
				}
                
                showExtent = geo.getExtent();
                break;
            case 'extent':
                geo = new Polygon(geo);
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([0, 255, 255]), 3), new dojo.Color([0, 0, 0, 0.35]));
                showExtent = geo.getExtent();
                break;
        }
        if (showExtent != undefined) {
            var tempGra = new esri.Graphic(geo, symbol, null, null);
            MapControl.graphicLayers[gralyr == undefined ? 'gralyr1' : gralyr].add(tempGra);
			if (isshowExtent == undefined)
                map.setExtent(showExtent.expand(0));
        }
    });
};



/**
 * Geometry高亮显示
 */
MapControl.showGeometry = function(geo, isshowExtent, gralyr, color, clear, size, att, extent, name,outline,bgcolor) {
    //outline 小圆点外边框 1 显示 0不显示
    esriLoader.loadModules(['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(([Point, Polyline, Polygon]) => {

        if (clear == undefined) MapControl.graphicLayers[gralyr == undefined ? 'gralyr3' : gralyr].clear();
        let map = MapControl.map[MapControl.mapId];
        var symbol;
        var showExtent;
        if(geo.type != undefined && geo.type != ''){
            switch (geo.type) {
                case 'point':
                    geo = new Point(geo);
                    var xMin = parseFloat(geo.x) - 30;
                    var yMin = parseFloat(geo.y) - 30;
                    var xMax = parseFloat(geo.x) + 30;
                    var yMax = parseFloat(geo.y) + 30;
                    showExtent = new esri.geometry.Extent(xMin, yMin, xMax, yMax, map.spatialReference);
					// showExtent = geo.getExtent();
                    var symbol=null;
                    symbol= new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, size == undefined ? 15 : size, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_CIRCLE, new dojo.Color(color == undefined ? [0, 255, 0, 5] : color)), new dojo.Color(color == undefined ? [0, 255, 0, 5.25] : color));
                    if(outline==0){
                        //去掉小圆点外边框
                        symbol= new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, size == undefined ? 15 : size, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL, new dojo.Color(color == undefined ? [0, 255, 0, 5] : color)), new dojo.Color(color == undefined ? [0, 255, 0, 5.25] : color));
                    }else{
                        //默认显示
                        symbol= new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, size == undefined ? 15 : size, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_CIRCLE, new dojo.Color(color == undefined ? [0, 255, 0, 5] : color)), new dojo.Color(color == undefined ? [0, 255, 0, 5.25] : color));
                    }
                    break;
                case 'polyline':
                    geo = new Polyline(geo);
                    var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(color == undefined ? [0, 255, 255] : color), 3); //255, 87, 34
                    showExtent = geo.getExtent();
                    break;
            }
        }

        if (showExtent != undefined) {
            var tempGra = new esri.Graphic(geo, symbol, null, null);

            if (att != undefined) tempGra.setAttributes(att);
            MapControl.graphicLayers[gralyr == undefined ? 'gralyr3' : gralyr].add(tempGra);
            if (isshowExtent == undefined)
                map.setExtent(showExtent.expand(extent == undefined ? 0 : extent));

            if (name != undefined){
              if(bgcolor != undefined){
                if(bgcolor == 'red'){
                    bgcolor = '#FF0000'
                }else if(bgcolor == 'green'){
                    bgcolor = '#00FF00'
                }
              }else{
                bgcolor = '#03a1e2'
              }

                MapControl.GetTxtSymbols1(geo, name, "#000000", bgcolor, gralyr, att, name.length > 5 ? ((name.length - 5) * 10 + 75) : 70);
            }
        }
    });
};

MapControl.showGeometryMainStation = function(geo, isshowExtent, gralyr, color, size, att, extent, name) {
    esriLoader.loadModules(['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(([Point, Polyline, Polygon]) => {

        //  if (clear == undefined) MapControl.graphicLayers[gralyr == undefined ? 'gralyr3' : gralyr].clear();
        let map = MapControl.map[MapControl.mapId];
        var symbol;
        var showExtent;
        switch (geo.type) {
            case 'point':
                geo = new Point(geo);
                var xMin = parseFloat(geo.x) - 30;
                var yMin = parseFloat(geo.y) - 30;
                var xMax = parseFloat(geo.x) + 30;
                var yMax = parseFloat(geo.y) + 30;
                showExtent = new esri.geometry.Extent(xMin, yMin, xMax, yMax, map.spatialReference);
                var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, size == undefined ? 15 : size, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_CIRCLE, new dojo.Color(color == undefined ? [0, 255, 0, 5] : color)), new dojo.Color(color == undefined ? [0, 255, 0, 5.25] : color));
                break;
            case 'polyline':
                geo = new Polyline(geo);
                var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(color == undefined ? [0, 255, 255] : color), 3); //255, 87, 34
                showExtent = geo.getExtent();
                break;
        }
        if (showExtent != undefined) {
            var tempGra = new esri.Graphic(geo, symbol, null, null);

            if (att != undefined) tempGra.setAttributes(att);
            MapControl.graphicLayers[gralyr == undefined ? 'gralyr3' : gralyr].add(tempGra);
            if (isshowExtent == undefined)
                map.setExtent(showExtent.expand(extent == undefined ? 0 : extent));

            if (name != undefined && name != "")
                MapControl.GetTxtSymbols1(geo, name, "#fff", "#03a1e2", gralyr, att, name.length > 5 ? ((name.length - 5) * 10 + 75) : 70);
        }
    });
};

//添加气球标注(X,Y)文字标注偏移量（默认可以认为是0,13）
MapControl.GetTxtSymbols1 = function(geo, name, color, color1, gralyr, att, iconsize) {
    var iconPath = 'm254.18813,199.29122l-212.82314,0c-11.47576,0 -20.86501,-4.11193 -20.86501,-9.13761l0,-64.61599c0,-5.02569 9.38926,-9.13761 20.86501,-9.13761l499.26997,0c11.47576,0 20.86501,4.11193 20.86501,9.13761l0,64.61599c0,5.02569 -9.38926,9.13761 -20.86501,9.13761l-212.97217,0l-37.40799,16.70878l-36.06667,-16.70878z'
    if(name.length > 0){
        if(name.length > 8){
            iconPath = "m254.18813,199.29122l-212.82314,0c-11.47576,0 -20.86501,-4.11193 -20.86501,-9.13761l0,-64.61599c0,-5.02569 9.38926,-9.13761 20.86501,-9.13761l499.26997,0c11.47576,0 20.86501,4.11193 20.86501,9.13761l0,64.61599c0,5.02569 -9.38926,9.13761 -20.86501,9.13761l-212.97217,0l-37.40799,16.70878l-36.06667,-16.70878z"
        }else{
            iconPath = 'M229.3,238.4H86.5c-7.7,0-14-6.3-14-14v-99c0-7.7,6.3-14,14-14h335c7.7,0,14,6.3,14,14v99c0,7.7-6.3,14-14,14   H278.6L253.5,264L229.3,238.4z';
        }
    }
    var system = new esri.symbol.SimpleMarkerSymbol();
    system.setPath(iconPath);
    system.setSize(iconsize != undefined ? iconsize : 70);
    system.setColor(new esri.Color(color1 != undefined ? color1 : '#03a1e2'));
    var symbol = new esri.symbol.SimpleLineSymbol(
        esri.symbol.SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color([255, 255, 255]),
        0
    );
    // system.setOutline(symbol);
    system.setOffset(0, 20); //长方形框偏移
    var graphic2 = new esri.Graphic(geo, system);
    MapControl.graphicLayers[gralyr == undefined ? 'gralyr4' : gralyr].add(graphic2);

    var txtSym = new esri.symbol.TextSymbol();
    txtSym.setAlign(esri.symbol.TextSymbol.ALIGN_MIDDLE);
    txtSym.setText(name);
    txtSym.setColor(new esri.Color(color)); //"#f7f7f7"
    txtSym.setOffset(0, 20);
    var font = new esri.symbol.Font();
    font.setSize('12px');
    font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
    font.setFamily('微软雅黑');
    txtSym.setFont(font);
    var graphic1 = new esri.Graphic(geo, txtSym);
    if (att != undefined) graphic1.setAttributes(att);
    MapControl.graphicLayers[gralyr == undefined ? 'gralyr4' : gralyr].add(graphic1);
};

/**
 * 标注高亮
 */
MapControl.bzShowGeometry = function(geometryl) {
    esriLoader.loadModules(['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(([Point, Polyline, Polygon]) => {
        //
        let map = MapControl.map[MapControl.mapId];
        var symbol;
        for (var i = 0; i < geometryl.length; i++) {
            let geom = MapControl.WktToAgs(geometryl[i]);
            var geo = new Polyline(geom);
            var symbol = new esri.symbol.SimpleLineSymbol(
                    esri.symbol.SimpleLineSymbol.STYLE_SOILD,
                    new dojo.Color([0, 0, 0]),
                    2
                )
            var tempGra = new esri.Graphic(geo, symbol, null, null);
            MapControl.graphicLayers['gralyr1'].add(tempGra);
        }
    });
};


MapControl.setMapClearNew = function(value) {
    // if (value !== undefined) {
    // MapControl.graphicLayers['gralyr3'].clear();
    // } else {
    if (MapControl.graphicLayers['gralyr1'] != undefined)
        MapControl.graphicLayers['gralyr1'].clear();
    if (MapControl.graphicLayers['gralyr2'] != undefined)
        MapControl.graphicLayers['gralyr2'].clear();
    if (MapControl.graphicLayers['gralyr3'] != undefined)
        MapControl.graphicLayers['gralyr3'].clear();
    if (MapControl.graphicLayers['gralyr4'] != undefined)
        MapControl.graphicLayers['gralyr4'].clear();
    if (MapControl.graphicLayers['gralyr5'] != undefined)
        MapControl.graphicLayers['gralyr5'].clear();
    // }
    // MapControl.graphicLayers['MyGraphicsLayerMapOutput01FWZT'].clear();
    // }

    if (MapControl.map[MapControl.mapId] && MapControl.map[MapControl.mapId].graphics != undefined) {
        MapControl.map[MapControl.mapId].graphics.clear();
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
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
    if (toolbar) {
        toolbar.deactivate();
    }
    let editbar = MapControl.editToolbar[MapControl.mapId];
    if (editbar) {
        editbar.deactivate();
    }
    let map = MapControl.map[MapControl.mapId];
    if (map) {

        map.infoWindow.hide();
    }
};


/**
 *地图绘制
 */
MapControl.mapDraw = function(drawtype, isClear) {
    if (doSpaceDrawEventHandler != undefined) {
        doSpaceDrawEventHandler.remove();
    }
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
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

MapControl.clearmapDraw = function() {
    MapControl.graphicLayers['gralyr1'].clear();
    if (doSpaceDrawEventHandler != undefined) {
        doSpaceDrawEventHandler.remove();
    }
};

MapControl.doSpaceDraw = function(gra) {
    doSpaceDraw(gra);
}

function doSpaceDraw(gra) {
    let map = MapControl.map;
    if (doSpaceDrawEventHandler != undefined) {
        doSpaceDrawEventHandler.remove();
    }
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
    toolbar.deactivate();
    //根据图形的类型定义显示样式
    var geo = gra.geometry;
    var symbol;
    var geom = '';

    switch (geo.type) {
        case 'point':
            symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_CIRCLE, new dojo.Color([255, 87, 34, 5])), new dojo.Color([255, 87, 34, 5.25]));
            geom = transformUtils.PointToWKT(geo);
            break;
        case 'polyline':
            symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([0, 189, 1]), 3);
            geom = transformUtils.LineToWKT(geo);
            // for (var i = 0; i < geo.paths[0].length; i++) {
            //     geom = geo.paths[0][i][0] + ' ' + geo.paths[0][i][1] + ',' + geom;
            // }
            // geom = 'LINESTRING (' + geom.substring(0, geom.length - 1) + ')';
            break;
        case 'polygon':
            symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3), new dojo.Color([255, 140, 0, 0.35]));
            //geom = PolygonToWKT(geo);
            for (var i = 0; i < geo.rings[0].length; i++) {
                geom = geo.rings[0][i][0] + ' ' + geo.rings[0][i][1] + ',' + geom;
            }
            geom = geom + geo.rings[0][0][0] + ' ' + geo.rings[0][0][1];
            // geom = 'POLYGON((' + geom + '))';
            geom = 'POLYGON((' + geom + '))';
            break;
        case 'extent':
            symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3), new dojo.Color([255, 140, 0, 0.35]));
            geom = geo.xmin + ' ' + geo.ymin + ',' + geo.xmax + ' ' + geo.ymin + ',' + geo.xmax + ' ' + geo.ymax + ',' + geo.xmin + ' ' + geo.ymax + ',' + geo.xmin + ' ' + geo.ymin;
            geom = 'POLYGON((' + geom + '))';
            break;
    }

    bus.$emit('mapDrawresult', {
        gwkt: geom,
        gty: geo
    });

    var tempGra = new esri.Graphic(geo, symbol, null, null);
    MapControl.graphicLayers['gralyr1'].add(tempGra);
    bus.$emit('mapTempGra', tempGra);
}

MapControl.GetPoint = function(drawtype) {
    if (doSpaceDrawEventHandler != undefined) {
        doSpaceDrawEventHandler.remove();
    }

    let toolbar = MapControl.drawToolbar[MapControl.mapId];
    doSpaceDrawEventHandler = toolbar.on('draw-end', function(gra) {
        let map = MapControl.map;
        if (doSpaceDrawEventHandler != undefined) {
            doSpaceDrawEventHandler.remove();
        }
        let toolbar = MapControl.drawToolbar[MapControl.mapId];
        toolbar.deactivate();
        var geo = gra.geometry;
        var symbol;
        switch (geo.type) {
            case 'point':
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 5, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.35]));
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
MapControl.Draw = function(drawtype) {
    if (doSpaceDrawEventHandler != undefined) {
        doSpaceDrawEventHandler.remove();
    }

    let toolbar = MapControl.drawToolbar[MapControl.mapId];
    doSpaceDrawEventHandler = toolbar.on('draw-end', function(gra) {
        let map = MapControl.map[MapControl.mapId];
        if (doSpaceDrawEventHandler != undefined) {
            doSpaceDrawEventHandler.remove();
        }
        toolbar.deactivate();
        //根据图形的类型定义显示样式
        var geo = gra.geometry;
        var symbol;
        var geom = '';

        symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3), new dojo.Color([255, 140, 0, 0.35]));
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
MapControl.WktToAgs = function(wkt) {
    if(wkt=="MULTIPOINT EMPTY" || wkt==null || wkt == undefined) {
        return null;
    } else {
        let map = MapControl.map[MapControl.mapId];
        var geo;
        if (map && wkt) {
            if (wkt.indexOf('POINT') >= 0)
                geo = transformUtils.WktToPoint(wkt, map.spatialReference);
            else if (wkt.indexOf('LINESTRING') == 0)
                geo = transformUtils.WktToPolyline(wkt, map.spatialReference);
            else if (wkt.indexOf('POLYGON') == 0)
                geo = transformUtils.WktToPolygon(wkt, map.spatialReference);
            else if (wkt.indexOf('MULTIPOLYGON') == 0) {
                geo = transformUtils.WktToMULTIPOLYGON(wkt, map.spatialReference);
            } else if (wkt.indexOf('MULTILINESTRING') == 0) {
                geo = transformUtils.WktToMULTILINESTRING(wkt, map.spatialReference);
            }
        }
        return geo;
    }
};

/**
 *arcgis对象wkt
 */
MapControl.AgsToWkt = function(ags) {
    let map = MapControl.map[MapControl.mapId];
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
MapControl.AddMarker = function() {
    let map = MapControl.map[MapControl.mapId];
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
    toolbar.activate(esri.toolbars.Draw.POINT);
    MapControl.graphicLayers['gralyr1'].clear();
    if (domapOnclickEventHandler != undefined) {
        domapOnclickEventHandler.remove();
    }
    domapOnclickEventHandler = toolbar.on('draw-end', function(gra) {
        if (domapOnclickEventHandler != undefined) {
            domapOnclickEventHandler.remove();
        }
        var geo = gra.geometry;
        bus.$emit('AddMarker', geo);
        var symbol = esri.symbol.PictureMarkerSymbol('../../static/img/map/tips.png', 23, 30);
        var tempGra = new esri.Graphic(geo, symbol);
        MapControl.graphicLayers['gralyr1'].add(tempGra);
        toolbar.deactivate();
    });
};

MapControl.AddMarker1 = function(name) {
    let map = MapControl.map[MapControl.mapId];
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
    toolbar.activate(esri.toolbars.Draw.POINT);
    MapControl.graphicLayers['gralyr1'].clear();
    if (domapOnclickEventHandler != undefined) {
        domapOnclickEventHandler.remove();
    }
    domapOnclickEventHandler = toolbar.on('draw-end', function(gra) {
        if (domapOnclickEventHandler != undefined) {
            domapOnclickEventHandler.remove();
        }
        var geo = gra.geometry;
        MapControl.GetTxtSymbols(geo, name, 0, 40, '#495060');
        bus.$emit('AddMarker', geo);
        toolbar.deactivate();
    });
};

MapControl.showMarker = function(geo) {
        MapControl.graphicLayers['gralyr1'].clear();
        var symbol = esri.symbol.PictureMarkerSymbol('../../static/img/map/tips.png', 23, 30);
        var tempGra = new esri.Graphic(geo, symbol);
        MapControl.graphicLayers['gralyr1'].add(tempGra);
}

// 距离、面积测量操作
var doMeasureEventHandler;
var doLengthsCompleteHandler;
var doAreasAndLengthsCompleteHandler;
var length, lastpt, centerPoint;
MapControl.MeasureDraw = function(type) {
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
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
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
    let map = MapControl.map[MapControl.mapId];
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
    let geometryService = MapControl.GeometryService;
    var geometry = gra.geometry;
    esriLoader.loadModules(['esri/tasks/AreasAndLengthsParameters']).then(([AreasAndLengthsParameters]) => {
        switch (geometry.type) {
            case 'polygon':
                var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([181, 181, 181]), 2), new dojo.Color([135, 206, 255, 0.25]));
                var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
                areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_FOOT;
                areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_METER;
                geometryService.simplify([geometry], function(simplifiedGeometries) {
                    areasAndLengthParams.polygons = simplifiedGeometries;
                    geometryService.areasAndLengths(areasAndLengthParams, outputAreaAndLength);
                });
                centerPoint = geometry.getCentroid();
                break;
        }
        var graphic = new esri.Graphic(geometry, symbol);
        MapControl.graphicLayers['gralyr1'].add(graphic);
    });

}
var doonLengthsComplete;

function setupCustomTool(name) {
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
    if (domapOnclickEventHandler !== undefined) {
        domapOnclickEventHandler.remove();
    }
    if (name == 'polyline') {
        let map = MapControl.map[MapControl.mapId];
        domapOnclickEventHandler = map.on('click', MapclickHandler);
        map.on('dbclick', stopMeasure);
    }
}

function stopMeasure() {
    if (doonLengthsComplete !== undefined) {
        doonLengthsComplete.remove()
    }
    toolbar.deactivate()
}

function MapclickHandler(e) {
    let map = MapControl.map[MapControl.mapId];
    let geometryService = MapControl.GeometryService;
    var pt = new esri.geometry.Point(e.mapPoint.x, e.mapPoint.y, map.spatialReference);
    esriLoader.loadModules(['esri/tasks/LengthsParameters']).then(([LengthsParameters]) => {
        if (lastpt != undefined) {
            var line = new esri.geometry.Polyline({
                'spatialReference': map.spatialReference
            });
            line.addPath([lastpt, pt]);

            var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 2);
            MapControl.graphicLayers['gralyr1'].add(new esri.Graphic(line, symbol));

            var lengthParams = new esri.tasks.LengthsParameters();
            lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
            lengthParams.polylines = [line];
            lengthParams.geodesic = false;
            lengthParams.calculationType = 'geodesic';
            lengthParams.polylines[0].spatialReference = map.spatialReference;
            if (doonLengthsComplete !== undefined)
                dojo.disconnect(doonLengthsComplete);
            doonLengthsComplete = dojo.connect(geometryService, 'onLengthsComplete', outputDistance);
            geometryService.lengths(lengthParams);
        }
        lastpt = pt;
        var marksymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, dojox.gfx.px2pt(12), new esri.symbol.SimpleLineSymbol().setStyle(esri.symbol.SimpleLineSymbol.STYLE_SOLID).setColor(new dojo.Color([255, 0, 0, 255])), new dojo.Color([0, 0, 0, 0], dojox.gfx.px2pt(1)));
        var graphic = new esri.Graphic(pt, marksymbol);
        MapControl.graphicLayers['gralyr1'].add(graphic);
    });
}

function outputDistance(evtObj) {
    let map = MapControl.map[MapControl.mapId];
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
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

    var pmsTextBg = new esri.symbol.PictureMarkerSymbol('../../static/img/map/tips.png', 22, 20);

    pmsTextBg.setOffset(40, -15);
    var textLength = lengthValue.length;
    pmsTextBg.setWidth(textLength * 10);
    var bgGraphic = new esri.Graphic(lastpt, pmsTextBg);
    MapControl.graphicLayers['gralyr1'].add(bgGraphic);

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
    let map = MapControl.map[MapControl.mapId];
    let toolbar = MapControl.drawToolbar[MapControl.mapId];
    var area;
    var areaValue = result.areas[0];
    if (areaValue >= 1000000) {
        area = '面积：' + (result.areas[0] / 1000000).toFixed(3) + '平方公里';
    } else {
        area = '面积：' + result.areas[0].toFixed(3) + '平方米';
    }
    var font = new esri.symbol.Font();
    font.setSize('10pt');
    font.setFamily('微软雅黑');
    font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
    var textSymbol = new esri.symbol.TextSymbol(area, font, new dojo.Color([28, 28, 28]));
    var labelPointGraphic = new esri.Graphic(centerPoint, textSymbol);
    MapControl.graphicLayers['gralyr1'].add(labelPointGraphic);
    toolbar.deactivate();
}

/*图层控制显示*/
MapControl.SetLayerVisible = function(uservisibleLayers) {
    esriLoader.loadModules(['esri/map', 'esri/layers/ArcGISDynamicMapServiceLayer']).then(([Map, ArcGISDynamicMapServiceLayer]) => {
        let map = MapControl.map[MapControl.mapId];
        if (uservisibleLayers) {
            for (var sitem in uservisibleLayers) {
                if (uservisibleLayers[sitem].title) {
                    var sublay = map.getLayer(uservisibleLayers[sitem].title);
                    if (!sublay) {
                        sublay = new esri.layers.ArcGISDynamicMapServiceLayer(uservisibleLayers[sitem].SERVERURL);

                        sublay.setImageFormat('png32', false)
                        sublay.id = uservisibleLayers[sitem].title;
                        sublay.name = uservisibleLayers[sitem].title;
                        map.addLayer(sublay);
                    }
                    sublay.setVisibility(uservisibleLayers[sitem].IsVisible);
                    if (uservisibleLayers[sitem].SubLayers && uservisibleLayers[sitem].SubLayers.length > 0) {
                        sublay.setVisibleLayers([-1]);
                        /*设置显示子图层*/
                        if (uservisibleLayers[sitem].IsVisible)
                            sublay.setVisibleLayers(uservisibleLayers[sitem].SubLayers);
                    } else {
                        /*显示服务就可以了*/
                        if (sublay)
                            sublay.setVisibility(uservisibleLayers[sitem].IsVisible);

                    }
                }
            }
        }
    });
};

/*图层控制显示根据属性*/
MapControl.SetLayerVisibleByProperty = function(uservisibleLayers) {
    esriLoader.loadModules(['esri/map', 'esri/layers/ArcGISDynamicMapServiceLayer']).then(([Map, ArcGISDynamicMapServiceLayer]) => {
        let map = MapControl.map[MapControl.mapId];
        try {
            if (uservisibleLayers) {
                if (uservisibleLayers.title) {
                    var sublay = map.getLayer(uservisibleLayers.title);
                    if (!sublay) {
                        sublay = new esri.layers.ArcGISDynamicMapServiceLayer(uservisibleLayers.SERVERURL);
                        sublay.id = uservisibleLayers.title;
                        sublay.name = uservisibleLayers.title;
                        map.addLayer(sublay);
                    }

                    sublay.setVisibility(true);

                    if (uservisibleLayers.layerDefint && uservisibleLayers.layerDefint.length > 0) {
                        sublay.setLayerDefinitions(uservisibleLayers.layerDefint);
                    }

                }
            }
        } catch (e) {
            console.log(e);
        }
    });
};

MapControl.PostionToPolygon = function(geo) {
    esriLoader.loadModules(['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(([Point, Polyline, Polygon]) => {
        let map = MapControl.map[MapControl.mapId];
        var esrgeo = new Polygon(geo);
        var showExtent = esrgeo.getExtent();
        if (showExtent != undefined) {
            map.setExtent(showExtent.expand(1.5));
        }
    });
};

MapControl.addGraphic = function($graphic, att) {
    let map = MapControl.map[MapControl.mapId];
    let geometry = $graphic.geometry
    let symbol = $graphic.symbol
    switch (geometry.type) {
        case 'point':
            geometry = new esri.geometry.Point(geometry);
            if (symbol.type == 'SimpleMarkerSymbol') {
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, symbol.size, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_CIRCLE, new dojo.Color(symbol.color)), new dojo.Color(symbol.color));
            } else if (symbol.type == 'PictureMarkerSymbol') {
                symbol = new esri.symbol.PictureMarkerSymbol('../../static/img/map/' + symbol.image, symbol.width, symbol.height);
                if ($graphic.isdeviation == true) {
                    symbol.setOffset(0, 15);
                }
            }
            break;
        case 'polyline':
            geometry = new esri.geometry.Polyline(geometry);
            if (symbol.style == 'dash') {
                symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color(symbol.color), symbol.size);
            } else if (symbol.style == 'solid') {
                symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(symbol.color), symbol.size);
            } else {
                symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(symbol.color), symbol.size);
            }
            break;
        case 'polygon':
            geometry = new esri.geometry.Polygon(geometry);

            if (symbol.style == 'solid') {
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color(symbol.color), symbol.borwidth?symbol.borwidth:3), new dojo.Color(symbol.fillcolor));
            } else {
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color(symbol.color), symbol.borwidth?symbol.borwidth:3), new dojo.Color(symbol.fillcolor));
            }
            break;
        case 'extent':
            geometry = new esri.geometry.Polygon(geometry);
            break;
    }

    if ($graphic.setOffset !== undefined) {
        symbol.setOffset($graphic.setOffset.x, $graphic.setOffset.y);
    }

    let gra = new esri.Graphic(geometry, symbol, null, null);
    if ($graphic.attributes.guid !== '') {
        gra.setAttributes($graphic.attributes)
    }
    if ($graphic.isClear == true) {
        //MapControl.setMapClear()
        MapControl.graphicLayers[$graphic.layer].clear()
    }
    if ($graphic.InfoTemplate !== undefined) {
        MapControl.AddPop(gra, $graphic.InfoTemplate)
    }

    if (att != undefined) gra.setAttributes(att);
    MapControl.graphicLayers[$graphic.layer].add(gra);
};

//添加标注
MapControl.addLabel = function(point, content, guid) {
    var pmsTextBg = new esri.symbol.PictureMarkerSymbol('../../static/img/map/tips.png', 22, 20);
    pmsTextBg.setOffset(0, 20);
    var textLength = content.length;
    pmsTextBg.setWidth(textLength * 20);
    var bgGraphic = new esri.Graphic(point, pmsTextBg);
    MapControl.graphicLayers['gralyr2'].add(bgGraphic);
    var font = new esri.symbol.Font();
    font.setSize('12pt');
    font.setFamily('微软雅黑');
    var text = new esri.symbol.TextSymbol(content);
    text.setFont(font);
    text.setColor(new dojo.Color([0, 0, 0, 255]));
    text.setOffset(0, 15);
    var labelGraphic = new esri.Graphic(point, text);
    labelGraphic.setAttributes({
        'guid': guid
    })
    MapControl.graphicLayers['gralyr2'].add(labelGraphic);
}

//添加地图右键菜单
MapControl.MenuForGraphics = function() {
    esriLoader.loadModules(["esri/map", "esri/geometry/Point", "esri/geometry/Polygon",
        "esri/toolbars/draw", "esri/toolbars/edit",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/graphic", "esri/geometry/jsonUtils",
        "esri/Color", "dojo/parser",
        "dijit/Menu", "dijit/MenuItem", "dijit/MenuSeparator",
        "dijit/form/Button", "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
        "dojo/domReady!"
    ]).then(([Map, Point, Polygon,
        Draw, Edit,
        SimpleMarkerSymbol, SimpleLineSymbol,
        SimpleFillSymbol,
        Graphic, geometryJsonUtils,
        Color, parser,
        Menu, MenuItem, MenuSeparator
    ]) => {
        let map = MapControl.map[MapControl.mapId];
        let editbar = MapControl.editToolbar.mapbox;
        let ctxMenuForMap = new Menu({
            onOpen: function(box) {
                if (editbar) {
                    editbar.deactivate();
                }
            }
        });
        MapControl.MenuForMap = ctxMenuForMap
        ctxMenuForMap.startup();
        ctxMenuForMap.bindDomNode(map.container);
    });
}

//添加气泡
MapControl.AddPop = function(graphic, template) {
        esriLoader.loadModules(["esri/dijit/Popup",
            "esri/dijit/PopupTemplate",
            "esri/InfoTemplate",
            "dojo/dom-construct",
            "dojo/dom",
            "dojo/on",
            "dojo/domReady!"
        ]).then(([Popup, PopupTemplate, InfoTemplate, domConstruct,
            dom, on, domAttr
        ]) => {
            let map = MapControl.map[MapControl.mapId];
            var infoTemplate = new InfoTemplate();

            infoTemplate.setTitle("巡查人员");

            infoTemplate.setContent(template);

            graphic.setInfoTemplate(infoTemplate);
        });
}

//支持多个气泡显示
MapControl.CreatGraphicsLayerWithMTip = function(info, func, ctemplate, cGraphicslayer) {
        esriLoader.loadModules(["esri/dijit/Popup",
            "esri/layers/graphics",
            "esri/dijit/PopupTemplate",
            "esri/InfoTemplate",
            "ncam/PopupExtended",
            "esri/graphic",
            "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol",
            "dojo/dom-construct",
            "dojo/_base/lang",
            "dojo/dom",
            "dojo/on",
            "dojo/domReady!"
        ]).then(([Popup, GraphicsLayer, PopupTemplate, InfoTemplate, PopupExtended, Graphic,
            Point, SimpleMarkerSymbol, domConstruct, lang,
            dom, on, domAttr
        ]) => {
            let map = MapControl.map[MapControl.mapId];
            let data = info
            var cGraphicslayer = MapControl.graphicLayers['gralyr2'];
            cGraphicslayer.clear();

            for (var i = 0, len = data.length; i < len; i++) {
                var d = data[i];
                var p = new Point(d.x, d.y, map.spatialReference);
                var symbol = new esri.symbol.PictureMarkerSymbol('../../static/img/map/' + data[i].gra.symbol.image, data[i].gra.symbol.width, data[i].gra.symbol.height);
                var graphic = new Graphic(p, symbol, lang.clone(d), null);
                var t_actions = []
                for (var j = 0; j < func.length; j++) {
                    var $func = func[j].funcname
                    t_actions.push({
                        text: func[j].text,
                        className: func[j].className,
                        title: func[j].title,
                        click: function(feature) {
                            $func(feature)
                        }
                    })
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
                //}
            }

            var extendedPopup = new PopupExtended({
                extended: {
                    themeClass: "light",
                    draggable: false,
                    defaultWidth: 100,
                    hideOnOffClick: true,
                    multiple: true,
                    smallStyleWidthBreak: 768,
                },
                highlight: true,
                titleInBody: true,
            }, dojo.create("div"));
            extendedPopup.setMap(map);
            map.infoWindow = extendedPopup;
            // for (var i = 0; i < cGraphicslayer.graphics.length; i++) {
            //   var d = cGraphicslayer.graphics[i];
            //   var loc = map.toScreen(d.geometry);
            //   map.infoWindow.setFeatures([cGraphicslayer.graphics[i]]);
            //   map.infoWindow.show(loc);
            // }
        });
}
    
MapControl.ShowAllPoint = function(pointList, isshowExtent) {
    esriLoader.loadModules(['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(
        ([Point, Polyline, Polygon]) => {
            let map = MapControl.map.mapbox;
            var symbol;
            var showExtent;
            var geo;
            for (let i = 0; i < pointList.length; i++) {
                var tempObj = pointList[i];
                geo = MapControl.WktToAgs(pointList[i].shape)
                switch (geo.type) {
                    case 'point':
                        geo = new Point(geo);
                        var xMin = parseFloat(geo.x) - 50;
                        var yMin = parseFloat(geo.y) - 50;
                        var xMax = parseFloat(geo.x) + 50;
                        var yMax = parseFloat(geo.y) + 50;
                        showExtent = new esri.geometry.Extent(xMin, yMin, xMax, yMax, map.spatialReference);
                        // var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_CIRCLE, new dojo.Color([255, 87, 34, 5])), new dojo.Color([255, 87, 34, 5.25]));
                        var symbol = MapControl.GetSymbol(tempObj);
                        break;
                    case 'polyline':
                        geo = new Polyline(geo);
                        symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3);
                        showExtent = geo.getExtent();
                        break;
                    case 'polygon':
                        geo = new Polygon(geo);
                        symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3), new dojo.Color([0, 0, 0, 0.35]));
                        showExtent = geo.getExtent();
                        break;
                    case 'extent':
                        geo = new Polygon(geo);
                        symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 3), new dojo.Color([0, 0, 0, 0.35]));
                        showExtent = geo.getExtent();
                        break;
                }
                var tempGra = new esri.Graphic(geo, symbol, null, null);
                MapControl.graphicLayers['gralyr1'].add(tempGra);
            }
            if (showExtent != undefined) {
                if (isshowExtent == undefined) {
                    map.setExtent(showExtent.expand(1.5));
                } else {
                    map.setExtent(showExtent.expand(0));
                }

            }
        }).catch(err => {
        console.error(err);
    })
};


/*地图与影像图切换 */
MapControl.SetLayerbaseload = function(uservisibleLayers) {
    esriLoader.loadModules(
            ['esri/map', 'esri/layers/ArcGISTiledMapServiceLayer'])
        .then(([Map, ArcGISTiledMapServiceLayer]) => {
            let map = MapControl.map[MapControl.mapId];
            if (!uservisibleLayers) return;
            uservisibleLayers.forEach(element => {
                var sublay = map.getLayer(element.url);
                if (sublay && !element.isshow) {
                    map.removeLayer(sublay); //移除图层
                } else if (element.isshow) {
                    sublay = new esri.layers.ArcGISTiledMapServiceLayer(element.url);
                    sublay.id = element.url;
                    sublay.name = element.url;
                    map.addLayer(sublay, 0); //加载图层
                }
            });
        });
};

/*图层透明度设置*/
MapControl.transparency = function(uservisibleLayers) {
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
            let map = MapControl.map[MapControl.mapId];
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
    );
};

MapControl.ShowText = function(list) {
    MapControl.graphicLayers['gralyr1'].clear();
    var Boxlength = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i].length > Boxlength) {
            Boxlength = list[i].length;
        }
    }
    var lastpt = new esri.geometry.Point("325636.472", "353829.855", MapControl.map.spatialReference);


    var pmsTextBg = new esri.symbol.PictureMarkerSymbol('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAyCAYAAADsg90UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDA5REM3MjA5NzAwMTFFODg5RjBCNkZENDIzREQ4QjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDA5REM3MUY5NzAwMTFFODg5RjBCNkZENDIzREQ4QjYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjA3MzNDRkY5NkZCMTFFOEJFRjVFMjQ0RTQ2RDg0MDYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjA3MzNEMDA5NkZCMTFFOEJFRjVFMjQ0RTQ2RDg0MDYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5OK7IEAAABUklEQVR42uyawRKDIAxEJeOH++dWD860HYUgyYZAOPXQse7uW4Fi2vd9mXms14dt26Zz4tCc0knAjOKvQcvkIwy4ujCj+FP3yvjSCEJvxf9U4IkC7waU7p/uXBnFhKf7/tYZD8GcO54p4KT/SIB3E7jiowI5A7xSUJN+kQBvJtSKjwpwDPBCwZv02QT0vld4K765AiPsE6hCbJdVaEl/2IdgTWVJ4sJWFEj8Lkm5izahFf1YB7QYYE2BVPpNBFiZICk+KiCwEIJSIJ2+CAEoEzTERwWkDNCmQCt9UQK0doya4iEV6H3HSMJiRaugnb4KAdp/nkhfHzYL1FKAqg4hU+KKQqDvbh2gVS1C33CJAvSsQRapZRCHP1hjKWzV3f+0LdKHEVAywUp8VOAYCfmucM0bqajjOCgBXFHIs8iYBXpb0aFPok0IyMwKaXgCehsfAQYAaEWzFLozROIAAAAASUVORK5CYII=', 10, 10);
    pmsTextBg.setOffset(0, 5);
    pmsTextBg.setWidth(10);
    var bgGraphic = new esri.Graphic(lastpt, pmsTextBg);
    MapControl.graphicLayers['gralyr1'].add(bgGraphic);

    for (let i = list.length - 1; i >= 0; i--) {
        var lengthValue = list[i];
        var pmsTextBg = new esri.symbol.PictureMarkerSymbol('data:image/png;base64,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', 22, 20);
        pmsTextBg.setOffset(0, 38 - i * 20);
        pmsTextBg.setWidth((Boxlength + 2) * 10);
        var bgGraphic = new esri.Graphic(lastpt, pmsTextBg);
        MapControl.graphicLayers['gralyr1'].add(bgGraphic);

        var font = new esri.symbol.Font();
        font.setSize('10pt');
        font.setFamily('微软雅黑');
        var text = new esri.symbol.TextSymbol(lengthValue);
        text.setFont(font);
        text.setColor(new dojo.Color([0, 0, 0, 255]));
        text.setOffset(0, 33 - i * 20);

        var labelGraphic = new esri.Graphic(lastpt, text);
        MapControl.graphicLayers['gralyr1'].add(labelGraphic);
    }
};

//根据地图比例尺计算容差值返回范围面
MapControl.identify = function() {
    esriLoader.loadModules(
        ['esri/geometry/scaleUtils']).then(
        ([scaleUtils]) => {
            const map = MapControl.map[MapControl.mapId];
            const scale = scaleUtils.getScale(map);
            const PPI = 96
            let Resolution = scale / (PPI / 0.0254)
            MapControl.identifyHandler = map.on("click", function(geo) {
                let x = geo.mapPoint.x
                let y = geo.mapPoint.y
                let xmin = x - Resolution * 10
                let xmax = x + Resolution * 10
                let ymin = y - Resolution * 10
                let ymax = y + Resolution * 10
                let geom = 'POLYGON ((' + xmin + ' ' + ymin + ',' + xmax + ' ' + ymin + ',' + xmax + ' ' + ymax + ',' + xmin + ' ' + ymax + ',' + xmin + ' ' + ymin + '))';
                let geop = 'POINT(' + x + ' ' + y + ')';
                MapControl.identifyHandler.remove()
                bus.$emit('identify', geom);
                bus.$emit('identifypoint', geop);
            });
        }
    );
};

MapControl.identifyMore = function() {
    esriLoader.loadModules(
        ['esri/geometry/scaleUtils']).then(
        ([scaleUtils]) => {
            const map = MapControl.map[MapControl.mapId];
            const scale = scaleUtils.getScale(map);
            const PPI = 96
            let Resolution = scale / (PPI / 0.0254)
            MapControl.identifyHandler = map.on("click", function(geo) {
                let x = geo.mapPoint.x
                let y = geo.mapPoint.y
                let xmin = x - Resolution * 10
                let xmax = x + Resolution * 10
                let ymin = y - Resolution * 10
                let ymax = y + Resolution * 10
                let geom = 'POLYGON ((' + xmin + ' ' + ymin + ',' + xmax + ' ' + ymin + ',' + xmax + ' ' + ymax + ',' + xmin + ' ' + ymax + ',' + xmin + ' ' + ymin + '))';
                // MapControl.identifyHandler.remove()
                bus.$emit('identify', geom);
            });
        }
    );
};

//设置多个线对象的大致范围
MapControl.setPolylinesExtent = function(x, y) {
    function sequence(a, b) {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1
        } else {
            return 0;
        }
    }
    x = x.sort(sequence)
    y = y.sort(sequence)
    const map = MapControl.map[MapControl.mapId]
    let extent = new esri.geometry.Extent({
        "xmin": x[0],
        "ymin": y[0],
        "xmax": x[x.length - 1],
        "ymax": y[y.length - 1],
        "spatialReference": map.spatialReference
    });
    map.setExtent(extent.expand(0))
}

MapControl.addGcglTextSymbol = function(infoTem, point,color,attr) {
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

        var fontsize = 13;
        var radius = 5;
        infoTem = infoTem + "";

        var bglineSymbol = new esri.symbol.SimpleLineSymbol("solid", new dojo.Color(color? color : [17, 91, 122, 1]), 1);
        var width = (MapControl.chkstrlen(infoTem)) * 0.6 * (fontsize * 0.9);
        var height = fontsize * 1.6;

        //设置背景框的大小
        var path = "M0" + " " + radius + "L0" + " " + (height - radius) + "Q0" + " " + height + " " + radius + " " + height + "L" + (width - radius) + " " + height + "Q" + width + " " + height + " " + width + " " + (height - radius) + "L" + width + " " + radius + "Q" + width + " " + "0" + " " + (width - radius) + " " + "0L" + radius + " " + "0Q0" + " " + "0" + " " + "0" + " " + radius;
        var bgSymbol = new esri.symbol.SimpleMarkerSymbol();
        bgSymbol.setPath(path);
        bgSymbol.setColor(new dojo.Color(color? color : [17, 91, 122, 0.7]));
        bgSymbol.setOutline(bglineSymbol);
        var size = Math.max(height, width);
        bgSymbol.setSize(size);
        bgSymbol.xoffset = 0;
        bgSymbol.yoffset = -3;

        var bgGraphic = new Graphic(point, bgSymbol);
        MapControl.graphicLayers['gralyrgcglba'].add(bgGraphic);

        var font = new Font(fontsize + "px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_LIGHTER);
        var textSymbol = new esri.symbol.TextSymbol(infoTem, font.setWeight(esri.symbol.Font.WEIGHT_BOLD), new dojo.Color([122, 122, 122, 1]));
        textSymbol.setOffset(0, -7);
        font.setWeight('800');
        font.setFamily('微软雅黑');
        textSymbol.setColor(new dojo.Color([255, 255, 255, 1]));
        var tempGra = new esri.Graphic(point, textSymbol, null, null);
        tempGra.setAttributes(attr);
        MapControl.graphicLayers['gralyrgcgl'].add(tempGra);
    });
};

//绘制缓冲半径
MapControl.ShowGeometryBuffer = function(geom, buffer) {
    var distance = buffer;
    var map = MapControl.map[MapControl.mapId];
    esriLoader.loadModules(
        [
            'esri/tasks/BufferParameters',
            'esri/SpatialReference',
            'esri/tasks/GeometryService',
            'esri/geometry/Point',
            'esri/geometry/Polyline',
            'esri/geometry/Polygon'
        ]).then(
        (
            [BufferParameters,
                SpatialReference,
                GeometryService,
                Point,
                Polyline,
                Polygon
            ]
        ) => {
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
            geometryService.buffer(params, function(results) {
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
                // var showExtent = new Polygon(results[0]);
                // var Extent = showExtent.getExtent();
                // map.setExtent(Extent);
            });
        }
    );
};

 //地图定位
MapControl.showExtent = function(geo, iscal) {
    esriLoader.loadModules(
        ['esri/geometry/Point', 'esri/geometry/Polyline', 'esri/geometry/Polygon']).then(([Point, Polyline, Polygon]) => {
        //MapControl.graphicLayers['gralyr1'].clear();
        let map = MapControl.map[MapControl.mapId];
        var symbol;
        var showExtent;
        if (geo==null||geo==undefined||geo==''||geo.type==null||geo.type == undefined||geo.type=='') return;
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
        if (showExtent != undefined) {
            map.setExtent(showExtent.expand(iscal == undefined ? 1.5 : iscal));
        }
    });
};

//获取包含汉字字符串长度
MapControl.chkstrlen = function(str) {
    var strlen = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) //如果是汉字，则字符串长度加2
            strlen += 2;
        else
            strlen++;
    }
    return strlen;
}

MapControl.addGPSTextSymbol = function(infoTem, point) {
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

        var bglineSymbol = new esri.symbol.SimpleLineSymbol("solid", new dojo.Color([17, 91, 122, 1]), 1);
        var width = (MapControl.chkstrlen(infoTem)) * 0.6 * (fontsize + 1);
        var height = fontsize * 1.6;

        //设置背景框的大小
        var path = "M0" + " " + radius + "L0" + " " + (height - radius) + "Q0" + " " + height + " " + radius + " " + height + "L" + (width - radius) + " " + height + "Q" + width + " " + height + " " + width + " " + (height - radius) + "L" + width + " " + radius + "Q" + width + " " + "0" + " " + (width - radius) + " " + "0L" + radius + " " + "0Q0" + " " + "0" + " " + "0" + " " + radius;
        var bgSymbol = new esri.symbol.SimpleMarkerSymbol();
        bgSymbol.setPath(path);
        bgSymbol.setColor(new dojo.Color([17, 91, 122, 0.7]));
        bgSymbol.setOutline(bglineSymbol);
        var size = Math.max(height, width);
        bgSymbol.setSize(size);
        bgSymbol.xoffset = 60;
        bgSymbol.yoffset = 0;

        var bgGraphic = new Graphic(point, bgSymbol);
        MapControl.graphicLayers['gralyr1'].add(bgGraphic);

        var font = new Font(fontsize + "px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_LIGHTER);
        var textSymbol = new esri.symbol.TextSymbol(infoTem, font.setWeight(esri.symbol.Font.WEIGHT_BOLD), new dojo.Color([122, 122, 122, 1]));
        textSymbol.setOffset(60, -5);
        textSymbol.setColor(new dojo.Color([255, 255, 255, 0.7]));
        var tempGra = new esri.Graphic(point, textSymbol, null, null);
        MapControl.graphicLayers['gralyr1'].add(tempGra);
    });
};

MapControl.Angle = function(startx, starty, endx, endy) {
    var tan = 0
    if (endx == startx) {
        tan = Math.atan(0) * 180 / Math.PI
    } else {
        tan = Math.atan(Math.abs((endy - starty) / (endx - startx))) * 180 / Math.PI
            // console.log(tan);
    }

    if (endx >= startx && endy >= starty) //第一象限
    {
        return -tan;
    } else if (endx > startx && endy < starty) //第四象限
    {
        return tan;
    } else if (endx < startx && endy > starty) //第二象限
    {
        return tan - 180;
    } else {
        return 180 - tan; //第三象限
    }
}