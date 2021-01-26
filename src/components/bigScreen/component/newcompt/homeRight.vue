<template>
	<div class="homeRight" style="width: 100%;height: 100%;">
    <div class="UnitFrame fade-in-left1" style="height: 25%;float: left;width: 100%;">
			<div class="UnitDiv UnitDiv_bg6">
				<div id='echart_visite_volume1' class="echart_visite_volume1" :style="{height:'100%',width: '100%'}"> </div>
			</div>
    </div>
		<div class="UnitFrame fade-in-left1" style="height: 25%;float: left;width: 100%;">
			<div class="UnitDiv UnitDiv_bg6">
        <div class="borderdivLevel" style="height: calc(100% - 0.1rem);overflow: hidden;">
        <div style="position: relative;" :style="{top: noticeTopsb + 'px'}" :class="{transitionTop: animate }">
          <div v-for='(item,index) in datalist2' :key='index' class='pipeRightMidBot' style="height:100%;margin-left: 0.1rem;cursor: pointer;overflow: hidden;padding: 0% 0% 0% 0%;">
            <div style="float: left;">
              <div style='position: relative;'>
                <Tooltip class="setTips" :content="item.shortname" placement="right">
                  <img style="margin:0.1rem 0 0.1rem 0.05rem;height: 0.2rem;width: 0.2rem;" src="../../../../../static/img/newhome/ic_waterquality.png"/>
                </Tooltip>
              </div>
            </div>
            <div style="margin-left: 0.35rem;">
              <Col span="24">
                <span style=" color: #68a2eb;font-size: 0.12rem;">{{item.name}}</span>
              </Col>
              <Col span="15">
                <span style="font-size: 0.12rem;color: rgba(104, 162, 235, 0.6);" >时间:</span>
                <span style="color:#ffe400;font-size: 0.12rem;">{{item.recordtime}}</span>
              </Col>
              <Col span="9">
                <span style="font-size: 0.12rem;color: rgba(104, 162, 235, 0.6);">高程:</span>
                <span style="color:#ffe400;font-size: 0.12rem;">{{item.level_height.toFixed(3)}}</span>
                <span style="font-size: 0.12rem;color: rgba(104, 162, 235, 0.6);">(米)</span>
              </Col>
            </div>
          </div>
        </div>
        </div>       
			</div>
    </div>
		<div class="UnitFrame fade-in-left1" style="height: 50%;float: left;width: 100%;">
			<div class="UnitDiv UnitDiv_bg3">
        <div id='echart_visite_volume3' class="echart_visite_volume3" :style="{height:'100%',width: '100%'}"> </div>
			</div>
     </div>
   	</div>
	</div>
</template>

<script>

import echarts from 'echarts'
import resize from "@/api/mixins/echart.js";

	export default {
    name: "homeRight",
    mixins: [resize],
		components: {
			
		},
		data() {
			return {
        options1: null,
        options3: null,

				myChart1: null,
				myChart3: null,
		
        colorList: ['#4971e9', '#5ecc21','#ba9520','#a354d4'],
        
        timersb: null,
        animate : true,
        noticeTopsb: 0,
        datalist2: [
          { 
            shortname: '压力式液位仪',
            name:'1号淮源街',
            recordtime: '2020-12-03 09:32:03',
            level_height: 7.365
          },
          { 
            shortname: '压力式液位仪',
            name:'2号淮源街',
            recordtime: '2020-12-03 09:32:03',
            level_height: 7.365
          },
          { 
            shortname: '压力式液位仪',
            name:'3号淮源街',
            recordtime: '2020-12-03 09:32:03',
            level_height: 7.365
          },
          { 
            shortname: '压力式液位仪',
            name:'4号淮源街',
            recordtime: '2020-12-03 09:32:03',
            level_height: 7.365
          },
          { 
            shortname: '压力式液位仪',
            name:'5号淮源街',
            recordtime: '2020-12-03 09:32:03',
            level_height: 7.365
          },
        ]
			};
		},
		methods: {
		  initCharts1(){

            var data = [{
                    name: "计划安装",
                    value: 3200,
                },
                {
                    name: "完成招标",
                    value: 2380,
                },
                {
                    name: "已经安装",
                    value: 1587,
                },
                {
                    name: "正在安装",
                    value: 790,
                }
            ];
            var dataStyle = { 
                normal: {
                    label: {show:false},
                    labelLine: {show:false},
                    // shadowBlur: 40,
                    // shadowColor: 'rgba(40, 40, 40, 0.5)',
                }
            };
            var placeHolderStyle = {
                normal : {
                    color: 'rgba(255, 255, 255,0.1)',
                    label: {show:false},
                    labelLine: {show:false}
                },
                emphasis : {
                    color: 'rgba(255, 255, 255,0.1)'
                }
            };
            var legendData=[];
            function getData(data) {
                var sortData=data.sort((a,b)=>{
                    return b.value-a.value
                });
                var res = [];
                for (let i = 0; i < sortData.length; i++) {
                    legendData.push(sortData[i].name);
                    res.push({
                        type: 'pie',
                        clockWise: false, //顺时加载
                        hoverAnimation: false, //鼠标移入变大
            　　　　　　 radius: [60 - i * 10 + '%', 68 - i * 10 + '%'],
                        center: ['25%', '50%'],
                        itemStyle: dataStyle,
                        data: [{
                            number: sortData[i].value,
                            name: sortData[i].name,
                            value: (sortData[i].value/(sortData[0].value + sortData[0].value/3))
                        }, {
                            value: 1 - (sortData[i].value/(sortData[0].value + 300)),
                            itemStyle: placeHolderStyle,
        
                            number: sortData[i].value,
                            name: sortData[i].name,
                        }],
                        labelLine: {
                            normal: {
                                length: 0,
                                length2: 0,
                                lineStyle: {
                                    color: '#e6e6e6'
                                }
                            }
                        }
                    });
                }
                
                return res;
            }
    
            this.options1 = {
                color: this.colorList,
                tooltip : {
                    show: true,
                    formatter: function(params, ticket, callback) {
                      return params.name+"："+params.data.number +"(个)";
                    }
                      
                    // formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                     top:'10%',
                     right: '5%',
                     icon:'circle',
                     textStyle:{//图例文字的样式
                        fontSize:12,
                        rich:{
                          a:{
                          	align:'left',
                          	color:'rgba(255,255,255,0.8)',
                          	padding:[0,22,0,0],
                          },
                          b:{
                            fontSize: 16,
                         	align:'left',
                        	color:'#69d9ff',
                          },
                        }
                      },
        
                      formatter: function (name) {
                        let asd= data.filter(function(item){
                           return item.name === name
                        })
                        
                        let arr = [
                          '{a|'+name+'}',
                          '{b|'+asd[0].value+'}'
                          ]
        
                        return arr.join('');
                        
                      },
                    data:legendData
                },
                series : getData(data)
            };

	          this.myChart1.setOption(this.options1, true);
		        this.myChart1.resize();
		        var _this = this;
		        window.addEventListener("resize", function() {
			      	_this.myChart1.resize();
		        });
      },
      initCharts3(){
            let cdata = {
              category: [
                 "市区",
                 "万州",
                 "江北",
                 "南岸",
                 "北碚",
                 "綦南",
                 "长寿",
                 "永川",
                 "璧山",
                 "江津",
                 "城口",
                 "大足",
                 "垫江",
                 "丰都",
                 "奉节",
                 "合川",
                 "江津区",
                 "开州",
                 "南川",
                 "彭水",
                 "黔江",
                 "石柱",
                 "铜梁",
                 "潼南",
                 "巫山",
                 "巫溪",
                 "武隆",
                 "秀山",
                 "酉阳",
                 "云阳",
                 "忠县",
                 "川东",
                 "检修"
              ],
              lineData: [
                 18092,
                 20728,
                 24045,
                 28348,
                 32808,
                 36097,
                 39867,
                 44715,
                 48444,
                 50415,
                 56061,
                 62677,
                 59521,
                 67560,
                 18092,
                 20728,
                 24045,
                 28348,
                 32808,
                 36097,
                 39867,
                 44715,
                 48444,
                 50415,
                 36097,
                 39867,
                 44715,
                 48444,
                 50415,
                 50061,
                 32677,
                 49521,
                 32808
              ],
              barData: [
                 4600,
                 5000,
                 5500,
                 6500,
                 7500,
                 8500,
                 9900,
                 12500,
                 14000,
                 21500,
                 23200,
                 24450,
                 25250,
                 33300,
                 4600,
                 5000,
                 5500,
                 6500,
                 7500,
                 8500,
                 9900,
                 22500,
                 14000,
                 21500,
                 8500,
                 9900,
                 12500,
                 14000,
                 50415,
                 23200,
                 24450,
                 25250,
                 7500
              ],
              rateData: []
            }

            for (let i = 0; i < cdata.barData.length -1; i++) {
              let rate = cdata.barData[i] / cdata.lineData[i];
              cdata.rateData.push(rate.toFixed(2));
            }
            
            
            //默认显示10条数据（当数据多余10条时
            let dataZoom_end = 10
            if(cdata.category.length >10 ){
                dataZoom_end = (10/cdata.category.length)*100;
            }else{
                dataZoom_end = 100;
            }

            this.options3 = {
              title: {
                text: "",
              },
              tooltip: {
                trigger: "axis",
                backgroundColor: "rgba(255,255,255,0.2)",
                axisPointer: {
                  type: "shadow",
                  label: {
                    show: true,
                    backgroundColor: "#7B7DDC"
                  }
                }
              },
              legend: {
                data: ["已贯通", "计划贯通", "贯通率"],
                textStyle: {
                  color: "#B4B4B4"
                },
                top: "0%"
              },
              grid: {
                top: "10%",
                right: "11%",
                left: "11%",
                bottom: "20%"
              },
              dataZoom: [
                  {
                      type: 'slider',
                      height: 20,
                      show: true,
                      realtime: true,
                      start: 0,
                      end: dataZoom_end
                  }
              ],
              xAxis: {
                data: cdata.category,
                axisLine: {
                  lineStyle: {
                    color: "#B4B4B4"
                  }
                },
                axisTick: {
                  show: false
                }
              },
              yAxis: [
                {
                  splitLine: { show: false },
                  axisLine: {
                    lineStyle: {
                      color: "#B4B4B4"
                    }
                  },
                  axisLabel: {
                    formatter: function (value, index) {
                        if (value >= 10000 && value < 100000) {
                            value = value / 10000 + "万";
                        } else if (value >= 100000) {
                            value = value / 100000 + "十万";
                        } else if (value >= 1000000) {
                            value = value / 1000000 + "百万";
                        }
                        return value;
                    }
                  }
                },
                {
                  splitLine: { show: false },
                  axisLine: {
                    lineStyle: {
                      color: "#B4B4B4"
                    }
                  },
                  axisLabel: {
                    formatter: "{value} "
                  }
                }
              ],
              series: [
                {
                  name: "贯通率",
                  type: "line",
                  smooth: true,
                  showAllSymbol: true,
                  symbol: "emptyCircle",
                  symbolSize: 8,
                  yAxisIndex: 1,
                  itemStyle: {
                    normal: {
                      color: "#F02FC2"
                    }
                  },
                  showSymbol: false,
                  data: cdata.rateData
                },
                {
                  name: "已贯通",
                  type: "bar",
                  barWidth: 10,
                  itemStyle: {
                    normal: {
                      barBorderRadius: 5,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "#956FD4" },
                        { offset: 1, color: "#3EACE5" }
                      ])
                    }
                  },
                  data: cdata.barData
                },
                {
                  name: "计划贯通",
                  type: "bar",
                  barGap: "-100%",
                  barWidth: 10,
                  itemStyle: {
                    normal: {
                      barBorderRadius: 5,
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: "rgba(156,107,211,0.8)" },
                        { offset: 0.2, color: "rgba(156,107,211,0.5)" },
                        { offset: 1, color: "rgba(156,107,211,0.2)" }
                      ])
                    }
                  },
                  z: -12,
                  data: cdata.lineData
                }
              ]
            }
      
        this.myChart = echarts.init(document.getElementById("echart_visite_volume3"));
        this.myChart.setOption(this.options3, true);

      },

      settimeoutss() {
        let _this = this;
        
        let list = JSON.parse(JSON.stringify(_this.datalist2));
        let index = 1;
        _this.timersb = setInterval(() => {
          if (index > _this.datalist2.length) {
            index = 1;
          }
          let dom = document.getElementsByClassName("pipeRightMidBot");
          if (dom.length > 0) {
            dom[0].classList.remove("active-transform");
            dom[0].classList.add("active-transform");
            _this.noticeTopsb = -dom[0].clientHeight;
          }

          _this.datalist2.push(list[index - 1]);
          _this.animate  = true;
          setTimeout(function() {
            _this.datalist2.shift();
            _this.animate  = false;
            _this.noticeTopsb = 0;
            if (dom.length > 0) dom[0].classList.remove("active-transform");
          }, 2000);
          index++;
        }, 5000);

      },
      
		},
		mounted() {
			var _this = this;

			this.myChart1 = echarts.init(
	      document.getElementById("echart_visite_volume1")
      );
            
      setTimeout(() => {
        _this.initCharts1();
        _this.initCharts3();
        _this.settimeoutss()
      }, 500);
    },
    beforeDestroy() {
      clearInterval(this.timersb)
    },
	};
</script>

<style lang="less" scoped>
.homeRight {
  .UnitFrame{
    padding: 0 0.05rem 0.05rem 0.05rem;
	}
	
  .UnitDiv {
    position: relative;
    height: 100%;
	}

	.UnitDiv_bg6 {
		background: url("../../../../../static/img/newhome/04/6.png") no-repeat;
		background-size: 100% 100%;
	}
	.UnitDiv_bg3 {
		background: url("../../../../../static/img/newhome/04/3.png") no-repeat;
		background-size: 100% 100%;
  }
 
}
</style>
