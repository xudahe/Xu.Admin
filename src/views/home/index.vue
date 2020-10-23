<template>
  <div ref="home" style="height:100%;width:100%;" class="home">
     <el-row>
        <el-col :span="12">
             <el-card class="box-card" shadow="hover">
                <swiper :imgList="imgList"></swiper>
             </el-card>
        </el-col>
        <el-col :span="12">
             <el-card class="box-card" shadow="hover">
                <el-button @click.native="showdialog1">弹出框</el-button>
                <el-button @click.native="showdialog2">弹出框</el-button>
                <el-button @click.native="button1">打印</el-button>
             </el-card>
        </el-col>
         <el-col :span="12">
             <el-card class="box-card" shadow="hover">
                 <div style="height: 300px;">
                    <v-video></v-video>
                 </div>
             </el-card>
        </el-col>
     </el-row>
   
    <v-dialog  ref="dialog" v-model="dialog.show" :title="dialog.title" :buttons="dialog.buttons" :bodyshow="dialog.bodyshow" >
		<div style="height: 300px;">
		    <echarts :options="options" @hook:updated="handleEchartUpdated"></echarts>
		</div>
    </v-dialog>
    <dialog1 ref="dragdialog" v-show="showDialog"></dialog1>
  </div>
</template>

<script>

import dialog1 from "../../components/dialog/dialog1"
export default {
  components: {
    dialog1,
  },
  data() {
    return {
      options: [],
      imgList:[
        {img: './static/img/home/b1.png'},
        {img: './static/img/home/b2.png'},
        {img: './static/img/home/b3.png'},
        {img: './static/img/home/b4.png'},
      ],

       dialog: {
        show: false,
        title: {
          text: '分析',
          className: 'xa-bg-blue' //标题样式类名
        },
        bodyshow: true
      },
      showDialog: false,
    };
  },
  mounted(){
    this.initCharts();
  },
  methods: {
    initCharts() {
      var xData = [];
      for (var i = 1; i < 31; i++) {
          xData.push(i + "日");
      }

      this.options = {
        backgroundColor: "#1A1835",
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
                textStyle: {
                    color: "#fff"
                }
            },
        },
        grid: {
            borderWidth: 0,
            top: 110,
            bottom: 95,
            textStyle: {
                color: "#fff"
            }
        },
        legend: {
            x: '46%',
            top: '11%',
            textStyle: {
                color: '#90979c',
            },
            data: ['访问量', '订单量']
        },
        calculable: true,
        xAxis: [{
            type: "category",
            axisLine: {
                lineStyle: {
                    color: "rgba(204,187,225,0.5)",
                }
            },
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            data: xData,
        }],
        yAxis: [{
            type: "value",
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: "rgba(204,187,225,0.5)",
                }
            },
        }],
        dataZoom: [{
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            
            "start": 10,
            "end": 80,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
                color: "#5B3AAE",
            },
            textStyle:{
                color:"rgba(204,187,225,0.5)",
            },
            fillerColor:"rgba(67,55,160,0.4)",
            borderColor: "rgba(204,187,225,0.5)",
    
        }, {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35
        }],
        series: [
          {
            name: "访问量",
            type: "line",
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
                color: "#6f7de3",
            },
            markPoint: {
                label: {
                    normal: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                data: [{
                    type: 'max',
                    name: '最大值',
    
                }, {
                    type: 'min',
                    name: '最小值'
                }]
            },
            data: [
                509, 917, 2455, 2610, 2719, 3033, 3044, 3085, 2708, 2809, 2117,2000,1455,1210,719,
                733,944,2285,2208,3372,3936,3693,2962,2810,3519,2455,2610,2719,2484,2078
            ],
          }, 
          {
            name: "订单量",
            type: "line",
            symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
                color: "#c257F6",
            },
            markPoint: {
                label: {
                    normal: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                data: [{
                    type: 'max',
                    name: '最大值',
    
                }, {
                    type: 'min',
                    name: '最小值'
                }]
            },
            data: [
                2136,3693,2962,3810,3519,3484,3915,3823,3455,4310,4019,3433,3544,3885,4208,3372,
                3484,3915,3748,3675,4009,4433,3544,3285,4208,3372,3484,3915,3823,4265,4298
            ]
          }
        ]
      }
    },
    showdialog1(){
        this.dialog.show = true;
        this.$refs.dialog.retresize();
    },
    showdialog2(){
        this.showDialog = true
        this.$store.state.drag_com = "handsontable"
        this.$store.state.drag_ref = "handsontable"
    },
    button1(){
        this.$print(this.$refs.home.innerHTML);
    },
    handleEchartUpdated(){
        console.log('echarts组件的updated钩子函数被触发')
    },
  }
};
</script>
