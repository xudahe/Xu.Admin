// var Cesium = require('cesium/Cesium');
// var widgets = require('cesium/Widgets/widgets.css');
import * as Cesium from "cesium/Cesium";
import * as widgets from "cesium/Widgets/widgets.css";

// import CesiumNavigation from "cesium-navigation-es6"; //导航插件
import {cesiumInstance } from "./cesiumInstance";

export default {
    //创建三维视图
    createScene() {
        let viewer = new Cesium.Viewer("cesiumContainer", {
            animation: false, //是否创建动画小器件，左下角仪表
            baseLayerPicker: false, //是否显示图层选择器
            fullscreenButton: false, //是否显示全屏按钮
            geocoder: false, //是否显示geocoder小器件，右上角查询按钮
            homeButton: false, //是否显示Home按钮
            infoBox: true, //是否显示信息框
            sceneModePicker: false, //是否显示3D/2D选择器
            selectionIndicator: false, //是否显示选取指示器组件
            timeline: false, //是否显示时间轴
            navigationHelpButton: false, //是否显示右上角的帮助按钮
            scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            useDefaultRenderLoop: true, //如果需要控制渲染循环，则设为true
            targetFrameRate: undefined, //使用默认render loop时的帧率
            showRenderLoopErrors: false, //如果设为true，将在一个HTML面板中显示错误信息
            automaticallyTrackDataSourceClocks: true, //自动追踪最近添加的数据源的时钟设置
            contextOptions: undefined, //传递给Scene对象的上下文参数（scene.options）
            sceneMode: Cesium.SceneMode.SCENE3D, //初始场景模式
            mapProjection: new Cesium.WebMercatorProjection(), //地图投影体系
            dataSources: new Cesium.DataSourceCollection(),
            clock: new Cesium.Clock(), //用于控制当前时间的时钟对象
            imageryProvider: new Cesium.SingleTileImageryProvider({
                url: "http://58.213.48.101:81/cesiumData/earth_base.jpg"
            })
            // imageryProvider: new Cesium.UrlTemplateImageryProvider({ //使用自定义数据源
            //     url: "http://mt1.google.cn/vt/lyrs=s,h&gl=cn&x={x}&y={y}&z={z}&s=Gali"
            // })
        });

        viewer.scene.skyAtmosphere.show = true;
        viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度监测
        viewer._cesiumWidget._creditContainer.style.display = "none"; // 去除版权信息

        let options = {};

        // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
        options.defaultResetView = Cesium.Rectangle.fromDegrees(119.455, 32.584, 120.903, 34.472);
        // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
        options.enableCompass = true;
        // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
        options.enableZoomControls = true;
        // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
        options.enableDistanceLegend = true;
        // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
        options.enableCompassOuterRing = true;

        // CesiumNavigation(viewer, options);

        //let Cesium3DTilesInspector = new Cesium.Cesium3DTilesInspector("cesiumContainer", viewer.scene)

        //viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
        //var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;

        let initialPosition = new Cesium.Cartesian3.fromDegrees(120.183639, 33.37464, 10000);

        let homeCameraView = {

            destination: initialPosition,

        };

        viewer.scene.camera.setView(homeCameraView);

        // var silhouette = viewer.scene.postProcessStages.add(
        //     Cesium.PostProcessStageLibrary.createSilhouetteStage()
        // );
        // silhouette.enabled = true;
        // silhouette.uniforms.color = Cesium.Color.RED;
        // console.log(silhouette.name)
        //silhouette.name = Cesium.createGuid();

        let handler3D = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        // handler3D.setInputAction(function (movement) {
        //     let pick = new Cesium.Cartesian2(
        //         movement.endPosition.x,
        //         movement.endPosition.y
        //     );
        //     if (pick) {
        //         let cartesian = viewer.scene.globe.pick(
        //             viewer.camera.getPickRay(pick),
        //             viewer.scene
        //         );
        //         if (cartesian) {
        //             //世界坐标转地理坐标（弧度）
        //             let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
        //                 cartesian
        //             );
        //             if (cartographic) {
        //                 //海拔
        //                 let height = viewer.scene.globe.getHeight(cartographic);
        //                 //视角海拔高度
        //                 let he = Math.sqrt(
        //                     viewer.scene.camera.positionWC.x *
        //                     viewer.scene.camera.positionWC.x +
        //                     viewer.scene.camera.positionWC.y *
        //                     viewer.scene.camera.positionWC.y +
        //                     viewer.scene.camera.positionWC.z *
        //                     viewer.scene.camera.positionWC.z
        //                 );
        //                 let he2 = Math.sqrt(
        //                     cartesian.x * cartesian.x +
        //                     cartesian.y * cartesian.y +
        //                     cartesian.z * cartesian.z
        //                 );
        //                 //地理坐标（弧度）转经纬度坐标
        //                 let point = [
        //                     (cartographic.longitude / Math.PI) * 180,
        //                     (cartographic.latitude / Math.PI) * 180
        //                 ];
        //                 if (!height) {
        //                     height = 0;
        //                 }
        //                 if (!he) {
        //                     he = 0;
        //                 }
        //                 if (!he2) {
        //                     he2 = 0;
        //                 }
        //                 if (!point) {
        //                     point = [0, 0];
        //                 }
        //                 let str =
        //                     '<div style="line-height:30px;color:#FFF;mar"><strong>视角海拔高度: ' +
        //                     (he - he2).toFixed(2) +
        //                     "米</strong><strong>&nbsp;&nbsp;&nbsp;经度：" +
        //                     point[0].toFixed(6) +
        //                     "</strong><strong>&nbsp;&nbsp;&nbsp;纬度：" +
        //                     point[1].toFixed(6) +
        //                     "</strong></div>";
        //                 //bus.$emit("showCoord", str);
        //             }
        //         }
        //     }
        // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        cesiumInstance.viewer = viewer;

        // let local_provider_DOM_global7 = new Cesium.ImageryLayer(
        //   new Cesium.UrlTemplateImageryProvider({
        //     url: "http://58.213.48.101:81/cesiumData/DOM_global7/{z}/{x}/{y}.png",
        //     tilingScheme: new Cesium.WebMercatorTilingScheme(),
        //     minimumLevel: 0,
        //     maximumLevel: 7,
        //     show: true
        //   })
        // );
        // viewer.imageryLayers.add(local_provider_DOM_global7);

        if (cesiumInstance.layers.length > 0) {

            for (let i = 0; i < cesiumInstance.layers.length; i++) {
                for (let j = 0; j < cesiumInstance.layers[i].children.length; j++) {
                    let child = cesiumInstance.layers[i].children[j];
                    if (child.isdefaultload == true) {
                        this.AddToScene(child)
                    }
                }
            }
        }
        //vm.getLayers();
    },
    //测量空间直线距离 
    measureLineSpace(viewer, handler) {
        // 取消双击事件-追踪该位置
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        let positions = [];
        let poly = null;
        // let tooltip = document.getElementById("toolTip");
        let distance = 0;
        let cartesian = null;
        let floatingPoint;
        // tooltip.style.display = "block";

        handler.setInputAction(movement => {
            // tooltip.style.left = movement.endPosition.x + 3 + "px";
            // tooltip.style.top = movement.endPosition.y - 25 + "px";
            // tooltip.innerHTML = '<p>单击开始，右击结束</p>';
            // cartesian = viewer.scene.pickPosition(movement.endPosition);
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
            if (positions.length >= 2) {
                if (!Cesium.defined(poly)) {
                    poly = new PolyLinePrimitive(positions);
                } else {
                    positions.pop();
                    // cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                }
                distance = getSpaceDistance(positions);
                // console.log("distance: " + distance);
                // tooltip.innerHTML='<p>'+distance+'米</p>';
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(movement => {
            // tooltip.style.display = "none";
            // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
            // cartesian = viewer.scene.pickPosition(movement.position);
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            positions.push(cartesian);
            //在三维场景中添加Label
            //   let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            let textDisance = distance + "米";
            // console.log(textDisance + ",lng:" + cartographic.longitude/Math.PI*180.0);
            floatingPoint = viewer.entities.add({
                name: '空间直线距离',
                // position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
                position: positions[positions.length - 1],
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                },
                label: {
                    text: textDisance,
                    font: '18px sans-serif',
                    fillColor: Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(20, -20),
                }
            });
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(movement => {
            handler.destroy(); //关闭事件句柄
            positions.pop(); //最后一个点无效
            // viewer.entities.remove(floatingPoint);
            // tooltip.style.display = "none";

        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        let PolyLinePrimitive = (function () {
            function _(positions) {
                this.options = {
                    name: '直线',
                    polyline: {
                        show: true,
                        positions: [],
                        material: Cesium.Color.CHARTREUSE,
                        width: 5,
                        clampToGround: true
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
                viewer.entities.add(this.options);
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
    },
    //测量空间面积
    measureAreaSpace(viewer, handler) {
        // 取消双击事件-追踪该位置
        viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        // 鼠标事件
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        let positions = [];
        let tempPoints = [];
        let polygon = null;
        // let tooltip = document.getElementById("toolTip");
        let cartesian = null;
        let floatingPoint; //浮动点
        // tooltip.style.display = "block";

        handler.setInputAction(function (movement) {
            // tooltip.style.left = movement.endPosition.x + 3 + "px";
            // tooltip.style.top = movement.endPosition.y - 25 + "px";
            // tooltip.innerHTML ='<p>单击开始，右击结束</p>';
            // cartesian = viewer.scene.pickPosition(movement.endPosition); 
            let ray = viewer.camera.getPickRay(movement.endPosition);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
            if (positions.length >= 2) {
                if (!Cesium.defined(polygon)) {
                    polygon = new PolygonPrimitive(positions);
                } else {
                    positions.pop();
                    // cartesian.y += (1 + Math.random());
                    positions.push(cartesian);
                }
                // tooltip.innerHTML='<p>'+distance+'米</p>';
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function (movement) {
            // tooltip.style.display = "none";
            // cartesian = viewer.scene.pickPosition(movement.position); 
            let ray = viewer.camera.getPickRay(movement.position);
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            // cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
            if (positions.length == 0) {
                positions.push(cartesian.clone());
            }
            //positions.pop();
            positions.push(cartesian);
            //在三维场景中添加点
            let cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
            let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            let heightString = cartographic.height;
            tempPoints.push({
                lon: longitudeString,
                lat: latitudeString,
                hei: heightString
            });
            floatingPoint = viewer.entities.add({
                name: '多边形面积',
                position: positions[positions.length - 1],
                point: {
                    pixelSize: 5,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (movement) {
            handler.destroy();
            positions.pop();
            //tempPoints.pop();
            // viewer.entities.remove(floatingPoint);
            // tooltip.style.display = "none";
            //在三维场景中添加点
            // let cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
            // let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
            // let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
            // let heightString = cartographic.height;
            // tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});

            let textArea = getArea(tempPoints) + "平方公里";
            viewer.entities.add({
                name: '多边形面积',
                position: positions[positions.length - 1],
                // point : {
                //  pixelSize : 5,
                //  color : Cesium.Color.RED,
                //  outlineColor : Cesium.Color.WHITE,
                //  outlineWidth : 2,
                //  heightReference:Cesium.HeightReference.CLAMP_TO_GROUND 
                // },
                label: {
                    text: textArea,
                    font: '18px sans-serif',
                    fillColor: Cesium.Color.GOLD,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(20, -40),
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        let radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad) 
        let degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度

        //计算多边形面积
        function getArea(points) {

            let res = 0;
            //拆分三角曲面

            for (let i = 0; i < points.length - 2; i++) {
                let j = (i + 1) % points.length;
                let k = (i + 2) % points.length;
                let totalAngle = Angle(points[i], points[j], points[k]);


                let dis_temp1 = distance(positions[i], positions[j]);
                let dis_temp2 = distance(positions[j], positions[k]);
                res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
            }


            return (res / 1000000.0).toFixed(4);
        }

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

        let PolygonPrimitive = (function () {
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

                this.hierarchy = positions;
                this._init();
            }

            _.prototype._init = function () {
                let _self = this;
                let _update = function () {
                    return _self.hierarchy;
                };
                //实时更新polygon.hierarchy
                this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update, false);
                viewer.entities.add(this.options);
            };

            return _;
        })();

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
    },
    //清除绘制实体
    clearEntities(viewer) {
        viewer.entities.removeAll()
    },
    //简单拾取Enity实现
    pick(viewer) {
        var nameOverlay = document.createElement("div");
        var handler = new Cesium.ScreenSpaceEventHandler();
        viewer.container.appendChild(nameOverlay);
        nameOverlay.className = "backdrop";
        nameOverlay.style.display = "none";
        nameOverlay.style.position = "absolute";
        nameOverlay.style.bottom = "0";
        nameOverlay.style.left = "0";
        nameOverlay.style["pointer-events"] = "none";
        nameOverlay.style.padding = "4px";
        nameOverlay.style.backgroundColor = "black";

        var selected = {
            feature: undefined,
            originalColor: new Cesium.Color(),
        };

        // An entity object which will hold info about the currently selected feature for infobox display
        var selectedEntity = new Cesium.Entity();

        // Get default left click handler for when a feature is not picked on left click
        var clickHandler = viewer.screenSpaceEventHandler.getInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );

        // If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
        // If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
        if (
            Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)
        ) {
            // Silhouettes are supported
            var silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
            silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
            silhouetteBlue.uniforms.length = 0.01;
            silhouetteBlue.selected = [];

            var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
            silhouetteGreen.uniforms.color = Cesium.Color.LIME;
            silhouetteGreen.uniforms.length = 0.01;
            silhouetteGreen.selected = [];

            viewer.scene.postProcessStages.add(
                Cesium.PostProcessStageLibrary.createSilhouetteStage([
                    silhouetteBlue,
                    silhouetteGreen,
                ])
            );

            // Silhouette a feature blue on hover.
            viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
                    movement
                ) {
                    // If a feature was previously highlighted, undo the highlight
                    silhouetteBlue.selected = [];

                    // Pick a new feature
                    var pickedFeature = viewer.scene.pick(movement.endPosition);
                    // if (!Cesium.defined(pickedFeature)) {
                    //     nameOverlay.style.display = "none";
                    //     return;
                    // }

                    // A feature was picked, so show it's overlay content
                    // nameOverlay.style.display = "block";
                    // nameOverlay.style.bottom =
                    //     viewer.canvas.clientHeight - movement.endPosition.y + "px";
                    // nameOverlay.style.left = movement.endPosition.x + "px";
                    // var name = pickedFeature.getProperty("BIN");
                    // nameOverlay.textContent = name;

                    // Highlight the feature if it's not already selected.
                    if (pickedFeature !== selected.feature) {
                        silhouetteBlue.selected = [pickedFeature];
                    }
                },
                Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            // Silhouette a feature on selection and show metadata in the InfoBox.
            viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
                    movement
                ) {
                    // If a feature was previously selected, undo the highlight
                    silhouetteGreen.selected = [];

                    // Pick a new feature
                    var pickedFeature = viewer.scene.pick(movement.position);
                    if (!Cesium.defined(pickedFeature)) {
                        clickHandler(movement);
                        return;
                    }

                    // Select the feature if it's not already selected
                    if (silhouetteGreen.selected[0] === pickedFeature) {
                        return;
                    }

                    // Save the selected feature's original color
                    var highlightedFeature = silhouetteBlue.selected[0];
                    if (pickedFeature === highlightedFeature) {
                        silhouetteBlue.selected = [];
                    }

                    // Highlight newly selected feature
                    silhouetteGreen.selected = [pickedFeature];

                    // Set feature infobox description
                    var featureName = pickedFeature.getProperty("name");

                    var PropertyNames = pickedFeature.getPropertyNames()
                    var description = ''
                    for (var i = 0; i < PropertyNames.length; i++) {
                        description += '<tr><th>' + PropertyNames[i] + '</th><td>' + pickedFeature.getProperty(PropertyNames[i]) + '</td></tr>';
                    }
                    // selectedEntity.name = featureName;
                    selectedEntity.description =
                        'Loading <div class="cesium-infoBox-loading"></div>';
                    viewer.selectedEntity = selectedEntity;
                    selectedEntity.description =
                        '<table class="cesium-infoBox-defaultTable"><tbody>' + description + '</tbody></table>';
                },
                Cesium.ScreenSpaceEventType.LEFT_CLICK);

            viewer.screenSpaceEventHandler.setInputAction(function (movement) {
                viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                silhouetteGreen.selected = [];
                silhouetteBlue.selected = [];
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        }
    },
    //飞行到视点,    x--经度；y--纬度，z--视距（m）
    flyTo(x, y, z) {
        cesiumInstance.viewer.scene.camera.flyTo({
            destination: new Cesium.Cartesian3.fromDegrees(x, y, z),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-25.0),
                roll: 0.0
            },
            duration: 3
        });
    },
    //不同数据资源添加到Cesium场景
    AddToScene(item) {
        let viewer = cesiumInstance.viewer;
        if (item.servicetype == 'ImageryLayer') {
            let imageryLayer = new Cesium.ImageryLayer(
                new Cesium.UrlTemplateImageryProvider({
                    url: item.serviceurl,
                    tilingScheme: new Cesium.WebMercatorTilingScheme(),
                    minimumLevel: 0,
                    maximumLevel: 21,
                    show: true
                })
            );
            viewer.imageryLayers.add(imageryLayer);
            cesiumInstance.models[item.id] = imageryLayer
        }
        if (item.servicetype == '3DTileset') {
            var tileset = new Cesium.Cesium3DTileset({
                url: item.serviceurl,  // 数据路径
                maximumScreenSpaceError: 8, // 最大的屏幕空间误差
                totalMemoryUsageInBytes: 2048
            });
            if (item.color.conditions) {
                tileset.style = new Cesium.Cesium3DTileStyle({
                    color: item.color
                })
            }
            viewer.scene.primitives.add(tileset);
            tileset.readyPromise.then(tileset => {
                //viewer.camera.flyToBoundingSphere(tileset.boundingSphere);
            });
            cesiumInstance.models[item.id] = tileset
        }
        if (item.servicetype == 'ArcGISMapServer') {
            let imageryLayer = new Cesium.ImageryLayer(
                new Cesium.ArcGisMapServerImageryProvider({
                    url: item.serviceurl
                })
            );
            viewer.imageryLayers.add(imageryLayer);
            cesiumInstance.models[item.id] = imageryLayer
        }
    }
}