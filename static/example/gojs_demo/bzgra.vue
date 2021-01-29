<template>
  <div class="homepageDivGra" style="width: 100%;height: 100%;">
    <!--		<div style="height: 100%;position: relative;">-->
    <!--			<div class="topchangehomeGra">-->
    <!--				<ButtonGroup size="large">-->
    <!--					<Button @click="changeType(0)">大屏模式</Button>-->
    <!--					<Button @click="changeType(1)">卡片模式</Button>-->
    <!--					<Button @click="changeType(3)">拓扑图</Button>-->
    <!--				</ButtonGroup>-->
    <!--			</div>-->
    <!--			<div style="height: 2.5rem;font-size: 0.8rem;color: #2eb9c1;font-weight: bold;text-align: center;line-height: 2.5rem;">-->
    <!--				泵站水流向示意图-->
    <!--			</div>-->
    <!--			<div style="width: 100%;height: calc(100% - 2.5rem);">-->
    <!--				<div style="text-align: center;font-size: 0;">-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">猴嘴2号泵站</div>-->
    <!--					</div>-->
    <!--					<img :src="bzflow" class="bzflow" />-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">猴嘴1号泵站</div>-->
    <!--					</div>-->
    <!--					<img :src="bzflow" class="bzflow" />-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">大浦6号泵站</div>-->
    <!--					</div>-->
    <!--					<img :src="bzflow" class="bzflow" />-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">大浦6号泵站</div>-->
    <!--					</div>-->
    <!--					<img :src="bzflow" class="bzflow" />-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">大浦工业区污水处理厂</div>-->
    <!--					</div>-->
    <!--				</div>-->
    <!--				<div style="text-align: center;font-size: 0;">-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">中云1号泵站</div>-->
    <!--					</div>-->
    <!--					<img :src="bzflow" class="bzflow" />-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">中云3号泵站</div>-->
    <!--					</div>-->
    <!--					<img :src="bzflow" class="bzflow" />-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">中云2号泵站</div>-->
    <!--					</div>-->
    <!--					<img :src="bzflow" class="bzflow" />-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">平山路泵站</div>-->
    <!--					</div>-->
    <!--					<img :src="bzflow" class="bzflow" />-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">墟沟污水处理厂</div>-->
    <!--					</div>-->
    <!--				</div>-->

    <!--				<div style="text-align: left;font-size: 0;">-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">西湾泵站</div>-->
    <!--					</div>-->
    <!--					<img :src="bzflow" class="bzflow" />-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">朝阳街道泵站</div>-->
    <!--					</div>-->
    <!--					<img :src="bzflow" class="bzflow" />-->
    <!--					<div class="bzbg">-->
    <!--						<img :src="bzbg" class="bzimg" />-->
    <!--						<div class="bztext">港城大道地理泵站</div>-->
    <!--					</div>-->
    <!--				</div>-->

    <!--			</div>-->
    <!--		</div>-->

    <!--    gojs布局-->
    <div style="position: absolute; z-index: 999;">
<!--      <Button @click="btnclick">输出画布json</Button>-->
<!--      <Button @click="btngetkey">选中key</Button>-->
      <!-- <ButtonGroup size="large">
        <Button @click="changeType(0)">大屏模式</Button>
        <Button @click="changeType(1)">卡片模式</Button>
        <Button @click="changeType(3)">拓扑图</Button>
        <Button @click="changeType(4)">视频</Button>
      </ButtonGroup> -->
    </div>
    <div id="mygojs" style="height: 100%;width: 100%;background-image: linear-gradient(rgb(2, 63, 75), rgb(2, 22, 29));"></div>

  </div>
</template>

<script>
  import bus from "../../eventBus.js";
  import ApiSetting from "../../ApiSetting.js";
  import echarts from 'echarts'

  import go from "gojs";

  const $ = go.GraphObject.make;
  import axios from "axios";

  export default {
    components: {},
    // props:{
    //   itemlist:{
    //     type:Object,
    //     default () {
    //       return {};
    //     }
    //   }
    // },
    data() {
      return {
        myDiagram: null,
        // bzbg: "../../../static/template/004/img/newhome/homelyg/泵站位置.png",
        // bzflow: "../../../static/template/004/img/newhome/homelyg/间隔箭头1.png"
      };
    },
    methods: {
      getjson(){
        let _self = this;
        axios
          .get("static/二供设备/泵站拓扑图.json")
          .then(function(res) {
            _self.keys = []
            res.data.nodeDataArray.forEach(function(item){
              if(item.category == "valCase") _self.keys.push(item.key)
            });

            _self.initgojs(res.data);
          })
          .catch(err => {
            console.log(err);
          });
      },
      handlerDC(e, obj) {
        //双击事件
        var node = obj.part;//拿到节点的json对象，后面要拿什么值就直接.出来
        var procTaskId = node.data.key;
        var procTaskName = node.data.text;
        var procTaskloc = node.data.loc;
        var category = node.data.category;
        console.log(procTaskName+' key:'+procTaskId+' 坐标'+procTaskloc);
        // bus.$emit('changetype', 2)
        if(category !="valCase"){
          var item = {};
          item.pumpname=procTaskName;
          bus.$emit('changetype', 6,item,1)
        }

      },
      changeType(type) {
        bus.$emit('changetype', type)
      },
      btnclick() {
        var model = this.myDiagram.model.toJson();//获得整个画布的json
        var nodes = model.nodeDataArray;//取出所有节点
        var Links = model.linkDataArray;//取出所有线
        console.log(model)
      },
      btngetkey() {
        var person = prompt("请输入key：", "-10");
        if (person != null && person != "") {
          var nodekey = this.myDiagram.model.findNodeDataForKey(person);//通过节点key获取节点
          var nodekeyselect = this.myDiagram.findNodeForData(nodekey);//查找结点
          this.myDiagram.select(nodekeyselect);//反选此节点
        }
      },
      initgojs(data) {
        var _this=this;
        this.myDiagram = $(go.Diagram, "mygojs", // create a Diagram for the DIV HTML element
          {
            maxSelectionCount: 1, // users can select only one part at a time
            "toolManager.hoverDelay": 10, // how quickly tooltips are shown
            initialAutoScale: go.Diagram.Uniform, // scale to show all of the contents
            allowMove: true, //允许拖动
            // "ChangedSelection": onSelectionChanged, // view additional information
          });

        this.myDiagram.grid = $(
          go.Panel,
          go.Panel.Grid,
          {gridCellSize: new go.Size(70, 70)},
          $(go.Shape, "LineH", {stroke: "rgba(7, 87, 102, 0.6)"}),
          $(go.Shape, "LineV", {stroke: "rgba(7, 87, 102, 0.6)"})
        );

        var colors = {

          'red': '#be4b15',
          'green': '#52ce60',
          'blue': '#022e7e',
          'lightred': '#fd8852',
          'lightblue': '#afd4fe',
          'lightgreen': '#b9e986',
          'pink': '#faadc1',
          'purple': '#d689ff',
          'orange': '#fdb400',
        }
        // this.myDiagram.nodeTemplateMap.add(
        //   "ddd",
        //   $(go.Shape,"")
        // )

        this.myDiagram.nodeTemplateMap.add(
          "valCase",
          $(
            go.Node,
            "Spot",
            {doubleClick : function (e,node) {_this.handlerDC(e,node)}},//双击事件
            { locationSpot: go.Spot.Center, zOrder: 2 },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
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
        this.myDiagram.nodeTemplateMap.add("circleTbig",
          $(go.Node, "Spot",
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {doubleClick : function (e,node) {_this.handlerDC(e,node)}},//双击事件
            $(go.Shape, "Circle",
              {
                fill: colors.green, /* green */
                stroke: null,
                portId: "",
                width: 40,
                height: 40,
                cursor: "pointer"
              },new go.Binding("fill", "Outsidecolor")),
            $(go.Shape, "Circle",
              {
                fill: colors.blue, /* green */
                stroke: null,
                width: 23,
                height: 23,
                portId: "",
                cursor: "pointer"
              },new go.Binding("fill", "withincolor")),
            $(go.TextBlock,
              {
                stroke: colors.green,
                font: "Bold 24px Lato, sans-serif",
                // textAlign: "right",
                margin: 5,
                // maxSize: new go.Size(100, NaN),
                alignment: go.Spot.Bottom,
                alignmentFocus: go.Spot.Top,
              },
              new go.Binding("text", "text"),
              new go.Binding("stroke", "color"),
            )
          )
        );


        //文字在右边的模板
        this.myDiagram.nodeTemplateMap.add("circleTright",
          $(go.Node, "Spot",
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {doubleClick : function (e,node) {_this.handlerDC(e,node)}},//双击事件
            $(go.Shape, "Circle",
              {
                fill: colors.green, /* green */
                stroke: null,
                portId: "",
                width: 40,
                height: 40,
                cursor: "pointer"
              },new go.Binding("fill", "Outsidecolor")),
            $(go.Shape, "Circle",
              {
                fill: colors.blue, /* green */
                stroke: null,
                width: 23,
                height: 23,
                portId: "",
                cursor: "pointer"
              },new go.Binding("fill", "withincolor")),
            $(go.TextBlock,
              {
                stroke: colors.green,
                font: "Bold 16px Lato, sans-serif",
                textAlign: "center",
                margin: 5,
                // maxSize: new go.Size(100, NaN),
                alignment: go.Spot.RightCenter,
                alignmentFocus: go.Spot.LeftCenter,
              },
              new go.Binding("text", "text"),
              new go.Binding("stroke", "color"),
            )
          )
        );


        //文字在左边的模板
        this.myDiagram.nodeTemplateMap.add("circleTleft",
          $(go.Node, "Spot",
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {doubleClick : function (e,node) {_this.handlerDC(e,node)}},//双击事件
            $(go.Shape, "Circle",
              {
                fill: colors.green, /* green */
                stroke: null,
                portId: "",
                width: 40,
                height: 40,
                cursor: "pointer"
              },new go.Binding("fill", "Outsidecolor")),
            $(go.Shape, "Circle",
              {
                fill: colors.blue, /* green */
                stroke: null,
                width: 23,
                height: 23,
                portId: "",
                cursor: "pointer"
              },new go.Binding("fill", "withincolor")),
            $(go.TextBlock,
              {
                stroke: colors.green,
                font: "Bold 16px Lato, sans-serif",
                textAlign: "center",
                margin: 5,
                // maxSize: new go.Size(100, NaN),
                alignment: go.Spot.LeftCenter,
                alignmentFocus: go.Spot.RightCenter,
              },
              new go.Binding("stroke", "color"),
              new go.Binding("text", "text"),
            )
          )
        );

        //文字在下方的模板
        this.myDiagram.nodeTemplateMap.add("circleTbottom",
          $(go.Node, "Spot",
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {doubleClick : function (e,node) {_this.handlerDC(e,node)}},//双击事件
            $(go.Shape, "Circle",
              {
                fill: colors.green, /* green */
                stroke: null,
                portId: "",
                width: 40,
                height: 40,
                cursor: "pointer"
              },new go.Binding("fill", "Outsidecolor")),
            $(go.Shape, "Circle",
              {
                fill: colors.blue, /* green */
                stroke: null,
                width: 23,
                height: 23,
                portId: "",
                cursor: "pointer"
              },new go.Binding("fill", "withincolor")),
            $(go.TextBlock,
              {
                stroke: colors.green,
                font: "Bold 16px Lato, sans-serif",
                textAlign: "center",
                margin: 5,
                // maxSize: new go.Size(100, NaN),
                alignment: go.Spot.BottomCenter,
                alignmentFocus: go.Spot.TopCenter,
              },
              new go.Binding("stroke", "color"),
              new go.Binding("text", "text"),
            )
          )
        );


        //文字在上方的模板
        this.myDiagram.nodeTemplateMap.add("circleTtop",
          $(go.Node, "Spot",
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {doubleClick : function (e,node) {_this.handlerDC(e,node)}},//双击事件
            $(go.Shape, "Circle",
              {
                fill: colors.green, /* green */
                stroke: null,
                portId: "",
                width: 40,
                height: 40,
                cursor: "pointer"
              },new go.Binding("fill", "Outsidecolor")),
            $(go.Shape, "Circle",
              {
                fill: colors.blue, /* green */
                stroke: null,
                width: 23,
                height: 23,
                portId: "",
                cursor: "pointer"
              },new go.Binding("fill", "withincolor")),
            $(go.TextBlock,
              {
                stroke: colors.green,
                font: "Bold 16px Lato, sans-serif",
                textAlign: "center",
                margin: 5,
                // maxSize: new go.Size(100, NaN),
                alignment: go.Spot.TopCenter,
                alignmentFocus: go.Spot.BottomCenter,
              },
              new go.Binding("stroke", "color"),
              new go.Binding("text", "text"),
            )
          )
        );

        //随机数
        for (var key in data){
          if(key == "nodeDataArray"){
            var item = data[key];
            for (var i =0;i<item.length;i++){
              if(item[i].category=="valCase"){
                var n =0;
                var m = 100;
                item[i].showVal = (Math.random()*(n-m) + m).toFixed(2)+' m';
              }
            //   var json={
            //     "text": "实时值",
            //     "category": "valCase",
            //     "size": "80 24",
            //     "fontWeight": "normal",
            //     "fontSize": 10,
            //     "fontFamily": "Helvetica, Arial, sans-serif",
            //     "fontStyle": "normal 12pt Helvetica, Arial, sans-serif",
            //     "fontStroke": "#00FF00",
            //     "fillColor": "rgba(46, 51, 67, 1)",
            //     "strokeWidth": 3,
            //     "stroke": "#6d7da2",
            //     "showName": "",
            //     "showVal": "123",
            //     "key": item[i+1].key+'value',
            //     "loc": "212.40918111674858 159.55396175999977"
            //   };
            //   debugger
            //   item.push(json);
            }

          }
        }

        this.myDiagram.model = go.Model.fromJson(data); //加载json



        this.myDiagram.linkTemplate =
          $(go.Link, {
              toShortLength: -2,
              fromShortLength: -2,
              layerName: "Background",
              routing: go.Link.Orthogonal,
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
            $(go.Shape, {
                isPanelMain: true,
                stroke: colors.orange,
                strokeWidth: 17,
              },
              new go.Binding("stroke", "linkcolor")),
            // 流向
            $(go.Shape, {
                isPanelMain: true,
                stroke: colors.green,
                strokeWidth: 4,
                name: "PIPE",
                strokeDashArray: [20,40]
              },
              new go.Binding("stroke", "watercolor")
            )
          );

        function spotConverter(dir) {
          if (dir === "left") return go.Spot.LeftSide;
          if (dir === "right") return go.Spot.RightSide;
          if (dir === "top") return go.Spot.TopSide;
          if (dir === "bottom") return go.Spot.BottomSide;
          if (dir === "rightsingle") return go.Spot.Right;
        }

        this.loop();
      },

      loop() {
        var _this = this;
        var diagram = this.myDiagram;
        var opacity = 1;
        var down = true;
        setTimeout(function() {
          var oldskips = diagram.skipsUndoManager;
          diagram.skipsUndoManager = true;
          diagram.links.each(function(link) {
            var shape = link.findObject("PIPE");
            var off = shape.strokeDashOffset - 3;
            // 设置（移动）笔划划动画
            shape.strokeDashOffset = (off <= 0) ? 60 : off;
            // 动画（频闪）不透明度：
            // if (down) opacity = opacity - 0.01;
            // else opacity = opacity + 0.003;
            // if (opacity <= 0) { down = !down; opacity = 0; }
            // if (opacity > 1) { down = !down; opacity = 1; }
            // shape.opacity = opacity;
          });
          diagram.skipsUndoManager = oldskips;
          _this.loop();

        }, 60);


      },
      nodeStyle() {
      return [
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        { locationSpot: go.Spot.Center }
      ];
  },


    },
    mounted() {
      this.getjson();
    },
    beforeDestroy() {
    },
  };
</script>

<style lang="less">

</style>
<!--<style lang="less" scoped="scoped">-->
<!--	@font-face {-->
<!--		font-family: 'num';-->
<!--		src: url('../../../static/fonts/webfont-number.ttf');-->
<!--		font-weight: bold;-->
<!--		font-style: normal;-->
<!--	}-->

<!--	.homepageDivGra {-->
<!--		.topchangehomeGra {-->
<!--			position: absolute;-->
<!--			margin-top: 0.12rem;-->
<!--			right: 0.5rem;-->
<!--			z-index: 1;-->
<!--		}-->

<!--		.bzbg {-->
<!--			width: 6rem;-->
<!--			height: 6rem;-->
<!--			position: relative;-->
<!--			text-align: center;-->
<!--			display: inline-block;-->
<!--		}-->

<!--		.bzimg {-->
<!--			width: 6rem;-->
<!--			height: 6rem;-->
<!--		}-->

<!--		.bztext {-->
<!--			position: absolute;-->
<!--			font-size: 0.5rem;-->
<!--			width: 2rem;-->
<!--			left: calc(~"(100% - 2rem) / 2");-->
<!--			top: 1.8rem;-->
<!--			color: rgb(129, 255, 251);-->
<!--			font-weight: bold;-->
<!--		}-->

<!--		.bzflow {-->
<!--			width: 5rem;-->
<!--			height: 2rem;-->
<!--			position: relative;-->
<!--			top: -2rem;-->
<!--		}-->
<!--	}-->
<!--</style>-->
