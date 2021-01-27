<template>
  <div id="js-container" :style="{ width: '100%', height: '95%' }"></div>
</template>

<script>
/**
 * 高德地图API: https://lbs.amap.com/api/javascript-api/example/map/click-to-get-lnglat
 * 申请的key："e83f64300a2a55a33fa8e4ab9a46bca6","73cddabc2173e0166a622f4483d3592a","2d00cf810203e90c91261b1ae4ebacdd"
 */

import remoteLoad from "@/api/script/remoteLoad.js";

export default {
  name: "gdmap",
  props: {},
  components: {},
  data() {
    return {
      AMapUI: null,
      AMap: null
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
  methods: {
    init() {
      let _this = this;
      let AMapUI = (this.AMapUI = window.AMapUI);
      let AMap = (this.AMap = window.AMap);

      // console.log("AMapUI", AMapUI);

      //loadUI的路径参数为模块名中 'ui/' 之后的部分
      AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
        let mapConfig = {
          // zoom: 16,
          // pitch: 75,
          // rotation: 45,
          resizeEnable: true,
          viewMode: "3D", //开启3D视图,默认为关闭
          buildingAnimation: true //楼块出现是否带动画
          // center: [118.767413, 32.041544]
        };
        let map = new AMap.Map("js-container", mapConfig);

        ////加载工具条
        AMap.plugin(["AMap.ToolBar"], function() {
          map.addControl(
            new AMap.ToolBar({
              position: "LT" // LT:左上角;RT:右上角;LB:左下角;RB:右下角;
            })
          );
        });

        // 从高德地图api获取浏览器定位
        AMap.plugin(["AMap.Geolocation"], function() {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认：true
            timeout: 10000 // 设置定位超时时间，默认：无穷大
          });

          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, "complete", function(result) {
            console.log(result);
          });
          AMap.event.addListener(geolocation, "error", function(result) {
            _this.getLatLng();
          });
        });

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

        // // AMap.Autocomplete是输入提示插件，详情参考https://lbs.amap.com/api/javascript-api/reference/search#m_AMap.Autocomplete
        // AMap.plugin("AMap.Autocomplete", () => {
        //   let autoOptions = {
        //     city: this.shopDatadetail.city,
        //     input: "addressInput" // 输入框ID
        //   };
        //   let autoComplete = new AMap.Autocomplete(autoOptions);
        //   // select为输入框提示之后的选择事件，监听事件用法详情参考https://lbs.amap.com/api/javascript-api/reference/event/
        //   AMap.event.addListener(autoComplete, "select", e => {
        //     this.chooseAddressSelect = e; // e为回调函数返回的下拉框选择的参数
        //     this.accuratePos = e.poi.name; // accuratePos为输入框v-model绑定的值
        //     AMap.service("AMap.PlaceSearch", () => {
        //       let searchOptions = {
        //         city: "全国",
        //         map: this.map
        //       };
        //       let searchRes = new AMap.PlaceSearch(searchOptions);
        //       // 搜索服务，详情参考https://lbs.amap.com/api/javascript-api/reference/search#m_AMap.PlaceSearch
        //       searchRes.search(this.chooseAddressSelect.poi.name, () => {
        //         // 其实这个地方是我最主要讲的，请往下看
        //         searchRes.render.markerList.clear(); // 这个为清除搜索结果的点，不想清除注释即可
        //         console.log("搜索完成打印", searchRes); // searchRes为搜索的结果
        //       });
        //     });
        //   });
        // });
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
.map {
  width: 500px;
  height: 300px;
}
</style>
