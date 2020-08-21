<template>
  <div class="bgDiv" style="height: 100%; width: 100%;">
    <div class="bottomDiv" style="height: 100%;float: left;width: 50%;">
      <div class="jxTitle">
        <span class="titleText">压力动态</span>
      </div>
      <div style="height: calc(100% - 0.8rem);margin-top: -0.1rem;">
        <div style="position: relative;width: 100%;overflow: hidden;padding:0 0.05rem" 
        :style="{top: noticeTopsb + 'px'}" :class="{transitionTop: isActivesb}" >
          <div :key="index" v-for="(item,index) in yhList" class="pressureDiv" style="cursor: pointer;line-height:0.35rem;">
            <div style="font-size: 0.16rem;color: #2d8cf0;font-weight: bolder;text-align: left;">
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
        {id:1,name:'测试数据1111111'},
        {id:2,name:'测试数据2222222'},
        {id:3,name:'测试数据3333333'},
        {id:4,name:'测试数据4444444'},
        {id:5,name:'测试数据5555555'},
        {id:6,name:'测试数据6666666'},
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

  .jxTitle {
    height: 0.5rem;
    text-align: left;
    padding: 0.1rem 0 0 0.25rem;
    .titleText {
      font-size: 0.16rem;
      font-weight: bolder;
      color: #ffffff;
    }
  }
  .childTitle {
    height: 0.5rem;
    text-align: left;
    .titleText {
      font-size: 0.16rem;
      font-weight: bolder;
      color: #00fbff;
      margin-left: 0.3rem;
    }
  }

  .bottomDiv {
    position: relative;
    height: 100%;
    background: url("../../../../../static/img/newhome/xian/县-下.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .leftImg {
    height: 0.4rem;
  }
  .spanUnit {
    display: block;
    font-size: 0.16rem;
    color: #ffffff;
    font-weight: bolder;
  }
  .spanValue {
    display: block;
    margin-top: -0.05rem;
    font-size: 0.16rem;
    color: #00ff00;
    font-weight: bolder;
  }
  .span1 {
    font-size: 0.16rem;
    font-weight: normal;
    color: orange;
  }
  .span2 {
    font-size: 0.16rem;
    font-weight: bolder;
    color: #ffffff;
  }
  .span3 {
    font-size: 0.16rem;
    font-weight: normal;
    color: #2d8cf0;
  }
  .div1 {
    position: absolute;
    top: 0.41rem;
    margin-left: 0.15rem;
  }
  .div2 {
    display: inline-block;
    margin-left: 0.1rem;
  }
  .div3 {
    text-align: left;
    line-height: 0.25rem;
  }
  .split-line1 {
    width: 89%;
    border-bottom: 1px dashed rgba(87, 163, 243, 0.5);
    margin-left: 25px;
  }
  .yhDiv:hover {
    background: rgba(51, 151, 235, 0.15);
  }
  .pressureDiv:hover {
    background: rgba(51, 151, 235, 0.15);
  }
</style>
