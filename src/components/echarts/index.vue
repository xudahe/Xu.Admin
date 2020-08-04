<template>
  <div class="echart">
    <div class="loading" v-show="isLoading">
        数据加载中...
    </div>
    <div class="shadow" v-show="isOptionAbnormal">数据为空</div>
    <div class="echarts-container">
      <div class="echarts" :id="randomId" :style="{visibility: isChartVisible ? 'visible' : 'hidden',height:height+'px'}"/>
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
      },
      height:{
        type: String,
        default: '300'
      }
    },
    data() {
      return {
        randomId: 'echarts-dom'+ Math.random(),
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

        // 监听窗口发生变化，resize组件 （内部监听生命周期函数）
        window.addEventListener("resize", this.events, false);
   
        // 通过hook监听组件销毁钩子函数，并取消监听事件
        this.$once('hook:beforeDestroy', () => {
          window.removeEventListener('resize',  this.events, false)
        })
    },
    methods: {
        initChart() {
          this.myEcharts = echarts.init(document.getElementById(this.randomId))
 
          this.myEcharts.setOption(this.options)
          this.isOptionAbnormal = this.isLoading = false
        },
    },
    beforeDestroy(){
        // window.removeEventListener('resize', this.events, false)
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