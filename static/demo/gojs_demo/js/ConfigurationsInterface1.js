function _typeof(e) {
  return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
    return typeof e
  } : function (e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
  })(e)
}

function _toConsumableArray(e) {
  return _arrayWithoutHoles(e) || _iterableToArray(e) || _unsupportedIterableToArray(e) || _nonIterableSpread()
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}

function _unsupportedIterableToArray(e, t) {
  if (e) {
    if ("string" == typeof e) return _arrayLikeToArray(e, t);
    var o = Object.prototype.toString.call(e).slice(8, -1);
    return "Object" === o && e.constructor && (o = e.constructor.name), "Map" === o || "Set" === o ? Array.from(e) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? _arrayLikeToArray(e, t) : void 0
  }
}

function _iterableToArray(e) {
  if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) return Array.from(e)
}

function _arrayWithoutHoles(e) {
  if (Array.isArray(e)) return _arrayLikeToArray(e)
}

function _arrayLikeToArray(e, t) {
  (null == t || t > e.length) && (t = e.length);
  for (var o = 0, i = new Array(t); o < t; o++) i[o] = e[o];
  return i
}

function _defineProperty(e, t, o) {
  return t in e ? Object.defineProperty(e, t, {
    value: o,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = o, e
}
define(["backbone", "gis/core/promiseUtils", "configuration/ConfigurationsInterface/mqttView", "text!./ConfigurationsInterface.html", "text!./modal/SwitchControlModal.html", "text!./modal/AuthoControlModal.html", "text!./modal/AdjustControModal.html", "configuration/ConfigurationsInterface/js/waterFlowControlView", "components/HistoryViewNew/ScadaSampleHistory", "frameworkthree/components/renderUnit/renderUnit", "frameworkthree/components/loadPanorama/loadPanorama", "configuration/js/go", "sha1"], function (e, o, n, t, r, s, l, i, g, a, d) {
  var m = go.GraphObject.make,
    h = urlUtils.getUrl("Publish/Web/"),
    c = urlUtils.getUrl("Publish/Web/");
  urlUtils.getUrl("Cityinterface/rest/services/OMS.svc/");
  return e.View.extend({
    events: {
      "click .CIThreeDimension": "threeDimensionSwitch",
      "click .CIFourDimension": "fourDimensionSwitch"
    },
    render: function (e) {
      return this.name = e.name, this.devices = e.devices ? e.devices.split(",") : [],
        this.callBack = e.callBack ? e.callBack : function () {}, this.isScale = null == e.isScale || e.isScale, this.name && this.devices.length && this.$el.length ? (this.isRender = !0, this.guidAggre = {}, this.bindData = [], this._stationList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], this.stationList = [], this.$el.html(_.template(t)()), this.twoID = "TDG" + Date.now().toString(36), this.threeID = "TDD" + Date.now().toString(36), this.fourID = "FDD" + Date.now().toString(36), this.$el.find(".CIDimensionTwoBox").attr("id", this.twoID), this.$el.find(".CIDimensionThreeBox").attr("id", this.threeID), this.$el.find(".CIDimensionFourBox").attr("id", this.fourID), this._waterFlow = new i, this._waterFlow.render(), this.initiaPageRender(), this) : (msgUtils.warning("配置信息不完整"), !1)
    },
    initiaPageRender: function () {
      this.onlineMethod("https://panda-water.cn/web4/assets/images/bootPage/熊猫图标.png")
    },
    onlineMethod: function (e) {
      var t = new Image;
      t.src = e, t.onload = function (e) {
        if (0 < t.fileSize || 0 < t.width && 0 < t.height ? this.isBase = !0 : this.isBase = !1, this.isBase && (c = "https://panda-water.cn/Publish/Web/"), !this.isRender) return !1;
        this.dataRender()
      }.bind(this), t.onerror = function (e) {
        if (this.isBase = !1, this.isBase && (c = "https://panda-water.cn/Publish/Web/"), !this.isRender) return !1;
        this.dataRender()
      }.bind(this)
    },
    dataRender: function () {
      msgUtils.loading(this.$el), this.stationList = [], require(["configuration/js/GuidedDraggingTool", "configuration/js/RotatingTool", "configuration/js/BarLink", "configuration/js/DrawCommandHand"], function () {
        var e = [request(h + "Sketchpad/SketchPad/List", {
          query: {
            _site: _config.userInfo.site ? _config.userInfo.site : "",
            siteCode: _config.mqtt_site_code,
            name: this.name
          },
          cacheBust: !0
        })];
        o.eachAlways(e).then(function (e) {
          msgUtils.unloading(this.$el), this.drawBoard = e[0].value && e[0].value.data && e[0].value.data.getMe ? e[0].value.data.getMe : [];
          var t = this.drawBoard.filter(function (e, t) {
            return e.name == this.name
          }.bind(this));
          if (!t.length || !t[0].deployURL) return msgUtils.noResult(this.$el, "咦~未查询到工艺图画板信息哦~"), !1;
          for (var o = t.length && t[0].num ? 1 * t[0].num : 0, i = t.length && t[0].siteInfo ? JSON.parse(t[0].siteInfo) : "", a = 0; a < o; a++) {
            var n = parseInt(a / 26),
              r = a % 26;
            n ? this.stationList.push(this._stationList[r] + n) : this.stationList.push(this._stationList[r])
          }
          this.diagramJsonRender(t[0], i)
        }.bind(this))
      }.bind(this))
    },
    diagramJsonRender: function (i, a) {
      msgUtils.loading(this.$el), $.ajax({
        type: "get",
        url: h + "File/Sketch/Content/二维/" + i.deployURL.replace(/\\/g, "/"),
        data: {
          _site: _config.userInfo.site ? _config.userInfo.site : ""
        },
        cache: !0
      }).done(function (e) {
        msgUtils.unloading(this.$el);
        var t = e || '{ "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort" }';
        this.devices.forEach(function (e, t) {
          var o = "设备" + this.stationList[t];
          this.bindData.push({
            code: e,
            name: o,
            type: a && a[o] ? a[o].Type : ""
          })
        }.bind(this)), this._mqttView = new n, this._mqttView.render({
          devices: this.devices,
          callback: this.refreshData.bind(this),
          controlback: this.controlData.bind(this)
        });
        var o = JSON.parse(t).theme ? JSON.parse(t).theme : "深色";
        this.callBack(o), this.diagramRender(t);
        try {
          if (!i.threeDimonsionName && !i.panoramicModel) return !1;
          this.$el.find(".CIProcessMapHand").removeClass("CIHideCase"), i.threeDimonsionName && (this.$el.find(".CIThreeDimension").removeClass("CIHideCase"), this.threeDimensionRender(i.threeDimonsionName)), i.panoramicModel && (this.$el.find(".CIFourDimension").removeClass("CIHideCase"), this.fourDimensionRender(i.panoramicModel))
        } catch (e) {}
      }.bind(this)).fail(function (e) {
        msgUtils.unloading(this.$el), msgUtils.noResult(this.$el, "咦~获取画布信息失败，请重试~")
      }.bind(this))
    },
    diagramRender: function (e) {
      var t, o, n = this;
      this.myDiagram = m(go.Diagram, this.twoID, {
        initialContentAlignment: go.Spot.Center,
        contentAlignment: go.Spot.Center,
        allowDrop: !1,
        draggingTool: new GuidedDraggingTool,
        allowZoom: !this.isScale,
        allowSelect: !1,
        "draggingTool.dragsLink": !0,
        isReadOnly: !0,
        autoScale: this.isScale ? go.Diagram.Uniform : go.Diagram.None,
        initialAutoScale: go.Diagram.Uniform,
        "draggingTool.isGridSnapEnabled": !0,
        "linkingTool.isUnconnectedLinkValid": !0,
        "animationManager.duration": 100,
        allowHorizontalScroll: !this.isScale,
        padding: 20,
        allowVerticalScroll: !this.isScale,
        "linkingTool.portGravity": 20,
        "relinkingTool.isUnconnectedLinkValid": !0,
        "relinkingTool.portGravity": 20,
        "draggingTool.horizontalGuidelineColor": "blue",
        "draggingTool.verticalGuidelineColor": "blue",
        "draggingTool.centerGuidelineColor": "green",
        rotatingTool: m(TopRotatingTool),
        "rotatingTool.snapAngleMultiple": 15,
        "rotatingTool.snapAngleEpsilon": 15,
        "undoManager.isEnabled": !0,
        LinkDrawn: this.changLinkRouting,
        LinkReshaped: function (e) {
          e.subject.routing = go.Link.Orthogonal
        },
        "linkingTool.direction": go.LinkingTool.ForwardsOnly
      }), this.myDiagram.nodeTemplateMap.add("svgCase", m(go.Node, "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 1
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle").makeTwoWay(), m(go.Panel, "Auto", {
        name: "PANEL"
      }, new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify), m(go.Picture, {
          width: 56,
          height: 56,
          column: 0,
          scale: 1,
          source: ""
        },
        new go.Binding("source", "imgSrc", function (e) {
          return c + "File/ModelManage/ModelFilePreview/" + encodeURIComponent(e)
        }).makeTwoWay(),
        new go.Binding("scale", "scale").makeTwoWay(), new go.Binding("width", "width").makeTwoWay(), new go.Binding("height", "height").makeTwoWay())), this.makePort("T", go.Spot.Top, !0, !0), this.makePort("L", go.Spot.Left, !0, !0), this.makePort("R", go.Spot.Right, !0, !0), this.makePort("B", go.Spot.Bottom, !0, !0), this.makePort("RB", go.Spot.BottomRight, !0, !0), this.makePort("LB", go.Spot.BottomLeft, !0, !0), this.makePort("RT", go.Spot.TopRight, !0, !0), this.makePort("LT", go.Spot.TopLeft, !0, !0), {
        click: function (e, t) {}
      })), this.myDiagram.nodeTemplateMap.add("modelCase", m(go.Node, "Auto", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 1
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
        resizeObjectName: "SHAPE"
      }, new go.Binding("angle").makeTwoWay(), m(go.Shape, "Rectangle", {
        name: "SHAPE",
        fill: "rgba(128,128,128,0.2)",
        stroke: "gray"
      }, new go.Binding("fill", "fillColor").makeTwoWay(), new go.Binding("stroke").makeTwoWay(), new go.Binding("strokeWidth").makeTwoWay(), new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)))), this.myDiagram.nodeTemplateMap.add("ellipseCase", m(go.Node, "Auto", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 1
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
        resizeObjectName: "SHAPE"
      }, new go.Binding("angle").makeTwoWay(), m(go.Shape, "Ellipse", {
        name: "SHAPE",
        fill: "rgba(128,128,128,0.2)",
        stroke: "gray"
      }, new go.Binding("fill", "fillColor").makeTwoWay(), new go.Binding("stroke").makeTwoWay(), new go.Binding("strokeWidth").makeTwoWay(), new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)))), this.myDiagram.nodeTemplateMap.add("nameCase", m(go.Node, "Auto", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 3
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle").makeTwoWay(), m(go.Shape, "Rectangle", {
        name: "SHAPE",
        strokeWidth: 10,
        stroke: "#000000"
      }, new go.Binding("fill", "fillColor").makeTwoWay(), new go.Binding("stroke").makeTwoWay(), new go.Binding("strokeWidth").makeTwoWay(), new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)), m(go.TextBlock, this.textStyle(), {
        margin: 5,
        maxSize: new go.Size(NaN, NaN),
        minSize: new go.Size(NaN, 1),
        wrap: go.TextBlock.WrapFit,
        textAlign: "center",
        editable: !0,
        font: "bold 12px Helvetica, Arial, sans-serif",
        stroke: "#454545"
      }, new go.Binding("text").makeTwoWay(), new go.Binding("font", "fontStyle"), new go.Binding("stroke", "fontStroke").makeTwoWay()))), this.myDiagram.nodeTemplateMap.add("HBar", m(go.Node, "Auto", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 1
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle").makeTwoWay(), new go.Binding("angle").makeTwoWay(), m(go.Shape, "Rectangle", (_defineProperty(t = {
        name: "SHAPE",
        stroke: "white",
        strokeWidth: 6,
        height: 0,
        width: 120,
        fill: "#41BFEC"
      }, "stroke", null), _defineProperty(t, "strokeWidth", 0), _defineProperty(t, "minSize", new go.Size(20, 0)), _defineProperty(t, "maxSize", new go.Size(1 / 0, 0)), t), new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify), new go.Binding("minSize", "minSize").makeTwoWay(), new go.Binding("maxSize", "maxSize").makeTwoWay(), new go.Binding("stroke", "stroke").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()), m(go.Shape, {
        isPanelMain: !0,
        stroke: "white",
        strokeWidth: 3,
        height: 0,
        width: 100,
        name: "PIPE",
        strokeDashArray: [20, 40]
      }, new go.Binding("width").makeTwoWay(), new go.Binding("stroke", "waterStroke").makeTwoWay(), new go.Binding("strokeWidth", "waterWidth").makeTwoWay(), new go.Binding("strokeDashArray", "strokeDashArray").makeTwoWay(), {
        portId: "",
        toLinkable: !0,
        fromLinkable: !0
      }), {
        click: function (e, t) {
          t.data
        }
      })), this.myDiagram.nodeTemplateMap.add("valCase", m(go.Node, "Auto", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 2
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle").makeTwoWay(), m(go.Shape, "Rectangle", {
        name: "SHAPE",
        strokeWidth: 10,
        stroke: "#000000"
      }, new go.Binding("fill", "fillColor"), new go.Binding("stroke"), new go.Binding("strokeWidth"), new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)), m(go.TextBlock, this.textStyle(), {
        maxSize: new go.Size(NaN, NaN),
        minSize: new go.Size(NaN, 1),
        wrap: go.TextBlock.WrapFit,
        textAlign: "center",
        editable: !0,
        font: "bold 12px Helvetica, Arial, sans-serif",
        stroke: "#454545"
      }, new go.Binding("text", "showVal"), new go.Binding("font", "fontStyle"), new go.Binding("stroke", "fontStroke")), {
        click: function (e, t) {
          var o = t.data,
            i = n.bindData.filter(function (e) {
              return e.name == o.stationName
            });
          if (!i.length) return !1;
          if ("--" == o.realVal) return !1;
          if ("输入控制" == o.controlType) {
            var a = o.controlName || o.showName;
            $("body .CFSModal").remove(), $("body").append("<div class='CFSModal'></div>"), $("body .CFSModal").empty().append(_.template(l)({
              name: a,
              value: o.realVal
            })), $(".CFSModal .CFSModalClose").off().on("click", n.CFSModalClose), $(".CFSModal .CFSModalConfirm").off().on("click", function (e) {
              n.controlMethod(e, i[0].code, a, o)
            }), $(".CFSModal .CFSModalMain").off().on("click", function (e) {
              e.stopPropagation()
            })
          } else if ("历史查看" == o.controlType) {
            if (!o.pointName) return !1;
            n.historyWidget && (n.historyWidget.widgetClose(), n.historyWidget = null), n.historyWidget = new g({
              title: o.showName,
              stationCode: i[0].code,
              sensorName: o.showName,
              pointAddress: i[0].type,
              chartType: -1 < o.showName.indexOf("瞬时流量") ? "areaspline" : "spline",
              bgColor: "#282d3b"
            }), n.historyWidget.widgetOpen()
          }
        }
      })), this.myDiagram.nodeTemplateMap.add("linkPort", m(go.Node, "Auto", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 1
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle").makeTwoWay(), m(go.Panel, "Auto", {
        name: "PANEL"
      }, m(go.Shape, "Rectangle", {
        fill: "transparent",
        strokeWidth: 0,
        width: 8,
        height: 8,
        minSize: new go.Size(5, 5)
      })))), go.Shape.defineFigureGenerator("Pool", function (e, t, o) {
        var i = new go.Geometry,
          a = new go.PathFigure(0, 0, !0);
        return i.add(a), a.add(new go.PathSegment(go.PathSegment.Line, .75 * t, 0)), a.add(new go.PathSegment(go.PathSegment.Line, t, .25 * o)), a.add(new go.PathSegment(go.PathSegment.Line, t, o)), a.add(new go.PathSegment(go.PathSegment.Line, 0, o).close()), i
      }), this.myDiagram.nodeTemplateMap.add("waterCase", m(go.Node, "Auto", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 1
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle").makeTwoWay(), m(go.Shape, "Rectangle", {
        name: "SHAPE",
        alignment: go.Spot.Bottom,
        alignmentFocus: go.Spot.Bottom,
        fill: "transparent",
        strokeWidth: 10,
        stroke: "red",
        desiredSize: new go.Size(NaN, 26)
      }, new go.Binding("width").makeTwoWay(), new go.Binding("height").makeTwoWay(), new go.Binding("stroke", "stroke").makeTwoWay(), new go.Binding("strokeWidth", "stokeColor").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()), m(go.Shape, "Rectangle", {
        name: "SHAPE",
        alignment: go.Spot.Bottom,
        alignmentFocus: go.Spot.Bottom,
        fill: "#ccc",
        strokeWidth: 10,
        stroke: "transparent",
        desiredSize: new go.Size(NaN, 26)
      }, new go.Binding("width").makeTwoWay(), new go.Binding("height").makeTwoWay(), new go.Binding("fill", "fontStroke").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()), m(go.Shape, "Pool", {
        name: "waterSvg",
        alignment: go.Spot.Bottom,
        alignmentFocus: go.Spot.Bottom,
        fill: "#DEE0A3",
        stroke: "transparent",
        strokeWidth: 10,
        minSize: new go.Size(NaN, 5),
        desiredSize: new go.Size(NaN, 20)
      }, new go.Binding("width").makeTwoWay(), new go.Binding("height", "waterHight").makeTwoWay(), new go.Binding("fill", "fillColor").makeTwoWay(), new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()))), this.myDiagram.nodeTemplateMap.add("rotateCase", m(go.Node, "Table", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 2
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
        resizeObjectName: "SHAPE",
        rotatable: !0
      }, m(go.Panel, "Table", {
        name: "PANEL"
      }, m(go.Shape, "Ellipse", {
        width: 37,
        height: 37,
        fill: "transparent",
        stroke: "transparent",
        strokeWidth: 1
      }, new go.Binding("width", "widthBox").makeTwoWay(), new go.Binding("height", "heightBox").makeTwoWay()), new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify), m(go.Picture, {
        name: "rotateSvg",
        width: 26,
        height: 26,
        column: 0,
        scale: 1,
        source: "assets/images/组态/状态/泵离线.svg",
        angle: 0
      }, new go.Binding("source", "imgSrc").makeTwoWay(), new go.Binding("scale", "scale").makeTwoWay(), new go.Binding("width", "width").makeTwoWay(), new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("height", "height").makeTwoWay())))), this.myDiagram.nodeTemplateMap.add("pointCase", m(go.Node, "Auto", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 2
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle").makeTwoWay(), m(go.Shape, "Ellipse", {
        width: 14,
        height: 14,
        name: "SHAPE",
        fill: "rgba(109, 122, 151, 1)",
        stroke: "gray"
      }, new go.Binding("fill", "fillColor").makeTwoWay(), new go.Binding("stroke").makeTwoWay(), new go.Binding("height", "height").makeTwoWay(), new go.Binding("width", "height").makeTwoWay()))), this.myDiagram.nodeTemplateMap.add("switchCase", m(go.Node, "Auto", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 2
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), new go.Binding("angle").makeTwoWay(), m(go.Shape, "RoundedRectangle", {
        name: "SHAPE",
        strokeWidth: 10,
        stroke: "#000000"
      }, new go.Binding("fill", "fillColor"), new go.Binding("stroke"), new go.Binding("strokeWidth"), new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)), m(go.TextBlock, this.textStyle(), {
        maxSize: new go.Size(NaN, NaN),
        minSize: new go.Size(NaN, 1),
        wrap: go.TextBlock.WrapFit,
        textAlign: "center",
        editable: !0,
        font: "bold 12px Helvetica, Arial, sans-serif",
        stroke: "#454545"
      }, new go.Binding("text"), new go.Binding("font", "fontStyle"), new go.Binding("stroke", "fontStroke")), {
        toolTip: m("ToolTip", m(go.TextBlock, {
          margin: 2
        }, new go.Binding("text", "text")))
      }, {
        click: function (e, t) {
          var o = t.data,
            i = n.bindData.filter(function (e) {
              return e.name == o.stationName
            });
          if (!i.length) return !1;
          if ("开" == o.switchState || "--" == o.realVal) return !1;
          var a = o.controlName || o.showName;
          $("body .CFSModal").remove(), $("body").append("<div class='CFSModal'></div>"), $("body .CFSModal").empty().append(_.template(r)({
            type: "确定要" + o.text + a + "？"
          })), $(".CFSModal .CFSModalClose").off().on("click", n.CFSModalClose), $(".CFSModal .CFSModalConfirm").off().on("click", function (e) {
            n.defineSwitch(e, i[0].code, a, o)
          }), $(".CFSModal .CFSModalMain").off().on("click", function (e) {
            e.stopPropagation()
          })
        }
      })), this.myDiagram.nodeTemplateMap.add("blenderCase", m(go.Node, "Table", this.nodeStyle(), "Spot", {
        locationSpot: go.Spot.Center,
        zOrder: 2
      }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
        resizeObjectName: "SHAPE",
        rotatable: !0
      }, new go.Binding("angle").makeTwoWay(), m(go.Panel, "Auto", {
        name: "PANEL"
      }, new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify), m(go.Picture, {
        name: "blenderSvg",
        width: 42.5,
        height: 56,
        column: 0,
        scale: 1,
        source: "assets/images/组态/状态/搅拌机双头1.svg",
        angle: 0
      }, new go.Binding("source", "imgSrc").makeTwoWay(), new go.Binding("scale", "scale").makeTwoWay(), new go.Binding("width", "width").makeTwoWay(), new go.Binding("angle", "angle").makeTwoWay(), new go.Binding("height", "height").makeTwoWay())), {
        toolTip: m("ToolTip", m(go.TextBlock, {
          margin: 2
        }, new go.Binding("text", "text")))
      }));
      m(go.Adornment, "Link", m(go.Shape, {
        isPanelMain: !0,
        fill: null,
        stroke: "deepskyblue",
        strokeWidth: 0
      }));
      this.myDiagram.linkTemplate = m(BarLink, (_defineProperty(o = {
        curve: go.Link.JumpOver,
        toShortLength: 0,
        fromShortLength: 0,
        layerName: "Background",
        routing: go.Link.Orthogonal,
        corner: 2,
        reshapable: !0,
        resegmentable: !0,
        relinkableFrom: !0,
        relinkableTo: !0
      }, "relinkableFrom", !0), _defineProperty(o, "relinkableTo", !0), o), new go.Binding("fromSpot", "fromPort", function (e) {
        return spotConverter(e)
      }), new go.Binding("toSpot", "toPort", function (e) {
        return spotConverter(e)
      }), new go.Binding("points").makeTwoWay(), m(go.Shape, {
        isPanelMain: !0,
        stroke: "#41BFEC",
        strokeWidth: 6,
        name: "changecolor"
      }, new go.Binding("stroke", "stroke"), new go.Binding("strokeWidth", "strokeWidth")), m(go.Shape, {
        isPanelMain: !0,
        stroke: "white",
        strokeWidth: 3,
        name: "PIPE",
        strokeDashArray: [20, 40]
      }, new go.Binding("strokeWidth", "waterWidth"), new go.Binding("stroke", "waterStroke")), {
        click: function (e, t) {}
      }), this.myDiagram.linkTemplateMap.add("linkToLink", m("Link", {
        relinkableFrom: !0,
        relinkableTo: !0
      }, m("Shape", {
        stroke: "#2D9945",
        strokeWidth: 2
      }), {
        click: function (e, t) {
          var o = t.data;
          n.myDiagram.model.findLinkDataForKey(o.key);
          n.myDiagram.model.setDataProperty(o, "color", "red")
        }
      }));
      var i = JSON.parse(e);
      this.setTime = setTimeout(function () {
        n.loop(), n.waterSvg(), n.rotateSvg(), n.blenderSvg()
      }, 100);
      var a = JSON.parse(JSON.stringify(i));
      a.linkDataArray.forEach(function (e) {
        e.isHavingDash = !0, e.realVal = "--", e.defaultWidth = e.waterWidth
      }), a.nodeDataArray.forEach(function (e) {
        e.showVal = "--", e.realVal = "--", e.realType = "离线", e.Unit = "", e.switchState = "开", "HBar" == e.category && (e.hBarClolor = e.waterStroke, e.typeDash = !1), "nameCase" == e.category && (e._fillColor = e.fillColor, e._stroke = e.stroke, e._fontStroke = e.fontStroke)
      }), this.myDiagram.model = go.Model.fromJson(a)
    },
    controlMethod: function (e, t, o, i) {
      e.stopPropagation();
      var a = $(e.currentTarget).parents(".CFSModal").find(".setValBox").val();
      if (!a) return msgUtils.warning("设置值不能为空！"), !1;
      if (isNaN(1 * a)) return msgUtils.warning("设置值不合理！"), !1;
      if (a < 0)
        return msgUtils.warning("设置值不合理！"), !1;
      var n = this.createGuid();
      if (this.CFSModalClose(), "是" == i.authoControl) return this.authoMethod(t, o, i, n, a), !1;
      this.guidAggre[n] = {
        tag: o,
        code: t
      }, this._mqttView.onSendWaMessageArrived("", "", n, t, o, i.switchType, 1 * a)
    },
    defineSwitch: function (e, t, o, i) {
      e.stopPropagation();
      var a = this.createGuid();
      if (this.CFSModalClose(), "是" == i.authoControl) return this.authoMethod(t, o, i, a, ""), !1;
      this.guidAggre[a] = {
        tag: o,
        code: t
      }, this._mqttView.onSendWaMessageArrived("", "", a, t, o, i.text, "")
    },
    authoMethod: function (t, o, i, a, n) {
      var r = this;
      $("body .CFSModal").remove(), $("body").append("<div class='CFSModal'></div>"), $("body .CFSModal").empty().append(_.template(s)()), $(".CFSModal .CFSModalClose").off().on("click", r.CFSModalClose), $(".CFSModal .CFSModalConfirm").off().on("click", function (e) {
        r.defineAutho(e, t, o, i, a, n)
      }), $(".CFSModal .CFSModalMain").off().on("click", function (e) {
        e.stopPropagation()
      })
    },
    defineAutho: function (e, t, o, i, a, n) {
      var r = $(e.currentTarget).parents(".CFSModal"),
        s = r.find(".userNameBox").val(),
        l = r.find(".passWordBox").val();
      if (!s || !l) return msgUtils.warning("用户名或密码不能为空！"), !1;
      this.CFSModalClose(), this.guidAggre[a] = {
        tag: o,
        code: t
      };
      var g = i.switchType ? i.text : "";
      this._mqttView.onSendWaMessageArrived(s, sha1(l).toUpperCase(), a, t, o, g, n)
    },
    changLinkRouting: function (e) {
      var t = e.subject;
      if (null == t.toNode || null == t.fromNode) return !1;
      "HBar" !== t.fromNode.category && "HBar" !== t.toNode.category || (e.subject.routing = go.Link.Normal)
    },
    dataHandle: function (e) {
      e.forEach(function (e, t) {
        switch (e.controlType) {
          case "开关展示":
          case "开关控制":
            e.switchState = -1 < e.openVal.toString().split(",").indexOf(e.realVal.toString()) ? "开" : "关", "switchCase" == e.category && "关" == e.switchType && (e.switchState = -1 < e.openVal.toString().split(",").indexOf(e.realVal.toString()) ? "关" : "开")
        }
        var o = this.myDiagram.model.findNodeDataForKey(e.key);
        this.myDiagram.model.setDataProperty(o, "switchState", e.switchState)
      }.bind(this))
    },
    makePort: function (e, t, o, i) {
      return m(go.Shape, "Circle", {
        fill: null,
        stroke: null,
        desiredSize: new go.Size(7, 7),
        alignment: t,
        alignmentFocus: t,
        portId: e,
        fromSpot: t,
        toSpot: t,
        fromLinkable: o,
        toLinkable: i,
        cursor: "pointer"
      })
    },
    waterSvg: function () {
      var t = this.myDiagram;
      this.poolWater = setInterval(function () {
        var e = t.skipsUndoManager;
        t.skipsUndoManager = !0, t.nodes.each(function (e) {
          var t = e.findObject("waterSvg");
          if (!t) return !1;
          t.height;
          range = (t.range ? t.range : 0) + .5, t.range = 5 <= range ? 0 : range, t.geometryString = "F M0 " + t.range + " L" + t.width + " " + (5 - t.range) + " L" + t.width + " " + t.height + " L0 " + t.height + "z"
        }), t.skipsUndoManager = e
      }, 100)
    },
    loop: function () {
      var t = this.myDiagram;
      this.tubeWater = setInterval(function () {
        var e = t.skipsUndoManager;
        t.skipsUndoManager = !0, t.links.each(function (e) {
          var t = e.findObject("PIPE");
          if (!t) return !1;
          if (e.data.isHavingDash) {
            t.strokeWidth = e.data.defaultWidth || 3;
            var o = t.strokeDashOffset - 3;
            t.strokeDashOffset = o <= 0 ? 60 : o
          } else t.strokeWidth = 0, t.strokeDashOffset = 0
        }), t.skipsUndoManager = e
      }, 60)
    },
    rotateSvg: function () {
      var t = this.myDiagram;
      this.pumpType = setInterval(function () {
        var e = t.skipsUndoManager;
        t.skipsUndoManager = !0, t.nodes.each(function (e) {
          var t = e.findObject("rotateSvg");
          if (!t) return !1;
          if ("运行" != e.data.realType) return !1;
          var o = t.angle + 60;
          t.angle = o <= 360 ? o : 0
        }), t.skipsUndoManager = e
      }, 60)
    },
    blenderSvg: function () {
      var t = this.myDiagram;
      this.blenderType = setInterval(function () {
        var e = t.skipsUndoManager;
        t.skipsUndoManager = !0, t.nodes.each(function (e) {
          var t = e.findObject("blenderSvg");
          if (!t) return !1;
          var o = e.data;
          if ("开" != o.switchState || "--" == o.realVal) return t.source = t.source.replace(/[0-9]/gi, 1), !1;
          t.flag = t.flag || 1;
          var i = 1 * t.source.replace(/[^0-9]/gi, ""),
            a = 1;
          1 == t.flag ? (a = i < 5 ? i + 1 : 4, 5 <= i && (t.flag = 2)) : (a = 1 < i ? i - 1 : 2, i <= 1 && (t.flag = 1)), t.source = t.source.replace(/[0-9]/gi, a)
        }), t.skipsUndoManager = e
      }, 100)
    },
    loadDiagramProperties: function (e) {
      var t = this.myDiagram.model.modelData.position;
      t && (this.myDiagram.initialPosition = go.Point.parse(t))
    },
    nodeStyle: function () {
      return [new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
        locationSpot: go.Spot.Center
      }]
    },
    textStyle: function () {
      return {
        font: "bold 11pt Helvetica, Arial, sans-serif",
        stroke: "whitesmoke"
      }
    },
    controlData: function (e, t, o) {
      var i = JSON.parse(e);
      if (this.guidAggre[t]) {
        var a = this.guidAggre[t];
        i.result ? (this.guidCode = a.code, this.isNum = 0) : msgUtils.warning(a.tag + "控制失败，" + i.message + "！"), delete this.guidAggre[t]
      }
    },
    refreshData: function (e, t, o) {
      var l = this,
        i = this.bindData.filter(function (e) {
          return e.code == t
        }),
        a = new Object,
        n = i.length ? i[0].name : "",
        g = JSON.parse(e)[t];
      if (!g) return !1;
      try {
        this.unitRender && this.unitRender.tipRender({
          deviceID: t,
          data: g
        })
      } catch (e) {}
      var r = JSON.parse(this.myDiagram.model.toJson()),
        s = JSON.parse(JSON.stringify(r));
      a = this.deepCopy(s);
      if (this.guidCode == t && (this.isNum++, 2 == this.isNum)) return this.guidCode = null, this.isNum = 0, !1;
      try {
        l.myDiagram.model.linkDataArray.forEach(function (a) {
          a.stationName != n || !a.showName || "线条控制" != a.controlType || a.category && "sharpLine" != a.category && "curveLine" != a.category || g.forEach(function (e, t) {
            if (null == e.Value) return !1;
            var o = e.ItemID,
              i = o.lastIndexOf(".");
            l.myDiagram.findLinkForData(a), o.substring(0, i);
            o.substring(i + 1, 1 / 0) == a.showName && (a.realVal = 1 * e.Value, -1 < a.openVal.toString().split(",").indexOf(a.realVal.toString()) ? (l.myDiagram.model.setDataProperty(a, "stroke", a.stroke), l.myDiagram.model.setDataProperty(a, "waterStroke", a.waterStroke)) : (l.myDiagram.model.setDataProperty(a, "stroke", a.unstroke), l.myDiagram.model.setDataProperty(a, "waterStroke", a.unwaterStroke)))
          })
        })
      } catch (e) {}
      try {
        s.nodeDataArray.forEach(function (r) {
          if (r.stationName != n || !r.showName && "updateTime" != r.figure) return !1;
          if ("nameCase" == r.category && "name" == r.figure && "不控制" == r.controlType) return !1;
          var s = l.myDiagram.model.findNodeDataForKey(r.key);
          g.forEach(function (e, t) {
            if (null == e.Value) return !1;
            "updateTime" == s.figure && l.myDiagram.model.setDataProperty(s, "text", new Date(e.Time).format("yyyy年MM月dd日 hh时mm分ss秒"));
            var o = e.ItemID,
              i = o.lastIndexOf(".");
            o.substring(0, i);
            if (o.substring(i + 1, 1 / 0) == r.showName) {
              if (r.showVal == e.Value || r.realVal == e.Value) return !1;
              switch (r.realVal = e.Value, r.showVal = e.Value < 0 ? 0 : e.Value, l.myDiagram.model.setDataProperty(s, "realVal", r.realVal), l.myDiagram.model.setDataProperty(s, "showVal", r.showVal), r.controlType) {
                case "开关展示":
                case "开关控制":
                  r.switchState = -1 < r.openVal.toString().split(",").indexOf(r.realVal.toString()) ? "开" : "关", "switchCase" == r.category && "关" == r.switchType && (r.switchState = -1 < r.openVal.toString().split(",").indexOf(r.realVal.toString()) ? "关" : "开")
              }
              switch (l.myDiagram.model.setDataProperty(s, "switchState", r.switchState), r.category) {
                case "waterCase":
                  var a = r.height - 2 * r.strokeWidth,
                    n = e.Value * a / r.poolHeight;
                  n = a <= n ? a : n, l.myDiagram.model.setDataProperty(s, "waterHight", n);
                  break;
                case "rotateCase":
                  "开关展示" == r.controlType ? l.typeState(s.text, s) : l.typeSwitch(e.Value, s.text, s);
                  break;
                case "switchCase":
                  "开" == r.switchState && "开" == r.switchType ? l.myDiagram.model.setDataProperty(s, "fillColor", "rgba(9, 185, 105, 1)") : "关" == r.switchState && "开" == r.switchType ? l.myDiagram.model.setDataProperty(s, "fillColor", "rgba(8, 39, 64, 1)") : "开" == r.switchState && "关" == r.switchType ? l.myDiagram.model.setDataProperty(s, "fillColor", "rgba(186, 27, 59, 1)") : l.myDiagram.model.setDataProperty(s, "fillColor", "rgba(8, 39, 64, 1)");
                  break;
                case "pointCase":
                  "开关展示" == r.controlType ? l.typeState(s.text, s, !0) : l.typeSwitch(e.Value, s.text, s, !0);
                  break;
                case "nameCase":
                  "开关展示" == r.controlType && ("关" == r.switchState ? (l.myDiagram.model.setDataProperty(s, "fillColor", "transparent"), l.myDiagram.model.setDataProperty(s, "stroke", "transparent"), l.myDiagram.model.setDataProperty(s, "fontStroke", "transparent")) : (l.myDiagram.model.setDataProperty(s, "fillColor", s._fillColor), l.myDiagram.model.setDataProperty(s, "stroke", s._stroke), l.myDiagram.model.setDataProperty(s, "fontStroke", s._fontStroke)))
              }
            }
          })
        }), this.dataHandle(s.nodeDataArray);
        var d = this._waterFlow.waterFlowControlByDiagramJson(a, this.myDiagram);
        if (d) {
          var m = d.linkDataArray,
            h = l.myDiagram.model.linkDataArray,
            c = d.nodeDataArray,
            p = [];
          m.forEach(function (e, t) {
            var o = Object.assign({}, h[t]);
            o.isHavingDash = e.isHavingDash, p.push(o)
          }), c.forEach(function (e, t) {
            if ("HBar" == e.category) {
              var o = l.myDiagram.model.findNodeDataForKey(e.key),
                i = e.typeDash ? "transparent" : e.hBarClolor;
              e.typeDash != o.typeDash && l.myDiagram.model.setDataProperty(o, "waterStroke", i)
            }
          }), p.forEach(function (e) {
            var t = l.myDiagram.findLinkForData(e);
            e.isHavingDash != t.data.isHavingDash && l.myDiagram.model.setDataProperty(t.data, "isHavingDash", e.isHavingDash)
          })
        }
      } catch (e) {}
    },
    typeSwitch: function (e, t, o, i) {
      switch (e) {
        case 0:
        case 1:
          if (i) return this.myDiagram.model.setDataProperty(o, "fillColor", m(go.Brush, "Linear", {
            0: "#6D7A97",
            1: "#9FB3BF",
            start: go.Spot.Top,
            end: go.Spot.Bottom
          })), !1;
          this.myDiagram.model.setDataProperty(o, "imgSrc", "assets/images/组态/状态/" + t + "离线.svg"), this.myDiagram.model.setDataProperty(o, "realType", "离线");
          break;
        case 2:
          if (i) return this.myDiagram.model.setDataProperty(o, "fillColor", m(go.Brush, "Linear", {
            0: "#09e014",
            1: "#069d0d",
            start: go.Spot.Top,
            end: go.Spot.Bottom
          })), !1;
          this.myDiagram.model.setDataProperty(o, "imgSrc", "assets/images/组态/状态/" + t + "运行.svg"), this.myDiagram.model.setDataProperty(o, "realType", "运行");
          break;
        case 3:
          if (i) return this.myDiagram.model.setDataProperty(o, "fillColor", m(go.Brush, "Linear", {
            0: "#FB596C",
            1: "#D0384F",
            start: go.Spot.Top,
            end: go.Spot.Bottom
          })), !1;
          this.myDiagram.model.setDataProperty(o, "imgSrc", "assets/images/组态/状态/" + t + "故障.svg"), this.myDiagram.model.setDataProperty(o, "realType", "故障");
          break;
        case 4:
          if (i) return this.myDiagram.model.setDataProperty(o, "fillColor", m(go.Brush, "Linear", {
            0: "#09e014",
            1: "#069d0d",
            start: go.Spot.Top,
            end: go.Spot.Bottom
          })), !1;
          this.myDiagram.model.setDataProperty(o, "imgSrc", "assets/images/组态/状态/" + t + "运行.svg"), this.myDiagram.model.setDataProperty(o, "realType", "运行");
          break;
        default:
          if (i) return this.myDiagram.model.setDataProperty(o, "fillColor", m(go.Brush, "Linear", {
            0: "#6D7A97",
            1: "#9FB3BF",
            start: go.Spot.Top,
            end: go.Spot.Bottom
          })), !1;
          this.myDiagram.model.setDataProperty(o, "imgSrc", "assets/images/组态/状态/" + t + "离线.svg"), this.myDiagram.model.setDataProperty(o, "realType", "离线")
      }
    },
    typeState: function (e, t, o) {
      switch (t.switchState) {
        case "关":
          if (o) return this.myDiagram.model.setDataProperty(t, "fillColor", m(go.Brush, "Linear", {
            0: "#6D7A97",
            1: "#9FB3BF",
            start: go.Spot.Top,
            end: go.Spot.Bottom
          })), !1;
          this.myDiagram.model.setDataProperty(t, "imgSrc", "assets/images/组态/状态/" + e + "离线.svg"), this.myDiagram.model.setDataProperty(t, "realType", "离线");
          break;
        case "开":
          if (o) return this.myDiagram.model.setDataProperty(t, "fillColor", m(go.Brush, "Linear", {
            0: "#09e014",
            1: "#069d0d",
            start: go.Spot.Top,
            end: go.Spot.Bottom
          })), !1;
          this.myDiagram.model.setDataProperty(t, "imgSrc", "assets/images/组态/状态/" + e + "运行.svg"), this.myDiagram.model.setDataProperty(t, "realType", "运行");
          break;
        default:
          if (o) return this.myDiagram.model.setDataProperty(t, "fillColor", m(go.Brush, "Linear", {
            0: "#6D7A97",
            1: "#9FB3BF",
            start: go.Spot.Top,
            end: go.Spot.Bottom
          })), !1;
          this.myDiagram.model.setDataProperty(t, "imgSrc", "assets/images/组态/状态/" + e + "离线.svg"), this.myDiagram.model.setDataProperty(t, "realType", "离线")
      }
    },
    diagramRefresh: function (e) {
      this.name = e.name || this.name, this.bindData = [];
      var t = [request(h + "ModelManage/Sketchpad", {
        query: {
          _site: _config.userInfo.site ? _config.userInfo.site : "",
          siteCode: _config.mqtt_site_code,
          name: this.name
        },
        cacheBust: !0
      })];
      msgUtils.loading(this.$el), o.eachAlways(t).then(function (e) {
        msgUtils.unloading(this.$el), this.drawBoard = e[0].value && e[0].value.data && e[0].value.data.getMe ? e[0].value.data.getMe : [];
        var t = this.drawBoard.filter(function (e, t) {
            return e.name == this.name
          }.bind(this)),
          o = t.length ? t[0].deployURL : {
            linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort"
          },
          i = JSON.parse(o),
          a = JSON.parse(JSON.stringify(i));
        a.linkDataArray.forEach(function (e) {
          e.isHavingDash = !1
        }), a.nodeDataArray.forEach(function (e) {
          e.showVal = "--", e.realVal = "--", e.Unit = "", e.switchState = "关"
        }), this.myDiagram.model = go.Model.fromJson(a)
      }.bind(this))
    },
    diffent: function (e, t, o) {
      var i = [],
        a = [],
        n = [];
      for (var r in e) {
        var s = !1;
        for (var l in t)
          if (t[l][o] === e[r][o]) {
            s = !0;
            break
          } s || a.push(e[r])
      }
      for (var g in t) {
        var d = !1;
        for (var m in e)
          if (e[m][o] === t[g][o]) {
            d = !0;
            break
          } d || n.push(t[g])
      }
      return i.push.apply(i, _toConsumableArray(n.concat(a))), i
    },
    CFSModalClose: function (e) {
      $(".CFSModal").remove()
    },
    createGuid: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
        var t = 16 * Math.random() | 0;
        return ("x" == e ? t : 3 & t | 8).toString(16)
      }).toUpperCase()
    },
    deepCopy: function (e, t) {
      t = t || {};
      for (var o in e) "object" === _typeof(e[o]) ? (t[o] = e[o].constructor === Array ? [] : {}, this.deepCopy(e[o], t[o])) : t[o] = e[o];
      return t
    },
    threeDimensionRender: function (e) {
      this.unitRender = new a, this.unitRender.setElement($(this.el).find("#".concat(this.threeID))).render({
        modelName: e,
        deviceID: this.devices
      })
    },
    fourDimensionRender: function (e) {
      this.loadPanorama = new d, this.loadPanorama.setElement($(this.el).find("#".concat(this.fourID))).render({
        panoramaName: e,
        devices: this.devices
      })
    },
    threeDimensionSwitch: function (e) {
      if (e.stopPropagation(), this.$el.find(".CIFourDimension").removeClass("CIDimensionTwoIcon").addClass("CIDimensionFourIcon").attr("title", "全景"), $(e.currentTarget).hasClass("CIDimensionThreeIcon")) return $(e.currentTarget).removeClass("CIDimensionThreeIcon").addClass("CIDimensionTwoIcon").attr("title", "二维"), this.$el.find(".CIDimensionTwoBox").addClass("CIVisibleHide"), this.$el.find(".CIDimensionFourBox").addClass("CIVisibleHide"), this.$el.find(".CIDimensionThreeBox").removeClass("CIVisibleHide"), !1;
      $(e.currentTarget).removeClass("CIDimensionTwoIcon").addClass("CIDimensionThreeIcon").attr("title", "三维"), this.$el.find(".CIDimensionThreeBox").addClass("CIVisibleHide"), this.$el.find(".CIDimensionFourBox").addClass("CIVisibleHide"), this.$el.find(".CIDimensionTwoBox").removeClass("CIVisibleHide")
    },
    fourDimensionSwitch: function (e) {
      if (e.stopPropagation(), this.$el.find(".CIThreeDimension").removeClass("CIDimensionTwoIcon").addClass("CIDimensionThreeIcon").attr("title", "三维"), $(e.currentTarget).hasClass("CIDimensionFourIcon")) return $(e.currentTarget).removeClass("CIDimensionFourIcon").addClass("CIDimensionTwoIcon").attr("title", "二维"), this.$el.find(".CIDimensionTwoBox").addClass("CIVisibleHide"), this.$el.find(".CIDimensionThreeBox").addClass("CIVisibleHide"), this.$el.find(".CIDimensionFourBox").removeClass("CIVisibleHide"), !1;
      $(e.currentTarget).removeClass("CIDimensionTwoIcon").addClass("CIDimensionFourIcon").attr("title", "全景"), this.$el.find(".CIDimensionThreeBox").addClass("CIVisibleHide"), this.$el.find(".CIDimensionFourBox").addClass("CIVisibleHide"), this.$el.find(".CIDimensionTwoBox").removeClass("CIVisibleHide")
    },
    destroy: function () {
      this.isRender = !1, null != this.loadingMaskView && this.loadingMaskView.destroy(), this.unitRender && this.unitRender.clear3D && (this.unitRender.clear3D(), this.unitRender = null), this.loadPanorama && this.loadPanorama.clear3D && (this.loadPanorama.clear3D(), this.loadPanorama = null), this.setTime && (clearTimeout(this.setTime), this.setTime = null), this.poolWater && (clearInterval(this.poolWater), this.poolWater = null), this.tubeWater && (clearInterval(this.tubeWater), this.tubeWater = null), this.pumpType && (clearInterval(this.pumpType), this.pumpType = null), this.blenderType && (clearInterval(this.blenderType), this.blenderType = null), this.historyWidget && (this.historyWidget.widgetClose(), this.historyWidget = null), this.stopListening(), this.undelegateEvents(), this.$el.removeData().unbind(), this.cloneAndClearDom(), this.remove(), e.View.prototype.remove.call(this);
      try {
        this._mqttView && (this._mqttView.disSaveWaconnect(), this._mqttView = null)
      } catch (e) {
        this._mqttView = null
      }
    },
    cloneAndClearDom: function () {
      var e = $(this.el),
        t = e.parent(),
        o = e.prev(),
        i = e.next();
      o.length + i.length == 0 ? t.append(e.clone().empty()) : 0 < o.length ? o.after(e.clone().empty()) : i.before(e.clone().empty())
    }
  })
});
//# sourceMappingURL=../../sourcemaps/configuration/ConfigurationsInterface/ConfigurationsInterface.js.map
