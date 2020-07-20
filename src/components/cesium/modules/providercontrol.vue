<!-- 图层列表信息 -->
<style>
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
.itemclick {
  color: red !important;
}
</style>
<template>
  <div class="layercontrol">
    <div class="layerpannel_title">
      <font>图层管理</font>
      <div class="layerpannel_btn">
        <Button
          size="small"
          style="margin:5px;"
          shape="circle"
          @click="close()"
        >
          <Icon type="close"></Icon>
        </Button>
      </div>
    </div>
    <div
      class="layerpanel gx-scrollbar"
      style="overflow: auto; max-height: 300px;"
    >
      <Tree
        :data="layerList"
        show-checkbox
        @on-check-change="setCheckNodes"
      ></Tree>
    </div>
  </div>
</template>
<script>

import { cesiumInstance } from "../../../api/cesium/cesiumInstance";
import cesiumTools from "../../../api/cesium/cesiumTools";
var Cesium = require("cesium/Cesium");
var widgets = require("cesium/Widgets/widgets.css");
export default {
  data() {
    return {
      layerList: cesiumInstance.layers, //图层顺序叠加
      treeSetting: {
        data: {
          key: {
            title: "remark"
          }
        },
        check: {
          enable: true
        },
        view: {
          showIcon: this.showIconForTree,
          showLine: false,
          fontCss: this.setFontCss
        }
      }
    };
  },
  methods: {
    setFontCss(treeId, treeNode) {
      if (treeNode.iscollect == true) {
        return { color: "green" };
      } else {
        return {};
      }
    },
    showIconForTree(treeId, treeNode) {
      if (treeNode.icon && treeNode.icon !== "") {
        return true;
      } else {
        return false;
      }
    },
    close() {
      this.$parent.current_com = "";
    },
    setCheckNodes(data) {
      let viewer = cesiumInstance.viewer;
      for (let i = 0; i < this.layerList.length; i++) {
        for (let j = 0; j < this.layerList[i].children.length; j++) {
          let child = this.layerList[i].children[j];
          if (child.servicetype && child.serviceurl) {
            if (child.checked == true) {
              if (!cesiumInstance.models[child.id]) {
                cesiumTools.AddToScene(child);
              }
              if (child.id == "GDDK") {
                if (!cesiumInstance.models["GDDK_Labels"]) {
                  let dataSource = new Cesium.GeoJsonDataSource();
                  dataSource.load("./static/GDDK.geojson").then(function() {
                    let entities = dataSource.entities.values;
                    for (let i = 0; i < entities.length; i++) {
                      let entity = entities[i];
                      entity.billboard = undefined;
                      entity.label = {
                        text:
                          "批准文号:" +
                          entity.properties.PZ_WH +
                          "\n" +
                          entity.properties.XM_MC +
                          "\n" +
                          "面积：" +
                          entity.properties.GD_ZMJ +
                          "\n" +
                          "金额:" +
                          entity.properties.JE +
                          "万元" +
                          "\n" +
                          "容积率:" +
                          entity.properties.MIN_RJL,
                        scale: 0.5,
                        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                        style: Cesium.LabelStyle.FILL,
                        fillColor: Cesium.Color.WHITE,
                        pixelOffset: new Cesium.Cartesian2(-50, -50), //偏移量
                        showBackground: true,
                        backgroundColor: new Cesium.Color(0.5, 0.6, 1, 0.5)
                        //scaleByDistance: new Cesium.NearFarScalar(500, 1, 500, 0),
                        //translucencyByDistance: new Cesium.NearFarScalar(500, 1, 500, 0.5)
                      };
                    }
                  });
                  viewer.dataSources.add(dataSource);
                  cesiumInstance.models["GDDK_Labels"] = dataSource;
                }
              }
            } else {
              if (cesiumInstance.models[child.id]) {
                viewer.scene.primitives.remove(cesiumInstance.models[child.id]);
                delete cesiumInstance.models[child.id];
              }
              if (child.id == "GDDK") {
                viewer.dataSources.remove(
                  cesiumInstance.models["GDDK_Labels"],
                  true
                );
                delete cesiumInstance.models["GDDK_Labels"];
              }
            }
          }
        }
      }
    }
  },
  mounted() {}
};
</script>