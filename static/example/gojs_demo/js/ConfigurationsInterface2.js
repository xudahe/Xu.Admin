/* 
 * @Author: lijiwen
 * @Date:   2020-06-02
 * @Title：组态界面 组态画布组件
 * @参数：name: 画板名称 ；devices：站点code集合
 * @url： configuration/ConfigurationsInterface/ConfigurationsInterface
 */

define(["backbone", "gis/core/promiseUtils", "configuration/ConfigurationsInterface/mqttView", "text!./ConfigurationsInterface.html", "text!./modal/SwitchControlModal.html", "text!./modal/AuthoControlModal.html", "text!./modal/AdjustControModal.html", "configuration/ConfigurationsInterface/js/waterFlowControlView", "components/HistoryViewNew/ScadaSampleHistory", "frameworkthree/components/renderUnit/renderUnit", "frameworkthree/components/loadPanorama/loadPanorama", "configuration/js/go", "sha1"],
    function(Backbone, promiseUtils, mqttViewJS, template, switchControlModal, authoControlModal, adjustControModal, waterFlowControlView, ScadaSampleHistory, RenderUnit, LoadPanorama) {
        var goJS = go.GraphObject.make;
        var configUrl = urlUtils.getUrl("Publish/Web/");
        var imgUrl = urlUtils.getUrl("Publish/Web/");
        var judgeUrl = urlUtils.getUrl("Cityinterface/rest/services/OMS.svc/");
        var View = Backbone.View.extend({
            events: {
                "click .CIThreeDimension": "threeDimensionSwitch", //二维三维切换
                "click .CIFourDimension": "fourDimensionSwitch", //二维四维切换
            },

            render: function(options) {
                console.log(options);
                this.name = options.name;
                this.devices = options.devices ? options.devices.split(",") : [];
                this.callBack = options.callBack ? options.callBack : function() {};
                this.isScale = options.isScale != undefined ? options.isScale : true;
                if (!this.name || !this.devices.length || !this.$el.length) {
                    msgUtils.warning("配置信息不完整");
                    return false;
                }
                this.isRender = true;
                this.guidAggre = {};
                this.bindData = [];
                this._stationList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
                this.stationList = [];
                this.$el.html(_.template(template)());
                this.twoID = "TDG" + Date.now().toString(36);
                this.threeID = "TDD" + Date.now().toString(36);
                this.fourID = "FDD" + Date.now().toString(36);
                this.$el.find(".CIDimensionTwoBox").attr("id", this.twoID);
                this.$el.find(".CIDimensionThreeBox").attr("id", this.threeID);
                this.$el.find(".CIDimensionFourBox").attr("id", this.fourID);
                this._waterFlow = new waterFlowControlView();
                this._waterFlow.render();
                this.initiaPageRender();
                return this;
            },

            /**************************************************页面渲染**********************************************/
            initiaPageRender: function() {
                this.onlineMethod("https://panda-water.cn/web4/assets/images/bootPage/熊猫图标.png");
                // var me = this;
                // // 模型获取服务
                // var req1 = request(judgeUrl + "Network", {
                //     data: {
                //         _site: _config.userInfo.site ? _config.userInfo.site : "",
                //     },
                //     cacheBust: true
                // });
                // var reqArr = [req1];
                // promiseUtils.eachAlways(reqArr).then(function(results) {
                //     this.isBase = results[0].value ? (results[0].value.data ? true : false) : false;
                //     if (this.isBase && flag) {
                //         imgUrl = "https://panda-water.cn/Publish/Web/";
                //     }
                //     if (!this.isRender) return false;
                //     this.dataRender();
                // }.bind(this));
                // https://panda-water.cn/web4/assets/images/logo/单独图案-蓝绿色.svg
            },

            /**************************************************联网判断**********************************************/
            onlineMethod: function(pathImg) {
                var ImgObj = new Image();
                ImgObj.src = pathImg;
                ImgObj.onload = function(res) {
                    if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
                        this.isBase = true;
                    } else {
                        this.isBase = false;
                    }
                    if (this.isBase) {
                        imgUrl = "https://panda-water.cn/Publish/Web/";
                    }
                    if (!this.isRender) return false;
                    this.dataRender();
                }.bind(this)
                ImgObj.onerror = function(err) {
                    this.isBase = false;
                    if (this.isBase) {
                        imgUrl = "https://panda-water.cn/Publish/Web/";
                    }
                    if (!this.isRender) return false;
                    this.dataRender();
                }.bind(this)
            },

            /**************************************************数据获取**********************************************/
            dataRender: function() {
                msgUtils.loading(this.$el);
                this.stationList = [];
                require(["configuration/ConfigurationsInterface/modal/ProcessDrawModal","configuration/js/GuidedDraggingTool", "configuration/js/RotatingTool", "configuration/js/BarLink", "configuration/js/DrawCommandHand"], function(processDrawModal) {
                    this.processDrawModal = processDrawModal;
                    // 获取画板服务
                    var req1 = request(configUrl + "Sketchpad/SketchPad/List", {
                        query: {
                            _site: _config.userInfo.site ? _config.userInfo.site : "",
                            siteCode: _config.mqtt_site_code,
                            name: this.name
                        },
                        cacheBust: true
                    });
                    var reqArr = [req1];
                    promiseUtils.eachAlways(reqArr).then(function(results) {
                        msgUtils.unloading(this.$el);
                        console.log(results);
                        this.drawBoard = results[0].value ? results[0].value.data ? results[0].value.data.getMe ? results[0].value.data.getMe : [] : [] : [];
                        var list = this.drawBoard.filter(function(item, index) {
                            return item.name == this.name;
                        }.bind(this));
                        console.log(list);
                        if (!list.length || !list[0].deployURL) {
                            console.log('咦~未查询到工艺图画板信息哦~');
                            msgUtils.noResult(this.$el, "咦~未查询到工艺图画板信息哦~")
                            return false;
                        }
                        var num = list.length ? list[0].num ? list[0].num * 1 : 0 : 0;
                        var siteInfo = list.length ? list[0].siteInfo ? JSON.parse(list[0].siteInfo) : '' : '';
                        for (var i = 0; i < num; i++) {
                            var round = parseInt(i / 26),
                                remain = i % 26;
                            if (round) {
                                this.stationList.push(this._stationList[remain] + round);
                            } else {
                                this.stationList.push(this._stationList[remain]);
                            }
                        }
                        this.diagramJsonRender(list[0], siteInfo);
                    }.bind(this));
                }.bind(this));
            },

            /**************************************************画布Json获取**********************************************/
            diagramJsonRender: function(data, siteInfo) {
                msgUtils.loading(this.$el);
                $.ajax({
                    type: 'get',
                    url: configUrl + 'File/Sketch/Content/二维/' + data.deployURL.replace(/\\/g, "/"),
                    data: {
                        _site: _config.userInfo.site ? _config.userInfo.site : "",
                    },
                    cache: true
                }).done(function(response) {
                    msgUtils.unloading(this.$el);
                    var jsonStr = response ? response : `{ "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort" }`;
                    this.devices.forEach(function(item, index) {
                        var name = "设备" + this.stationList[index];
                        this.bindData.push({
                            code: item,
                            name: name,
                            type: siteInfo && siteInfo[name] ? siteInfo[name].Type : ''
                        })
                    }.bind(this));
                    this._mqttView = new mqttViewJS();
                    this._mqttView.render({ devices: this.devices, callback: this.refreshData.bind(this), controlback: this.controlData.bind(this) });
                    var theme = JSON.parse(jsonStr).theme ? JSON.parse(jsonStr).theme : "深色";
                    this.callBack(theme);
                    this.diagramRender(jsonStr);
                    // 三维渲染
                    try {
                        if (!data.threeDimonsionName && !data.panoramicModel) return false;
                        this.$el.find(".CIProcessMapHand").removeClass("CIHideCase");
                        if(data.threeDimonsionName){
                            this.$el.find(".CIThreeDimension").removeClass("CIHideCase");
                            this.threeDimensionRender(data.threeDimonsionName);
                        }
                        if(data.panoramicModel){
                            this.$el.find(".CIFourDimension").removeClass("CIHideCase");
                            this.fourDimensionRender(data.panoramicModel);
                        }
                    } catch (err) {}
                }.bind(this)).fail(function(err) {
                    msgUtils.unloading(this.$el);
                    msgUtils.noResult(this.$el, "咦~获取画布信息失败，请重试~")
                }.bind(this));
            },

            /**************************************************画布渲染**********************************************/
            diagramRender: function(jsonStr) {
                var me = this;
                this.myDiagram = goJS(go.Diagram, this.twoID, // must name or refer to the DIV HTML element
                    {
                        initialContentAlignment: go.Spot.Center,
                        contentAlignment: go.Spot.Center,
                        // contentAlignment: go.Spot.Default,
                        allowDrop: false, // must be true to accept drops from the Palette 右边的面板允许防止图形
                        draggingTool: new GuidedDraggingTool(),
                        // "grid.visible": true,
                        // minScale:0.5,
                        allowZoom: this.isScale ? false : true,
                        allowSelect: false,
                        "draggingTool.dragsLink": true,
                        isReadOnly: true,
                        autoScale: this.isScale ? go.Diagram.Uniform : go.Diagram.None, //自适应,默认不自适应
                        initialAutoScale: go.Diagram.Uniform, //自适应,默认不自适应
                        "draggingTool.isGridSnapEnabled": true,
                        "linkingTool.isUnconnectedLinkValid": true,
                        "animationManager.duration": 100,
                        allowHorizontalScroll: this.isScale ? false : true,
                        padding: 20,
                        allowVerticalScroll: this.isScale ? false : true,
                        "linkingTool.portGravity": 20,
                        "relinkingTool.isUnconnectedLinkValid": true,
                        "relinkingTool.portGravity": 20,
                        "draggingTool.horizontalGuidelineColor": "blue",
                        "draggingTool.verticalGuidelineColor": "blue",
                        "draggingTool.centerGuidelineColor": "green",
                        rotatingTool: goJS(TopRotatingTool), // defined below
                        "rotatingTool.snapAngleMultiple": 15,
                        "rotatingTool.snapAngleEpsilon": 15,
                        "undoManager.isEnabled": true,
                        "LinkDrawn": this.changLinkRouting,
                        'LinkReshaped': function(e) { e.subject.routing = go.Link.Orthogonal; },
                        "linkingTool.direction": go.LinkingTool.ForwardsOnly,
                        // grid: goJS(go.Panel, 'Grid', { gridCellSize: new go.Size(8, 8) }, goJS(go.Shape, 'LineH', { stroke: '#282d3b', strokeWidth: 1 }), goJS(go.Shape, 'LineV', { stroke: '#282d3b', strokeWidth: 1 })),
                    }
                );

                /**************************************************节点模板**********************************************/
                // svg节点定义
                this.myDiagram.nodeTemplateMap.add("svgCase",
                    goJS(go.Node, "Spot", { locationSpot: go.Spot.Center, zOrder: 1 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        new go.Binding("angle").makeTwoWay(),

                        // the main object is a Panel that surrounds a TextBlock with a Shape ~图形：Panel包围着TextBlock
                        goJS(go.Panel, "Auto", {
                                name: "PANEL"
                            },
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),

                            goJS(go.Picture, { width: 56, height: 56, column: 0, scale: 1, source: "" },
                                new go.Binding("source", "imgSrc", function(v) { return imgUrl + 'File/ModelManage/ModelFilePreview/' + encodeURIComponent(v); }).makeTwoWay(),
                                new go.Binding("scale", "scale").makeTwoWay(),
                                new go.Binding("width", "width").makeTwoWay(),
                                new go.Binding("height", "height").makeTwoWay()
                            )), this.makePort("T", go.Spot.Top, true, true),
                        this.makePort("L", go.Spot.Left, true, true),
                        this.makePort("R", go.Spot.Right, true, true),
                        this.makePort("B", go.Spot.Bottom, true, true),
                        this.makePort("RB", go.Spot.BottomRight, true, true),
                        this.makePort("LB", go.Spot.BottomLeft, true, true),
                        this.makePort("RT", go.Spot.TopRight, true, true),
                        this.makePort("LT", go.Spot.TopLeft, true, true), {
                            click: function(e, node) {
                                var data = node.data;
                                if (data.controlType == "画板跳转") {
                                    var name = data.chartInfo && data.chartInfo.name ? data.chartInfo.name : "";
                                    var title = data.chartInfo && data.chartInfo.title ? data.chartInfo.title : "";
                                    var device = data.chartInfo && data.chartInfo.device ? data.chartInfo.device : [];
                                    var width = data.chartInfo && data.chartInfo.width ? data.chartInfo.width : "";
                                    var height = data.chartInfo && data.chartInfo.height ? data.chartInfo.height : "";
                                    if(!name) return false;
                                    var _device = [];
                                    device.forEach(function(item){
                                        var _list = me.bindData.find(function(item1){return item1.name == item;});
                                        _device.push(_list ? _list.code : item);
                                    })
                                    if(me._chartModal) {
                                        me._chartModal.destroy();
                                        me._chartModal = null;
                                    }
                                    me._chartModal = new me.processDrawModal();
                                    me._chartModal.render({
                                        title: title,
                                        name: name,
                                        device: _device.join(","),
                                        width: width,
                                        height: height
                                    });
                                }
                            },
                        }
                    )
                );

                // 模板块定义
                this.myDiagram.nodeTemplateMap.add("modelCase",
                    goJS(go.Node, "Auto", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 1 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), { //设置其可改变大小
                            resizeObjectName: "SHAPE",
                        },
                        new go.Binding("angle").makeTwoWay(),
                        // { selectionChanged: nodeSelectionChanged },
                        goJS(go.Shape, "Rectangle", { name: "SHAPE", fill: "rgba(128,128,128,0.2)", stroke: "gray", },
                            new go.Binding("fill", "fillColor").makeTwoWay(),
                            new go.Binding("stroke").makeTwoWay(),
                            new go.Binding("strokeWidth").makeTwoWay(),
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        )
                    )
                );

                // 圆形定义
                this.myDiagram.nodeTemplateMap.add("ellipseCase",
                    goJS(go.Node, "Auto", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 1 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), { //设置其可改变大小
                            resizeObjectName: "SHAPE",
                        },
                        new go.Binding("angle").makeTwoWay(),
                        // { selectionChanged: nodeSelectionChanged },
                        goJS(go.Shape, "Ellipse", { name: "SHAPE", fill: "rgba(128,128,128,0.2)", stroke: "gray", },
                            new go.Binding("fill", "fillColor").makeTwoWay(),
                            new go.Binding("stroke").makeTwoWay(),
                            new go.Binding("strokeWidth").makeTwoWay(),
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        )
                    )
                );

                // 名称定义
                this.myDiagram.nodeTemplateMap.add("nameCase",
                    goJS(go.Node, "Auto", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 3 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        new go.Binding("angle").makeTwoWay(),
                        // { selectionChanged: nodeSelectionChanged },
                        goJS(go.Shape, "Rectangle", { name: "SHAPE", strokeWidth: 10, stroke: "#000000" },
                            new go.Binding("fill", "fillColor").makeTwoWay(),
                            new go.Binding("stroke").makeTwoWay(),
                            new go.Binding("strokeWidth").makeTwoWay(),
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        ),
                        goJS(go.TextBlock, this.textStyle(), {
                                margin: 5,
                                maxSize: new go.Size(NaN, NaN),
                                minSize: new go.Size(NaN, 1),
                                wrap: go.TextBlock.WrapFit,
                                textAlign: "center",
                                editable: true,
                                font: "bold 12px Helvetica, Arial, sans-serif",
                                stroke: '#454545'
                            },
                            new go.Binding("text").makeTwoWay(),
                            new go.Binding("font", "fontStyle"),
                            new go.Binding("stroke", "fontStroke").makeTwoWay(),
                        )
                    )
                );

                // 公用管定义
                this.myDiagram.nodeTemplateMap.add("HBar",
                    goJS(go.Node, "Auto", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 1 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        new go.Binding("angle").makeTwoWay(),
                        new go.Binding("angle").makeTwoWay(),
                        goJS(go.Shape, "Rectangle", {
                                name: "SHAPE",
                                stroke: "white",
                                strokeWidth: 6,
                                height: 0,
                                width: 120,
                                fill: "#41BFEC",
                                stroke: null,
                                strokeWidth: 0,
                                // width: 60, height:8,
                                minSize: new go.Size(20, 0),
                                maxSize: new go.Size(Infinity, 0),
                            },
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                            new go.Binding("minSize", "minSize").makeTwoWay(),
                            new go.Binding("maxSize", "maxSize").makeTwoWay(),
                            new go.Binding("stroke", "stroke").makeTwoWay(),
                            new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(),
                        ),
                        // goJS(go.Shape, { name: "changecolor", isPanelMain: true, stroke: "#41BFEC"  blue , strokeWidth: 6, height: 0, width: 120 },
                        //     ),
                        goJS(go.Shape, {
                                isPanelMain: true,
                                stroke: "white",
                                strokeWidth: 3,
                                height: 0,
                                width: 100,
                                name: "PIPE",
                                strokeDashArray: [20, 40]
                            },
                            new go.Binding("width").makeTwoWay(),
                            new go.Binding("stroke", "waterStroke").makeTwoWay(),
                            new go.Binding("strokeWidth", "waterWidth").makeTwoWay(),
                            new go.Binding("strokeDashArray", "strokeDashArray").makeTwoWay(), { portId: "", toLinkable: true, fromLinkable: true },
                        ), {
                            click: function(e, node) {
                                // console.log(e, link);
                                var data = node.data;
                                // console.log(data);
                            },
                        }
                    )
                );

                // 值定义
                this.myDiagram.nodeTemplateMap.add("valCase",
                    goJS(go.Node, "Auto", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 2 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        new go.Binding("angle").makeTwoWay(),
                        // { selectionChanged: nodeSelectionChanged },
                        goJS(go.Shape, "Rectangle", { name: "SHAPE", strokeWidth: 10, stroke: "#000000" },
                            new go.Binding("fill", "fillColor"),
                            new go.Binding("stroke"),
                            new go.Binding("strokeWidth"),
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        ),
                        goJS(go.TextBlock, this.textStyle(), {
                                // margin: 5,
                                maxSize: new go.Size(NaN, NaN),
                                minSize: new go.Size(NaN, 1),
                                wrap: go.TextBlock.WrapFit,
                                textAlign: "center",
                                editable: true,
                                font: "bold 12px Helvetica, Arial, sans-serif",
                                stroke: '#454545'
                            },
                            new go.Binding("text", "showVal"),
                            new go.Binding("font", "fontStyle"),
                            new go.Binding("stroke", "fontStroke")), {
                            click: function(e, node) {
                                var data = node.data;
                                var list = me.bindData.filter(function(item) {
                                    return item.name == data.stationName;
                                });
                                if (!list.length) return false;
                                if (data.realVal == "--") return false;
                                if (data.controlType == "输入控制") {
                                    var controlName = data.controlName || data.showName;
                                    $("body .CFSModal").remove();
                                    $("body").append("<div class='CFSModal'></div>");
                                    $("body .CFSModal").empty().append(_.template(adjustControModal)({ name: controlName, value: data.realVal }));
                                    $(".CFSModal .CFSModalClose").off().on("click", me.CFSModalClose);
                                    $(".CFSModal .CFSModalConfirm").off().on("click", (event) => { me.controlMethod(event, list[0].code, controlName, data) });
                                    $(".CFSModal .CFSModalMain").off().on("click", function(e) { e.stopPropagation(); });
                                } else if (data.controlType == "历史查看") {
                                    if (!data.pointName) return false;
                                    if (me.historyWidget) {
                                        me.historyWidget.widgetClose();
                                        me.historyWidget = null;
                                    }
                                    me.historyWidget = new ScadaSampleHistory({
                                        title: data.showName,
                                        stationCode: list[0].code,
                                        sensorName: data.showName,
                                        pointAddress: list[0].type,
                                        chartType: data.showName.indexOf("瞬时流量") > -1 ? 'areaspline' : 'spline',
                                        bgColor: '#282d3b',
                                    });
                                    me.historyWidget.widgetOpen();
                                }
                            }
                        }
                    )
                );

                // 连接点定义
                this.myDiagram.nodeTemplateMap.add("linkPort",
                    goJS(go.Node, "Auto", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 1 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        new go.Binding("angle").makeTwoWay(),
                        // { selectionChanged: this.nodeSelectionChanged },
                        goJS(go.Panel, "Auto", {
                                name: "PANEL"
                            },
                            // new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                            // Circle
                            goJS(go.Shape, "Rectangle", { fill: "transparent", strokeWidth: 0, width: 8, height: 8, minSize: new go.Size(5, 5) }, ))
                    )
                );

                // 水池动效
                go.Shape.defineFigureGenerator("Pool", function(shape, w, h) {
                    var geo = new go.Geometry();
                    var fig = new go.PathFigure(0, 0, true); // starting point
                    geo.add(fig);
                    fig.add(new go.PathSegment(go.PathSegment.Line, .75 * w, 0));
                    fig.add(new go.PathSegment(go.PathSegment.Line, w, .25 * h));
                    fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
                    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
                    return geo;
                });

                // 定义水池
                this.myDiagram.nodeTemplateMap.add("waterCase",
                    goJS(go.Node, "Auto", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 1 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        new go.Binding("angle").makeTwoWay(),
                        goJS(go.Shape, "Rectangle", { name: "SHAPE", alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Bottom, fill: "transparent", strokeWidth: 10, stroke: "red", desiredSize: new go.Size(NaN, 26) },
                            new go.Binding("width").makeTwoWay(), new go.Binding("height").makeTwoWay(), new go.Binding("stroke", "stroke").makeTwoWay(), new go.Binding("strokeWidth", "stokeColor").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()),
                        goJS(go.Shape, "Rectangle", { name: "SHAPE", alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Bottom, fill: "#ccc", strokeWidth: 10, stroke: "transparent", desiredSize: new go.Size(NaN, 26) },
                            new go.Binding("width").makeTwoWay(), new go.Binding("height").makeTwoWay(), new go.Binding("fill", "fontStroke").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()),
                        goJS(go.Shape, "Pool", { name: "waterSvg", alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Bottom, fill: "#DEE0A3", stroke: "transparent", strokeWidth: 10, minSize: new go.Size(NaN, 5), desiredSize: new go.Size(NaN, 20) },
                            new go.Binding("width").makeTwoWay(), new go.Binding("height", "waterHight").makeTwoWay(), new go.Binding("fill", "fillColor").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay())
                    )
                );

                // 泵状态设置
                this.myDiagram.nodeTemplateMap.add("rotateCase",
                    goJS(go.Node, "Table", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 2 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), { //设置其可改变大小
                            resizeObjectName: "SHAPE",
                            rotatable: true
                        },
                        goJS(go.Panel, "Table", {
                                name: "PANEL"
                            },
                            goJS(go.Shape,
                                "Ellipse", //定义形状
                                { width: 37, height: 37, fill: "transparent", stroke: "transparent", strokeWidth: 1 },
                                new go.Binding("width", "widthBox").makeTwoWay(),
                                new go.Binding("height", "heightBox").makeTwoWay()
                            ),
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),

                            goJS(go.Picture, { name: "rotateSvg", width: 26, height: 26, column: 0, scale: 1, source: "assets/images/组态/状态/泵离线.svg", angle: 0 },
                                new go.Binding("source", "imgSrc").makeTwoWay(),
                                new go.Binding("scale", "scale").makeTwoWay(),
                                new go.Binding("width", "width").makeTwoWay(),
                                new go.Binding("angle", "angle").makeTwoWay(),
                                new go.Binding("height", "height").makeTwoWay(),
                            )),
                        // no ports, because no links are allowed to connect with a comment
                    )
                );

                // 点状态设置
                this.myDiagram.nodeTemplateMap.add("pointCase",
                    goJS(go.Node, "Auto", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 2 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        new go.Binding("angle").makeTwoWay(),
                        // { selectionChanged: nodeSelectionChanged },
                        goJS(go.Shape, "Ellipse", { width: 14, height: 14, name: "SHAPE", fill: "rgba(109, 122, 151, 1)", stroke: "#ffffff", },
                            new go.Binding("fill", "fillColor").makeTwoWay(),
                            // new go.Binding("stroke").makeTwoWay(),
                            // new go.Binding("strokeWidth").makeTwoWay(),
                            new go.Binding("height", "height").makeTwoWay(),
                            new go.Binding("width", "height").makeTwoWay(),
                        )
                    )
                );

                // 开关开设置
                this.myDiagram.nodeTemplateMap.add("switchCase",
                    goJS(go.Node, "Auto", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 2 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                        new go.Binding("angle").makeTwoWay(),
                        goJS(go.Shape, "RoundedRectangle", { name: "SHAPE", strokeWidth: 10, stroke: "#000000" },
                            new go.Binding("fill", "fillColor"),
                            new go.Binding("stroke"),
                            new go.Binding("strokeWidth"),
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
                        ),
                        goJS(go.TextBlock, this.textStyle(), {
                                // margin: 5,
                                maxSize: new go.Size(NaN, NaN),
                                minSize: new go.Size(NaN, 1),
                                wrap: go.TextBlock.WrapFit,
                                textAlign: "center",
                                editable: true,
                                font: "bold 12px Helvetica, Arial, sans-serif",
                                stroke: '#454545'
                            },
                            new go.Binding("text"),
                            new go.Binding("font", "fontStyle"),
                            new go.Binding("stroke", "fontStroke")), {
                            toolTip: // define a tooltip for each node that displays the color as text
                                goJS("ToolTip",
                                    goJS(go.TextBlock, { margin: 2 },
                                        new go.Binding("text", "text"))
                                )
                        }, {
                            click: function(e, node) {
                                var data = node.data;
                                var list = me.bindData.filter(function(item) {
                                    return item.name == data.stationName;
                                });
                                if (!list.length) return false;
                                if (data.switchState == "开" || data.realVal == "--") return false;
                                var controlName = data.controlName || data.showName;
                                $("body .CFSModal").remove();
                                $("body").append("<div class='CFSModal'></div>");
                                $("body .CFSModal").empty().append(_.template(switchControlModal)({ type: "确定要" + data.text + controlName + "？" }));
                                $(".CFSModal .CFSModalClose").off().on("click", me.CFSModalClose);
                                $(".CFSModal .CFSModalConfirm").off().on("click", (event) => { me.defineSwitch(event, list[0].code, controlName, data) });
                                $(".CFSModal .CFSModalMain").off().on("click", function(e) { e.stopPropagation(); });
                                // me._mqttView.onSendWaMessageArrived(list[0].code, data.showName, '开');
                            },
                        }
                    )
                );

                // 搅拌机状态设置
                this.myDiagram.nodeTemplateMap.add("blenderCase",
                    goJS(go.Node, "Table", this.nodeStyle(), "Spot", { locationSpot: go.Spot.Center, zOrder: 2 },
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), { //设置其可改变大小
                            resizeObjectName: "SHAPE",
                            rotatable: true
                        },
                        new go.Binding("angle").makeTwoWay(),
                        // { selectionChanged: nodeSelectionChanged },
                        goJS(go.Panel, "Auto", {
                                name: "PANEL"
                            },
                            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),

                            goJS(go.Picture, { name: "blenderSvg", width: 42.5, height: 56, column: 0, scale: 1, source: "assets/images/组态/状态/搅拌机双头1.svg", angle: 0 },
                                new go.Binding("source", "imgSrc").makeTwoWay(),
                                new go.Binding("scale", "scale").makeTwoWay(),
                                new go.Binding("width", "width").makeTwoWay(),
                                new go.Binding("angle", "angle").makeTwoWay(),
                                new go.Binding("height", "height").makeTwoWay(),
                            )), {
                            toolTip: // define a tooltip for each node that displays the color as text
                                goJS("ToolTip",
                                    goJS(go.TextBlock, { margin: 2 },
                                        new go.Binding("text", "text"))
                                )
                        }
                        // no ports, because no links are allowed to connect with a comment
                    )
                );

                //连接线装饰模板
                var linkSelectionAdornmentTemplate = goJS(go.Adornment, "Link", goJS(
                        go.Shape,
                        // isPanelMain declares that this Shape shares the Link.geometry
                        {
                            isPanelMain: true,
                            fill: null,
                            stroke: "deepskyblue",
                            strokeWidth: 0
                        }
                    ) // use selection object's strokeWidth
                );

                /****************************************单管连接方式*******************************************/
                this.myDiagram.linkTemplate =
                    goJS(BarLink, {
                            curve: go.Link.JumpOver,
                            // adjusting: go.Link.Stretch,
                            toShortLength: 0,
                            fromShortLength: 0,
                            layerName: "Background",
                            routing: go.Link.Orthogonal, //不同的位置进行不同的routing
                            // adjusting: go.Link.End,
                            corner: 2,
                            //  fromSpot: go.Spot.RightSide,
                            //   toSpot: go.Spot.LeftSide,
                            reshapable: true,
                            resegmentable: true,
                            relinkableFrom: true,
                            relinkableTo: true,
                            relinkableFrom: true,
                            relinkableTo: true
                        },
                        // make sure links come in from the proper direction and go out appropriately
                        new go.Binding("fromSpot", "fromPort", function(d) {
                            return spotConverter(d);
                        }),
                        new go.Binding("toSpot", "toPort", function(d) {
                            return spotConverter(d);
                        }),
                        new go.Binding("points").makeTwoWay(),
                        // mark each Shape to get the link geometry with isPanelMain: true
                        goJS(go.Shape, { isPanelMain: true, stroke: "#41BFEC" /* blue*/ , strokeWidth: 6, name: "changecolor" },
                            new go.Binding("stroke", "stroke"), new go.Binding("strokeWidth", "strokeWidth")),
                        goJS(go.Shape, { isPanelMain: true, stroke: "white", strokeWidth: 3, name: "PIPE", strokeDashArray: [20, 40] }, new go.Binding("strokeWidth", "waterWidth"), new go.Binding("stroke", "waterStroke")), {
                            click: function(e, link) {
                                // console.log(link.data);
                            },
                        }
                    );

                /****************************************合管连接方式*******************************************/
                this.myDiagram.linkTemplateMap.add("linkToLink",
                    goJS("Link", { relinkableFrom: true, relinkableTo: true },
                        goJS("Shape", { stroke: "#2D9945", strokeWidth: 2 }), {
                            click: function(e, link) {
                                // console.log(e, link);
                                var data = link.data;
                                // console.log(data);
                                var node1 = me.myDiagram.model.findLinkDataForKey(data.key);
                                me.myDiagram.model.setDataProperty(data, "color", "red");
                            },
                        }
                    )
                );
                var fromJson = JSON.parse(jsonStr);
                this.setTime = setTimeout(function() {
                    me.loop();
                    me.waterSvg();
                    me.rotateSvg();
                    me.blenderSvg();
                }, 100);
                var json = JSON.parse(JSON.stringify(fromJson));
                json.linkDataArray.forEach(function(item) {
                    item.isHavingDash = true;
                    item.realVal = "--";
                    item.defaultWidth = item.waterWidth;
                })
                json.nodeDataArray.forEach(function(item) {
                    item.showVal = "--"
                    item.realVal = "--";
                    item.realType = "离线";
                    item.Unit = "";
                    item.switchState = "开";
                    if (item.category == "HBar") {
                        item.hBarClolor = item.waterStroke;
                        item.typeDash = false;
                    }
                    if (item.category == "nameCase") {
                        item._fillColor = item.fillColor;
                        item._stroke = item.stroke;
                        item._fontStroke = item.fontStroke;
                    }
                })
                this.myDiagram.model = go.Model.fromJson(json);
            },

            /****************************************控制方法*******************************************/
            controlMethod: function(e, code, tag, node) {
                e.stopPropagation();
                var dom = $(e.currentTarget).parents(".CFSModal");
                var value = dom.find(".setValBox").val();
                if (!value) {
                    msgUtils.warning("设置值不能为空！");
                    return false;
                } else {
                    if (isNaN(value * 1)) {
                        msgUtils.warning("设置值不合理！");
                        return false;
                    } else {
                        if (value < 0) {
                            msgUtils.warning("设置值不合理！");
                            return false;
                        }
                    }
                }
                var guid = this.createGuid();
                this.CFSModalClose();
                if (node.authoControl == "是") {
                    this.authoMethod(code, tag, node, guid, value);
                    return false;
                } else {
                    this.guidAggre[guid] = {
                        tag: tag,
                        code: code
                    }
                    this._mqttView.onSendWaMessageArrived(_config.token || "", "", guid, code, tag, node.switchType, value * 1);
                }
            },

            /****************************************开关控制确定*******************************************/
            defineSwitch: function(e, code, tag, node) {
                e.stopPropagation();
                var guid = this.createGuid();
                this.CFSModalClose();
                if (node.authoControl == "是") {
                    this.authoMethod(code, tag, node, guid, "");
                    return false;
                } else {
                    this.guidAggre[guid] = {
                        tag: tag,
                        code: code
                    }
                    this._mqttView.onSendWaMessageArrived(_config.token || "", "", guid, code, tag, node.text, "");
                }
            },

            /****************************************权限控制方法*******************************************/
            authoMethod: function(code, tag, node, guid, value) {
                var me = this;
                $("body .CFSModal").remove();
                $("body").append("<div class='CFSModal'></div>");
                $("body .CFSModal").empty().append(_.template(authoControlModal)());
                $(".CFSModal .CFSModalClose").off().on("click", me.CFSModalClose);
                $(".CFSModal #CFSLoginForm").off().on("submit", (event) => { me.defineAutho(event, code, tag, node, guid, value) });
                $(".CFSModal .CFSModalMain").off().on("click", function(e) { e.stopPropagation(); });
            },

            /****************************************权限控制确认*******************************************/
            defineAutho: function(e, code, tag, node, guid, value) {
                var dom = $(e.currentTarget).parents(".CFSModal");
                var userName = dom.find(".userNameBox").val();
                var password = dom.find(".passWordBox").val();
                if (!userName || !password) {
                    msgUtils.warning("用户名或密码不能为空！");
                    e.preventDefault();
                    return false;
                }
                this.CFSModalClose();
                this.guidAggre[guid] = {
                    tag: tag,
                    code: code
                }
                var type = node.switchType ? node.text : '';
                this._mqttView.onSendWaMessageArrived(userName, sha1(password).toUpperCase(), guid, code, tag, type, value);
                e.preventDefault();
            },

            /****************************************合管*******************************************/
            changLinkRouting: function(e) {
                var link = e.subject;
                if (link.toNode == null || link.fromNode == null) {
                    return false;
                }
                if (link.fromNode.category === "HBar" || link.toNode.category === "HBar") {
                    e.subject.routing = go.Link.Normal;
                }
            },

            /*****************************************数据处理*********************************/
            dataHandle: function(data) {
                data.forEach(function(item, index) {
                    switch (item.controlType) {
                        case "开关展示":
                            item.switchState = (item.openVal.toString().split(",")).indexOf(item.realVal.toString()) > -1 ? "开" : "关";
                            if (item.category == "switchCase" && item.switchType == "关")
                                item.switchState = (item.openVal.toString().split(",")).indexOf(item.realVal.toString()) > -1 ? "关" : "开";
                            break;
                        case "开关控制":
                            item.switchState = (item.openVal.toString().split(",")).indexOf(item.realVal.toString()) > -1 ? "开" : "关";
                            if (item.category == "switchCase" && item.switchType == "关")
                                item.switchState = (item.openVal.toString().split(",")).indexOf(item.realVal.toString()) > -1 ? "关" : "开";
                            break;
                        default:
                            break;
                    }
                    var node = this.myDiagram.model.findNodeDataForKey(item.key);
                    this.myDiagram.model.setDataProperty(node, 'switchState', item.switchState);
                }.bind(this))
            },

            /**************************************创建连接点************************************/
            //创建一个port,ID为name,spot控制其怎么被连接,放置于node的什么位置,output/input决定其哪里可以from和to
            makePort: function(name, spot, output, input) {
                // the port is basically just a small transparent square
                return goJS(go.Shape, "Circle", {
                    fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
                    stroke: null,
                    desiredSize: new go.Size(7, 7),
                    alignment: spot, // align the port on the main Shape
                    alignmentFocus: spot, // just inside the Shape
                    portId: name, // declare this object to be a "port"
                    fromSpot: spot,
                    toSpot: spot, // declare where links may connect at this port
                    fromLinkable: output,
                    toLinkable: input, // declare whether the user may draw links to/from here
                    cursor: "pointer" // show a different cursor to indicate potential link point
                });
            },

            /********************************************水池效果**************************************/
            waterSvg: function() {
                var me = this;
                var i = 0;
                var diagram = this.myDiagram;
                this.poolWater = setInterval(function() {
                    var oldskips = diagram.skipsUndoManager;
                    diagram.skipsUndoManager = true;
                    diagram.nodes.each(function(node) {
                        var shape = node.findObject("waterSvg");
                        if (!shape) return false;
                        var off = shape.height + 0.3;
                        range = (shape.range ? shape.range : 0) + 0.5;
                        shape.range = (range >= 5) ? 0 : range;
                        shape.geometryString = 'F M0 ' + shape.range + ' L' + shape.width + ' ' + (5 - shape.range) + ' L' + shape.width + ' ' + shape.height + ' L0 ' + shape.height + 'z';
                    });
                    diagram.skipsUndoManager = oldskips;
                }, 100);
            },

            /*****************************************水流效果***********************************/
            loop: function() {
                var me = this;
                var diagram = this.myDiagram;
                this.tubeWater = setInterval(function() {
                    var oldskips = diagram.skipsUndoManager;
                    diagram.skipsUndoManager = true;
                    diagram.links.each(function(link) {
                        var shape = link.findObject("PIPE");
                        if (!shape) return false;
                        if (link.data.isHavingDash) {
                            link.zOrder = 1;
                            shape.strokeWidth = link.data.defaultWidth || 3;
                            var off = shape.strokeDashOffset - 3;
                            shape.strokeDashOffset = (off <= 0) ? 60 : off;
                        } else {
                            link.zOrder = 0;
                            shape.strokeWidth = 0;
                            shape.strokeDashOffset = 0;
                        }
                    });
                    diagram.skipsUndoManager = oldskips;
                }, 60);
            },

            /****************************************泵状态效果*********************************/
            rotateSvg: function() {
                var diagram = this.myDiagram;
                this.pumpType = setInterval(function() {
                    var oldskips = diagram.skipsUndoManager;
                    diagram.skipsUndoManager = true;
                    diagram.nodes.each(function(node) {
                        var shape = node.findObject("rotateSvg");
                        if (!shape) return false;
                        var _node = node.data;
                        if (_node.realType != "运行") return false;
                        var off = shape.angle + 60;
                        shape.angle = (off <= 360) ? off : 0;
                    });
                    diagram.skipsUndoManager = oldskips;
                }, 60);
            },

            /******************************************搅拌机状态效果**********************************/
            blenderSvg: function() {
                var diagram = this.myDiagram;
                this.blenderType = setInterval(function() {
                    var oldskips = diagram.skipsUndoManager;
                    diagram.skipsUndoManager = true;
                    diagram.nodes.each(function(node) {
                        var shape = node.findObject("blenderSvg");
                        if (!shape) return false;
                        var _node = node.data;
                        if (_node.switchState != "开" || _node.realVal == "--") {
                            shape.source = shape.source.replace(/[0-9]/ig, 1);
                            return false;
                        }
                        shape.flag = shape.flag || 1;
                        var num = shape.source.replace(/[^0-9]/ig, "") * 1;
                        var _num = 1;
                        if (shape.flag == 1) {
                            _num = num < 5 ? (num + 1) : 4;
                            if (num >= 5) shape.flag = 2;
                        } else {
                            _num = num > 1 ? (num - 1) : 2;
                            if (num <= 1) shape.flag = 1;
                        }
                        shape.source = shape.source.replace(/[0-9]/ig, _num);
                    });
                    diagram.skipsUndoManager = oldskips;
                }, 100);
            },

            /*********************将myDiagram.model中的信息展示在画板上****************************/
            loadDiagramProperties: function(e) {
                var pos = this.myDiagram.model.modelData.position;
                if (pos)
                    this.myDiagram.initialPosition = go.Point.parse(pos);
            },

            /**************************************************节点样式**********************************************/
            nodeStyle: function() {
                return [
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        locationSpot: go.Spot.Center
                    }
                ];
            },

            /******************************************文本样式*******************************/
            textStyle: function() {
                return {
                    font: "bold 11pt Helvetica, Arial, sans-serif",
                    stroke: "whitesmoke"
                }
            },

            /*************************************MQTT控制结果回调**********************************/
            controlData: function(mqttDatas, code, topic) {
                var controlInfo = JSON.parse(mqttDatas);
                if (this.guidAggre[code]) {
                    var guid = this.guidAggre[code];
                    if (!controlInfo.result) {
                        msgUtils.warning(guid.tag + "控制失败，" + controlInfo.message + "！");
                    } else {
                        msgUtils.success(guid.tag + "控制下发成功。");
                        this.guidCode = guid.code;
                        this.isNum = 0;
                    }
                    delete this.guidAggre[code];
                }
            },

            /***********************************MQTT请求数据回调*******************************/
            refreshData: function(mqttDatas, code, topic) {
                var me = this;
                var list = this.bindData.filter(function(item) {
                    return item.code == code;
                })
                var oldJson = new Object();
                var name = list.length ? list[0].name : "";
                var mqttData = JSON.parse(mqttDatas)[code];
                if (!mqttData) return false;
                try {
                    if (this.unitRender) this.unitRender.tipRender({ deviceID: code, data: mqttData });
                } catch (err) {}
                var json = JSON.parse(this.myDiagram.model.toJson());
                var json_ = JSON.parse(JSON.stringify(json));
                var oldJson = this.deepCopy(json_);
                // if (this.guidCode == code) {
                //     this.isNum++;
                //     if (this.isNum == 1) {
                //         this.guidCode = null;
                //         this.isNum = 0;
                //         return false;
                //     }
                // }

                try {
                    me.myDiagram.model.linkDataArray.forEach((item) => {
                        if (item.stationName == name && item.showName && item.controlType == "线条控制" && (!item.category || item.category == "sharpLine" || item.category == "curveLine")) {
                            mqttData.forEach((list, index) => {
                                if (list.Value == null) return false;
                                var _item = list.ItemID;
                                var _num = _item.lastIndexOf(".");
                                var node = me.myDiagram.findLinkForData(item);
                                var _pointName = _item.substring(0, _num);
                                var _showName = _item.substring(_num + 1, Infinity);
                                if (_showName == item.showName) {
                                    item.realVal = list.Value * 1;
                                    var isDefault = (item.openVal.toString().split(",")).indexOf(item.realVal.toString()) > -1 ? true : false;
                                    if (!isDefault) {
                                        me.myDiagram.model.setDataProperty(item, 'stroke', item.unstroke);
                                        me.myDiagram.model.setDataProperty(item, 'waterStroke', item.unwaterStroke);
                                    } else {
                                        me.myDiagram.model.setDataProperty(item, 'stroke', item.stroke);
                                        me.myDiagram.model.setDataProperty(item, 'waterStroke', item.waterStroke);
                                    }
                                }
                            })
                        }
                    })
                } catch (e) {}

                try {
                    json_.nodeDataArray.forEach((item) => {
                        if (item.stationName != name || !(item.showName || item.figure == "updateTime")) return false;
                        if(item.category == "nameCase" && item.figure == "name" && item.controlType == "不控制") return false;
                        var node = me.myDiagram.model.findNodeDataForKey(item.key);
                        mqttData.forEach((list, index) => {
                            if (list.Value == null) return false;
                            if (node.figure == "updateTime") me.myDiagram.model.setDataProperty(node, 'text', new Date(list.Time).format("yyyy年MM月dd日 hh时mm分ss秒"));
                            var _item = list.ItemID;
                            var _num = _item.lastIndexOf(".");
                            var _pointName = _item.substring(0, _num);
                            var _showName = _item.substring(_num + 1, Infinity);
                            //  && _pointName == item.pointName
                            if (_showName == item.showName) {
                                if(item.showVal == list.Value || item.realVal == list.Value) return false;
                                item.realVal = list.Value;
                                item.showVal = list.Value < 0 ? 0 : list.Value;
                                me.myDiagram.model.setDataProperty(node, 'realVal', item.realVal);
                                me.myDiagram.model.setDataProperty(node, 'showVal', item.showVal);
                                switch (item.controlType) {
                                    case "开关展示":
                                        item.switchState = (item.openVal.toString().split(",")).indexOf(item.realVal.toString()) > -1 ? "开" : "关";
                                        if (item.category == "switchCase" && item.switchType == "关")
                                            item.switchState = (item.openVal.toString().split(",")).indexOf(item.realVal.toString()) > -1 ? "关" : "开";
                                        break;
                                    case "开关控制":
                                        item.switchState = (item.openVal.toString().split(",")).indexOf(item.realVal.toString()) > -1 ? "开" : "关";
                                        if (item.category == "switchCase" && item.switchType == "关")
                                            item.switchState = (item.openVal.toString().split(",")).indexOf(item.realVal.toString()) > -1 ? "关" : "开";
                                        break;
                                    default:
                                        break;
                                }
                                me.myDiagram.model.setDataProperty(node, 'switchState', item.switchState);
                                switch (item.category) {
                                    case "waterCase":
                                        var _height = item.height - item.strokeWidth * 2;
                                        var waterHight = (list.Value * _height) / item.poolHeight;
                                        waterHight = (waterHight >= _height) ? _height : waterHight;
                                        me.myDiagram.model.setDataProperty(node, 'waterHight', waterHight);
                                        break;
                                    case "rotateCase":
                                        if (item.controlType == "开关展示") {
                                            me.typeState(node.text, node);
                                        } else {
                                            me.typeSwitch(list.Value, node.text, node);
                                        }
                                        break;
                                    case "switchCase":
                                        if (item.switchState == "开" && item.switchType == "开") {
                                            me.myDiagram.model.setDataProperty(node, 'fillColor', "rgba(9, 185, 105, 1)");
                                        } else if (item.switchState == "关" && item.switchType == "开") {
                                            me.myDiagram.model.setDataProperty(node, 'fillColor', "rgba(8, 39, 64, 1)");
                                        } else if (item.switchState == "开" && item.switchType == "关") {
                                            me.myDiagram.model.setDataProperty(node, 'fillColor', "rgba(186, 27, 59, 1)");
                                        } else {
                                            me.myDiagram.model.setDataProperty(node, 'fillColor', "rgba(8, 39, 64, 1)");
                                        }
                                        break;
                                    case "pointCase":
                                        if (item.controlType == "开关展示") {
                                            me.typeState(node.text, node, true);
                                        } else {
                                            me.typeSwitch(list.Value, node.text, node, true);
                                        }
                                        break;
                                    case "nameCase":
                                        if (item.controlType == "开关展示") {
                                            if(item.switchState == "关") {
                                                me.myDiagram.model.setDataProperty(node, 'fillColor', "transparent");
                                                me.myDiagram.model.setDataProperty(node, 'stroke', "transparent");
                                                me.myDiagram.model.setDataProperty(node, 'fontStroke', "transparent");
                                            } else {
                                                me.myDiagram.model.setDataProperty(node, 'fillColor', node._fillColor);
                                                me.myDiagram.model.setDataProperty(node, 'stroke', node._stroke);
                                                me.myDiagram.model.setDataProperty(node, 'fontStroke', node._fontStroke);
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        })
                    })
                    this.dataHandle(json_.nodeDataArray);
                    var jsonModel = this._waterFlow.waterFlowControlByDiagramJson(oldJson, this.myDiagram);
                    // 代表管子
                    if (jsonModel) {
                        var newLink = jsonModel.linkDataArray;
                        var oldLink = me.myDiagram.model.linkDataArray;
                        var newNode = jsonModel.nodeDataArray;
                        var dataLink = [];
                        newLink.forEach(function(item, index) {
                            var list = Object.assign({}, oldLink[index]);
                            list.isHavingDash = item.isHavingDash;
                            dataLink.push(list);
                        })
                        newNode.forEach(function(item, index) {
                            if (item.category == "HBar") {
                                var node = me.myDiagram.model.findNodeDataForKey(item.key);
                                var waterStroke = item.typeDash ? "transparent" : item.hBarClolor;
                                if(item.typeDash != node.typeDash) {
                                    me.myDiagram.model.setDataProperty(node, 'waterStroke', waterStroke);
                                    me.myDiagram.model.setDataProperty(node, 'typeDash', item.typeDash);
                                }
                            }
                        })
                        dataLink.forEach(function(item) {
                            var node = me.myDiagram.findLinkForData(item);
                            if(item.isHavingDash != node.data.isHavingDash)
                            me.myDiagram.model.setDataProperty(node.data, 'isHavingDash', item.isHavingDash);
                        })
                    }
                } catch (e) {}
            },

            /*****************************************状态类型切换********************************/
            typeSwitch: function(num, type, node, flag) {
                switch (num) {
                    case 0:
                        if (flag) {
                            this.myDiagram.model.setDataProperty(node, 'fillColor', goJS(go.Brush, "Linear", { 0.0: "#6D7A97", 1.0: "#9FB3BF", start: go.Spot.Top, end: go.Spot.Bottom }));
                            return false;
                        }
                        this.myDiagram.model.setDataProperty(node, 'imgSrc', "assets/images/组态/状态/" + type + "离线.svg");
                        this.myDiagram.model.setDataProperty(node, 'realType', "离线");
                        break;
                    case 1:
                        if (flag) {
                            this.myDiagram.model.setDataProperty(node, 'fillColor', goJS(go.Brush, "Linear", { 0.0: "#6D7A97", 1.0: "#9FB3BF", start: go.Spot.Top, end: go.Spot.Bottom }));
                            return false;
                        }
                        this.myDiagram.model.setDataProperty(node, 'imgSrc', "assets/images/组态/状态/" + type + "离线.svg");
                        this.myDiagram.model.setDataProperty(node, 'realType', "离线");
                        break;
                    case 2:
                        if (flag) {
                            this.myDiagram.model.setDataProperty(node, 'fillColor', goJS(go.Brush, "Linear", { 0.0: "#09e014", 1.0: "#069d0d", start: go.Spot.Top, end: go.Spot.Bottom }));
                            return false;
                        }
                        this.myDiagram.model.setDataProperty(node, 'imgSrc', "assets/images/组态/状态/" + type + "运行.svg");
                        this.myDiagram.model.setDataProperty(node, 'realType', "运行");
                        break;
                    case 3:
                        if (flag) {
                            this.myDiagram.model.setDataProperty(node, 'fillColor', goJS(go.Brush, "Linear", { 0.0: "#FB596C", 1.0: "#D0384F", start: go.Spot.Top, end: go.Spot.Bottom }));
                            return false;
                        }
                        this.myDiagram.model.setDataProperty(node, 'imgSrc', "assets/images/组态/状态/" + type + "故障.svg");
                        this.myDiagram.model.setDataProperty(node, 'realType', "故障");
                        break;
                    case 4:
                        if (flag) {
                            this.myDiagram.model.setDataProperty(node, 'fillColor', goJS(go.Brush, "Linear", { 0.0: "#09e014", 1.0: "#069d0d", start: go.Spot.Top, end: go.Spot.Bottom }));
                            return false;
                        }
                        this.myDiagram.model.setDataProperty(node, 'imgSrc', "assets/images/组态/状态/" + type + "运行.svg");
                        this.myDiagram.model.setDataProperty(node, 'realType', "运行");
                        break;
                    default:
                        if (flag) {
                            this.myDiagram.model.setDataProperty(node, 'fillColor', goJS(go.Brush, "Linear", { 0.0: "#6D7A97", 1.0: "#9FB3BF", start: go.Spot.Top, end: go.Spot.Bottom }));
                            return false;
                        }
                        this.myDiagram.model.setDataProperty(node, 'imgSrc', "assets/images/组态/状态/" + type + "离线.svg");
                        this.myDiagram.model.setDataProperty(node, 'realType', "离线");
                        break;
                }
            },

            /******************************************状态开关切换******************************/
            typeState: function(type, node, flag) {
                switch (node.switchState) {
                    case '关':
                        if (flag) {
                            this.myDiagram.model.setDataProperty(node, 'fillColor', goJS(go.Brush, "Linear", { 0.0: "#6D7A97", 1.0: "#9FB3BF", start: go.Spot.Top, end: go.Spot.Bottom }));
                            return false;
                        }
                        this.myDiagram.model.setDataProperty(node, 'imgSrc', "assets/images/组态/状态/" + type + "离线.svg");
                        this.myDiagram.model.setDataProperty(node, 'realType', "离线");
                        break;
                    case '开':
                        if (flag) {
                            this.myDiagram.model.setDataProperty(node, 'fillColor', goJS(go.Brush, "Linear", { 0.0: "#09e014", 1.0: "#069d0d", start: go.Spot.Top, end: go.Spot.Bottom }));
                            return false;
                        }
                        this.myDiagram.model.setDataProperty(node, 'imgSrc', "assets/images/组态/状态/" + type + "运行.svg");
                        this.myDiagram.model.setDataProperty(node, 'realType', "运行");
                        break;
                    default:
                        if (flag) {
                            this.myDiagram.model.setDataProperty(node, 'fillColor', goJS(go.Brush, "Linear", { 0.0: "#6D7A97", 1.0: "#9FB3BF", start: go.Spot.Top, end: go.Spot.Bottom }));
                            return false;
                        }
                        this.myDiagram.model.setDataProperty(node, 'imgSrc', "assets/images/组态/状态/" + type + "离线.svg");
                        this.myDiagram.model.setDataProperty(node, 'realType', "离线");
                        break;
                }
            },

            /********************************************************重新渲染***************************************************/
            diagramRefresh: function(options) {
                this.name = options.name || this.name;
                this.bindData = [];
                // 获取画板服务
                var req1 = request(configUrl + "ModelManage/Sketchpad", {
                    query: {
                        _site: _config.userInfo.site ? _config.userInfo.site : "",
                        siteCode: _config.mqtt_site_code,
                        name: this.name
                    },
                    cacheBust: true
                });
                var reqArr = [req1];
                msgUtils.loading(this.$el);
                promiseUtils.eachAlways(reqArr).then(function(results) {
                    msgUtils.unloading(this.$el);
                    this.drawBoard = results[0].value ? results[0].value.data ? results[0].value.data.getMe ? results[0].value.data.getMe : [] : [] : [];
                    var list = this.drawBoard.filter(function(item, index) {
                        return item.name == this.name;
                    }.bind(this));
                    var jsonStr = list.length ? list[0].deployURL : { "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort" };
                    var fromJson = JSON.parse(jsonStr);
                    var json = JSON.parse(JSON.stringify(fromJson));
                    json.linkDataArray.forEach(function(item) {
                        item.isHavingDash = false;
                    })
                    json.nodeDataArray.forEach(function(item) {
                        item.showVal = "--"
                        item.realVal = "--";
                        item.Unit = "";
                        item.switchState = "关";
                    })
                    this.myDiagram.model = go.Model.fromJson(json);
                }.bind(this));
            },

            /**************************************对比数组差异*************************************/
            diffent: function(fArr, cArr, field) {
                let diffRes = []
                let fDatas = []
                let cDatas = []
                for (let i in fArr) {
                    let flg = false
                    for (let j in cArr) {
                        if (cArr[j][field] === fArr[i][field]) {
                            flg = true
                            break
                        }
                    }
                    if (!flg) {
                        fDatas.push(fArr[i])
                    }
                }
                for (let i in cArr) {
                    let flg = false
                    for (let j in fArr) {
                        if (fArr[j][field] === cArr[i][field]) {
                            flg = true
                            break
                        }
                    }
                    if (!flg) {
                        cDatas.push(cArr[i])
                    }
                }
                diffRes.push(...cDatas.concat(fDatas))
                return diffRes
            },

            /*********************************************模态清除*************************************/
            CFSModalClose: function(e) {
                $(".CFSModal").remove();
            },

            /**********************************************创造guid****************************************************/
            createGuid: function() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                }).toUpperCase();
            },

            /**************************************************深拷贝*************************************************/
            deepCopy: function(p, c) {
                var c = c || {};
                for (var i in p) {
                    if (typeof p[i] === 'object') {　
                        c[i] = (p[i].constructor === Array) ? [] : {};
                        this.deepCopy(p[i], c[i]);
                    } else {　　　
                        c[i] = p[i];　　　
                    }　　　　
                }
                return c;　　
            },

            /*********************************************三维渲染****************************************************/
            threeDimensionRender: function(modleName) {
                // 记得使用   unitRender实例的 clear3D方法
                this.unitRender = new RenderUnit();
                this.unitRender.setElement($(this.el).find(`#${this.threeID}`)).render({ modelName: modleName, deviceID: this.devices });
            },

            /*********************************************四维渲染****************************************************/
            fourDimensionRender: function(modleName) {
                // 记得使用   unitRender实例的 clear3D方法
                this.loadPanorama = new LoadPanorama();
                this.loadPanorama.setElement($(this.el).find(`#${this.fourID}`)).render({ panoramaName: modleName, devices: this.devices });
            },

            /***********************************************二维三维切换****************************************************/
            threeDimensionSwitch: function(e) {
                e.stopPropagation();
                this.$el.find(".CIFourDimension").removeClass("CIDimensionTwoIcon").addClass("CIDimensionFourIcon").attr("title", "全景");
                if ($(e.currentTarget).hasClass("CIDimensionThreeIcon")) {
                    $(e.currentTarget).removeClass("CIDimensionThreeIcon").addClass("CIDimensionTwoIcon").attr("title", "二维");
                    this.$el.find(".CIDimensionTwoBox").addClass('CIVisibleHide');
                    this.$el.find(".CIDimensionFourBox").addClass('CIVisibleHide');
                    this.$el.find(".CIDimensionThreeBox").removeClass('CIVisibleHide');
                    return false;
                }
                $(e.currentTarget).removeClass("CIDimensionTwoIcon").addClass("CIDimensionThreeIcon").attr("title", "三维");
                this.$el.find(".CIDimensionThreeBox").addClass('CIVisibleHide');
                this.$el.find(".CIDimensionFourBox").addClass('CIVisibleHide');
                this.$el.find(".CIDimensionTwoBox").removeClass('CIVisibleHide');
            },

            /***********************************************二维四维切换****************************************************/
            fourDimensionSwitch: function(e) {
                e.stopPropagation();
                this.$el.find(".CIThreeDimension").removeClass("CIDimensionTwoIcon").addClass("CIDimensionThreeIcon").attr("title", "三维");
                if ($(e.currentTarget).hasClass("CIDimensionFourIcon")) {
                    $(e.currentTarget).removeClass("CIDimensionFourIcon").addClass("CIDimensionTwoIcon").attr("title", "二维");
                    this.$el.find(".CIDimensionTwoBox").addClass('CIVisibleHide');
                    this.$el.find(".CIDimensionThreeBox").addClass('CIVisibleHide');
                    this.$el.find(".CIDimensionFourBox").removeClass('CIVisibleHide');
                    return false;
                }
                $(e.currentTarget).removeClass("CIDimensionTwoIcon").addClass("CIDimensionFourIcon").attr("title", "全景");
                this.$el.find(".CIDimensionThreeBox").addClass('CIVisibleHide');
                this.$el.find(".CIDimensionFourBox").addClass('CIVisibleHide');
                this.$el.find(".CIDimensionTwoBox").removeClass('CIVisibleHide');
            },

            /*********************************************清除***************************************************/

            destroy: function() {
                this.isRender = false;
                if (this.loadingMaskView != undefined) {
                    this.loadingMaskView.destroy();
                }
                if (this.unitRender && this.unitRender.clear3D) {
                    this.unitRender.clear3D();
                    this.unitRender = null;
                }
                if (this.loadPanorama && this.loadPanorama.clear3D) {
                    this.loadPanorama.clear3D();
                    this.loadPanorama = null;
                }
                if (this.setTime) {
                    clearTimeout(this.setTime);
                    this.setTime = null;
                }
                if (this.poolWater) {
                    clearInterval(this.poolWater);
                    this.poolWater = null;
                }
                if (this.tubeWater) {
                    clearInterval(this.tubeWater);
                    this.tubeWater = null;
                }
                if (this.pumpType) {
                    clearInterval(this.pumpType);
                    this.pumpType = null;
                }
                if (this.blenderType) {
                    clearInterval(this.blenderType);
                    this.blenderType = null;
                }
                if (this.historyWidget) {
                    this.historyWidget.widgetClose();
                    this.historyWidget = null;
                }
                if (this._chartModal) {
                    this._chartModal.destroy();
                }
                this.stopListening();
                // 解除事件绑定
                this.undelegateEvents();
                this.$el.removeData().unbind();
                this.cloneAndClearDom();
                // 从dom中删除
                this.remove();
                Backbone.View.prototype.remove.call(this);
                try {
                    if (this._mqttView) {
                        this._mqttView.disSaveWaconnect();
                        this._mqttView = null;
                    }
                } catch (err) {
                    this._mqttView = null;
                }
            },

            cloneAndClearDom: function() {
                var thisDom = $(this.el);
                var parentDom = thisDom.parent();
                var prevDom = thisDom.prev();
                var nextDom = thisDom.next();
                if (prevDom.length + nextDom.length == 0) {
                    parentDom.append(thisDom.clone().empty());
                } else {
                    if (prevDom.length > 0) {
                        prevDom.after(thisDom.clone().empty());
                    } else {
                        nextDom.before(thisDom.clone().empty());
                    }
                }
            }
        });
        return View;
    });