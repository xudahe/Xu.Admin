<style lang="less">
.homepageDivGra {
  .menusa {
    height: calc(100% - 7%);
    width: 100%;
    top: 1rem;
    position: relative;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    cursor: auto;
    background-image: linear-gradient(to right, rgba(0, 4, 76, 0.82), rgba(1, 13, 76, 0.56));
    /*padding: 1%;*/
  }
  .menus {
    position: absolute;
    right: 0px;
    top: 0.1rem;
    z-index: 3;
    // width: 4.7rem;
    .changemenu {
      width: 2rem;
      margin: 0.15rem;
      height: 0.55rem;
      display: inline-block;
      font-size: 16px;
      line-height: 0.55rem;
      text-align: center;
      color: #ffffff;
      cursor: pointer;
    }
    .changemenuC {
      //选中
      background: url("../../../static/template/004/img/newhome/applyg/tp/功能切换1.png")
        no-repeat;
      background-size: 100% 100%;
      color: #ffffff;
      text-shadow: 0px 0px 14px #019aff;
      font-weight: bold;
    }
    .changemenuN {
      background: url("../../../static/template/004/img/newhome/applyg/tp/功能切换2.png")
        no-repeat;
      background-size: 100% 100%;
      color: rgb(124, 156, 255);
      font-weight: bold;
    }
  }
}
</style>
<template>
  <div class="homepageDivGra" style="width: 100%;height: 94%;">
    <div class="menus">
      <div
        v-show="changemenuindex != 2"
        :class="
          changemenuindex == 0
            ? 'changemenu changemenuC'
            : 'changemenu changemenuN'
        "
        @click="changemenuindex = 0"
      >
        线路图
      </div>
      <div
        v-show="changemenuindex != 2"
        :class="
          changemenuindex == 1
            ? 'changemenu changemenuC'
            : 'changemenu changemenuN'
        "
        @click="changemenuindex = 1"
      >
        数据板
      </div>
      <!-- <div
        v-show="changemenuindex == 2"
        :class="
          changemenuindex == 2
            ? 'changemenu changemenuC'
            : 'changemenu changemenuN'
        "
        @click="changemenuindex = changecont"
      >
        返回
      </div> -->
             <Button v-show="allowMove" @click="btnclick">输出画布json</Button>
      <!--      <Button @click="btngetkey">选中key</Button>-->
    </div>
    <!--    gojs布局-->
    <!--    <div style="position: absolute; z-index: 999;">-->
    <!--      <Button @click="btnclick">输出画布json</Button>-->
    <!--      <Button @click="btngetkey">选中key</Button>-->
    <!--      &lt;!&ndash; <ButtonGroup size="large">-->
    <!--        <Button @click="changeType(0)">大屏模式</Button>-->
    <!--        <Button @click="changeType(1)">卡片模式</Button>-->
    <!--        <Button @click="changeType(3)">拓扑图</Button>-->
    <!--        <Button @click="changeType(4)">视频</Button>-->
    <!--      </ButtonGroup> &ndash;&gt;-->
    <!--    </div>-->
    <div v-show="changemenuindex == 0" id="mygojs" class="menusa" :class="changemenuindex == 0 ? 'fade-in-right2' : 'fade-out-right'"> </div>
    <div v-show="changemenuindex == 1" style="height: 100%;width: 100%;" :class="changemenuindex == 1 ? 'fade-in-left2' : 'fade-out-left'" >
      <pumpLists :pupmlistdata = 'pupmlistdata'></pumpLists>
    </div>
    <div v-if="changemenuindex == 2" style="height: 100%;width: 100%;" >
      <pumpInfo :detailitem="detailitem"></pumpInfo>
    </div>
  </div>
</template>

<script>
import bus from "../../eventBus.js";
import ApiSetting from "../../ApiSetting.js";
import echarts from "echarts";
import pumpLists from "../monitor/pumpLists";
import pumpInfo from "../monitor/pump/pumpInfo";
import go from "gojs";

const $ = go.GraphObject.make;
import axios from "axios";

export default {
  components: {
    pumpLists,
    pumpInfo
  },
  // props:{
  //   itemlist:{
  //     type:Object,
  //     default () {
  //       return {};
  //     }
  //   }
  // },
  watch:{
    changemenuindex:{
      handler(newdata,olddata){
        var _this = this;

        if(olddata == 2){
          _this.Interval  = setInterval(()=>{
            _this.getdata()
          },10000)
        }

        if(newdata == 2){
          if(this.Interval) {
            clearInterval(this.Interval);
            this.Interval = null;
          }

        }
      }
    }
    // pupmlistdata:{
    //
    //   deep:true
    // },

  },
  data() {
    return {
      valuecolors:{
        离线:{
          "stroke": '#151e54',//实时值边框
          "fontStroke":'#c6cacf',//实时值底色
          "fillColor":  '#151e54',//实时值底色文字

          "color": '#bfc2c4',//节点头部文字
          "Outsidecolor":  '#555555',//节点外圈
          "withincolor":  '#afafaf'//节点内圈
        },
        报警:{
          "stroke":    '#151e54',//实时值边框
          "fontStroke":'#ff401e',//实时值底色
          "fillColor": '#151e54',//实时值底色文字

          "color": '#add5f9',//节点头部文字
          "Outsidecolor":   '#6a0c0c',//节点外圈
          "withincolor":   '#ff0c0c'//节点内圈
        },
        在线:{
          "stroke": '#151e54',//实时值边框
          "fontStroke":'#39ff78',//实时值底色
          "fillColor":  '#151e54',//实时值底色文字

          "color": '#add5f9',//节点头部文字
          "withincolor":   '#39ff78'//节点内圈
        }

      },
      jdcolors :{
        大浦工业区:{
          Outsidecolor: '#71721f',
          withincolor :'#d6d823'
        },
        运盐河:{
          Outsidecolor: '#088d58',
          withincolor :'#1eec9b'
        },
        墟沟:{
          Outsidecolor: '#91550e',
          withincolor :'#ff9f16'
        },
        排淡河:{
          Outsidecolor:'#0052d9',
          withincolor :'#09d9ff'
        },
        临港:{
          Outsidecolor:'#5d0ebf',
          withincolor :'#c58cff'
        },
        东盐河:{
          Outsidecolor:'#00bdc4',
          withincolor :'#2df8ff'
        }
      },
      sssjsonn:null,
      screensize: window.screen.width + "*" + window.screen.height, // 屏幕分辨率
      detailitem: null,
      myDiagram: null,
      allowMove: false, //允许gojs面板拖动节点
      changemenuindex: 0,
      changecont: 0,
      pupmlistdata:[],
      // bzbg: "../../../static/template/004/img/newhome/homelyg/泵站位置.png",
      // bzflow: "../../../static/template/004/img/newhome/homelyg/间隔箭头1.png"
      lwithincolor:"",
      Interval:null,
    };
  },
  methods: {
    changejdvalue(newVal){
        var _this=this;
        // _this.fortest()
        if(!_this.myDiagram) return;
        newVal.forEach(jjs => {
          let nodesvalCases =_this.myDiagram.model.findNodeDataForKey(jjs.pumpspaceid+'valCase');
          _this.myDiagram.model.setDataProperty(nodesvalCases, "showVal", '-- m');
          _this.myDiagram.model.setDataProperty(nodesvalCases, "stroke",  _this.valuecolors["离线"].stroke);  //边框
          _this.myDiagram.model.setDataProperty(nodesvalCases, "fontStroke",  _this.valuecolors["离线"].fontStroke);//底色
          _this.myDiagram.model.setDataProperty(nodesvalCases, "fillColor",  _this.valuecolors["离线"].fillColor);//底色文字
        });

        setTimeout(()=>{
          for (var i = 0; i < newVal.length; i++){
            var item = newVal[i];
            var nodesvalCase = _this.myDiagram.model.findNodeDataForKey(item.pumpspaceid+'valCase');//实时值
            var nodes =_this.myDiagram.model.findNodeDataForKey(item.pumpspaceid); //节点
            if(nodes.key == item.pumpspaceid){
              _this.myDiagram.model.setDataProperty(nodes, "text",  item.pumpname);//泵站名称
            }
            var liquidlevel =item.liquidlevel =='' ? '--' : parseFloat(item.liquidlevel).toFixed(2);
            _this.myDiagram.model.setDataProperty(nodesvalCase, "showVal",  liquidlevel + ' m');

            _this.myDiagram.model.setDataProperty(nodesvalCase, "stroke",  _this.valuecolors[liquidlevel != '--' && item.status =='离线'?"在线":item.status].stroke);  //边框
            _this.myDiagram.model.setDataProperty(nodesvalCase, "fontStroke",  _this.valuecolors[liquidlevel != '--' && item.status =='离线'?"在线":item.status].fontStroke);//底色
            _this.myDiagram.model.setDataProperty(nodesvalCase, "fillColor",  _this.valuecolors[liquidlevel != '--' && item.status =='离线'?"在线":item.status].fillColor);//底色文字


            _this.myDiagram.model.setDataProperty(nodes, "color", _this.valuecolors[item.status].color); //头部标题文字
            _this.myDiagram.model.setDataProperty(nodes, "Outsidecolor",item.status == '在线' ? _this.jdcolors[item.city].Outsidecolor : _this.valuecolors[item.status].Outsidecolor);//外圈
            // _this.myDiagram.model.setDataProperty(nodes, "withincolor",item.status == '在线' ? _this.jdcolors[item.city].withincolor : _this.valuecolors[item.status].withincolor);//内圈
            _this.myDiagram.model.setDataProperty(nodes, "withincolor",_this.valuecolors[item.status].withincolor);//内圈

          }
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("西湾泵站实时值"), "stroke",    _this.valuecolors['离线'].stroke);  //边框
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("西湾泵站实时值"), "fontStroke",   _this.valuecolors['离线'].fontStroke);//底色
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("西湾泵站实时值"), "fillColor",    _this.valuecolors['离线'].fillColor);//底色文字
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("西湾泵站"), "color", _this.valuecolors["离线"].color); //头部标题文字
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("西湾泵站"), "Outsidecolor", _this.valuecolors["离线"].Outsidecolor);//外圈
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("西湾泵站"), "withincolor",_this.valuecolors["离线"].withincolor);//内圈

          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("平山路泵站实时值"), "stroke",    _this.valuecolors['离线'].stroke);  //边框
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("平山路泵站实时值"), "fontStroke",   _this.valuecolors['离线'].fontStroke);//底色
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("平山路泵站实时值"), "fillColor",    _this.valuecolors['离线'].fillColor);//底色文字
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("平山路泵站"), "color", _this.valuecolors["离线"].color); //头部标题文字
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("平山路泵站"), "Outsidecolor", _this.valuecolors["离线"].Outsidecolor);//外圈
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("平山路泵站"), "withincolor",_this.valuecolors["离线"].withincolor);//内圈

          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("朝阳街道泵站实时值"), "stroke",    _this.valuecolors['离线'].stroke);  //边框
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("朝阳街道泵站实时值"), "fontStroke",   _this.valuecolors['离线'].fontStroke);//底色
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("朝阳街道泵站实时值"), "fillColor",    _this.valuecolors['离线'].fillColor);//底色文字
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("朝阳街道泵站"), "color", _this.valuecolors["离线"].color); //头部标题文字
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("朝阳街道泵站"), "Outsidecolor", _this.valuecolors["离线"].Outsidecolor);//外圈
          _this.myDiagram.model.setDataProperty(_this.myDiagram.model.findNodeDataForKey("朝阳街道泵站"), "withincolor",_this.valuecolors["离线"].withincolor);//内圈


        },1500)
    },
    getjson() {
      let _self = this;
      axios
        .get("static/二供设备/泵站拓扑图.json")
        .then(function(res) {
          // _self.keys = []
          // res.data.nodeDataArray.forEach(function(item){
          //   if(item.category == "valCase") _self.keys.push(item.key)
          // });
          _self.sssjsonn = res.data;
          _self.initgojs(res.data);

        })
        .catch(err => {
          console.log(err);
        });
    },
    mouseLeave(e, obj) {
      //鼠标移出
      var node = obj.data;
      var nodes = this.myDiagram.model.findNodeDataForKey(node.key);
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
      var node = obj.part; //拿到节点的json对象，后面要拿什么值就直接.出来
      var procTaskId = node.data.key;
      var procTaskloc = node.data.loc;
      var procTaskName = node.data.text;
      var category = node.data.category;
      if (
        procTaskName.indexOf("大浦工业区") > -1 ||
        procTaskName.indexOf("河") > -1 ||
        procTaskName.indexOf("墟沟") > -1 ||
        procTaskName.indexOf("临港") > -1
      ) {
        this.$Message.error("暂无详情");
        return;
      }
      console.log(procTaskName + " key:" + procTaskId + " 坐标" + procTaskloc);
      if(procTaskName == '西湾泵站' || procTaskName == '朝阳街道泵站' || procTaskName == '平山路泵站' ){
        this.$Message.error("暂未接入");
        return
      };
        if(this.pupmlistdata.length > 0){
          for(var i = 0;i< this.pupmlistdata.length;i++){
            if(this.pupmlistdata[i].pumpspaceid == procTaskId){
              bus.$emit("pumpinfo", this.pupmlistdata[i]);
              this.changecont = 0;
            }
          // bus.$emit('changetype', 6,item,1)
        }
      }




    },

    handlerDC(e, obj) {
      //双击事件
    },
    changeType(type) {
      bus.$emit("changetype", type);
    },
    btnclick() {
      var model = this.myDiagram.model.toJson(); //获得整个画布的json
      var nodes = model.nodeDataArray; //取出所有节点
      var Links = model.linkDataArray; //取出所有线
      console.log(model);
    },
    btngetkey() {
      var person = prompt("请输入key：", "-10");
      if (person != null && person != "") {
        var nodekey = this.myDiagram.model.findNodeDataForKey(person); //通过节点key获取节点
        var nodekeyselect = this.myDiagram.findNodeForData(nodekey); //查找结点
        this.myDiagram.select(nodekeyselect); //反选此节点
      }
    },
    initgojs(data) {
      var _this = this;
      var scale = 0.5;
      if (this.screensize == "1920*1080") scale = 0.7;
      if (this.screensize == "1600*900") scale = 0.65;
      if (this.screensize == "1440*900") scale = 0.53;
      if (this.screensize == "1366*768") scale = 0.55;
      this.myDiagram = $(
        go.Diagram,
        "mygojs", // 为div元素创建一个图表
        {
          "grid.visible": true, //画布上面是否出现网格
          // scale: scale, //初始视图大小比例
          // minScale:0.6,//最小视图的缩小比例
          autoScale:go.Diagram.Uniform, //自适应
          padding:50,
          allowHorizontalScroll: false,//禁止水平拖动画布  禁止水平滚动条
          allowVerticalScroll: false,//禁止垂直拖动画布 禁止垂直滚动条
          // maxScale:1.2,//最大视图的放大比例
          maxSelectionCount: 1, // 用户一次只能选择一个零件
          "toolManager.hoverDelay": 10, // 显示工具提示的速度
          // initialAutoScale: go.Diagram.Uniform, // 缩放以显示所有内容
          allowMove: _this.allowMove, //允许拖动
          "undoManager.isEnabled": _this.allowMove, //撤销
          nodeSelectionAdornmentTemplate: $(
            go.Adornment,
            "Auto",
            $(go.Shape, "Rectangle", { fill: "white", stroke: null })
          )
        }
      );
      //
      this.myDiagram.grid = $(
        go.Panel,
        go.Panel.Grid,
        { gridCellSize: new go.Size(120, 120) },
        $(go.Shape, "LineH", { stroke: "rgb(4, 58, 218)" }),
        $(go.Shape, "LineV", { stroke: "rgb(4, 58, 218)" })
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
      // this.myDiagram.nodeTemplateMap.add(
      //   "ddd",
      //   $(go.Shape,"")
      // )

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
              width: 50,
              height: 50,
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
              width: 28,
              height: 28,
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
            "Rectangle",
            { fill: "#000b76", stroke: null },
            // Shape.fill is bound to Node.data.color
            new go.Binding("fill", "color")
          ),
          $(
            go.Panel,
            "Table",
            { padding: 10 },
            // $(go.RowColumnDefinition, { column: 0, separatorStroke: "black" }),
            // $(go.RowColumnDefinition, { column: 1, separatorStroke: "black", background: "#ba0006" }),
            // $(go.RowColumnDefinition, { row: 0, separatorStroke: "black" }),
            // $(go.RowColumnDefinition, { row: 1, separatorStroke: "black" }),
            $(
              go.TextBlock,
              "格栅前:",
              {
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
              "格栅后:",
              {
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
              "2222",
              {
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
              "444",
              {
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
      // this.myDiagram.nodeTemplateMap.add("circleTbig",
      //   $(go.Node, "Spot",
      //     new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      //     {doubleClick : function (e,node) {_this.handlerDC(e,node)}},//双击事件
      //     $(go.Shape, "Circle",
      //       {
      //         fill: colors.green, /* green */
      //         stroke: null,
      //         portId: "",
      //         width: 60,
      //         height: 60,
      //         cursor: "pointer"
      //       },new go.Binding("fill", "Outsidecolor")),
      //     $(go.Shape, "Circle",
      //       {
      //         fill: colors.blue, /* green */
      //         stroke: null,
      //         width: 40,
      //         height: 40,
      //         portId: "",
      //         cursor: "pointer"
      //       },new go.Binding("fill", "withincolor")),
      //     $(go.TextBlock,
      //       {
      //         stroke: colors.green,
      //         font: "Bold 24px Lato, sans-serif",
      //         // textAlign: "right",
      //         margin: 5,
      //         // maxSize: new go.Size(100, NaN),
      //         alignment: go.Spot.Bottom,
      //         alignmentFocus: go.Spot.Top,
      //       },
      //       new go.Binding("text", "text"),
      //       new go.Binding("stroke", "color"),
      //     )
      //   )
      // );

      //文字放大 2.0
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

      //文字带图片
      // this.myDiagram.nodeTemplateMap.add("circleS",
      //   $(go.Node, "Spot",
      //     new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      //     {doubleClick : function (e,node) {_this.handlerDC(e,node)}},//双击事件
      //     $(go.Shape, "Circle",
      //       {
      //         fill: 'rgba(255,255,255,0)', /* green */
      //         stroke: null,
      //         portId: "",
      //         width: 52,
      //         height: 52,
      //         cursor: "pointer"
      //       },
      //       // new go.Binding("fill", "Outsidecolor")
      //     ),
      //     // $(go.Shape, "Circle",
      //     //   {
      //     //     fill: colors.blue, /* green */
      //     //     stroke: null,
      //     //     width: 23,
      //     //     height: 23,
      //     //     portId: "",
      //     //     cursor: "pointer"
      //     //   },new go.Binding("fill", "withincolor")),
      //     $(go.Picture,
      //       {
      //         name: "Picture",
      //         // margin: 1.5,
      //       },
      //       new go.Binding("source", "imgsrc"),
      //       new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
      //     ),
      //     $(go.TextBlock,
      //       {
      //         stroke: colors.green,
      //         font: "Bold 16px Lato, sans-serif",
      //         textAlign: "center",
      //         margin: 5,
      //         // maxSize: new go.Size(100, NaN),
      // alignment: go.Spot.TopCenter,
      // alignmentFocus: go.Spot.BottomCenter,
      //   },
      //   new go.Binding("alignment", "fromSpot", function (d) {
      //     return tetxXY(d,'alignment');
      //   }),
      //   new go.Binding("alignmentFocus", "fromSpot", function (d) {
      //     return tetxXY(d,'alignmentFocus');
      //   }),
      //       new go.Binding("text", "text"),
      //       new go.Binding("stroke", "color"),
      //     )
      //   )
      // );






      // setTimeout( ()=> {
      //   if(_this.pupmlistdata){
      //     // 测试
      //     //  pupmlistdata 接口
      //     for (var key in data) {
      //       if (key == "nodeDataArray") {
      //         var citem = data[key];
      //         for (var i = 0; i < citem.length; i++) {
      //           // circleTbig ,circleS,circleyiji,valCase
      //           var item = citem[i];
      //          var category = item.category;
      //           if(category != 'valCase'){
      //             if(category == 'circleTbig') {item.font  = 'Bold 35px Lato, sans-serif';item.color = '#b5ddff'}
      //             // if(category == 'circleS') item.font  = 'Bold 26px Lato, sans-serif'
      //             // if(category == 'circleyiji') item.font  = 'Bold 26px Lato, sans-serif'
      //
      //           }
      //         }
      //       }
      //     }
      //     console.log(data)
      //   }
      // },2000)



      this.myDiagram.model = go.Model.fromJson(data); //加载json
      _this.getdata();

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
      );
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
          var off = shape.strokeDashOffset - 1;
          // 设置（移动）笔划划动画
          shape.strokeDashOffset = off <= 0 ? 120 : off;
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
    fortest(){
      //生成gojs中nodeDataArray
      for (var key in this.sssjsonn) {
        if (key == "nodeDataArray") {
          this.sssjsonn.nodeDataArray = [];
          var item = this.sssjsonn[key];
          item = [];
          for (var i = 0; i < this.pupmlistdata.length; i++) {
            var json = {};
            var datas = this.pupmlistdata[i];
            json['key'] = datas.pumpspaceid;
            json.id = datas.id;

            if(datas.level == 1){
              json["category"] =  "circleS";
              json["Outsidesize"] = 35;
              json["withinsize"] =  20;
            }

            if(datas.level == 2){
              json["category"] =  "circleyiji";
              json["size"] =  "60 60";
              json["Circlesize"] =  60;
            }

            json["color"] =  "#CCC8CA";
            json['boxno'] = datas.boxno;
            json.text = datas.pumpname;
            json.fromSpot ='top';
            json.font ='Bold 20px Lato, sans-serif';
            if(datas.city == '临港'){
              json["withincolor"] = '#022e7e';
              json["Outsidecolor"] =  '#cf947f';
            }if(datas.city == '大浦工业区'){
              json["withincolor"] = '#022e7e';
              json["Outsidecolor"] =  '#6ea5f8';
            }if(datas.city == '墟沟'){
              json["withincolor"] = '#022e7e';
              json["Outsidecolor"] =  '#5bac83';
            }if(datas.city == '运盐河'){
              json["withincolor"] = '#022e7e';
              json["Outsidecolor"] =  '#d0cf90';
            }if(datas.city == '排淡河'){
              json["withincolor"] = '#022e7e';
              json["Outsidecolor"] =  '#a396df';
            }


            var json2 = {};
            json2.text =  datas.pumpname + '实时值';
            json2["category"] =  "valCase";
            json2["size"] =  "80 24";
            json2["fontWeight"] =  "normal";
            json2["fontSize"] =  10;
            json2["fontFamily"] =  "Helvetica, Arial, sans-serif";
            json2["fontStyle"] =  "normal 12pt Helvetica, Arial, sans-serif";
            json2["fontStroke"] =  "#00FF00";
            json2["fillColor"] =  "rgba(46, 51, 67, 1)";
            json2["strokeWidth"] =  3;
            json2["stroke"] =  '#6d7da2';
            json2["showNameshowName"] =  "";
            json2["showVal"] =  datas.liquidlevel;
            json2['key'] = datas.pumpspaceid  + 'valCase';
            this.sssjsonn.nodeDataArray .push(json);
            this.sssjsonn.nodeDataArray .push(json2);

          }
        }
      }
      console.info(this.sssjsonn)
    },
    getdata(rivername) {
      var data = {};
      var _this = this;
      data['rivername'] = rivername == undefined ? '' : rivername;
      this.$http(ApiSetting.getlygpumpts, data).then(
        res => {
          if (res.data.success) {
              _this.changejdvalue( res.data.source);
              _this.pupmlistdata = res.data.source;
          }
        }
      )
    },
  },
  mounted() {
    let _this = this;
    _this.getjson();

    _this.Interval  = setInterval(()=>{
      _this.getdata()
    },10000)
    _this.detailitem = "";
    bus.$on("pumpinfo", function(item) {
      _this.detailitem = item;
      _this.changemenuindex = 2;
    });

    bus.$on("returnPump", function() {
      _this.changemenuindex = _this.changecont;
    });
  },
  beforeDestroy() {
    if(this.Interval) {
      clearInterval(this.Interval);
      this.Interval = null;
    }
  }
};
</script>
