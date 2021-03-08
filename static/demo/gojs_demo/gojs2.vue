<template>
  <div style="width: 100%;height: 100%">
    <!--  <div style="position: absolute; z-index: 999;">-->
    <!--    <Button @click="btnclick" >输出画布json</Button>-->
    <!--    <Button @click="btngetkey">选中key</Button>-->
    <!--  </div>-->
    <div id="myDiagramDiv" style="width: 100%;height: 100%;">
      <!-- background-image: linear-gradient(to bottom, #023f4b, #02161d); -->
    </div>
  </div>
</template>

<script>
import mqtt from "mqtt";
import go from "gojs";
const $ = go.GraphObject.make;

import axios from "axios";

function _createGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    .replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .toUpperCase();
}

var client;
const options = {
  connectTimeout: 40000,
  clientId: "PandaWeb-" + _createGuid(),
  username: "mqtt_js",
  password: "B66FY1jRMAtyOwO2j99l",
  clean: true
};

export default {
  name: "gojs",
  data() {
    return {
      myDiagram: "",
      keys: [],

      poolWater: null,
      tubeWater: null,
      pumpType: null,
      blenderType: null
    };
  },
  mounted() {
    this.getjson();
    this.mqttMsg();
  },
  methods: {
    mqttMsg() {
      if (client == null)
        client = mqtt.connect("ws://36.156.142.83:8083/mqtt", options);

      client.on("connect", e => {
        console.log("连接成功！！！");
        client.subscribe(
          "Topic/flexem/fbox/" + 301020112779 + "/system/MonitorData",
          {},
          error => {
            if (!error) {
              console.log("订阅成功");
            } else {
              console.log("订阅失败");
            }
          }
        );
      });

      // 接收消息处理

      client.on("message", (topic, message) => {
        console.log("收到来自", topic, "的消息", message.toString());
        this.msg = message.toString();
      });
    },
    btngetkey() {
      var person = prompt("请输入key：", "-10");
      if (person != null && person != "") {
        var nodekey = this.myDiagram.model.findNodeDataForKey(person); //通过节点key获取节点
        var nodekeyselect = this.myDiagram.findNodeForData(nodekey); //查找结点
        this.myDiagram.select(nodekeyselect); //反选此节点
      }
    },
    btnclick() {
      var model = this.myDiagram.model.toJson(); //获得整个画布的json
      var nodes = model.nodeDataArray; //取出所有节点
      var Links = model.linkDataArray; //取出所有线
      console.log(model);
    },
    changebeijing(node) {
      //选中改变事件
      // debugger
      // var nodekey = this.myDiagram.model.findNodeDataForKey('-2222');//通过节点key获取节点
      var nodekeyselect = this.myDiagram.findNodeForData(node); //查找结点
      this.myDiagram.select(nodekeyselect); //反选此节点
    },
    getjson() {
      let _self = this;
      axios
        .get("../../../static/二供设备/json_海安泵站.json")
        // .get("../../../static/二供设备/json_东北明珠.json")
        .then(function(res) {
          _self.keys = [];
          res.data.nodeDataArray.forEach(function(item) {
            if (item.category == "valCase") _self.keys.push(item.key);
          });

          _self.init(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    initWebsocket() {
      var _this = this;
      this.websocket = new WebSocket("ws://58.213.48.106/lyg/ws");

      this.websocket.onopen = function(evt) {
        var msg = {
          action: "getData",
          PumpName: _this.keys.join(",")
        };
        _this.websocket.send(JSON.stringify(msg));
      };

      this.websocket.onmessage = function(msg) {
        // console.log(msg)
        var data = eval("(" + msg.data + ")");
        if (data.source.length == 0) return;
        data.source.forEach(function(item) {
          var node = _this.myDiagram.model.findNodeDataForKey(item.key);
          _this.myDiagram.model.setDataProperty(node, "realVal", item.value);
          _this.myDiagram.model.setDataProperty(node, "showVal", item.value);
        });
      };

      this.websocket.onerror = function(evt) {};

      this.websocket.onclose = function(evt) {};
    },
    handlerDC(e, obj) {
      //双击事件
      var node = obj.part; //拿到节点的json对象，后面要拿什么值就直接.出来
      var procTaskId = node.data.key;
      var procTaskName = node.data.text;
      var procTaskloc = node.data.loc;
      console.log(procTaskName + " key:" + procTaskId + " 坐标" + procTaskloc);
    },
    init(jsonStr) {
      var _this = this;
      var o,
        opacity = 1,
        down = true,
        _self = this;

      if (window.goSamples) goSamples();

      this.myDiagram = $(go.Diagram, "myDiagramDiv", {
        initialAutoScale: go.Diagram.Uniform,
        initialContentAlignment: go.Spot.Center, // 画布内居中显示
        "grid.visible": true, //显示网格
        allowZoom: true, //画布是否可以缩放
        maxSelectionCount: 1,
        allowMove: false //选中节点
        // "undoManager.isEnabled": true //撤销
        // "dragSelectingTool.isEnabled" : false,//禁止鼠标拖动区域选中
        //  isReadOnly: true, //只读
      });

      this.myDiagram.grid = $(
        go.Panel,
        go.Panel.Grid,
        { gridCellSize: new go.Size(70, 70) },
        $(go.Shape, "LineH", { stroke: "rgba(7, 87, 102, 0.6)" }),
        $(go.Shape, "LineV", { stroke: "rgba(7, 87, 102, 0.6)" })
      );
      // console.log('11')
      go.Shape.defineFigureGenerator("Pool", function(shape, w, h) {
        var geo = new go.Geometry();
        var fig = new go.PathFigure(0, 0, true);
        geo.add(fig);
        fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
        fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
        fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
        return geo;
      });

      this.myDiagram.nodeTemplateMap.add(
        "pic",
        $(
          go.Node,
          "Spot",
          { locationSpot: go.Spot.Center, zOrder: 1 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Picture,
            { width: 56, height: 56, column: 0, scale: 1, source: "" },
            new go.Binding("source", "imgSrc").makeTwoWay(),
            new go.Binding("scale", "scale").makeTwoWay(),
            new go.Binding("width", "width").makeTwoWay(),
            new go.Binding("height", "height").makeTwoWay()
          )
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "svgCase",
        $(
          go.Node,
          "Spot",
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          { locationSpot: go.Spot.Center, zOrder: 1 },
          // { selectionChanged: _this.changebeijing },

          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Panel,
            "Auto",
            { name: "PANEL" },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            ),
            $(
              go.Picture,
              { width: 56, height: 56, column: 0, scale: 1, source: "" },
              new go.Binding("source", "imgSrc").makeTwoWay(),
              new go.Binding("scale", "scale").makeTwoWay(),
              new go.Binding("width", "width").makeTwoWay(),
              new go.Binding("height", "height").makeTwoWay()
            ),
            this.makePort("T", go.Spot.Top, !0, !0),
            this.makePort("L", go.Spot.Left, !0, !0),
            this.makePort("R", go.Spot.Right, !0, !0),
            this.makePort("B", go.Spot.Bottom, !0, !0),
            this.makePort("RB", go.Spot.BottomRight, !0, !0),
            this.makePort("LB", go.Spot.BottomLeft, !0, !0),
            this.makePort("RT", go.Spot.TopRight, !0, !0),
            this.makePort("LT", go.Spot.TopLeft, !0, !0),
            { click: function(e, t) {} }
          )
        )
      );
      this.myDiagram.nodeTemplateMap.add(
        "modelCase",
        $(
          go.Node,
          "Auto",
          this.nodeStyle(),
          "Spot",
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          { locationSpot: go.Spot.Center, zOrder: 1 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          { resizeObjectName: "SHAPE" },
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Shape,
            "Rectangle",
            {
              name: "SHAPE",
              fill: "rgba(128,128,128,0.2)",
              stroke: "gray"
            },
            new go.Binding("fill", "fillColor").makeTwoWay(),
            new go.Binding("stroke").makeTwoWay(),
            new go.Binding("strokeWidth").makeTwoWay(),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            )
          )
        )
      );
      this.myDiagram.nodeTemplateMap.add(
        "ellipseCase",
        $(
          go.Node,
          "Auto",
          this.nodeStyle(),
          "Spot",
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          { locationSpot: go.Spot.Center, zOrder: 1 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            resizeObjectName: "SHAPE"
          },
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Shape,
            "Ellipse",
            { name: "SHAPE", fill: "rgba(128,128,128,0.2)", stroke: "gray" },
            new go.Binding("fill", "fillColor").makeTwoWay(),
            new go.Binding("stroke").makeTwoWay(),
            new go.Binding("strokeWidth").makeTwoWay(),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            )
          )
        )
      );
      this.myDiagram.nodeTemplateMap.add(
        "nameCase",
        $(
          go.Node,
          "Auto",
          this.nodeStyle(),
          "Spot",
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          { locationSpot: go.Spot.Center, zOrder: 3 },

          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Shape,
            "Rectangle",
            { name: "SHAPE", strokeWidth: 10, stroke: "#000000" },
            new go.Binding("fill", "fillColor").makeTwoWay(),
            new go.Binding("stroke").makeTwoWay(),
            new go.Binding("strokeWidth").makeTwoWay(),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            )
          ),
          $(
            go.TextBlock,
            this.textStyle(),
            {
              margin: 5,
              maxSize: new go.Size(NaN, NaN),
              minSize: new go.Size(NaN, 1),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: !0,
              font: "bold 12px Helvetica, Arial, sans-serif",
              stroke: "#454545"
            },
            new go.Binding("text").makeTwoWay(),
            new go.Binding("font", "fontStyle"),
            new go.Binding("stroke", "fontStroke").makeTwoWay()
          )
        )
      );
      this.myDiagram.nodeTemplateMap.add(
        "HBar",
        $(
          go.Node,
          "Auto",
          this.nodeStyle(),
          "Spot",
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          { locationSpot: go.Spot.Center, zOrder: 1 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("angle").makeTwoWay(),
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Shape,
            "Rectangle",
            {
              name: "SHAPE",
              stroke: "white",
              strokeWidth: 6,
              height: 0,
              width: 120,
              fill: "#41BFEC",
              stroke: null,
              strokeWidth: 0,
              minSize: new go.Size(20, 0),
              maxSize: new go.Size(Infinity, 0)
            },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            ),
            new go.Binding("minSize", "minSize").makeTwoWay(),
            new go.Binding("maxSize", "maxSize").makeTwoWay(),
            new go.Binding("stroke", "stroke").makeTwoWay(),
            new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()
          ),
          $(
            go.Shape,
            {
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
            new go.Binding("strokeDashArray", "strokeDashArray").makeTwoWay(),
            { portId: "", toLinkable: true, fromLinkable: true }
          ),
          {
            click: function(e, node) {
              var data = node.data;
            }
          }
        )
      );
      this.myDiagram.nodeTemplateMap.add(
        "valCase",
        $(
          go.Node,
          "Auto",
          this.nodeStyle(),
          "Spot",
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          { locationSpot: go.Spot.Center, zOrder: 2 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Shape,
            "Rectangle",
            { name: "SHAPE", strokeWidth: 10, stroke: "#000000" },
            new go.Binding("fill", "fillColor"),
            new go.Binding("stroke"),
            new go.Binding("strokeWidth"),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            )
          ),
          $(
            go.TextBlock,
            this.textStyle(),
            {
              maxSize: new go.Size(NaN, NaN),
              minSize: new go.Size(NaN, 1),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: !0,
              font: "bold 12px Helvetica, Arial, sans-serif",
              stroke: "#454545"
            },
            new go.Binding("text", "showVal"),
            new go.Binding("font", "fontStyle"),
            new go.Binding("stroke", "fontStroke")
          ),
          {
            click: function(e, t) {
              t.data;
            }
          }
        )
      );
      this.myDiagram.nodeTemplateMap.add(
        "linkPort",
        $(
          go.Node,
          "Auto",
          this.nodeStyle(),
          "Spot",
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          { locationSpot: go.Spot.Center, zOrder: 1 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Panel,
            "Auto",
            { name: "PANEL" },
            $(go.Shape, "Rectangle", {
              fill: "transparent",
              strokeWidth: 0,
              width: 8,
              height: 8,
              minSize: new go.Size(5, 5)
            })
          )
        )
      );
      this.myDiagram.nodeTemplateMap.add(
        "waterCase",
        $(
          go.Node,
          "Auto",
          this.nodeStyle(),
          "Spot",
          { locationSpot: go.Spot.Center, zOrder: 1 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Shape,
            "Rectangle",
            {
              name: "SHAPE",
              alignment: go.Spot.Bottom,
              alignmentFocus: go.Spot.Bottom,
              fill: "transparent",
              strokeWidth: 10,
              stroke: "red",
              desiredSize: new go.Size(NaN, 26)
            },
            new go.Binding("width").makeTwoWay(),
            new go.Binding("height").makeTwoWay(),
            new go.Binding("stroke", "stroke").makeTwoWay(),
            new go.Binding("strokeWidth", "stokeColor").makeTwoWay(),
            new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()
          ),
          $(
            go.Shape,
            "Rectangle",
            {
              name: "SHAPE",
              alignment: go.Spot.Bottom,
              alignmentFocus: go.Spot.Bottom,
              fill: "#ccc",
              strokeWidth: 10,
              stroke: "transparent",
              desiredSize: new go.Size(NaN, 26)
            },
            new go.Binding("width").makeTwoWay(),
            new go.Binding("height").makeTwoWay(),
            new go.Binding("fill", "fontStroke").makeTwoWay(),
            new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()
          ),
          $(
            go.Shape,
            "Pool",
            {
              name: "waterSvg",
              alignment: go.Spot.Bottom,
              alignmentFocus: go.Spot.Bottom,
              fill: "#DEE0A3",
              stroke: "transparent",
              strokeWidth: 10,
              minSize: new go.Size(NaN, 5),
              desiredSize: new go.Size(NaN, 20)
            },
            new go.Binding("width").makeTwoWay(),
            new go.Binding("height", "waterHight").makeTwoWay(),
            new go.Binding("fill", "fillColor").makeTwoWay(),
            new go.Binding("strokeWidth", "strokeWidth").makeTwoWay()
          )
        )
      );
      this.myDiagram.nodeTemplateMap.add(
        "rotateCase",
        $(
          go.Node,
          "Table",
          this.nodeStyle(),
          "Spot",
          { locationSpot: go.Spot.Center, zOrder: 2 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            resizeObjectName: "SHAPE",
            rotatable: true
          },
          $(
            go.Panel,
            "Table",
            {
              name: "PANEL"
            },
            $(
              go.Shape,
              "Ellipse", //定义形状
              {
                width: 37,
                height: 37,
                fill: "transparent",
                stroke: "transparent",
                strokeWidth: 1
              },
              new go.Binding("width", "widthBox").makeTwoWay(),
              new go.Binding("height", "heightBox").makeTwoWay()
            ),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            ),

            $(
              go.Picture,
              {
                name: "rotateSvg",
                width: 26,
                height: 26,
                column: 0,
                scale: 1,
                source: "assets/images/组态/状态/泵离线.svg",
                angle: 0
              },
              new go.Binding("source", "imgSrc").makeTwoWay(),
              new go.Binding("scale", "scale").makeTwoWay(),
              new go.Binding("width", "width").makeTwoWay(),
              new go.Binding("angle", "angle").makeTwoWay(),
              new go.Binding("height", "height").makeTwoWay()
            )
          )
        )
      );
      this.myDiagram.nodeTemplateMap.add(
        "pointCase",
        $(
          go.Node,
          "Auto",
          this.nodeStyle(),
          "Spot",
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          { locationSpot: go.Spot.Center, zOrder: 2 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Shape,
            "Ellipse",
            {
              width: 14,
              height: 14,
              name: "SHAPE",
              fill: "rgba(109, 122, 151, 1)",
              stroke: "gray"
            },
            new go.Binding("fill", "fillColor").makeTwoWay(),
            new go.Binding("stroke").makeTwoWay(),
            new go.Binding("height", "height").makeTwoWay(),
            new go.Binding("width", "height").makeTwoWay()
          )
        )
      );
      this.myDiagram.nodeTemplateMap.add(
        "switchCase",
        $(
          go.Node,
          "Auto",
          this.nodeStyle(),
          "Spot",
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          { locationSpot: go.Spot.Center, zOrder: 2 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Shape,
            "RoundedRectangle",
            { name: "SHAPE", strokeWidth: 10, stroke: "#000000" },
            new go.Binding("fill", "fillColor"),
            new go.Binding("stroke"),
            new go.Binding("strokeWidth"),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            )
          ),
          $(
            go.TextBlock,
            this.textStyle(),
            {
              maxSize: new go.Size(NaN, NaN),
              minSize: new go.Size(NaN, 1),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: !0,
              font: "bold 12px Helvetica, Arial, sans-serif",
              stroke: "#454545"
            },
            new go.Binding("text"),
            new go.Binding("font", "fontStyle"),
            new go.Binding("stroke", "fontStroke")
          ),
          {
            toolTip: $(
              "ToolTip",
              $(go.TextBlock, { margin: 2 }, new go.Binding("text", "text"))
            )
          },
          {
            click: function(e, t) {
              var item = t.data;
              // if (item.switchState == "开" || item.realVal == "--") return false;
              var controlName = item.controlName || item.showName;

              _self.$Modal.confirm({
                title: "操作",
                content: "确定要" + item.text + controlName + "吗？",
                onOk: () => {}
              });
            }
          }
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "blenderCase",
        $(
          go.Node,
          "Table",
          this.nodeStyle(),
          "Spot",
          { locationSpot: go.Spot.Center, zOrder: 2 },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            resizeObjectName: "SHAPE",
            rotatable: true
          },
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Panel,
            "Auto",
            {
              name: "PANEL"
            },
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            ),

            $(
              go.Picture,
              {
                name: "blenderSvg",
                width: 42.5,
                height: 56,
                column: 0,
                scale: 1,
                source: "assets/images/组态/状态/搅拌机双头1.svg",
                angle: 0
              },
              new go.Binding("source", "imgSrc").makeTwoWay(),
              new go.Binding("scale", "scale").makeTwoWay(),
              new go.Binding("width", "width").makeTwoWay(),
              new go.Binding("angle", "angle").makeTwoWay(),
              new go.Binding("height", "height").makeTwoWay()
            )
          ),
          {
            toolTip: $(
              "ToolTip",
              $(go.TextBlock, { margin: 2 }, new go.Binding("text", "text"))
            )
          }
        )
      );

      this.myDiagram.linkTemplate = $(
        go.Link,
        (this._defineProperty(
          (o = {
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
          }),
          "relinkableFrom",
          !0
        ),
        this._defineProperty(o, "relinkableTo", !0),
        o),
        new go.Binding("fromSpot", "fromPort", function(e) {
          return spotConverter(e);
        }),
        new go.Binding("toSpot", "toPort", function(e) {
          return spotConverter(e);
        }),
        new go.Binding("points").makeTwoWay(),
        $(
          go.Shape,
          {
            isPanelMain: !0,
            stroke: "#41BFEC",
            strokeWidth: 6,
            name: "changecolor"
          },
          new go.Binding("stroke", "stroke"),
          new go.Binding("strokeWidth", "strokeWidth")
        ),
        $(
          go.Shape,
          {
            isPanelMain: !0,
            stroke: "white",
            strokeWidth: 3,
            name: "PIPE",
            strokeDashArray: [20, 40]
          },
          new go.Binding("strokeWidth", "waterWidth"),
          new go.Binding("stroke", "waterStroke")
        ),
        {
          click: function(e, t) {
            t.data;
          }
        }
      );
      this.myDiagram.linkTemplateMap.add(
        "linkToLink",
        $(
          "Link",
          { relinkableFrom: !0, relinkableTo: !0 },
          $("Shape", { stroke: "#2D9945", strokeWidth: 2 }),
          {
            click: function(e, t) {
              var o = t.data;
              n.myDiagram.model.findLinkDataForKey(o.key);
              n.myDiagram.model.setDataProperty(o, "color", "red");
            }
          }
        )
      );

      this.setTime = setTimeout(function() {
        _self.loop();
        _self.waterSvg();
        _self.rotateSvg();
        _self.blenderSvg();
      }, 100);

      jsonStr.linkDataArray.forEach(function(item) {
        item.isHavingDash = true;
        item.realVal = "--";
        item.defaultWidth = item.waterWidth;
      });
      jsonStr.nodeDataArray.forEach(function(item) {
        item.showVal = "--";
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
      });
      this.myDiagram.model = go.Model.fromJson(jsonStr);
    },
    nodeStyle() {
      return [
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        { locationSpot: go.Spot.Center }
      ];
    },

    textStyle() {
      return {
        font: "bold 11pt Helvetica, Arial, sans-serif",
        stroke: "whitesmoke"
      };
    },

    _defineProperty(e, t, o) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: o,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (e[t] = o),
        e
      );
    },

    makePort(e, t, o, i) {
      return $(go.Shape, "Circle", {
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
      });
    },

    loop() {
      let _self = this;
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
            shape.strokeDashOffset = off <= 0 ? 60 : off;
          } else {
            link.zOrder = 0;
            shape.strokeWidth = 0;
            shape.strokeDashOffset = 0;
          }
        });
        diagram.skipsUndoManager = oldskips;
      }, 60);
    },

    waterSvg() {
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
          var range = (shape.range ? shape.range : 0) + 0.5;
          shape.range = range >= 5 ? 0 : range;
          shape.geometryString =
            "F M0 " +
            shape.range +
            " L" +
            shape.width +
            " " +
            (5 - shape.range) +
            " L" +
            shape.width +
            " " +
            shape.height +
            " L0 " +
            shape.height +
            "z";
        });
        diagram.skipsUndoManager = oldskips;
      }, 100);
    },

    rotateSvg() {
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
          shape.angle = off <= 360 ? off : 0;
        });
        diagram.skipsUndoManager = oldskips;
      }, 60);
    },

    blenderSvg() {
      var diagram = this.myDiagram;
      this.blenderType = setInterval(function() {
        var oldskips = diagram.skipsUndoManager;
        diagram.skipsUndoManager = true;
        diagram.nodes.each(function(node) {
          var shape = node.findObject("blenderSvg");
          if (!shape) return false;
          var _node = node.data;
          if (_node.switchState != "开" || _node.realVal == "--") {
            shape.source = shape.source.replace(/[0-9]/gi, 1);
            return false;
          }
          shape.flag = shape.flag || 1;
          var num = shape.source.replace(/[^0-9]/gi, "") * 1;
          var _num = 1;
          if (shape.flag == 1) {
            _num = num < 5 ? num + 1 : 4;
            if (num >= 5) shape.flag = 2;
          } else {
            _num = num > 1 ? num - 1 : 2;
            if (num <= 1) shape.flag = 1;
          }
          shape.source = shape.source.replace(/[0-9]/gi, _num);
        });
        diagram.skipsUndoManager = oldskips;
      }, 100);
    }
  },
  beforeDestroy() {
    client.end();
    client = null;

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
    this.websocket.close();
  }
};
</script>

<style scoped></style>
