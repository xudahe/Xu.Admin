<!-- 组态图组件 -->
<style lang="less">
.configuration {
  width: 100%;
  height: 100%;
}
</style>
<!--组态图-->
<template>
  <div class="configuration Tabs_bg iview_bg table_bg page_big table_big menu_bg" style="width: 100%;height: 100%">

    <v-dialog ref="dialog" v-model="dialog.show" :title="dialog.title" :buttons="dialog.buttons" :bodyshow="dialog.bodyshow">
      <div style="width: 5rem;height: 5rem;color: #ffffff;padding: 0px 1rem;">
        <Form :model="dialog.formItem" :label-width="80">
          <FormItem label="线分组">
            <RadioGroup v-model="dialog.formItem.category">
              <Radio label="onelink">动态虚线</Radio>
              <Radio label="twolink">默认</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="从">
            <RadioGroup v-model="dialog.formItem.from">
              <Radio label="top">上</Radio>
              <Radio label="bottom">下</Radio>
              <Radio label="left">左</Radio>
              <Radio label="right">右</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="到">
            <RadioGroup v-model="dialog.formItem.to">
              <Radio label="top">上</Radio>
              <Radio label="bottom">下</Radio>
              <Radio label="left">左</Radio>
              <Radio label="right">右</Radio>
            </RadioGroup>
          </FormItem>
          <div v-if="dialog.formItem.category == 'onelink'">
            <FormItem label="线条颜色">
              <ColorPicker v-model="dialog.formItem.linkcolor" recommend />
            </FormItem>
            <FormItem label="虚线颜色">
              <ColorPicker v-model="dialog.formItem.watercolor" recommend />
            </FormItem>
          </div>
          <FormItem>
            <Button type="primary" @click="dialog.show = false">确定</Button>
            <Button style="margin-left: 8px" @click="dialog.show = false">取消</Button>
          </FormItem>

        </Form>
      </div>
    </v-dialog>

    <Button v-show="allowMove" @click="btnclick">输出画布json</Button>
    <Button v-show="allowMove" @click="getjson('btn')">重新加载</Button>
    <Button v-show="allowMove" @click="opendialog">线设置</Button>
    <div id="qywscgojs" style=" width: 100%; height:calc(100%); padding: 0.1rem;background-color: #a7d0e28a;"></div>
  </div>
</template>
<script>

const $ = go.GraphObject.make;
import axios from 'axios';

export default {
  components: {

  },
  data() {
    return {
      //线配置
      dialog: {
        show: false,
        title: {
          text: "视频播放",
          className: "xa-bg-blue" //标题样式类名，包含`background`、`color`即可
        },
        bodyshow: true,
        formItem: {
          category: "onelink",
          from: "left",
          to: "left",
          watercolor: "#00bdc4",
          linkcolor: "#2df8ff",
        }
      },

      screensize: window.screen.width + "*" + window.screen.height, // 屏幕分辨率
      myDiagram: null,
      allowMove: false, //允许gojs面板拖动节点 调试模式

      lwithincolor: "",
      Interval: null,
    };
  },
  methods: {
    opendialog() {
      this.dialog.show = true;
      this.$refs.dialog.retresize();
    },
    getjson(type) {
      let _self = this;
      axios.get("static/wsc/秦源配件/秦源污水厂.json").then(function (res) {
        if (type == 'btn') {
          //加载数据一定放在最后面
          _self.myDiagram.model = go.Model.fromJson(res.data); //加载json
        } else {
          _self.initgojs(res.data);
        }
      })
        .catch(err => {
          console.log(err);
        });
    },
    mouseLeave(e, obj) {
      //鼠标移出
      let node = obj.data;
      let nodes = this.myDiagram.model.findNodeDataForKey(node.key);
      switch (node.category) {
        case "circleS":
        case "circleyiji":
          this.myDiagram.model.setDataProperty(nodes, "withincolor", this.lwithincolor);
          this.lwithincolor = '';
          break;
        case "circleTbig":
          break;
      }
    },
    mouseEnter(e, obj) {
      //鼠标移入
      let node = obj.data;
      let nodes = this.myDiagram.model.findNodeDataForKey(node.key);
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
      // let node = obj.part; //拿到节点的json对象，后面要拿什么值就直接.出来
      //调试模式
      if (this.allowMove) {
        let node = this.myDiagram.selection.first();
        let data = node.data;
        console.log(data)
        let procTaskId = node.data.key;
        let procTaskloc = node.data.loc;
        let procTaskName = node.data.text;
        let category = node.data.category;
        let nodes = this.myDiagram.model.findNodeDataForKey(procTaskId); //节点
        console.log(procTaskName + " key:" + procTaskId + " 坐标" + procTaskloc);
        this.myDiagram.model.setDataProperty(nodes, "text", prompt('请输入要修改的值')); //修改节点
        return
      };


    },
    handlerDC(e, obj) {
      //双击事件
    },
    updatePortHeight(node, link, port) {
      node.findLinksConnected().each(function (l) {
        if (l.toNode === node) {
          console.log(l.toNode.data)
          if (l.toSpot === go.Spot.LeftSide) {
            console.log('从左')
          }
          if (l.toSpot === go.Spot.RightSide) {
            console.log('从右')
          }
          if (l.toSpot === go.Spot.TopSide) {
            console.log('从上')
          }
          if (l.toSpot === go.Spot.BottomSide) {
            console.log('从下')
          }
        }
        if (l.fromNode === node) {
          console.log(l.fromNode.data)
          if (l.fromSpot === go.Spot.LeftSide) {
            console.log('到左')
          }
          if (l.fromSpot === go.Spot.RightSide) {
            console.log('到右')
          }
          if (l.fromSpot === go.Spot.TopSide) {
            console.log('到上')
          }
          if (l.fromSpot === go.Spot.BottomSide) {
            console.log('到下')
          }
        }
      })
      port.category = "onelink";
    },
    btnclick() {
      let model = this.myDiagram.model.toJson(); //获得整个画布的json
      let nodes = model.nodeDataArray; //取出所有节点
      let Links = model.linkDataArray; //取出所有线
      console.log(model);
    },
    btngetkey() {
      let person = prompt("请输入key：", "-10");
      if (person != null && person != "") {
        let nodekey = this.myDiagram.model.findNodeDataForKey(person); //通过节点key获取节点
        let nodekeyselect = this.myDiagram.findNodeForData(nodekey); //查找结点
        this.myDiagram.select(nodekeyselect); //反选此节点
      }
    },
    initgojs(data) {
      let _this = this;
      let scale = 0.5;
      if (this.screensize == "1920*1080") scale = 0.7;
      if (this.screensize == "1600*900") scale = 0.65;
      if (this.screensize == "1440*900") scale = 0.53;
      if (this.screensize == "1366*768") scale = 0.55;
      /**
       * 图表配置
       * */
      let myDiagramoptijson = {
        // "linkingTool.portGravity": 0,  // 控制是否显示连线
        "linkingTool.doActivate": function () {
          if (!_this.allowMove) return
          this.temporaryLink.curve = go.Link.Bezier; //go.Link.Bezier ,go.Link.Normal
          this.temporaryLink.path.stroke = "blue";
          this.temporaryLink.path.strokeWidth = 5;
          go.LinkingTool.prototype.doActivate.call(this);
        },
        "linkingTool.insertLink": function (fromnode, fromport, tonode, toport) {
          if (!_this.allowMove) return
          return go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
        },

        "grid.visible": true, //画布上面是否出现网格
        // scale: scale, //初始视图大小比例
        // minScale:0.6,//最小视图的缩小比例
        // "ChangedSelection": onSelectionChanged,
        "draggingTool.gridSnapCellSize": new go.Size(10, 1),
        "draggingTool.isGridSnapEnabled": true,
        padding: 30,
        autoScale: go.Diagram.Uniform, //自适应
        allowHorizontalScroll: true, //禁止水平拖动画布  禁止水平滚动条
        allowVerticalScroll: true, //禁止垂直拖动画布 禁止垂直滚动条
        // maxScale:1.2,//最大视图的放大比例
        maxSelectionCount: 1, // 用户一次只能选择一个零件
        "toolManager.hoverDelay": 10, // 显示工具提示的速度
        // initialAutoScale: go.Diagram.Uniform, // 缩放以显示所有内容
        allowMove: _this.allowMove, //允许拖动
        "undoManager.isEnabled": _this.allowMove, //撤销
      }
      if (!_this.allowMove) {
        myDiagramoptijson['nodeSelectionAdornmentTemplate'] = $(go.Adornment, "Auto", $(go.Shape, "Rectangle", { fill: "white", stroke: null }))
      }
      this.myDiagram = $(
        go.Diagram,
        "qywscgojs", // 为div元素创建一个图表
        myDiagramoptijson
      );
      //监听连线方法
      this.myDiagram.addDiagramListener("LinkDrawn", function (e) {
        if (!_this.allowMove) return


        //设置连线属性
        let link = e.subject;

        link.data
        link.category = _this.dialog.formItem.category;
        link.fromSpot = spotConverter(_this.dialog.formItem.from);
        link.toSpot = spotConverter(_this.dialog.formItem.to);
        link.watercolor = _this.dialog.formItem.watercolor;
        link.linkcolor = _this.dialog.formItem.linkcolor;

      });
      //
      this.myDiagram.grid = $(
        go.Panel,
        go.Panel.Grid, {
        gridCellSize: new go.Size(120, 120)
      },
        $(go.Shape, "LineH", {
          stroke: "rgb(4, 58, 218)"
        }),
        $(go.Shape, "LineV", {
          stroke: "rgb(4, 58, 218)"
        })
      );

      let colors = {
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


      this.myDiagram.nodeTemplateMap.add(
        "valCase2",
        $(
          go.Node,
          "Auto",
          // { selectable: false },
          // {doubleClick : function (e,node) {_this.handlerDC(e,node)}},//双击事件
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          $(
            go.Shape,
            "Rectangle", {
            fill: "#000b76",
            stroke: null
          },
            // Shape.fill is bound to Node.data.color
            new go.Binding("fill", "color")
          ),
          $(
            go.Panel,
            "Table", {
            padding: 10
          },
            // $(go.RowColumnDefinition, { column: 0, separatorStroke: "black" }),
            // $(go.RowColumnDefinition, { column: 1, separatorStroke: "black", background: "#ba0006" }),
            // $(go.RowColumnDefinition, { row: 0, separatorStroke: "black" }),
            // $(go.RowColumnDefinition, { row: 1, separatorStroke: "black" }),
            $(
              go.TextBlock,
              "格栅前:", {
              row: 0,
              wrap: go.TextBlock.None,
              isMultiline: false,
              textAlign: "left",
              width: 80,
              font: "12pt  Segoe UI,sans-serif",
              stroke: "#0780db"
            }
              // new go.Binding("text", "player1").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "格栅后:", {
              row: 1,
              wrap: go.TextBlock.None,
              isMultiline: false,
              textAlign: "left",
              width: 80,
              font: "12pt  Segoe UI,sans-serif",
              stroke: "#0780db"
            }
              // new go.Binding("text", "player2").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "2222", {
              column: 1,
              row: 0,
              wrap: go.TextBlock.None,
              isMultiline: false,
              editable: true,
              textAlign: "center",
              width: 60,
              font: "12pt  Segoe UI,sans-serif",
              stroke: "#ffffff"
            },
              new go.Binding("text", "score1").makeTwoWay()
            ),
            $(
              go.TextBlock,
              "444", {
              column: 1,
              row: 1,
              wrap: go.TextBlock.None,
              isMultiline: false,
              editable: true,
              textAlign: "center",
              width: 60,
              font: "12pt  Segoe UI,sans-serif",
              stroke: "#ffffff"
            },
              new go.Binding("text", "score2").makeTwoWay()
            ),
            $(go.TextBlock, "米", {
              column: 2,
              row: 0,
              wrap: go.TextBlock.None,
              isMultiline: false,
              editable: true,
              textAlign: "right",
              font: "12pt  Segoe UI,sans-serif",
              stroke: "#0780db"
            }),
            $(go.TextBlock, "米", {
              column: 2,
              row: 1,
              wrap: go.TextBlock.None,
              isMultiline: false,
              editable: true,
              textAlign: "right",
              font: "12pt  Segoe UI,sans-serif",
              stroke: "#0780db"
            })
          )
        )
      );

      this.myDiagram.nodeTemplateMap.add(
        "valCase",
        $(
          go.Node,
          "Spot", {
          doubleClick: function (e, node) {
            let procTaskId = node.data.key;
            let procTaskName = node.data.text;
            let procTaskloc = node.data.loc;
            let category = node.data.category;
            let boxno = node.data.boxno;
            console.log(
              procTaskName + " key:" + procTaskId + " 坐标" + procTaskloc
            );
          }
        }, //双击事件
          {
            locationSpot: go.Spot.Center,
            zOrder: 2
          },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          new go.Binding("angle").makeTwoWay(),
          $(
            go.Shape,
            "Rectangle", {
            name: "SHAPE",
            strokeWidth: 10,
            stroke: "#000000"
          },
            new go.Binding("fill", "fillColor"),
            new go.Binding("stroke"),
            new go.Binding("strokeWidth"),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            )
          ),
          $(
            go.TextBlock, {
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
          ), {
          click: function (e, t) {
            t.data;
          }
        }
        )
      );


      this.myDiagram.nodeTemplateMap.add(
        "circleTbig",
        $(go.Node, "Spot",
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          {
            doubleClick: function (e, node) { _this.handlerDC(e, node); },//双击事件
            click: function (e, node) { _this.gojsclick(e, node); },//单击事件
            mouseEnter: _this.mouseEnter,
            mouseLeave: _this.mouseLeave,
            // linkConnected: _this.updatePortHeight,//连线开始回调
            // linkDisconnected: _this.updatePortHeight,//连线结束回调
          },
          $(
            go.Shape,
            "Circle", {
            fill: "rgba(255,255,255,0)" /* green */,
            stroke: null,
            portId: "",
            width: 90,
            cursor: "pointer"
          },
            new go.Binding("width", "Circle")
          ),
          $(
            go.Picture, {
            name: "Picture",
            // margin: 1.5,
            portId: "", //规定锚点的名称
            fromLinkable: true,//是否可以输出
            toLinkable: true, //是否可以输入
            // alignment: go.Spot.Top, //规定锚点的位置
            // fromSpot: go.Spot.TopSide, //输出点
            // toSpot: go.Spot.TopSide, //输入点
            cursor: "pointer",
            mouseEnter: function (e, port) {
              if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
            },
            mouseLeave: function (e, port) {
              port.fill = "yellow";
            }

          },
            new go.Binding("source", "imgsrc"),
            new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(
              go.Size.stringify
            )
          ),
          $(
            go.TextBlock, {
            stroke: colors.green,
            font: "Bold 24px Lato, sans-serif",
            // textAlign: "right",
            margin: 5,
            editable: true,
            // maxSize: new go.Size(100, NaN),
            // alignment: go.Spot.TopCenter,
            // alignmentFocus: go.Spot.BottomCenter,
          },
            new go.Binding("font", "font"),
            new go.Binding("alignment", "fromSpot", function (d) {
              return tetxXY(d, "alignment");
            }),
            new go.Binding("alignmentFocus", "fromSpot", function (d) {
              return tetxXY(d, "alignmentFocus");
            }),
            new go.Binding("text", "text"),
            new go.Binding("stroke", "color")
          ),
        )
      );

      //动态水流
      this.myDiagram.linkTemplateMap.add(
        "onelink",
        $(
          go.Link, {
          toShortLength: -2,
          fromShortLength: -2,
          layerName: "Background",
          routing: go.Link.Orthogonal,
          // reshapable: true, //可重塑的
          // resegmentable: true,//可重分段
          corner: 15,
          fromSpot: go.Spot.RightSide,
          toSpot: go.Spot.LeftSide
        },
          // make sure links come in from the proper direction and go out appropriately
          new go.Binding("fromSpot", "fromSpot", function (d) {
            return spotConverter(d);
          }),
          new go.Binding("toSpot", "toSpot", function (d) {
            return spotConverter(d);
          }),
          new go.Binding("points").makeTwoWay(),
          // mark each Shape to get the link geometry with isPanelMain: true
          $(
            go.Shape, {
            isPanelMain: true,
            stroke: colors.orange,
            strokeWidth: 8
          },
            new go.Binding("stroke", "linkcolor")
          ),
          // 流向a
          $(
            go.Shape, {
            isPanelMain: true,
            stroke: colors.green,
            strokeWidth: 4,
            toArrow: 'Standard',
            name: "dashedLink",
            strokeDashArray: [18, 18],
          },
            new go.Binding("stroke", "watercolor")
          ),
        ))

      this.myDiagram.linkTemplateMap.add(
        "twolink",
        $(go.Link,
          { toShortLength: 6, toEndSegmentLength: 20 },
          $(go.Shape,
            { strokeWidth: 4 },
            new go.Binding("stroke", "stroke")),
          $(go.Shape,  // arrowhead
            { toArrow: "Triangle", stroke: null, scale: 1.5 },
            new go.Binding("fill", "stroke"))
        )
      )

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

      //加载数据一定放在最后面
      this.myDiagram.model = go.Model.fromJson(data); //加载json
      // _this.loop();
      function animation() {
        let diagram = _this.myDiagram;
        const loop = () => {
          let animationTimer = setTimeout(() => {
            const oldskips = diagram.skipsUndoManager;
            diagram.skipsUndoManager = true;
            // 虚线动画
            diagram.links.each((link) => {
              const dashedLinkShape = link.findObject("dashedLink");
              if (dashedLinkShape) {
                const off = dashedLinkShape.strokeDashOffset - 3;
                // 设置（移动）笔划划动画
                dashedLinkShape.strokeDashOffset = (off <= 0) ? 140 : off;
              }
            });
            diagram.skipsUndoManager = oldskips;
            loop();
          }, 60);
        }
        loop()
      }
      animation()


    },

    nodeStyle() {
      return [
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        {
          locationSpot: go.Spot.Center
        }
      ];
    },

  },
  mounted() {
    let _this = this;
    _this.getjson();
  },
  beforeDestroy() {
    if (this.Interval) {
      clearInterval(this.Interval);
      this.Interval = null;
    }
  }
};
</script>


