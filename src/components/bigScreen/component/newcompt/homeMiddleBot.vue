<template>
  <div class="homeMiddleBot" style="height: 100%; width: 100%;">
    <div
      class="UnitFrame rotate-in-x"
      style="height: 100%;float: left;width: 50%;padding:0 0 0.05rem 0"
    >
      <div class="UnitDiv UnitDiv_bg6">
        <div
          id="echart_visite_bot1"
          class="echart_visite_bot1"
          :style="{ height: '100%', width: '100%' }"
        ></div>
      </div>
    </div>

    <div
      class="UnitFrame rotate-in-x"
      style="height: 100%;float: left;width: 50%;padding:0 0 0.05rem 0"
    >
      <div class="UnitDiv UnitDiv_bg6">
        <div
          id="echart_visite_bot2"
          class="echart_visite_bot2"
          :style="{ height: '100%', width: '100%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "homeMiddleBot",
  components: {},
  data() {
    return {
      myChart1: null,
      options1: null,

      myChart2: null,
      options2: null
    };
  },
  methods: {
    initCharts1() {
      let _this = this;

      var spirit =
        "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAADYElEQVR4nO2dz0sUYRjHP7tIdAmxQ1LdlhCKMohAIsgiyEuHjkUEFQTlpejS/xCCBB06RBGBBKIG4cGyH0qHBKE9eKyFqBQPRQeNCt06vGNY7bq7szPfeZLnAwuzM+/zgw/DDvMu70wOIVveLscJOwycA44A24CfwAfgKXAbeFVvovlC/o/vuVwuTj+x0FWiYdGbgXvA8RrjHgAXgIVaCbMU3SKr1BhtwEtgZx1jTwI7gG7ga5pNNUO+9pBMuEN9klfYD9xMqZdEsCj6AHAiRtxZYFeyrSSHRdGnYsblCD8jJrEoek8TsbsT6yJhLIrelFFsqlgUPZtRbKpYFP2kidjxxLpIGIuiB4AvMeLmgJGEe0kMi6I/AVdjxPVSx91hVlgUDXAXuEaY16jFMnAJeJhqR01iVTTAdeAYUFxjzBRwCLgl6agJrM51rDAO7AP2EmbxthPO8vfAc2Ams84axLpoCGKLrH1mm8eC6KPAGaAL2Fpj7AZgY7T9DfhRY/wc4eflPmH+OjOynI8uEGbpukXlJ4Dz84V8aWWHcj46q4thFzCNTjJRren2UrlLWPM3WYjuAMYIk/tq2oCx9lK5Q11YLboFGARaxXVX0woMtpfK0uuTWvRFoFNcsxKdhF5kqEX3iuuthbQXtehG/gdMG2kvlm/B1xUuWoSLFmFF9CRwg2TnM4pRzskEc8bGiugR4ArhNjkpJqKcJv51sSJ63eOiRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEWvTHKvs/p1izWu5qvaSCWvTlCvtmgeEUaw5TeUVtpV5SQy16COgBRoHXhMWb3aS7PnAhqjEQ1RwFeuYL+aEUa/5DFmtYHkefOEwQVmcBvKD+FQNvgNN/P+pHiV8MRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEixbhokVYEx3nudGKXE1jTfS6xUWLcNEiXLQIFy3CRYtw0SJctAgXLcJFi3DRIv430eUq2+axJvp7jePPqmzHySXFmuhHwFKVYzNA/6rv/VR/s9BSlMsM1kTPEN4DPkU4I8vAO6APOAgsrhq7GO3ri8aUo5ipKIep1zv9AtipgOACGIrLAAAAAElFTkSuQmCC";

      var maxData = 2000;

      this.options1 = {
        tooltip: {},
        legend: {
          show: false
        },
        xAxis: {
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: [
          {
            data: ["2020", "2019", "2018", "2017"],
            type: "category",
            inverse: true,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
              margin: 10,
              color: "#fff",
              fontSize: 16
            }
          }
        ],
        grid: {
          top: "18%",
          right: "22%",
          left: "16%",
          bottom: "8%"
        },
        series: [
          {
            type: "pictorialBar", //echarts图的类型
            symbol: spirit, //内部类型（方块，圆，svg，base64图片）
            symbolRepeat: "fixed", //是否重复symbol
            symbolMargin: "5%", //间距
            symbolClip: true,
            symbolSize: 15, //图标大小
            symbolBoundingData: maxData,
            symbolPosition: "start",
            label: {
              normal: {
                show: true,
                position: "insideRight",
                offset: [40, 0],
                color: "yellow",
                formatter: function(params) {
                  return params.value;
                }
              }
            },
            data: [891, 1220, 660, 1670],
            markLine: {
              //警戒线
              symbol: "none",
              label: {
                formatter: "max: {c}",
                position: "start",
                color: "#7ad87f"
              },
              lineStyle: {
                color: "#7ad87f",
                type: "dotted",
                opacity: 0.8,
                width: 2
              },
              data: [
                {
                  type: "max"
                }
              ]
            },
            z: 10 //图层值
          },
          {
            type: "pictorialBar",
            itemStyle: {
              normal: {
                opacity: 0.2
              }
            },
            // label: {
            //   show: true,
            //   formatter: function(params) {
            //     return ((params.value / maxData) * 100).toFixed(1) + " %";
            //   },
            //   position: "right",
            //   offset: [10, 0],
            //   color: "#00d2ff",
            //   fontSize: 18
            // },
            animationDuration: 0,
            symbolRepeat: "fixed",
            symbolMargin: "5%",
            symbol: spirit,
            symbolSize: 15, //图标大小
            symbolBoundingData: maxData,
            data: [891, 1220, 660, 1670],
            z: 5
          }
        ]
      };

      function random() {
        return +(Math.random() * (maxData - 10)).toFixed(1);
      }
      var timer = setInterval(function() {
        var dynamicData = [random(), random(), random(), random()];
        _this.myChart1.setOption({
          series: [
            {
              data: dynamicData.slice()
            }
            // {
            //   data: dynamicData.slice()
            // }
          ]
        });
      }, 10000);

      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });

      this.myChart1.setOption(this.options1, true);
      this.myChart1.resize();
      window.addEventListener("resize", function() {
        _this.myChart1.resize();
      });
    },

    initCharts2() {
      let _this = this;

      var charts = {
        unit: "户数",
        names: ["新增户数", "注销户数"],
        lineX: [
          "2012年",
          "2013年",
          "2014年",
          "2015年",
          "2016年",
          "2017年",
          "2018年"
        ],
        value: [[], []]
      };

      getData();
      function getData() {
        charts.value[0] = [];
        charts.value[1] = [];
        for (let i = 0; i < charts.lineX.length; i++) {
          let num1 = Math.floor(Math.random() * 900);
          let num2 = Math.floor(Math.random() * num1);
          charts.value[0].push(num1);
          charts.value[1].push(num2);
        }
      }

      var color = ["rgba(23, 255, 243", "rgba(119,61,190"];
      var lineY = [];

      for (var i = 0; i < charts.names.length; i++) {
        var x = i;
        if (x > color.length - 1) {
          x = color.length - 1;
        }
        var data = {
          name: charts.names[i],
          type: "line",
          color: color[x] + ")",
          smooth: true,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: color[x] + ", 0.5)"
                  },
                  {
                    offset: 1,
                    color: color[x] + ", 0)"
                  }
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowBlur: 10
            }
          },
          symbol: "circle",
          symbolSize: 5,
          data: charts.value[i]
        };
        lineY.push(data);
      }

      lineY[0].markLine = {
        silent: true,
        data: [
          {
            yAxis: 150
          },
          {
            yAxis: 400
          }
        ]
      };

      this.options2 = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: charts.names,
          textStyle: {
            fontSize: 12,
            color: "rgb(0,253,255,0.6)"
          },
          right: "4%"
        },
        grid: {
          top: "23%",
          left: "4%",
          right: "8%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: charts.lineX,
          nameTextStyle: {
            color: "#6ea7da",
            fontSize: "12"
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: "dashed",
              color: "#dfdfdf"
            }
          },
          axisLabel: {
            textStyle: {
              color: "#00cffe"
            },
            formatter: function(params) {
              return params.split(" ")[0];
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#2a6192"
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: charts.unit,
          type: "value",

          splitLine: {
            show: false,
            lineStyle: {
              type: "dashed",
              color: "#dfdfdf"
            }
          },
          axisLabel: {
            formatter: "{value}",
            textStyle: {
              color: "#00cffe"
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#2a6192"
            }
          },
          nameTextStyle: {
            color: "#00cffe",
            fontSize: "12"
          },
          axisTick: {
            show: true
          }
        },
        series: lineY
      };

      var timer = setInterval(() => {
        getData();

        _this.myChart2.setOption({
          series: [
            {
              data: charts.value[0]
            },
            {
              data: charts.value[1]
            }
          ]
        });
      }, 10000);

      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });

      this.myChart2.setOption(this.options2, true);
      this.myChart2.resize();
      window.addEventListener("resize", function() {
        _this.myChart2.resize();
      });
    }
  },
  mounted() {
    var _this = this;

    this.myChart1 = echarts.init(document.getElementById("echart_visite_bot1"));
    this.myChart2 = echarts.init(document.getElementById("echart_visite_bot2"));

    setTimeout(() => {
      _this.initCharts1();
      _this.initCharts2();
    }, 500);
  }
};
</script>

<style lang="less" scoped>

</style>
