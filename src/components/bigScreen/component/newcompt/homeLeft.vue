<template>
  <div class="homeLeft" style="width: 100%;height: 100%;">
    <div
      class="UnitFrame fade-in-right1"
      style="height: 25%;float: left;width: 100%;"
    >
      <div class="UnitDiv UnitDiv_bg6">
        <Row style="margin-top:0.3rem;position:absolute;width:100%;">
          <Col span="8" style="text-align: center;">
            <i-circle
              :percent="30"
              trail-color="#1B566E"
              stroke-color="#ba9520"
              :size="80"
              dashboard
            >
              <span
                class="demo-circle-inner"
                style="font-size:24px;color:#ba9520"
                >30%</span
              >
            </i-circle>
            <div style="color:#ba9520">未处理</div>
          </Col>
          <Col span="8" style="text-align: center;">
            <i-circle
              :percent="50"
              trail-color="#1B566E"
              stroke-color="#37A2DA"
              :size="80"
              dashboard
            >
              <span
                class="demo-circle-inner"
                style="font-size:24px;color:#37A2DA"
                >50%</span
              >
            </i-circle>
            <div style="color:#37A2DA">处理中</div>
          </Col>
          <Col span="8" style="text-align: center;">
            <i-circle
              :percent="80"
              trail-color="#1B566E"
              stroke-color="#40dd0f"
              :size="80"
              dashboard
            >
              <span
                class="demo-circle-inner"
                style="font-size:24px;color:#40dd0f"
                >80%</span
              >
            </i-circle>
            <div style="color:#40dd0f">已处理</div>
          </Col>
        </Row>
      </div>
    </div>
    <div
      class="UnitFrame fade-in-right1"
      style="height: 25%;float: left;width: 100%;"
    >
      <div class="UnitDiv UnitDiv_bg6">
        <div
          style="width: 100%;height: calc(100%);position: relative;"
        >
          <div class="notice">
            <div class="wrap">
              <div
                style="height:calc(100% - 0.1rem);overflow: hidden;position: relative;margin: 0.05rem;left: 0.05rem;"
                :style="{ width: tempWid + 'px' }"
              >
                <ul
                  style="position: absolute;width: 9999px;height: 100%;"
                  :style="{ left: noticeRight + 'px' }"
                  :class="{ transitionLeft: animate  }"
                >
                  <li
                    :style="{ width: tempWid + 'px', display: 'inline-block' }"
                    class="carousel_DivList"
                    v-for="(item, index) in noticeList"
                    :key="index"
                  >
                    <div class="carousel_Title">
                      {{ item.number }}
					  (<span style="color: rgb(255,140,0);">待巡查</span>)
                    </div>
                    <div class="carousel_date">
                      {{ item.realstarttime }}
                    </div>
                    <div class="carousel_main">
                      <div
                        style="width: 60%;height: 100%;display: inline-block;float: left;padding-left: 20px;"
                      >
                        <Timeline>
                          <TimelineItem>
                            <p
                              class="carousel_length"
                              style="text-align: left;"
                            >
                              <span class="carousel_name">问题数量：</span>
                              <span class="carousel_value"
                                >{{ item.problemcount }}个</span
                              >
                            </p>
                          </TimelineItem>
                          <TimelineItem>
                            <p
                              class="carousel_length"
                              style="text-align: left;"
                            >
                              <span class="carousel_name">巡查道路：</span>
                              <span class="carousel_value">{{
                                item.roadsname
                              }}</span>
                            </p>
                          </TimelineItem>
                        </Timeline>
                      </div>
                      <div
                        style="width: 40%;height: 100%;display: inline-block;text-align: center;"
                      >
                        <div>
                          <Icon
                            type="ios-person-outline"
                            size="30"
                            color="#307bcc"
                            style="font-weight: 600;"
                          />
                        </div>
                        <div style="color:#307bcc">
                          {{ item.xcrname }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="UnitFrame fade-in-right1"
      style="height: 50%;float: left;width: 100%;"
    >
      <div class="UnitDiv UnitDiv_bg3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "homeRight",
  components: {},
  data() {
    return {
      timerrt: null,
      animate : true,
      noticeList: [
        {
          number: "20201016123425",
          realstarttime: "2020-10-16",
          problemcount: "2",
          roadsname: "春江路1",
          xcrname: "张三"
        },
        {
          number: "20201016123425",
          realstarttime: "2020-10-16",
          problemcount: "3",
          roadsname: "春江路2",
          xcrname: "张三"
        },
        {
          number: "20201016123425",
          realstarttime: "2020-10-16",
          problemcount: "4",
          roadsname: "春江路3",
          xcrname: "张三"
        }
      ],
      noticeRight: 0,
      tempWid: 0
    };
  },
  methods: {
    settimeoutsr() {
      let _this = this;

      let wid = document.body.clientWidth; //屏幕宽度
      _this.tempWid = wid * (8 / 24) * 0.9 - 30 - 35 - 30;

      let index = 1, list = this.noticeList;
         
      const timerrt = setInterval(() => {
        if (index - 1 == list.length) {
          index = 1;
        }

        let dom = document.getElementsByClassName("carousel_DivList");
        for (let i = 0; i < dom.length; i++) {
          dom[i].classList.remove("activeList");
        }
        if (dom.length > 0) {
          _this.noticeRight = -dom[0].offsetWidth;
          dom[0].classList.add("activeList");
        }

        _this.noticeList.push(list[index - 1]);
        _this.animate  = true;



                   
        setTimeout(function() {
          _this.animate  = false;
          _this.noticeRight = 0;
          _this.noticeList.splice(0, 1);
          for (let i = 0; i < dom.length; i++) {
            dom[i].classList.remove("activeList");
          }
        }, 2000);
        index++;
      }, 5000);

      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timerrt);
      });
    }
  },
  mounted() {
    var _this = this;
    this.settimeoutsr();
  }
};
</script>

<style lang="less" scoped>
.homeLeft {
  .UnitFrame {
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

  .carousel_DivList {
    float: left;
    margin: 0 auto;
    height: 100%;
    background: url("../../../../../static/img/newhome/list-bg-3.png") no-repeat;
    background-size: 100% 100%;
    .carousel_Title {
      color: #cccc39;
      height: 30px;
      line-height: 30px;
      font-weight: bold;
      text-align: center;
    }
    .carousel_date {
      color: #67aae4;
      height: 25px;
      line-height: 25px;
      font-family: fantasy;
      font-size: 12px;
      text-align: center;
    }
    .carousel_main {
      height: calc(~'100% - 60px');
      width: 100%;
      padding-top: 10px;
    }
    .carousel_name {
      color: #4ba5f5;
    }
    .carousel_value {
      color: #a9cdec;
    }
    .ivu-timeline-item {
      padding: 0 !important;
    }
  }

  .notice {
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;

    .wrap {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
    .wrapDiv {
      position: relative;
    }
  }

  .activeList {
    -webkit-animation: roll-out-left 2s;
    animation: roll-out-left 2s;
  }
  @keyframes roll-out-left {
    0% {
      transform: translateX(0%) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateX(-100%) rotate(-90deg);
      opacity: 0;
    }
  }
  @-webkit-keyframes roll-out-left {
    0% {
      -webkit-transform: translateX(0%) rotate(0deg);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateX(-100%) rotate(-90deg);
      opacity: 0;
    }
  }
}
</style>
