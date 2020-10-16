<template>
  <div class="homeMiddleBot" style="height: 100%; width: 100%;">
    <div class="UnitFrame rotate-in-x" style="height: 100%;float: left;width: 50%;">
			<div class="UnitDiv">
        <div>
          <div style="position: relative;width: 100%;height:100%;overflow: hidden;padding:0 0.15rem" :style="{top: noticeTopsb + 'px'}" :class="{transitionTop: isActivesb}" >
            <div :key="index" v-for="(item,index) in yhList" class="pressureDiv" style="cursor: pointer;line-height:0.35rem;">
              <div style="font-size: 0.14rem;color: #2d8cf0;font-weight: bolder;text-align: left;">
                <Row>
                  <Col :span="12">
                    <span>时间:</span>
                    <span class="span2" style="margin-right: 0rem;">2020-08-20</span>
                  </Col>
                  <Col :span="12">
                    <span>信息:</span>
                    <span class="span3" style="color: #fff65a">{{item.name}}</span>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
			</div>
    </div>

    <div class="UnitFrame rotate-in-x" style="height: 100%;float: left;width: 50%;">
			<div class="UnitDiv">
        	<div id="ordernoticeHei" style="width: 100%;height: calc(100%);position: relative;">
						<div class="notice">
							<div class="wrap">
								<div style="height:calc(100% - 0.1rem);overflow: hidden;position: relative;margin: 0.05rem;left: 15px;" :style="{width: tempWid+'px'}">
									<ul style="position: absolute;width: 9999px;height: 100%;" :style="{left: noticeRight + 'px'}" :class="{transitionLeft: isActive}">
										<li :id="'orderList'+index" style="display: inline-block;" :style="{width: tempWid + 'px'}" class="carousel_DivList"
										 v-for="(item, index) in noticeList" :key="index">
											
                      <div class="carousel_Title">
                        {{item.number}}(<span style="color: rgb(255,140,0);">待巡查</span>)
                      </div>
											<div class="carousel_date">
												{{item.realstarttime}}
											</div>
											<div class="carousel_main">
												<div style="width: 60%;height: 100%;display: inline-block;float: left;padding-left: 20px;">
													<Timeline>
														<TimelineItem>
															<p class="carousel_length" style="text-align: left;">
																<span class="carousel_name">问题数量：</span>
																<span class="carousel_value">{{item.problemcount}}个</span>
															</p>
														</TimelineItem>
														<TimelineItem>
															<p class="carousel_length" style="text-align: left;">
																<span class="carousel_name">巡查道路：</span>
																<span class="carousel_value">{{item.roadsname}}</span>
															</p>
														</TimelineItem>
													</Timeline>
												</div>
												<div style="width: 40%;height: 100%;display: inline-block;text-align: center;">
													<div>
														<Icon type="ios-person-outline" size="30" color="#307bcc" style="font-weight: 600;" />
													</div>
													<div style="color:#307bcc">
														{{item.xcrname}}
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

      timersb: null,
      timerxl: null,

      timerrt: null,
 
      isActivesb: true,// 是否显示transitionTop动画
      noticeTopsb: 0,
    
      isActive: true,
      noticeList: [
       {number:'20201016123425',realstarttime:'2020-10-16',problemcount:'2',roadsname:'春江路1',xcrname:'张三'},
       {number:'20201016123425',realstarttime:'2020-10-16',problemcount:'3',roadsname:'春江路2',xcrname:'张三'},
       {number:'20201016123425',realstarttime:'2020-10-16',problemcount:'4',roadsname:'春江路3',xcrname:'张三'},
      ],
      noticeRight: 0,
      tempWid: 0,
    };
  },
  methods: {
    settimeoutsl() {
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
        }, 2500);
        index++;
        
      }, 5000);

    },
    settimeoutsr(){
      let _this = this

      	let wid = document.body.clientWidth; //屏幕宽度
		  	_this.tempWid = wid * (8 / 24) * 0.9 - 30 - 35 - 10 - 35;
        
				let index = 1,list = this.noticeList;
				_this.timerrt = setInterval(() => {

					if ((index - 1) == list.length) {
						index = 1;
					}
					let dom = document.getElementsByClassName('carousel_DivList');

					for (let i = 0; i < dom.length; i++) {
						dom[i].classList.remove('activeList')
					}
					if (dom.length > 0) {
						let wid = dom[0].offsetWidth;
						_this.noticeRight = -wid;
						dom[0].classList.add('activeList')
					}

					_this.noticeList.push(list[(index - 1)]);
					_this.isActive = true;

					setTimeout(function() {
						_this.isActive = false;
						_this.noticeRight = 0;
						_this.noticeList.splice(0, 1);
						for (let i = 0; i < dom.length; i++) {
							dom[i].classList.remove('activeList')
						}
					}, 2500)
					index++;

				}, 5000);
    },
  },
  mounted() {
    var _this = this;
    this.settimeoutsl();
    this.settimeoutsr();
  },
  beforeDestroy() {
    clearInterval(this.timersb);
    clearTimeout(this.timerxl);
    
    clearInterval(this.timerrt);
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
  
  
  .carousel_DivList{
		float: left;
		margin: 0 auto;
		height: 100%;
		background: url("../../../../../static/img/newhome/list-bg-3.png") no-repeat;
		background-size: 100% 100%;
		.carousel_Title{
			color: #cccc39;
			height: 30px;
			line-height: 30px;
      font-weight: bold;
      text-align: center;
		}
		.carousel_date{
			color: #67aae4;
			height: 25px;
			line-height: 25px;
			font-family: fantasy;
      font-size: 12px;
      text-align: center;
		}
		.carousel_main{
      height: calc(100% - 60px);
      width: 100%;
      padding-top: 10px;
		}
		.carousel_name{
			color: #4ba5f5;
		}
		.carousel_value{
			color: #a9cdec;
		}
		.ivu-timeline-item{
			padding: 0 !important;
		}
  }
  
  .notice{
	  display: flex;
	  justify-content: center;
    height: 100%;
    width: 100%;

	  .wrap{
	    position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
	  }
	  .wrapDiv{
	    position: relative;
	  }
  }
  
  .activeList
	{
	    -webkit-animation: roll-out-left 2.5s;
	            animation: roll-out-left 2.5s;
	}
	@keyframes roll-out-left	{
	    0%{
	        transform: translateX(0%) rotate(0deg);
	        opacity: 1;
	    }
	    100%{
	        transform: translateX(-100%) rotate(-90deg);
	        opacity: 0;
	    }
	}
	@-webkit-keyframes roll-out-left{
	    0%{
	        -webkit-transform: translateX(0%) rotate(0deg);
	        opacity: 1;
	    }
	    100%{
	        -webkit-transform: translateX(-100%) rotate(-90deg);
	        opacity: 0;
	    }
  }

}

</style>
