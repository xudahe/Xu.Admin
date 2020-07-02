<template>
  <div class="echart">
    <div class="loading" v-show="isLoading">
        数据加载中...
    </div>
    <div class="shadow" v-show="isOptionAbnormal">数据为空</div>
    <div class="echarts-container">
      <div class="echarts" :id="randomId" :style="{visibility: isChartVisible ? 'visible' : 'hidden'}"/>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
    name: "echarts",
    props: {
        options:{
            requried:true 
        }
    },
    data() {
        return {
            randomId: 'echarts-dom' + Date.now() + Math.random(),
            myEcharts: null,
            isOptionAbnormal: false,
            isLoading: false,
            events: {
			      	handleEvent: function(event) {
			      		if(event.type == 'resize') {
			      			this.InitResize()
			      		}
			      	},
			      	InitResize: (e) => {
			      		this.myEcharts.resize();
			      	}
			      },
        } 
    },
    computed: {
        isChartVisible() {
           return !this.isLoading && !this.isOptionAbnormal
        }
    },
    watch: {
        options: {
            handler: function (val, oldVal) {
                this.isLoading = true;
                this.initChart();
            },
            deep: true
        }
    },
    mounted (){
        this.initChart(); // 初始化echarts表格
       	window.addEventListener("resize", this.events, false);
    },
    methods: {
        initChart() {
            let $echartsDOM = document.getElementById(this.randomId)
            if(!$echartsDOM) return
            this.myEcharts = echarts.init($echartsDOM)
 
            if(isValidOption(options)){
              this.myEcharts.setOption(this.options)
              this.isOptionAbnormal = this.isLoading = false
            }else{
              this.isOptionAbnormal = true
            }
        },
        //判断传入的option是否合法
        isValidOption(option) {
            return isObject(option) && !isEmptyObject(option) && hasSeriesKey(option) && isSeriesArray(option) && !isSeriesEmpty(option)
        },
        // 1. 是否为对象；
        isObject(option) {
          return Object.prototype.isPrototypeOf(option)
        },
        // 2. 是否为空对象；
        isEmptyObject(option) {
          return Object.keys(option).length === 0
        },
        // 3. 是否包含 series 键；
        hasSeriesKey(option) {
          return !!option['series']
        },
        // 4. series 是否为数组；
        isSeriesArray(option) {
          return Array.isArray(option['series'])
        },
        // 5. series 数组是否为空。
        isSeriesEmpty(option) {
          return option['series'].length === 0
        },
    },
    beforeDestroy(){
        window.removeEventListener('resize', this.events, false)
    }
}
</script>

<style lang="scss" scoped>
    .echarts-container {
      width: 100%;
      height: 100%;
    }
    
    .shadow {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
      color: #8590a6;
    }
</style>