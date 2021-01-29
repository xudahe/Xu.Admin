<template>
  <section>
    <div style="height:100%;width:100%" id="container" width tabindex="0"></div>
    <div class="search-div">
      <el-input
        id="tipInput"
        v-model="inputSearchVal"
        placeholder="请输入搜索名称"
      >
      </el-input>
    </div>
    <div class="geolocation">
      <el-tooltip
        class="item"
        effect="dark"
        content="定位到当前位置"
        placement="left"
      >
        <el-button
          type="primary"
          icon="el-icon-location-outline"
          circle
          @click.native="Geolocation"
        ></el-button>
      </el-tooltip>
    </div>
  </section>
</template>

<script>
/**
 * 高德地图API: https://lbs.amap.com/api/javascript-api/example/map/click-to-get-lnglat
 * 申请的key："e83f64300a2a55a33fa8e4ab9a46bca6","73cddabc2173e0166a622f4483d3592a","2d00cf810203e90c91261b1ae4ebacdd"
 * vue-amap：https://github.com/ElemeFE/vue-amap
 */

import remoteLoad from "@/api/script/remoteLoad.js";

var AMapUI = null;
var AMap = null;

export default {
  name: "gdmap",
  props: {},
  components: {},
  data() {
    return {
      mapConfig: {
        zoom: 19,
        // pitch: 75,
        // rotation: 45,
        resizeEnable: true,
        viewMode: "3D", //开启3D视图,默认为关闭
        buildingAnimation: true //楼块出现是否带动画
        // center: [118.767413, 32.041544]
      },

      map: null,

      inputSearchVal: "",
      placeSearch: null
    };
  },
  async created() {
    if (window.AMap && window.AMapUI) {
      this.init();
    } else {
      await remoteLoad(
        `http://webapi.amap.com/maps?v=1.4.15&key=2d00cf810203e90c91261b1ae4ebacdd`,
        true
      ),
        await remoteLoad(`http://webapi.amap.com/ui/1.1/main.js`);
      await this.init();
    }
  },
  mounted() {},
  methods: {
    init() {
      let _this = this;
      AMapUI = this.AMapUI = window.AMapUI;
      AMap = this.AMap = window.AMap;

      // console.log("AMapUI", AMapUI);

      //loadUI的路径参数为模块名中 'ui/' 之后的部分
      AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
        let map = new AMap.Map("container", this.mapConfig);

        AMap.plugin(
          ["AMap.ToolBar", "AMap.Scale", "AMap.MapType", "AMap.ControlBar"],
          function() {
            map.addControl(new AMap.ToolBar()); //工具条
            map.addControl(new AMap.Scale()); //左下角地图比例尺
            map.addControl(new AMap.MapType()); // 卫星和标准切换，可加路况显示
            // map.addControl(new AMap.ControlBar()); // 组合了旋转、倾斜、复位、缩放在内的地图控件，在3D地图模式下会显示
          }
        );
        this.map = map;

        //单击事件
        AMap.event.addListener(map, "click", function(e) {
          console.info("click", e);
        });
        //双击事件
        // AMap.event.addListener(map, "dblclick", function(e) {
        //   console.info("dblclick", e);
        // });

        this.Geolocation();
        this.PlaceSearch();

        let positionPicker = new PositionPicker({
          mode: "dragMap", //设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
          map: map, //依赖地图对象
          iconStyle: {
            // 自定义外观
            url: "http://webapi.amap.com/ui/1.0/assets/position-picker2.png",
            ancher: [24, 40],
            size: [48, 48]
          }
        });
        positionPicker.on("success", function(result) {
          console.log(result);
        });
        positionPicker.on("fail", function(result) {});
        // positionPicker.start(); //显示拖拽图标
      });
    },
    PlaceSearch() {
      let _this = this;
      AMap.plugin(["AMap.Autocomplete", "AMap.PlaceSearch"], () => {
        let autoOptions = {
          output: "show",
          input: "tipInput" // 输入框ID
        };
        let autoComplete = new AMap.Autocomplete(autoOptions);

        AMap.event.addListener(autoComplete, "select", data => {
          if (data.poi.location != undefined) {
            _this.map.setCenter(data.poi.location); //定位到中心点
          }
          this.inputSearchVal = data.poi.name; // inputSearchVal为输入框v-model绑定的值

          let searchOptions = {
            map: _this.map
          };
          let searchRes = new AMap.PlaceSearch(searchOptions);
          searchRes.search(data.poi.name, (status, info) => {
            searchRes.render.markerList.clear(); // 这个为清除搜索结果的点，不想清除注释即可
            console.log("搜索完成打印", status, info); // searchRes为搜索的结果
          });
        });
      });
    },
    Geolocation() {
      let _this = this;

      // 从高德地图api获取浏览器当前定位
      AMap.plugin(["AMap.Geolocation"], function() {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认：true
          timeout: 10000 // 设置定位超时时间，默认：无穷大
        });

        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", function(result) {
          console.log(result);
          _this.map.setCenter(result.position); //定位到中心点
        });
        AMap.event.addListener(geolocation, "error", function(result) {
          _this.getLatLng();
        });
      });
    },
    getLatLng() {
      this.AMap.plugin("AMap.CitySearch", function() {
        let citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function(status, result) {
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            AMap.plugin("AMap.Geocoder", function() {
              let geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: result.adcode
              });
              let lnglat = result.rectangle.split(";")[0].split(",");
              geocoder.getAddress(lnglat, function(status, data) {
                if (status === "complete" && data.info === "OK") {
                  // data为对应的地理位置详细信息
                  console.log(data);
                }
              });
            });
          }
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.search-div {
  position: absolute;
  display: flex;
  align-items: center;
  right: 100px;
  top: 108px;
  width: 250px;
  height: 40px;
  box-sizing: border-box;
}
.geolocation {
  position: absolute;
  display: flex;
  align-items: center;
  right: 28px;
  bottom: 100px;
  box-sizing: border-box;
}
</style>
