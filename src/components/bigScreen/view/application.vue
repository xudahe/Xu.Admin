<template>
	<div class="appDiv2 appMenu1">

      <!-- 左侧菜单 -->
			<div class="appMenu push-in-right">
				<div :key="index" v-for="(item,index) in menuData" :style="index==0 ? {margintop: '0.15rem'}:''"
				 @click="changeMenu(item,index)" :class="[menuFlag == index ? 'menuCont menuSel' : 'menuCont menuNor']">
					<div class="menuImg">
						<img :src="menuFlag == index ? item.imgT : item.imgF" class="menuContImg" />
					</div>
					<div class="menuContText"><span :class="menuFlag==index? 'actives':''">{{item .menuname}}</span></div>
				</div>
			</div>
      
			<div id="appComponts" class="appComponts" :style="{width:'calc(100% - 1.60rem)'}">

        <!-- 左侧列表框 -->
				<div id="leftMenu" class="appCompontsContLeft fade-in-right" :style="{width: leftWidth +'rem'}" v-show="isLeftMenu">
					<div class="appCompontsContLeftDiv">
						<div class="titleCont titleContImg">
							<div class="titleContText">{{titleName}}</div>
							<div style="position: absolute;top: 20%;right: 0.15rem;">
								<img class="closeImg" :src="closeImg" v-on:mouseover="changeImg(1,1)" v-on:mouseout="changeImg(1,2)" @click="detailclose('leftMenu')" />
							</div>
						</div>
						<div style="height: calc(100% - 0.4rem);margin-top: 0.4rem;">
							<component :is="componentName" v-bind:detailData="detailData"></component>
						</div>
					</div>
				</div>

        <!-- 左侧详情框 -->
				<div class="appCompontsContLeft fade-in-right"  style="width:3.2rem" v-show="isDetailDataLeft">
					<div class="appCompontsContLeftDiv">
						<div class="titleCont titleContImg">
							<div class="titleContText">{{titleLeftName}}</div>
							<div style="position: absolute;top: 20%;right: 0.15rem;">
								<img class="closeImg" :src="closeImg1" v-on:mouseover="changeImg(2,1)" v-on:mouseout="changeImg(2,2)" @click="detailclose('leftdetail')" />
							</div>
						</div>
						<div :style="{height: 'calc(100% - 0.4rem)',marginTop: '0.4rem'}">
							<component :is="componentLeftDetail" v-bind:detailData="leftDetailData"></component>
						</div>
					</div>
				</div>

				<!-- 全屏框/半框 -->
				<div style="float: left;height: 100%;" :style="{width: screenWidth,paddingRight: screenWidth == '49%' ? '0.1rem':'0rem'}" v-show="isDetailScreen">
					<div class="appCompontsScreen scale-in">
						<div class="titleCont titleContImgT" style="width:100%">
							<div class="titleContText">{{titleScreenName}}</div>
							<div style="position: absolute; top: 20%; bottom: 0; right: 0.15rem;">
								<img class="closeImg" :src="closeImg" v-on:mouseover="changeImg(1,1)" v-on:mouseout="changeImg(1,2)" @click="detailclose('screendetail')" />
							</div>
						</div>
						<div style="height: calc(100% - 0.4rem);margin-top: 0.4rem;">
							<component :is="componentScreenName" v-bind:detailData="screenDetailData"></component>
						</div>
					</div>
				</div>
        
        <!-- 中间地图部分 -->
				<div style="position:absolution;float: left;" :style="{height: mapHeight,width: mapWidth}" v-show="isMapShow">
					<div class="appCompontsContMap scale-in">
					
					</div>
				</div>

        <!-- 底部详情框 -->
				<div  class="appCompontsContDetail fade-in-up" :style="{height: '50%',width: 'calc(100% - '+ leftWidth +'rem)'}" v-show="isDetailDataBotm">
					<div class="appCompontsContDetailDiv">
						<div class="titleCont titleContImg" style="width: 100%;">
							<div class="titleContText">{{titleBotmName}}	</div>
							<div style="position: absolute;top: 20%;right: 0.15rem;">
								<img class="closeImg" :src="closeImg1" v-on:mouseover="changeImg(2,1)" v-on:mouseout="changeImg(2,2)" @click="detailclose('botmdetail')" />
							</div>
						</div>
						<div style="height: calc(100% - 0.4rem);margin-top: 0.4rem;">
							<component :is="componentBotmDetail" v-bind:detailData="botmDetailData"></component>
						</div>
					</div>
				</div>

				<!-- 右侧详情框 -->
				<div class="appCompontsContLeft fade-in-left1" v-show="isDetailDataRight">
					<div class="appCompontsContLeftDiv">
						<div class="titleCont titleContImg">
							<div class="titleContText">{{titleRightName}}</div>
							<div style="position: absolute;top: 20%;right: 0.15rem;">
								<img class="closeImg" :src="closeImg1" v-on:mouseover="changeImg(2,1)" v-on:mouseout="changeImg(2,2)" @click="detailclose('rightdetail')" />
							</div>
						</div>
						<div style="height: calc(100% - 0.4rem);margin-top: 0.4rem;">
							<component :is="componentRightDetail" v-bind:detailData="rightDetailData"></component>
						</div>
					</div>
				</div>

			</div>

	</div>
</template>


<script>
  import bus from "../../../eventBus.js";
	
	export default {
		name: "application",
		components: {
		},
		watch: {
			// 监测路由变化,只要变化了就获取路由参数重新加载菜单
			$route(to, from) {
				var _this = this;
				// to为跳转之后的路由

				var menuid = this.$route.query.id
				_this.getMenus(menuid);
				_this.detailclose("leftMenu");
				_this.menuFlag = -1;
			}
		},
		props: {},
		data() {
			return {
				menuFlag: -1,
				menuData: [],
				componentName: "",
				componentBotmDetail: "", //底部详情
        componentLeftDetail: "", //左侧详情
        componentRightDetail: "",//右侧详情
        componentScreenName: "", //全屏

				isDetailDataLeft: false,
				titleName: "",
				titleLeftName: "",
        titleBotmName: "",
        titleRightName: "",
        titleScreenName: "",

				closeImg: require("../../../../static/img/newhome/btn_Close_n.png"),
				closeImg1: require("../../../../static/img/newhome/btn_Close_n.png"),
				isLeftMenu: false,
        detailData: {},
        
        botmDetailData: {},
        rightDetailData: {},
        leftDetailData: {},
        screenDetailData: {},

        leftWidth: 3.2, //左侧列表宽度
        screenWidth: '100%',
        mapWidth: '100%',
        mapHeight: '100%',
        
        isDetailDataLeft: false,
        isDetailDataBotm: false,
        isDetailDataRight: false,
        isDetailScreen: false,
        
				isMapShow:true,
			};
		},
		methods: {
			changeMenu(item, index) {
				var _this = this;
        _this.menuFlag = index;
				_this.componentName = item.classname;
        _this.titleName = item.menuname;
			
				_this.isMapShow = true; //地图显示

        _this.isLeftMenu = false;
        _this.isDetailScreen = false;
        _this.isMapShow = true;
        
        _this.detailclose();

        switch (item.menuname) {
          case "二级菜单1":
          case "二级菜单4":
          case "二级菜单5":
            _this.isLeftMenu = true;
            _this.leftWidth = 3.2 + 0.1;
            _this.mapWidth = 'calc(100% - '+ _this.leftWidth +'rem' +')';
            _this.titleLeftName = item.menuname;
            break;
          case "二级菜单2":
            _this.isDetailScreen = true;
            _this.screenWidth = '49%';
            _this.mapWidth = '51%';
            _this.titleScreenName = item.menuname;
            break;
          case "二级菜单3":
            _this.isMapShow = false;
            _this.isDetailScreen = true;
            _this.screenWidth = '100%';
            _this.mapWidth = '0%';
            _this.titleScreenName = item.menuname;
            break;
        }
			
			},
			detailclose(type) {
				this.isMapvisible = true; //关闭组件时，将地图显示出来

				if (type == "leftMenu") {
					this.isLeftMenu = false;
          this.leftWidth = 0;
          this.mapWidth = '100%';
				}
				else if (type == "leftdetail") {
					this.leftWidth = 3.2 + 0.1;
					this.isDetailDataLeft = false;
				}
				else if (type == "botmdetail") {
          this.mapHeight = '100%';
					this.isDetailDataBotm = false;
        }
        else if (type == "screendetail") {
          this.mapWidth = '100%';
					this.isDetailScreen = false;
				}
        else if (type == "rightdetail") {
          this.isDetailDataRight = false;
        }
        else {
          this.leftWidth = 0;
          this.isDetailDataLeft = false;
          this.isDetailDataBotm = false;
          this.isDetailDataRight = false;
        }
				this.closeImg = this.closeImg1 = "../../../../static/img/newhome/btn_Close_n.png";
			},
			changeImg(type, flag) {
				if (type == "1")
					this.closeImg  = "../../../../static/img/newhome/"+ (flag == 1 ?"btn_Close_h.png":"btn_Close_n.png")
        if (type == "2")
          this.closeImg1 = "../../../../static/img/newhome/"+ (flag == 1 ?"btn_Close_h.png":"btn_Close_n.png")
			},
			getMenus(menuid) {
				var _this = this;
				_this.menuData = [];
			  let children = [
          {id:1,classname:"test1",menuname:"二级菜单1",img:"",systemid:32,},
          {id:2,classname:"classname",menuname:"二级菜单2",img:"",systemid:32,},
          {id:3,classname:"classname",menuname:"二级菜单3",img:"",systemid:32,},
          {id:3,classname:"test2",menuname:"二级菜单4",img:"",systemid:32,},
          {id:3,classname:"test3",menuname:"二级菜单5",img:"",systemid:32,},
        ]
				for (let l = 0; l < children.length; l++) {
					_this.menuData.push({
						classname: children[l].classname,
						id: children[l].id,
						img: children[l].img,
						menuname: children[l].menuname,
						systemid: children[l].systemid,
						imgT: "../../static/img/newhome/icon_inspection_s.png",
						imgF: "../../static/img/newhome/icon_inspection_n.png",
					})
				}
							
			},
		},
		mounted() {
			let _this = this;
      
      // 返回列表页
			bus.$off("showLeftMenu");
			bus.$on("showLeftMenu", function() {
				_this.isLeftMenu = true;
        _this.isDetailDataLeft = false;
        _this.mapWidth = 'calc(100% - '+ _this.leftWidth +'rem' +')';
      });

      //左侧详情页
			bus.$off("leftDetail");
			bus.$on("leftDetail", function(value, item, title) {
        _this.isDetailDataLeft = true;
        _this.mapWidth = 'calc(100% - '+ (_this.leftWidth + _this.leftWidth + 0.1) +'rem' +')'
        _this.leftDetailData = item;
        _this.componentLeftDetail = value;
        _this.titleLeftName = title;
      });

      //底部详情页
			bus.$off("botmDetail");
			bus.$on("botmDetail", function(value, item, title) {
        _this.isDetailDataBotm = true;
        _this.mapHeight = '50%';
        _this.mapWidth = 'calc(100% - '+ (_this.leftWidth) +'rem' +')'
				_this.botmDetailData = item;
				_this.componentBotmDetail = value;
				_this.titleBotmName = title;
      });
      
			// 右侧详情页
			bus.$off("rightDetail");
			bus.$on("rightDetail", function(value, item, title) {
        _this.isDetailDataRight = true;
				_this.rightDetailData = item;
				_this.componentLeftDetail = value;
				_this.titleRightName = title;
			});

      //关闭详情框
			bus.$off("detailclose");
			bus.$on("detailclose", function(value) {
				_this.detailclose(value);
      });
      
			var menuid = this.$route.query.id; //序号（id）
			_this.getMenus(menuid);

			_this.detailclose("leftMenu");
			_this.menuFlag = -1;

		},
	}
</script>

<style lang="less">
.appDiv2 {
    width: 100%;
    height: calc(100% - 0.6rem);
    position: relative;
    padding: 0.1rem;

    .appMenu{
      width: 1.6rem;
      height: 100%;
      // background-color: #013282;
      border-right: none;
      float: left;
      overflow-y: auto;
      background-image: url("../../../../static/img/newhome/02/bg_left.png");
      background-size: 100% 100%;
    }
    .appMenu1{
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: hidden;
        position: absolute;
    }
    .menuCont{
      position: relative;
      cursor: pointer;
      padding-top: 0.1rem;
    }
    .menuSel {
        background-image: url("../../../../static/img/newhome/02/bg_选项_sel.png");
        background-size: 100% 100%;
        margin: 0.15rem;
        height: 0.35rem;
    }
    .menuNor {
        background-image: url("../../../../static/img/newhome/02/bg_选项_nor.png");
        background-size: 100% 100%;
        margin: 0.15rem;
        height: 0.35rem;
    }
    .menuImg{
      width: 0.2rem;
      height: 0.2rem;
      position: relative;
      left: 0.15rem;
      float: left;
    }
    .menuContImg{
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .menuContText{
    font-size: 0.12rem;
    color: #9db8e5ba;
    font-weight: bold;
    text-align: left;
    padding-top: 0rem;
    padding-left: 0.45rem;
    }
    .menuContText .actives{
       color: #ffffff; 
    }
    .appComponts{
      float: left;
      width: 100%;
      height: 100%;
      position: relative;
      padding-left: 0.1rem;
    .appCompontsContLeft{
      width: 100%;
      height: 100%;
      float: left;
      padding-right: 0.1rem;
    }
    .appCompontsContLeftDiv{
      border-radius: 0.2rem;
      background: none;
      width: 100%;
      height: 100%;
      float: left;
      position: relative;
      background-image: url("../../../../static/img/newhome/02/底部bg-06.png");
      background-size: 100% 100%;
    }

    .appCompontsScreen{
      border: 1px solid #285fa3;
      border-radius: 0.2rem;
      background: transparent;
      width: 100%;
      height: 100%;
      float: left;
      position: relative;
    }

    .appCompontsContRight {
      height: 100%;
      float: left;
    }

    .appCompontsContMap{
      border: 1px solid #2962ab;
      border-radius: 0.2rem;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .appCompontsContDetail{
      width: 100%;
      height: 50%;
      padding-top: 0.1rem;
      float: left;
    }

    .appCompontsContDetailDiv{
      height: 100%;
      border: 1px solid rgba(255,0,0,0);
      border-radius: 0.2rem;
      position: relative;
      background: url("../../../../static/img/newhome/02/底部bg-2.png");
      background-repeat: no-repeat;
      background-size: 101% 100%;
    }
    
    .titleCont {
      position: absolute;
    }
    
    .titleContImg {
      width: 3.2rem;
      height: 0.4rem;
      line-height: 0.4rem;
      border-radius: 10px 10px 0px 0px;
      border-bottom: 1px solid #0161ba;
    }
    .titleContImgT {
      height: 0.4rem;
      line-height: 0.4rem;
      background: #0052b0;
      border-radius: 10px 10px 0px 0px;
      border-bottom: 1px solid #0161ba;
    }
    
    .titleContText {
      position: absolute;
      top: 0;
      font-size: 0.14rem;
      color: #ffffff;
      font-weight: bold;
      left: 0.15rem;
      float: left;
    }
    
    .closeImg {
      height: 0.25rem;
      float: right;
    }
  }
}

</style>
