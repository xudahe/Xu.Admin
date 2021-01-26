<template>
  <div class="homeMiddleBot" style="height: 100%; width: 100%;">
    <div
      class="UnitFrame rotate-in-x"
      style="height: 100%;float: left;width: 50%;"
    >
      <div class="UnitDiv">
        <div
          id="echart_visite_bot1"
          class="echart_visite_bot1"
          :style="{ height: '100%', width: '100%' }"
        ></div>
      </div>
    </div>

    <div
      class="UnitFrame rotate-in-x"
      style="height: 100%;float: left;width: 50%;"
    >
      <div class="UnitDiv"></div>
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
      options1: null
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
          show: false,
          max: maxData
        },
        yAxis: {
          data: ["2020", "2019", "2018", "2017"],
          inverse: true,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            margin: 10,
            color: "#999",
            fontSize: 16
          }
        },
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
            data: [891, 1220, 660, 1670],
            markLine: {
              symbol: "none",
              label: {
                formatter: "max: {c}",
                position: "start",
                color: "yellow"
              },
              lineStyle: {
                color: "#B4B4B4",
                type: "dotted",
                opacity: 0.2,
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
            },
            {
              data: dynamicData.slice()
            }
          ]
        });
      }, 3000);

      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });

      this.myChart1.setOption(this.options1, true);
      this.myChart1.resize();
      window.addEventListener("resize", function() {
        _this.myChart1.resize();
      });
    }
  },
  mounted() {
    var _this = this;

    this.myChart1 = echarts.init(document.getElementById("echart_visite_bot1"));

    setTimeout(() => {
      _this.initCharts1();
    }, 500);
  }
};
</script>

<style lang="less" scoped>
.homeMiddleBot {
  .UnitFrame {
    padding-bottom: 0.05rem;
  }

  .UnitDiv {
    position: relative;
    height: 100%;
    background: url("../../../../../static/img/newhome/04/6.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
