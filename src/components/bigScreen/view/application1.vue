<template>
	<div class="appDiv1">
		<div class="appMenu">
			<div class="appComponts">
        
				<!-- 左侧列表 -->
				<div class="appCompontsContLeft fade-in-right4" style="margin-left: 0px;" :style="{'margin-right': (listWidth != 0.15?0:0.4) +'rem !important'}">
					<div class="UnitFrame fade-in-right1" style="height: 100%;padding: 0">
            <div :class="listWidth != 0.15 ? 'appCompontsContLeftlistF':'appCompontsContLeftlistT'" v-show="listWidth != 0.15"  >
              <div class="UnitDivBigtitle">{{panelName}}</div>
			        <div style="height: calc(100% - 0.55rem);">
			        	<menuListPage></menuListPage>
			        </div>
						</div>
            <div  :class="listWidth != 0.15? 'imgF':'imgT'">
            	<div style="position: relative;top: 43%;">
	              <Icon @click="listShow" :type="listIcon" size='32' color="#fff" style="cursor: pointer;opacity: 0;" />
            	</div>
            </div>
					</div>
				</div>
				
				<!-- 左侧详情框 -->
				<div v-show="leftFlag" class="appCompontsContLeft fade-in-right4" :style="{width:leftwidth+'rem'}" style="margin-left: 0px">
					<div class="appCompontsContLeftDivJn">
						<div style="height: 100%;">
							<component :is="leftComponentName" v-bind:detailData="detailData"></component>
						</div>
					</div>
				</div>
				<div class="appCompontsContRightTT" :style="{width:'calc(100% - '+ (rightwidth + leftwidth+0.2) +'rem' +')'}">
					<!-- 地图部分 -->
					<div :class="!botFlag ? 'appCompontsContMapF' : 'appCompontsContMapT'">
						<div class="appCompontsContMapDiv">
							<!-- <newMap ref="newMap"></newMap> -->
						</div>
					</div>
					<!-- 底部详情框 -->
					<div v-if="botmComponentName != ''" class="appCompontsContDetail fade-in-upJn">
						<div class="appCompontsContDetailDiv">
							<div style="height: 100%;">
								<component :is="botmComponentName" v-bind:detailData="detailData"></component>
							</div>
						</div>
					</div>
				</div>

				<!-- 右侧详情框 -->
				<div v-show="rightFlag" class="appCompontsContLeft fade-in-right4" :style="{width:rightwidth+'rem'}">
					<div class="appCompontsContLeftDivJn">
						<div style="height: 100%;">
							<component :is="rightComponentName" v-bind:detailData="detailData"></component>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>


<script>
  import bus from "../../../eventBus.js";
import menuListPage from "../component/publics/menuListPage";

export default {
  name: "application1",
  components: {
    menuListPage
  },
  watch: {
    // 监测路由变化,只要变化了就获取路由参数重新加载菜单
    $route(to, from) {
        var _this = this;
        // to为跳转之后的路由
        var menuid = this.$route.query.id;
	    _this.$nextTick(() => {
	    	_this.getMenus(menuid);
	    })
    }
  },
  props: {},
  data() {
    return {
      panelName:"",
      leftwidth: 3,
      rightwidth: 3,
      listWidth: 0.15,
      listIcon:'ios-arrow-forward',
      leftTitleName: "",
      botmTitleName: "",
      rightTitleName: "",
      leftComponentName: "",
      botmComponentName: "",
      rightComponentName: "",
      detailData: {},
      
      botFlag: false,
      leftFlag: true,
      rightFlag: true,


      list: [],
      currentindex: -1,
	    
    };
  },
  methods: {
    getMenus(menuid) {
      var _this = this;

      _this.leftComponentName = "";
      _this.leftTitleName = "";
      _this.rightComponentName = "";
      _this.rightTitleName = "";
      _this.botmComponentName = "";
      _this.botmTitleName = "";
	    _this.panelName = "";
      _this.botFlag = false;
      
    },
    // 箭头收缩
    listShow(){
      if(this.listWidth == 0.15){ //收缩状态
        this.listWidth = 3.15;
        this.listIcon = "ios-arrow-back";
      }else{
        this.listWidth = 0.15; //展开状态
        this.listIcon = "ios-arrow-forward";
      }
      setTimeout(function(){
        bus.$emit("drawR")
      },100)
    },
    
  },

  mounted() {
    let _this = this;
    var menuid = this.$route.query.id; //序号（id）

  },
  beforeDestroy() {
  },
  destroyed(){
  }
};

</script>

<style lang="less" scoped>
.appDiv1 {
    width: calc(100% - 0.1rem);
    height: calc(100% - 0.65rem);
    position: relative;
    padding: 0.05rem;
    
    .imgT {
        display: inline-block;
        position:  absolute;
        height: 100%;
        background-image:url("../../../../static/img/newhome/侧边展开.png");
        background-repeat: no-repeat;
        background-size:100% 100%;
        left: 0rem;
    }

    .imgF {
        display: inline-block;
        position:  absolute;
        top: 0rem;
        height: 100%;
        left: 2.76rem;
        z-index: 99;
    }

    .navtrans-navlist-title {
        margin-top: -0.7rem !important;
    }
    
    .appMenu{
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        overflow-y: hidden;
        position: absolute;
    }
    
    .appComponts{
        float: left;
        width: 100%;
        height: 100%;
        position: relative;

        .appCompontsContLeft{
            height: 100%;
            float: left;
	          margin-left: 0.1rem;
            padding-top: 0rem;
        }
        .appCompontsContLeftlistT{
            display: inline-block;
            overflow-y:auto;
            background-image: url("../../../../static/img/newhome/bg_left.png"); 
            background-repeat: no-repeat;
            background-size:90% 100%;
            height: 100%;
            width: 2.76rem;
        }
    
        .appCompontsContLeftlistF{
            display: inline-block;
            overflow-y:auto;
            background-image: url("../../../../static/img/newhome/侧边收缩.png"); 
            background-repeat: no-repeat;
            background-size:100% 100%;
            height: 100%;
            width: 2.00rem;
        }
    
        .appCompontsContLeftDivJn{
            width: 100%;
            height: 100%;
            position: relative;
        }

        .appCompontsContRightTT {
            height: 100%;
            float: left;
            padding: 0.05rem;
        }
        
        .appCompontsContMapT{
            width: 100%;
            height: 65%;
        }
        .appCompontsContMapF{
            width: 100%;
            height: 100%;
        }
        .appCompontsContMapDiv{
            border: 1px solid #01bfc2;
            border-radius: 0.2rem;
            // background: #0f336a;
            height: 100%;
            position: relative;
        }
        .appCompontsContDetail{
            width: 100%;
            height: 35%;
            padding-bottom: 0.1rem;
        }
        .appCompontsContDetailDiv{
            height: 100%;
            margin-left: 0.1rem;
            position: relative;
        }
    }

    .UnitFrame{
    	width: 100%;
    	height: 25%;
    	padding: 0 0.1rem 0.1rem 0.1rem;
    }

    .UnitDivBigtitle{
        height: 0.4rem;
        width: 2.0rem;
        line-height: 0.4rem;
        border-radius: 10px 10px 0px 0px;
        font-size: 0.22rem;
        color: #ffffff;
        font-weight: bold;
        padding-left: 0.210834rem;
        border-bottom: 1px solid #49afd3;
    }

}
    
</style>
