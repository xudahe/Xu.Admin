<!-- 中间主体部分 -->
<template>
  <div class="middlePageDiv" style="width: 100%;height: 100%;">
    <!-- <Button v-show="allowMove" @click="btnclick">输出画布json</Button> -->
    <div id="myDiagram" style="width: 100%;height: 100%;">
      <!-- background-image: linear-gradient(to bottom, #023f4b, #02161d); -->
    </div>
  </div>
</template>
<script>
const $ = go.GraphObject.make;
import axios from "axios";

export default {
  name: "carouselPage3",
  components: {},
  data() {
    return {
      screensize: window.screen.width + "*" + window.screen.height, // 屏幕分辨率
      myDiagram: null,
      allowMove: true, //允许gojs面板拖动节点

      valuecolors: {
        离线: {
          stroke: "#151e54", //实时值边框
          fontStroke: "#c6cacf", //实时值底色
          fillColor: "#151e54", //实时值底色文字

          color: "#bfc2c4", //节点头部文字
          Outsidecolor: "#555555", //节点外圈
          withincolor: "#afafaf" //节点内圈
        },
        报警: {
          stroke: "#151e54", //实时值边框
          fontStroke: "#ff401e", //实时值底色
          fillColor: "#151e54", //实时值底色文字

          color: "#add5f9", //节点头部文字
          Outsidecolor: "#6a0c0c", //节点外圈
          withincolor: "#ff0c0c" //节点内圈
        },
        在线: {
          stroke: "#151e54", //实时值边框
          fontStroke: "#39ff78", //实时值底色
          fillColor: "#151e54", //实时值底色文字

          color: "#add5f9", //节点头部文字
          withincolor: "#39ff78" //节点内圈
        }
      },
      jdcolors: {
        大浦工业区: {
          Outsidecolor: "#71721f",
          withincolor: "#d6d823"
        },
        运盐河: {
          Outsidecolor: "#088d58",
          withincolor: "#1eec9b"
        },
        墟沟: {
          Outsidecolor: "#91550e",
          withincolor: "#ff9f16"
        },
        排淡河: {
          Outsidecolor: "#0052d9",
          withincolor: "#09d9ff"
        },
        临港: {
          Outsidecolor: "#5d0ebf",
          withincolor: "#c58cff"
        },
        东盐河: {
          Outsidecolor: "#00bdc4",
          withincolor: "#2df8ff"
        }
      }
    };
  },
  methods: {
    gojsJson() {
      let _this = this;

      axios
        .get("static/demo/gojs_demo/json/泵站拓扑图.json")
        .then(function(res) {
          _this.initgojs(res.data);
        });
    },
    initgojs(data) {
      var _this = this;

      this.myDiagram = $(
        go.Diagram,
        "myDiagram", // 为div元素创建一个图表
        {
          "grid.visible": true, //画布上面是否出现网格
          padding: 30,
          autoScale: go.Diagram.Uniform, //自适应
          initialContentAlignment: go.Spot.Center, // 画布内居中显示
          allowHorizontalScroll: false, //禁止水平拖动画布  禁止水平滚动条
          allowVerticalScroll: false, //禁止垂直拖动画布 禁止垂直滚动条
          // maxScale:1.2,//最大视图的放大比例
          maxSelectionCount: 10, // 用户一次只能选择一个零件
          "toolManager.hoverDelay": 10, // 显示工具提示的速度
          // initialAutoScale: go.Diagram.Uniform, // 缩放以显示所有内容
          allowMove: _this.allowMove, //允许拖动
          "undoManager.isEnabled": _this.allowMove, //撤销
          nodeSelectionAdornmentTemplate: $(
            //节点选中边框
            go.Adornment,
            "Auto",
            $(go.Shape, "Rectangle", { fill: "white", stroke: null })
          )
        }
      );

      this.myDiagram.grid = $(
        go.Panel,
        go.Panel.Grid,
        { gridCellSize: new go.Size(70, 70) },
        $(go.Shape, "LineH", { stroke: "rgba(7, 87, 102, 0.6)" }),
        $(go.Shape, "LineV", { stroke: "rgba(7, 87, 102, 0.6)" })
      );

      var colors = {
        red: "#be4b15",
        green: "#52ce60",
        blue: "#022e7e",
        lightred: "#fd8852",
        lightblue: "#afd4fe",
        lightgreen: "#b9e986",
        pink: "#faadc1",
        purple: "#d689ff",
        orange: "#fdb400"
      };

      //一级泵站
      this.myDiagram.nodeTemplateMap.add(
        "circleyiji",
        $(
          go.Node,
          "Spot",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          {
            click: function(e, node) {
              _this.gojsclick(e, node);
            }
          }, //单击事件
          {
            mouseEnter: _this.mouseEnter,
            mouseLeave: _this.mouseLeave
          },
          $(
            go.Shape,
            "Circle",
            {
              fill: "rgba(255,255,255,0)" /* green */,
              stroke: null,
              portId: "",
              width: 52,
              height: 52,
              cursor: "pointer"
            },
            new go.Binding("fill", "Outsidecolor")
          ),
          $(
            go.Shape,
            "Circle",
            {
              fill: colors.blue /* green */,
              stroke: null,
              width: 29,
              height: 29,
              portId: "",
              cursor: "pointer"
            },
            new go.Binding("fill", "withincolor")
          ),
          // $(go.Picture,
          //   {
          //     name: "Picture",
          //     // margin: 1.5,
          //   },
          //   new go.Binding("source", "imgsrc"),
          //   new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
          // ),
          $(
            go.TextBlock,
            {
              stroke: colors.green,
              font: "Bold 20px Lato, sans-serif",
              textAlign: "center",
              margin: 5
              // maxSize: new go.Size(100, NaN),
              // alignment: go.Spot.TopCenter,
              // alignmentFocus: go.Spot.BottomCenter,
            },
            new go.Binding("font", "font"),
            new go.Binding("alignment", "fromSpot", function(d) {
              return tetxXY(d, "alignment");
            }),
            new go.Binding("alignmentFocus", "fromSpot", function(d) {
              return tetxXY(d, "alignmentFocus");
            }),
            new go.Binding("stroke", "color"),
            new go.Binding("text", "text")
          )
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "valCase",
        $(
          go.Node,
          "Spot",
          {
            doubleClick: function(e, node) {
              var procTaskId = node.data.key;
              var procTaskName = node.data.text;
              var procTaskloc = node.data.loc;
              var category = node.data.category;
              var boxno = node.data.boxno;
              console.log(
                procTaskName + " key:" + procTaskId + " 坐标" + procTaskloc
              );
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
            {
              font: "bold 11pt Helvetica, Arial, sans-serif",
              stroke: "whitesmoke",
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

      //文字放大
      this.myDiagram.nodeTemplateMap.add(
        "circleTbig",
        $(
          go.Node,
          "Spot",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          {
            click: function(e, node) {
              _this.gojsclick(e, node);
            }
          }, //单击事件
          {
            mouseEnter: _this.mouseEnter,
            mouseLeave: _this.mouseLeave
          },
          $(
            go.Shape,
            "Circle",
            {
              fill: "rgba(255,255,255,0)" /* green */,
              stroke: null,
              portId: "",
              width: 90,
              cursor: "pointer"
            },
            new go.Binding("width", "Circle")
          ),
          $(
            go.Picture,
            {
              name: "Picture"
              // margin: 1.5,
            },
            new go.Binding("source", "imgsrc"),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            )
          ),
          $(
            go.TextBlock,
            {
              stroke: colors.green,
              font: "Bold 24px Lato, sans-serif",
              // textAlign: "right",
              margin: 5
              // maxSize: new go.Size(100, NaN),
              // alignment: go.Spot.TopCenter,
              // alignmentFocus: go.Spot.BottomCenter,
            },
            new go.Binding("font", "font"),
            new go.Binding("alignment", "fromSpot", function(d) {
              return tetxXY(d, "alignment");
            }),
            new go.Binding("alignmentFocus", "fromSpot", function(d) {
              return tetxXY(d, "alignmentFocus");
            }),
            new go.Binding("text", "text"),
            new go.Binding("stroke", "color")
          )
        )
      );

      //文字 带圈
      this.myDiagram.nodeTemplateMap.add(
        "circleS",
        $(
          go.Node,
          "Spot",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            doubleClick: function(e, node) {
              _this.handlerDC(e, node);
            }
          }, //双击事件
          {
            click: function(e, node) {
              _this.gojsclick(e, node);
            }
          }, //单击事件
          {
            mouseEnter: _this.mouseEnter,
            mouseLeave: _this.mouseLeave
          },
          $(
            go.Shape,
            "Circle",
            {
              fill: colors.green /* green */,
              stroke: null,
              portId: "",
              width: 35,
              height: 35,
              cursor: "pointer"
            },
            new go.Binding("fill", "Outsidecolor"),
            new go.Binding("width", "Outsidesize"),
            new go.Binding("height", "Outsidesize")
          ),
          $(
            go.Shape,
            "Circle",
            {
              fill: colors.blue /* green */,
              stroke: null,
              width: 20,
              height: 20,
              portId: "",
              cursor: "pointer"
            },
            new go.Binding("fill", "withincolor"),
            new go.Binding("width", "withinsize"),
            new go.Binding("height", "withinsize")
          ),
          $(
            go.TextBlock,
            {
              stroke: colors.green,
              font: "Bold 20px Lato, sans-serif",
              textAlign: "center",
              margin: 10
              // maxSize: new go.Size(100, NaN),
              // alignment: go.Spot.TopCenter,
              // alignmentFocus: go.Spot.BottomCenter,
            },
            new go.Binding("font", "font"),
            new go.Binding("alignment", "fromSpot", function(d) {
              return tetxXY(d, "alignment");
            }),
            new go.Binding("alignmentFocus", "fromSpot", function(d) {
              return tetxXY(d, "alignmentFocus");
            }),
            new go.Binding("text", "text"),
            new go.Binding("stroke", "color")
          )
        )
      );

      this.myDiagram.linkTemplate = $(
        go.Link,
        {
          toShortLength: -2,
          fromShortLength: -2,
          layerName: "Background",
          routing: go.Link.Orthogonal,
          corner: 15,
          fromSpot: go.Spot.RightSide,
          toSpot: go.Spot.LeftSide
        },
        // make sure links come in from the proper direction and go out appropriately
        new go.Binding("fromSpot", "fromSpot", function(d) {
          return spotConverter(d);
        }),
        new go.Binding("toSpot", "toSpot", function(d) {
          return spotConverter(d);
        }),
        new go.Binding("points").makeTwoWay(),
        // mark each Shape to get the link geometry with isPanelMain: true
        $(
          go.Shape,
          {
            isPanelMain: true,
            stroke: colors.orange,
            strokeWidth: 15
          },
          new go.Binding("stroke", "linkcolor")
        ),
        // 流向
        $(
          go.Shape,
          {
            isPanelMain: true,
            stroke: colors.green,
            strokeWidth: 5,
            name: "PIPE",
            strokeDashArray: [20, 20]
          },
          new go.Binding("stroke", "watercolor")
        )
        //箭头
        // $(go.TextBlock, ">>>>", {  font: "Bold 22px Lato, sans-serif",segmentIndex: 1, segmentFraction: 0.5, stroke:"#38ff0e",segmentOrientation: go.Link.OrientUpright}),
        // $(go.TextBlock, ">>>>", {  font: "Bold 22px Lato, sans-serif",segmentIndex: 2, segmentFraction: 0.5, stroke:"#38ff0e",segmentOrientation: go.Link.OrientUpright}),
        // $(go.TextBlock, ">>>>", {  font: "Bold 22px Lato, sans-serif",segmentIndex: 3, segmentFraction: 0.8, stroke:"#38ff0e",segmentOrientation: go.Link.OrientUpright}),
      );

      this.myDiagram.model = go.Model.fromJson(data); //加载json
      this.getdata();

      function tetxXY(dir, d) {
        if (d == "alignment") {
          if (dir === "left") return go.Spot.LeftCenter;
          if (dir === "right") return go.Spot.RightCenter;
          if (dir === "top") return go.Spot.TopCenter;
          if (dir === "bottom") return go.Spot.BottomCenter;
        }
        if (d == "alignmentFocus") {
          if (dir === "left") return go.Spot.RightCenter;
          if (dir === "right") return go.Spot.LeftCenter;
          if (dir === "bottom") return go.Spot.TopCenter;
          if (dir === "top") return go.Spot.BottomCenter;
        }
      }

      function spotConverter(dir) {
        if (dir === "left") return go.Spot.LeftSide;
        if (dir === "right") return go.Spot.RightSide;
        if (dir === "top") return go.Spot.TopSide;
        if (dir === "bottom") return go.Spot.BottomSide;
        if (dir === "rightsingle") return go.Spot.Right;
      }

      loop();
      function loop() {
        var diagram = _this.myDiagram;
        var opacity = 1;
        var down = true;
        setTimeout(function() {
          var oldskips = diagram.skipsUndoManager;
          diagram.skipsUndoManager = true;
          diagram.links.each(function(link) {
            var shape = link.findObject("PIPE");
            var off = shape.strokeDashOffset - 3;
            // 设置（移动）笔划划动画
            shape.strokeDashOffset = off <= 0 ? 60 : off;
            // 动画（频闪）不透明度：
            // if (down) opacity = opacity - 0.01;
            // else opacity = opacity + 0.003;
            // if (opacity <= 0) { down = !down; opacity = 0; }
            // if (opacity > 1) { down = !down; opacity = 1; }
            // shape.opacity = opacity;
          });
          diagram.skipsUndoManager = oldskips;
          loop();
        }, 60);
      }
    },
    mouseLeave(e, obj) {
      //鼠标移出
      var node = obj.data;
      var nodes = this.myDiagram.model.findNodeDataForKey(node.key);
      switch (node.category) {
        case "circleS":
        case "circleyiji":
          this.myDiagram.model.setDataProperty(
            nodes,
            "withincolor",
            this.lwithincolor
          );
          this.lwithincolor = "";
          break;
        case "circleTbig":
          break;
      }
    },
    mouseEnter(e, obj) {
      //鼠标移入
      var node = obj.data;
      var nodes = this.myDiagram.model.findNodeDataForKey(node.key);
      this.lwithincolor = nodes.withincolor;
      switch (node.category) {
        case "circleS":
        case "circleyiji":
          this.myDiagram.model.setDataProperty(nodes, "withincolor", "#ffffff");
          break;
        case "circleTbig":
          break;
      }
    },
    gojsclick(e, obj) {
      //单击事件
      var node = obj.part; //拿到当前选中节点的json对象
      var procTaskId = node.data.key;
      var procTaskloc = node.data.loc;
      var procTaskName = node.data.text;

      console.log(procTaskName + " key:" + procTaskId + " Ioc" + procTaskloc);
    },
    handlerDC(e, obj) {
      //双击事件
    },
    btnclick() {
      var model = this.myDiagram.model.toJson(); //获得整个画布的json
      var nodes = model.nodeDataArray; //取出所有节点
      var Links = model.linkDataArray; //取出所有线
      console.log(model);
    },
    changejdvalue(newVal) {
      var _this = this;

      if (!_this.myDiagram) return;
      newVal.forEach(jjs => {
        let nodesvalCases = _this.myDiagram.model.findNodeDataForKey(
          jjs.pumpspaceid + "valCase"
        );
        _this.myDiagram.model.setDataProperty(nodesvalCases, "showVal", "-- m");
        _this.myDiagram.model.setDataProperty(
          nodesvalCases,
          "stroke",
          _this.valuecolors["离线"].stroke
        ); //边框
        _this.myDiagram.model.setDataProperty(
          nodesvalCases,
          "fontStroke",
          _this.valuecolors["离线"].fontStroke
        ); //底色
        _this.myDiagram.model.setDataProperty(
          nodesvalCases,
          "fillColor",
          _this.valuecolors["离线"].fillColor
        ); //底色文字
      });

      setTimeout(() => {
        for (var i = 0; i < newVal.length; i++) {
          var item = newVal[i];
          var nodesvalCase = _this.myDiagram.model.findNodeDataForKey(
            item.pumpspaceid + "valCase"
          ); //实时值
          var nodes = _this.myDiagram.model.findNodeDataForKey(
            item.pumpspaceid
          ); //节点
          if (nodes.key == item.pumpspaceid) {
            _this.myDiagram.model.setDataProperty(nodes, "text", item.pumpname); //泵站名称
          }
          var liquidlevel =
            item.liquidlevel == ""
              ? "--"
              : parseFloat(item.liquidlevel).toFixed(2);
          _this.myDiagram.model.setDataProperty(
            nodesvalCase,
            "showVal",
            liquidlevel + " m"
          );

          _this.myDiagram.model.setDataProperty(
            nodesvalCase,
            "stroke",
            _this.valuecolors[
              liquidlevel != "--" && item.status == "离线"
                ? "在线"
                : item.status
            ].stroke
          ); //边框
          _this.myDiagram.model.setDataProperty(
            nodesvalCase,
            "fontStroke",
            _this.valuecolors[
              liquidlevel != "--" && item.status == "离线"
                ? "在线"
                : item.status
            ].fontStroke
          ); //底色
          _this.myDiagram.model.setDataProperty(
            nodesvalCase,
            "fillColor",
            _this.valuecolors[
              liquidlevel != "--" && item.status == "离线"
                ? "在线"
                : item.status
            ].fillColor
          ); //底色文字

          _this.myDiagram.model.setDataProperty(
            nodes,
            "color",
            _this.valuecolors[item.status].color
          ); //头部标题文字
          _this.myDiagram.model.setDataProperty(
            nodes,
            "Outsidecolor",
            item.status == "在线"
              ? _this.jdcolors[item.city].Outsidecolor
              : _this.valuecolors[item.status].Outsidecolor
          ); //外圈
          // _this.myDiagram.model.setDataProperty(nodes, "withincolor",item.status == '在线' ? _this.jdcolors[item.city].withincolor : _this.valuecolors[item.status].withincolor);//内圈
          _this.myDiagram.model.setDataProperty(
            nodes,
            "withincolor",
            _this.valuecolors[item.status].withincolor
          ); //内圈
        }
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("西湾泵站实时值"),
          "stroke",
          _this.valuecolors["离线"].stroke
        ); //边框
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("西湾泵站实时值"),
          "fontStroke",
          _this.valuecolors["离线"].fontStroke
        ); //底色
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("西湾泵站实时值"),
          "fillColor",
          _this.valuecolors["离线"].fillColor
        ); //底色文字
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("西湾泵站"),
          "color",
          _this.valuecolors["离线"].color
        ); //头部标题文字
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("西湾泵站"),
          "Outsidecolor",
          _this.valuecolors["离线"].Outsidecolor
        ); //外圈
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("西湾泵站"),
          "withincolor",
          _this.valuecolors["离线"].withincolor
        ); //内圈

        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("平山路泵站实时值"),
          "stroke",
          _this.valuecolors["离线"].stroke
        ); //边框
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("平山路泵站实时值"),
          "fontStroke",
          _this.valuecolors["离线"].fontStroke
        ); //底色
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("平山路泵站实时值"),
          "fillColor",
          _this.valuecolors["离线"].fillColor
        ); //底色文字
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("平山路泵站"),
          "color",
          _this.valuecolors["离线"].color
        ); //头部标题文字
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("平山路泵站"),
          "Outsidecolor",
          _this.valuecolors["离线"].Outsidecolor
        ); //外圈
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("平山路泵站"),
          "withincolor",
          _this.valuecolors["离线"].withincolor
        ); //内圈

        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("朝阳街道泵站实时值"),
          "stroke",
          _this.valuecolors["离线"].stroke
        ); //边框
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("朝阳街道泵站实时值"),
          "fontStroke",
          _this.valuecolors["离线"].fontStroke
        ); //底色
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("朝阳街道泵站实时值"),
          "fillColor",
          _this.valuecolors["离线"].fillColor
        ); //底色文字
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("朝阳街道泵站"),
          "color",
          _this.valuecolors["离线"].color
        ); //头部标题文字
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("朝阳街道泵站"),
          "Outsidecolor",
          _this.valuecolors["离线"].Outsidecolor
        ); //外圈
        _this.myDiagram.model.setDataProperty(
          _this.myDiagram.model.findNodeDataForKey("朝阳街道泵站"),
          "withincolor",
          _this.valuecolors["离线"].withincolor
        ); //内圈
      }, 1500);
    },
    getdata() {
      let pumpdata = [
        {
          pumpspaceid: "bz001",
          pumpname: "33#污水泵站",
          city: "临港",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz002",
          pumpname: "朝阳工业园污水泵站",
          city: "临港",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz003",
          pumpname: "朝阳街道污水泵站",
          city: "墟沟",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz004",
          pumpname: "大港路污水泵站",
          city: "临港",
          liquidlevel: 5.502546,
          status: "在线"
        },
        {
          pumpspaceid: "bz005",
          pumpname: "大浦5#污水泵站",
          city: "大浦工业区",
          liquidlevel: 7.071759,
          status: "在线"
        },
        {
          pumpspaceid: "bz006",
          pumpname: "大浦6#污水泵站",
          city: "大浦工业区",
          liquidlevel: 2.076967,
          status: "在线"
        },
        {
          pumpspaceid: "bz007",
          pumpname: "港城大道地埋泵站",
          city: "墟沟",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz009",
          pumpname: "猴嘴1#污水泵站",
          city: "大浦工业区",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz010",
          pumpname: "猴嘴2#污水泵站",
          city: "大浦工业区",
          liquidlevel: "",
          status: "离线"
        },
        {
          id: 64,
          pumpspaceid: "bz011",
          pumpname: "猴嘴下穿雨水泵站",
          city: "东盐河",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz012",
          pumpname: "黄海大道1#污水泵站",
          city: "临港",
          liquidlevel: 3.808449,
          status: "在线"
        },
        {
          pumpspaceid: "bz013",
          pumpname: "黄海大道2#污水泵站",
          city: "临港",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz016",
          pumpname: "江宁工业区1号污水泵站",
          city: "墟沟",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz019",
          pumpname: "沙集自行车通道泵站",
          city: "排淡河",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz014",
          pumpname: "文明村泵站",
          city: "排淡河",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz008",
          pumpname: "西湾片区地埋泵站",
          city: "墟沟",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz015",
          pumpname: "新光路下穿铁路雨水泵站",
          city: "运盐河",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz017",
          pumpname: "中云2#污水泵站",
          city: "墟沟",
          liquidlevel: "",
          status: "离线"
        },
        {
          pumpspaceid: "bz018",
          pumpname: "中云3#污水泵站",
          city: "墟沟",
          liquidlevel: "",
          status: "离线"
        }
      ];
      this.changejdvalue(pumpdata);
    }
  },
  mounted() {
    var _this = this;
    this.gojsJson();

    let timer = setInterval(() => {
      _this.getdata();
    }, 10000);

    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  beforeDestroy() {}
};
</script>

<style lang="less" scoped></style>
