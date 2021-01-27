<template>
  <div id="chart-panel" class="chart-panel"></div>
</template>

<script>
import axios from "axios";
import echarts from "echarts";
import resize from "@/api/mixins/echart.js";

import reginCode from "../../../static/data/mapjson/reginCode";
import province from "../../../static/data/mapjson/province";

export default {
  name: "EchartMap",
  mixins: [resize],
  data() {
    return {};
  },
  mounted() {
    let _this = this;

    axios
      .get("../../../static/data/mapjson/china.geoJson")
      .then(function(res) {
        echarts.registerMap("中国", res.data); //注册
        _this.extendsMap("chart-panel", {
          bgColor: "#154e90", // 画布背景色
          mapName: "中国", // 地图名
          goDown: true, // 是否下钻
          // 下钻回调
          callback: function(name, option, instance) {
            console.log(name, option, instance);
          },
          // 数据展示
          data: [
            {
              name: "南昌",
              value: 10,
              level: 1
            },
            {
              name: "景德镇",
              value: 12,
              level: 2
            },
            {
              name: "萍乡",
              value: 11,
              level: 3
            },
            {
              name: "赣州",
              value: 16,
              level: 2
            },
            {
              name: "吉安",
              value: 12,
              level: 1
            }
          ]
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    extendsMap(id, opt) {
      // 实例
      var chart = echarts.init(document.getElementById(id));

      var curGeoJson = {};

      //直辖市和特别行政区-只有二级地图，没有三级地图
      var special = ["北京", "天津", "上海", "重庆", "香港", "澳门"];

      var geoCoordMap = {
        南昌: [115.89, 28.48],
        景德镇: [117.28, 29.09],
        萍乡: [113.93, 27.41],
        九江: [115.97, 29.51],
        新余: [114.81, 27.72],
        鹰潭: [117.12, 28.1],
        赣州: [115.04, 25.67],
        吉安: [115.05, 26.88],
        宜春: [114.41, 28.03],
        抚州: [116.45, 27.79],
        上饶: [117.92, 28.22]
      };
      var levelColorMap = {
        "1": "rgba(241, 109, 115, .8)",
        "2": "rgba(255, 235, 59, .7)",
        "3": "rgba(147, 235, 248, 1)"
      };

      var defaultOpt = {
        mapName: "china", // 地图展示
        goDown: false, // 是否下钻
        bgColor: "#404a59", // 画布背景色
        activeArea: [], // 区域高亮,同echarts配置项
        data: [],
        // 下钻回调(点击的地图名、实例对象option、实例对象)
        callback: function(name, option, instance) {}
      };
      if (opt) opt = echarts.util.extend(defaultOpt, opt);

      // 层级索引
      var name = [opt.mapName];
      var idx = 0;
      var pos = {
        leftPlus: 115,
        leftCur: 150,
        left: 198,
        top: 50
      };

      var line = [
        [0, 0],
        [8, 11],
        [0, 22]
      ];

      var style = {
        font: '18px "Microsoft YaHei", sans-serif',
        textColor: "#eee",
        lineColor: "rgba(147, 235, 248, .8)"
      };

      var handleEvents = {
        /**
         * i 实例对象
         * o option
         * n 地图名
         **/
        resetOption: function(i, o, n) {
          var breadcrumb = this.createBreadcrumb(n);
          var j = name.indexOf(n);
          var l = o.graphic.length;
          if (j < 0) {
            o.graphic.push(breadcrumb);
            o.graphic[0].children[0].shape.x2 = 145;
            o.graphic[0].children[1].shape.x2 = 145;
            if (o.graphic.length > 2) {
              for (var x = 0; x < opt.data.length; x++) {
                if (n === opt.data[x].name + "市") {
                  o.series[0].data = handleEvents.initSeriesData([opt.data[x]]);
                  break;
                } else o.series[0].data = [];
              }
            }
            name.push(n);
            idx++;
          } else {
            o.graphic.splice(j + 2, l);
            if (o.graphic.length <= 2) {
              o.graphic[0].children[0].shape.x2 = 60;
              o.graphic[0].children[1].shape.x2 = 60;
              o.series[0].data = handleEvents.initSeriesData(opt.data);
            }
            name.splice(j + 1, l);
            idx = j;
            pos.leftCur -= pos.leftPlus * (l - j - 1);
          }

          o.geo.map = n;
          o.geo.zoom = 0.4;
          i.clear();
          i.setOption(o);
          this.zoomAnimation();
          opt.callback(n, o, i);
        },

        /**
         * name 地图名
         **/
        createBreadcrumb: function(name) {
          var breadcrumb = {
            type: "group",
            id: name,
            left: pos.leftCur + pos.leftPlus,
            top: pos.top + 3,
            children: [
              {
                type: "polyline",
                left: -90,
                top: -5,
                shape: {
                  points: line
                },
                style: {
                  stroke: "#fff",
                  key: name
                  // lineWidth: 2,
                },
                onclick: function() {
                  var name = this.style.key;
                  handleEvents.resetOption(chart, option, name);
                }
              },
              {
                type: "text",
                left: -68,
                top: "middle",
                style: {
                  text: name,
                  textAlign: "center",
                  fill: style.textColor,
                  font: style.font
                },
                onclick: function() {
                  var name = this.style.text;
                  handleEvents.resetOption(chart, option, name);
                }
              },
              {
                type: "text",
                left: -68,
                top: 10,
                style: {
                  name: name,
                  text: province[name] ? province[name].toUpperCase() : "",
                  textAlign: "center",
                  fill: style.textColor,
                  font: '12px "Microsoft YaHei", sans-serif'
                },
                onclick: function() {
                  // console.log(this.style);
                  var name = this.style.name;
                  handleEvents.resetOption(chart, option, name);
                }
              }
            ]
          };

          pos.leftCur += pos.leftPlus;

          return breadcrumb;
        },

        // 设置effectscatter
        initSeriesData: function(data) {
          var temp = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              temp.push({
                type: "coord",
                name: data[i].name,
                value: geoCoord.concat(data[i].value, data[i].level)
              });
            }
          }
          return temp;
        },

        zoomAnimation: function() {
          var count = null;
          var zoom = function(per) {
            if (!count) count = per;
            count = count + per;
            // console.log(per,count);
            chart.setOption({
              geo: {
                zoom: count
              }
            });
            if (count < 1)
              window.requestAnimationFrame(function() {
                zoom(0.2);
              });
          };
          window.requestAnimationFrame(function() {
            zoom(0.2);
          });
        }
      };

      var option = {
        backgroundColor: opt.bgColor,
        graphic: [
          {
            type: "group",
            left: pos.left,
            top: pos.top - 4,
            children: [
              {
                type: "line",
                left: 0,
                top: -20,
                shape: {
                  x1: 0,
                  y1: 0,
                  x2: 60,
                  y2: 0
                },
                style: {
                  stroke: style.lineColor
                }
              },
              {
                type: "line",
                left: 0,
                top: 20,
                shape: {
                  x1: 0,
                  y1: 0,
                  x2: 60,
                  y2: 0
                },
                style: {
                  stroke: style.lineColor
                }
              }
            ]
          },
          {
            id: name[idx],
            type: "group",
            left: pos.left + 2,
            top: pos.top,
            children: [
              {
                type: "polyline",
                left: 90,
                top: -12,
                shape: {
                  points: line
                },
                style: {
                  stroke: "transparent",
                  key: name[0]
                },
                onclick: function() {
                  var name = this.style.key;
                  console.log("polyline", name);
                  handleEvents.resetOption(chart, option, name);
                }
              },
              {
                type: "text",
                left: 0,
                top: "middle",
                style: {
                  text: name[0],
                  textAlign: "center",
                  fill: style.textColor,
                  font: style.font
                },
                onclick: function() {
                  console.log("text", name);
                  handleEvents.resetOption(chart, option, "中国");
                }
              },
              {
                type: "text",
                left: 0,
                top: 10,
                style: {
                  text: "CHINA",
                  textAlign: "center",
                  fill: style.textColor,
                  font: '12px "Microsoft YaHei", sans-serif'
                },
                onclick: function() {
                  console.log("text", name);
                  handleEvents.resetOption(chart, option, "中国");
                }
              }
            ]
          }
        ],
        geo: {
          map: opt.mapName,
          // 开启缩放和拖动
          roam: true,
          // // 滚轮缩放控制
          // scaleLimit: {
          //   min: 0.5,
          //   max: 5
          // },
          // 当前视角的缩放比例
          zoom: 1,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: "#fff"
              }
            },
            emphasis: {
              textStyle: {
                color: "#fff"
              }
            }
          },
          mapLocation: {
            width: "110%",
            height: "97%"
          },
          itemStyle: {
            normal: {
              borderColor: "rgba(147, 235, 248, 1)",
              borderWidth: 1,
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(147, 235, 248, 0)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(147, 235, 248, .2)" // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              shadowColor: "rgba(128, 217, 248, 1)",
              // shadowColor: 'rgba(255, 255, 255, 1)',
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10
            },
            emphasis: {
              areaColor: "#389BB7",
              borderWidth: 0
            }
          },
          regions: opt.activeArea.map(function(item) {
            if (typeof item !== "string") {
              return {
                name: item.name,
                itemStyle: {
                  normal: {
                    areaColor: item.areaColor || "#389BB7"
                  }
                },
                label: {
                  normal: {
                    show: item.showLabel,
                    textStyle: {
                      color: "#fff"
                    }
                  }
                }
              };
            } else {
              return {
                name: item,
                itemStyle: {
                  normal: {
                    borderColor: "#91e6ff",
                    areaColor: "#389BB7"
                  }
                }
              };
            }
          })
        },
        series: [
          {
            type: "effectScatter",
            coordinateSystem: "geo",
            showEffectOn: "render", //高亮时显示特效
            rippleEffect: {
              //涟漪特效
              period: 15, //动画时间，值越小速度越快
              scale: 6, //波纹圆环最大限制，值越大波纹越大
              brushType: "fill" //波纹绘制方式 stroke, fill
            },
            label: {
              normal: {
                show: false,
                position: "right", //显示位置
                offset: [5, 0], //偏移设置
                formatter: function(params) {
                  //圆环显示文字
                  return params.data.name;
                },
                fontSize: 19
              },
              emphasis: {
                show: true
              }
            },
            symbol: "circle",
            symbolSize: function(val) {
              return 10 + val[2] * 0; //圆环大小
            },
            hoverAnimation: true,
            itemStyle: {
              normal: {
                color: function(params) {
                  return levelColorMap[params.value[3]];
                },
                shadowBlur: 10,
                shadowColor: "#333"
              }
            },
            data: handleEvents.initSeriesData(opt.data)
          }
        ]
      };

      chart.setOption(option);
      // 添加事件
      chart.on("click", function(params) {
        debugger
        console.info(params);
        var _self = this;
        if (opt.goDown && params.name !== name[idx]) {
          var code = reginCode[params.name];
          if (code) {
            axios
              .get(`../../../static/data/mapjson/province/${code}.geoJson`)
              .then(function(res) {
                echarts.registerMap(params.name, res.data);
                handleEvents.resetOption(_self, option, params.name);
              });
          }
          // else{ // 下钻到县区级
          //     var data = {features: [],name: params.name};
          //     var temp = curGeoJson.features;
          //     for(var i = 0;i < temp.length;i++){
          //         if(temp[i].properties.name === params.name){
          //             data.features.push(temp[i]);
          //             break;
          //         }
          //     };
          //     // console.log(data);
          //     echarts.registerMap(params.name, data);
          //     handleEvents.resetOption(_self, option, params.name);
          // }
        }
      });

      chart.setMap = function(mapName) {
        debugger;
        var _self = this;
        if (mapName.indexOf("市") < 0) mapName = mapName + "市";
        var citySource = reginCode[mapName];
        if (citySource) {
          var url = "./map/" + citySource + ".json";
          axios.get(url, function(response) {
            console.log(response);
            curGeoJson = response;
            echarts.registerMap(mapName, response);
            handleEvents.resetOption(_self, option, mapName);
          });
        }
      };

      return chart;
    }
  }
};
</script>

<style scoped>
.chart-panel {
  height: 100%;
  width: 100%;
}
</style>
