<!-- 图层列表信息 -->
<style scoped>
.icon_color {
  color: #2d8cf0;
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
}

.layercontrol {
  z-index: 999;
  position: absolute;
  left: 10px;
  top: 60px;
  background-color: rgba(255, 255, 255, 1);
  border: solid 1px #ddd;
  width: 250px;
  max-height: 500px;
}

.layerpannel_title {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  background: #f6f8f8;
  border-color: #edf1f2;
  background-image: -webkit-linear-gradient(top, #fff 0, #eee 100%);
  height: 35px;
}

.layerpannel_btn {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
}

.layerpannel_title font {
  font-size: 14px;
  color: #333;
  margin: 0 0 0px 10px;
  cursor: default;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.layerpannel {
  position: absolute;
  top: 35px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  overflow: auto;
}
.layerTree {
  height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: 10px;
}
</style>
<template>
  <div class="layercontrol">
    <div class="layerpannel_title">
      <font>图层控制</font>
      <div class="layerpannel_btn">
        <Button size="small" style="margin:5px;" shape="circle" @click="close()">
          <font-awesome-icon icon="times" size="lg"/>
        </Button>
      </div>
    </div>
    <div class="layerpanel gx-scrollbar">
      <div class="layerTree">
        <Tree :data="layerList" show-checkbox multiple @on-check-change="getCheckNodesTitle" :render="SetLegend"></Tree>
      </div>
    </div>
  </div>
</template>
<script>
import { MapControl } from "../js/MapControl.js";
export default {
  data() {
    return {
      layerList: []
    };
  },
  methods: {
    getCheckNodesTitle: function(datainfo) {
      var visibLayers = new Array();
      let map = MapControl.map.mapbox;

      /*分类级别*/
      for (let i = 0; i < this.layerList.length; i++) {
        /*增加公共非公共层级*/
        var gdatachild = this.layerList[i].children;
        if (gdatachild) {
          for (let g = 0; g < gdatachild.length; g++) {
            let gtitle = this.layerList[i].title;
            var datachild = gdatachild[g].children;
            if (!gdatachild[g].SubName) {
              /*服务级别-大类级别*/
              for (let j = 0; j < datachild.length; j++) {
                var sublayer = {};
                if (visibLayers[datachild[j].title + gtitle]) {
                  sublayer = visibLayers[datachild[j].title + gtitle];
                } else {
                  sublayer.SERVERURL = datachild[j].serviceurl;
                  sublayer.SERVERID = datachild[j].SERVERID;
                  sublayer.SubLayers = [];
                  sublayer.title = datachild[j].title + gtitle;
                  sublayer.IsVisible = false;
                  visibLayers[datachild[j].title + gtitle] = sublayer;
                }
                if (datachild[j].children && datachild[j].children.length > 0) {
                  /*小类级别*/
                  for (let k = 0; k < datachild[j].children.length; k++) {
                    if (datachild[j].children[k].checked) {
                      for (
                        var l = 0;
                        l < datachild[j].children[k].SubLayers.length;
                        l++
                      ) {
                        let d = datachild[j].children[k].SubLayers[l];
                        sublayer.SubLayers.push(d);
                      }
                      sublayer.IsVisible = datachild[j].children[k].checked;
                    }
                    sublayer.SERVERID = datachild[j].children[k].SERVERID;
                  }
                } else {
                  sublayer.IsVisible = datachild[j].checked;
                }
              } /*end 大类*/
            } else {
              let otherlayer = map.getLayer(gdatachild[g].title);
              
              if (otherlayer) {
                if (gdatachild[g].checked == true) {
                  otherlayer.show();
                } else {
                  otherlayer.hide();
                }
              }
            }
          } /*end 公共非公共*/
        }
      }
      /*设置图层显示*/
      MapControl.SetLayerVisible(visibLayers);
    },
    //设置图例
    SetLegend(h, { root, node, data }) {
      if (data.img) {
        return h(
          "span",
          {
            style: {
              display: "inline-block",
              width: "100%"
            }
          },
          [
            h("div", [
              h("img", {
                attrs: {
                  src: "data:image/jpeg;base64," + data.img
                },
                style: {
                  marginRight: "5px",
                  right: "15px",
                  width: "15px",
                  vif: false
                }
              }),
              h("span", data.title)
            ])
          ]
        );
      } else {
        return h(
          "span",
          {
            style: {
              display: "inline-block",
              width: "100%"
            }
          },
          [h("div", [h("span", data.title)])]
        );
      }
    },
    close() {
      this.$parent.current_com = "";
    }
  },
  mounted: function() {
    this.layerList = this.$store.state.userdata.TOC;
    //console.log(this.$store.state.userdata.TOC)
  }
};
</script>