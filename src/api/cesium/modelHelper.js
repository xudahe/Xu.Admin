var Cesium = require('cesium/Cesium');

export var modelHelper = {};
modelHelper.VCesViewer = {}
modelHelper.that = {}
modelHelper.param_meaLen = {
  positions: [],
  poly: null,
  // let tooltip = document.getElementById("toolTip");
  distance: 0,
  cartesian: null,
  floatingPoint: null
}
modelHelper.param_meaArea = {
  positions: [],
  tempPoints: [],
  polygon: null,
  // let tooltip = document.getElementById("toolTip");
  cartesian: null,
  floatingPoint: null //浮动点

}
//function InitEarthEvent() {
    modelHelper.InitEarthEvent = function (value) {
        modelHelper.that =value;
 
        var handler = new Cesium.ScreenSpaceEventHandler(modelHelper.VCesViewer.scene.canvas);
        handler.setInputAction(function (movement) {
      
          if (modelHelper.that.$store.getters.G_MapActionFlag == 1 || modelHelper.that.$store.getters.G_MapActionFlag == 2 || modelHelper.that.$store.getters.G_MapActionFlag == 3) {
            modelHelper.param_meaLen.cartesian = modelHelper.VCesViewer.scene.pickPosition(movement.endPosition);
            //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
            if (modelHelper.param_meaLen.cartesian != undefined) {
              console.log(modelHelper.param_meaLen.cartesian)
              console.log(modelHelper.param_meaLen.positions.length)
              if (modelHelper.param_meaLen.positions.length >= 2) {
                if (!Cesium.defined(modelHelper.param_meaLen.poly)) {
      
                  modelHelper.param_meaLen.poly = new PolyLinePrimitive(modelHelper.param_meaLen.positions);
                } else {
      
                  // cartesian.y += (1 + Math.random());
                  if (modelHelper.that.$store.getters.G_MapActionFlag == 1) {
      
                    let point1cartographic = Cesium.Cartographic.fromCartesian(modelHelper.param_meaLen.positions[0]);
                    let point2cartographic = Cesium.Cartographic.fromCartesian(modelHelper.param_meaLen.cartesian);
                    var lon = Cesium.Math.toDegrees(point1cartographic.longitude);
                    var lat = Cesium.Math.toDegrees(point1cartographic.latitude);
                    modelHelper.param_meaLen.positions.pop();
                    modelHelper.param_meaLen.positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, point2cartographic.height));
                  } else if (modelHelper.that.$store.getters.G_MapActionFlag == 2) {
      
                    let point1cartographic = Cesium.Cartographic.fromCartesian(modelHelper.param_meaLen.positions[0]);
                    let point2cartographic = Cesium.Cartographic.fromCartesian(modelHelper.param_meaLen.cartesian);
                    var lon = Cesium.Math.toDegrees(point2cartographic.longitude);
                    var lat = Cesium.Math.toDegrees(point2cartographic.latitude);
                    modelHelper.param_meaLen.positions.pop();
                    modelHelper.param_meaLen.positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, point1cartographic.height));
                  } else {
                    modelHelper.param_meaLen.positions.pop();
                    modelHelper.param_meaLen.positions.push(modelHelper.param_meaLen.cartesian);
                  }
      
                }
                if (modelHelper.that.$store.getters.G_MapActionFlag == 1) //垂直距离
                {
                  modelHelper.param_meaLen.distance = getVDistance(modelHelper.param_meaLen.positions);
                } else if (modelHelper.that.$store.getters.G_MapActionFlag == 2) //水平距离
                {
                  modelHelper.param_meaLen.distance = getHDistance(modelHelper.param_meaLen.positions);
                } else if (modelHelper.that.$store.getters.G_MapActionFlag == 3) //空间距离
                {
                  modelHelper.param_meaLen.distance = getSpaceDistance(modelHelper.param_meaLen.positions);
                }
      
                
              }
            }
          } else if (modelHelper.that.$store.getters.G_MapActionFlag == 4) {
            //面积量算
            modelHelper.param_meaArea.cartesian = modelHelper.VCesViewer.scene.pickPosition(movement.endPosition);
            if (modelHelper.param_meaArea.cartesian == undefined) {
              return;
            }
      
            //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
            if (modelHelper.param_meaArea.positions.length >= 2) {
              try {
                if (!Cesium.defined(modelHelper.param_meaArea.polygon)) {
                  modelHelper.param_meaArea.polygon = new PolygonPrimitive(modelHelper.param_meaArea.positions);
                } else {
                  modelHelper.param_meaArea.positions.pop();
                  modelHelper.param_meaArea.positions.push(modelHelper.param_meaArea.cartesian);
                }
              } catch (e) {
                console.log(e)
              }
            }
          }
 
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      
        handler.setInputAction(movement => {
          if (modelHelper.that.$store.getters.G_MapActionFlag == 1 || modelHelper.that.$store.getters.G_MapActionFlag == 2 || modelHelper.that.$store.getters.G_MapActionFlag == 3) {
            modelHelper.param_meaLen.positions.pop(); //最后一个点无效
            modelHelper.VCesViewer.entities.remove(modelHelper.param_meaLen.floatingPoint);
          } else if (modelHelper.that.$store.getters.G_MapActionFlag == 4) {
            modelHelper.that.$store.getters.G_MapActionFlag = 0
            modelHelper.param_meaArea.positions.pop();
            let areanum = getArea(modelHelper.param_meaArea.tempPoints);
            let textArea = "";
            if (areanum < 1000000) {
              textArea = (areanum).toFixed(2) + "平方米";
            } else {
              textArea = (areanum / 1000000.0).toFixed(4) + "平方公里";
            }
            modelHelper.VCesViewer.entities.add({
              name: '多边形面积',
              position: modelHelper.param_meaArea.positions[modelHelper.param_meaArea.positions.length - 1],
              label: {
                text: textArea,
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -40),
                eyeOffset: new Cesium.Cartesian3(0, 0, -10),
                // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
              }
            });
          }
      
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      
      
      
        modelHelper.VCesViewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
      
          var position = modelHelper.VCesViewer.scene.pickPosition(movement.position);
          
          if (position != undefined) {
      
            // 将笛卡尔坐标转换为地理坐标
            var cartographic = Cesium.Cartographic.fromCartesian(position);
            // 将弧度转为度的十进制度表示
            var lon = Cesium.Math.toDegrees(cartographic.longitude);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var h_ = cartographic.height;
             
            var realPos = modelHelper.VCesViewer.scene.camera.position
            console.log("x=" + realPos.x + ",y=" + realPos.y + ",z=" + realPos.z +
              ",heading=" + modelHelper.VCesViewer.scene.camera.heading +
              ",pitch=" + modelHelper.VCesViewer.scene.camera.pitch +
              ",roll=" + modelHelper.VCesViewer.scene.camera.roll)
            console.log("{lon:" + lon + ",lat:" + lat + ",bh:" + h_ + ",x:" + position.x + ",y:" + position.y + ",z:" + position.z + "}");
            // If a feature was previously selected, undo the highlight
 
      
      
            if (modelHelper.that.$store.getters.G_MapActionFlag == 1 || modelHelper.that.$store.getters.G_MapActionFlag == 2 || modelHelper.that.$store.getters.G_MapActionFlag == 3) {
              //高度测量
              //长度量算
              // let ray = modelHelper. VCesViewer.camera.getPickRay(movement.position);
              // modelHelper.param_meaLen.cartesian = modelHelper. VCesViewer.scene.globe.pick(ray, modelHelper. VCesViewer.scene);
              modelHelper.param_meaLen.cartesian = position;
              if (modelHelper.param_meaLen.cartesian == undefined) {
                return;
              }
              if (modelHelper.param_meaLen.positions.length == 0) {
                modelHelper.param_meaLen.positions.push(modelHelper.param_meaLen.cartesian.clone());
              }
      
              modelHelper.param_meaLen.positions.push(modelHelper.param_meaLen.cartesian);
      
      
      
              //在三维场景中添加Label
              //   let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
              let textDisance = modelHelper.param_meaLen.distance + "米";
              // console.log(textDisance + ",lng:" + cartographic.longitude/Math.PI*180.0);
              modelHelper.param_meaLen.floatingPoint = modelHelper.VCesViewer.entities.add({
                name: '空间直线距离',
                // position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
                position: modelHelper.param_meaLen.positions[modelHelper.param_meaLen.positions.length - 1],
                point: {
                  pixelSize: 5,
                  color: Cesium.Color.RED,
                  outlineColor: Cesium.Color.WHITE,
                  outlineWidth: 2,
                  eyeOffset: new Cesium.Cartesian3(0, 0, -10),
                },
                label: {
                  text: textDisance,
                  font: '18px sans-serif',
                  fillColor: Cesium.Color.GOLD,
                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                  outlineWidth: 2,
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  pixelOffset: new Cesium.Cartesian2(-40, -20),
                  eyeOffset: new Cesium.Cartesian3(0, 0, -10),
                }
              });
      
              if (modelHelper.that.$store.getters.G_MapActionFlag == 1 || modelHelper.that.$store.getters.G_MapActionFlag == 2) {
                while (modelHelper.param_meaLen.positions.length > 2) {
                  modelHelper.param_meaLen.positions.pop();
                }
              }
      
      
            } else if (modelHelper.that.$store.getters.G_MapActionFlag == 4) {
              //面积量算
              modelHelper.param_meaArea.cartesian = position;
              if (modelHelper.param_meaArea.cartesian == undefined) {
                return;
              }
              // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
              if (modelHelper.param_meaArea.positions.length == 0) {
                modelHelper.param_meaArea.positions.push(modelHelper.param_meaArea.cartesian.clone());
              }
              //positions.pop();
              modelHelper.param_meaArea.positions.push(modelHelper.param_meaArea.cartesian);
              //在三维场景中添加点
              let cartographic = Cesium.Cartographic.fromCartesian(modelHelper.param_meaArea.positions[modelHelper.param_meaArea.positions.length - 1]);
              let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
              let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
              let heightString = cartographic.height;
              modelHelper.param_meaArea.tempPoints.push({
                lon: longitudeString,
                lat: latitudeString,
                hei: heightString
              });
              modelHelper.param_meaArea.floatingPoint = modelHelper.VCesViewer.entities.add({
                name: '多边形面积',
                position: modelHelper.param_meaArea.positions[modelHelper.param_meaArea.positions.length - 1],
                point: {
                  pixelSize: 5,
                  color: Cesium.Color.RED,
                  outlineColor: Cesium.Color.WHITE,
                  outlineWidth: 2,
                  // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                  eyeOffset: new Cesium.Cartesian3(0, 0, -10)
                }
              });
            }  
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
      
      

//////////////////////量算计算//////////////////
var PolyLinePrimitive = (function () {
    function _(positions) {
      this.options = {
        name: '直线',
        polyline: {
          show: true,
          positions: [],
          material: Cesium.Color.CHARTREUSE,
          width: 5,
          clampToGround: false
        }
      };
      this.positions = positions;
      this._init();
    }
  
    _.prototype._init = function () {
      let _self = this;
      let _update = function () {
        return _self.positions;
      };
      //实时更新polyline.positions
      this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
      modelHelper.VCesViewer.entities.add(this.options);
    };
  
    return _;
  })();
  var PolygonPrimitive = (function () {
    function _(positions) {
      this.options = {
        name: '多边形',
        polygon: {
  
          hierarchy: [],
          // perPositionHeight : true,
          material: Cesium.Color.GREEN.withAlpha(0.5),
  
          // heightReference:20000
        }
      };
  
      this.hierarchy = {
        positions
      };
      this._init();
    }
  
    _.prototype._init = function () {
      let _self = this;
      let _update = function () {
        return _self.hierarchy;
      };
      //实时更新polygon.hierarchy
      this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
  
      modelHelper.VCesViewer.entities.add(this.options);
    };
  
    return _;
  })();
  
  
  
  //空间两点距离计算函数
  function getSpaceDistance(positions) {
    let distance = 0;
    for (let i = 0; i < positions.length - 1; i++) {
  
      let point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
      let point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
      /**根据经纬度计算出距离**/
      let geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      let s = geodesic.surfaceDistance;
      //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
      //返回两点之间的距离
      s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
      distance = distance + s;
    }
    return distance.toFixed(2);
  }
  //垂直距离计算函数
  function getVDistance(positions) {
    let distance = 0;
  
    let point1cartographic = Cesium.Cartographic.fromCartesian(positions[0]);
    let point2cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
    /**根据经纬度计算出距离**/
    let geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    let s = geodesic.surfaceDistance;
    //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
    //返回两点之间的距离
  
    distance = point2cartographic.height - point1cartographic.height;
  
    return distance.toFixed(2);
  }
  //水平距离计算函数
  function getHDistance(positions) {
    let distance = 0;
    for (let i = 0; i < positions.length - 1; i++) {
  
      let point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
      let point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
      /**根据经纬度计算出距离**/
      let geodesic = new Cesium.EllipsoidGeodesic();
      geodesic.setEndPoints(point1cartographic, point2cartographic);
      let s = geodesic.surfaceDistance;
      //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
      //返回两点之间的距离
      // s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
      distance = distance + s;
    }
    return distance.toFixed(2);
  }
  //计算多边形面积
  function getArea(points) {
  
    let res = 0;
    //拆分三角曲面
  
    for (let i = 0; i < points.length - 2; i++) {
      let j = (i + 1) % points.length;
      let k = (i + 2) % points.length;
      let totalAngle = Angle(points[i], points[j], points[k]);
      let dis_temp1 = distance(modelHelper.param_meaArea.positions[i], modelHelper.param_meaArea.positions[j]);
      let dis_temp2 = distance(modelHelper.param_meaArea.positions[j], modelHelper.param_meaArea.positions[k]);
      res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
    }
    return res;
  }
  var radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad) 
  var degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度
  /*角度*/
  function Angle(p1, p2, p3) {
    let bearing21 = Bearing(p2, p1);
    let bearing23 = Bearing(p2, p3);
    let angle = bearing21 - bearing23;
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  }
  /*方向*/
  function Bearing(from, to) {
    let lat1 = from.lat * radiansPerDegree;
    let lon1 = from.lon * radiansPerDegree;
    let lat2 = to.lat * radiansPerDegree;
    let lon2 = to.lon * radiansPerDegree;
    let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
    if (angle < 0) {
      angle += Math.PI * 2.0;
    }
    angle = angle * degreesPerRadian; //角度
    return angle;
  }
  
  function distance(point1, point2) {
    let point1cartographic = Cesium.Cartographic.fromCartesian(point1);
    let point2cartographic = Cesium.Cartographic.fromCartesian(point2);
    /**根据经纬度计算出距离**/
    let geodesic = new Cesium.EllipsoidGeodesic();
    geodesic.setEndPoints(point1cartographic, point2cartographic);
    let s = geodesic.surfaceDistance;
    //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
    //返回两点之间的距离
    s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
    return s;
  }
  