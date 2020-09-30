<template>
  <div class="homeMiddleBot" style="height: 100%; width: 100%;">
    <div class="UnitFrame rotate-in-x" style="height: 100%;float: left;width: 50%;">
			<div class="UnitDiv">
        <div style="height: calc(100%);margin-top: 0rem;">
          <div style="position: relative;width: 100%;overflow: hidden;padding:0 0.05rem" :style="{top: noticeTopsb + 'px'}" :class="{transitionTop: isActivesb}" >
            <div :key="index" v-for="(item,index) in yhList" class="pressureDiv" style="cursor: pointer;line-height:0.35rem;">
              <div style="font-size: 0.14rem;color: #2d8cf0;font-weight: bolder;text-align: left;">
                <span>时间:</span>
                <span class="span2" style="margin-right: 0rem;">2020-08-20</span>
                <span>信息:</span>
                <span class="span3" style="color: #fff65a">{{item.name}}</span>
              </div>
            </div>
          </div>
        </div>
			</div>
    </div>

    <div class="UnitFrame rotate-in-x" style="height: 100%;float: left;width: 50%;">
			<div class="UnitDiv">
        
			</div>
    </div>
  </div>
</template>

<script>
import bus from "../../../../eventBus.js";

export default {
  name: "homeMiddleBot",
  components: {
  },
  props: {
    typename: {
      type: String,
      default() {
        return "河道";
      }
    }
  },
  data() {
    return {
      yhList: [
        {id:1,name:'测试数据1'},
        {id:2,name:'测试数据2'},
        {id:3,name:'测试数据3'},
        {id:4,name:'测试数据4'},
        {id:5,name:'测试数据5'},
        {id:6,name:'测试数据6'},
        {id:6,name:'测试数据7'},
        {id:6,name:'测试数据8'},
      ],

      timersb: {},
      timerxl: {},
 
      isActivesb: true,
      noticeTopsb: 0,
    };
  },
  methods: {
    settimeoutss() {
      let _this = this;
      let list = JSON.parse(JSON.stringify(_this.yhList));
   
      let index = 1;
   
      _this.timersb = setInterval(() => {
        if (index > _this.yhList.length) {
          index = 1;
        }

        let dom = document.getElementsByClassName("pressureDiv");
        
        if (dom.length > 0) {
          dom[0].classList.remove("active");
          dom[0].classList.add("active");
          _this.noticeTopsb = -dom[0].clientHeight;
        }

        _this.yhList.push(list[index - 1]);
        _this.isActivesb = true;
        _this.timerxl = setTimeout(function () {
          _this.yhList.splice(0, 1);
          _this.isActivesb = false;
          _this.noticeTopsb = 0;
          if (dom.length > 0) dom[0].classList.remove("active");
        }, 2000);
        index++;
        
      }, 5000);

    },
  },
  mounted() {
    var _this = this;
    this.settimeoutss();
  },
  beforeDestroy() {
    clearInterval(this.timersb);
    clearTimeout(this.timerxl);
  },
};
</script>

<style lang="less" scoped>
.homeMiddleBot {
  .UnitFrame{
    padding-bottom:0.05rem;
	}
	
  .UnitDiv {
    position: relative;
    height: 100%;
    background: url("../../../../../static/img/newhome/04/6.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .bottomDiv {
    position: relative;
    height: 100%;
    background: url("../../../../../static/img/newhome/04/6.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .pressureDiv:hover {
    background: rgba(51, 151, 235, 0.15);
  }

}

</style>
