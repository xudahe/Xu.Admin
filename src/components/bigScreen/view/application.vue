<!-- 布局页面 -->
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
				<div class="appCompontsContLeft fade-in-right" :style="{width: pageWidth +'rem'}" v-show="isLeftMenu">
					<div class="appCompontsContLeftDiv">
						<div class="titleCont titleContImg">
							<div class="titleContText">{{titleName}}</div>
							<div class="titleRight">
                 <Icon class="closeIcon" type="ios-close-circle-outline" @click="detailclose('leftMenu')"/>
							</div>
						</div>
						<div style="height: calc(100% - 0.4rem);margin-top: 0.4rem;">
							<component :is="componentName" v-bind:detailData="detailData"></component>
						</div>
					</div>
				</div>

        <!-- 左侧详情框 -->
				<div class="appCompontsContLeft fade-in-right"  :style="{width: pageWidth +'rem',marginLeft: isDetailDataLeft ? '0.05rem':'0rem'}" v-show="isDetailDataLeft">
					<div class="appCompontsContLeftDiv">
						<div class="titleCont titleContImg">
							<div class="titleContText">{{titleLeftName}}</div>
							<div class="titleRight">
                <Icon class="closeIcon" type="ios-close-circle-outline" @click="detailclose('leftdetail')"/>
							</div>
						</div>
						<div :style="{height: 'calc(100% - 0.4rem)',marginTop: '0.4rem'}">
							<component :is="componentLeft" v-bind:detailData="leftDetailData"></component>
						</div>
					</div>
				</div>

				<!-- 全屏框/半框 -->
				<div style="float: left;height: 100%;" :style="{width: pageWidth,paddingRight: pageWidth == '49%' ? '0.05rem':'0rem'}" v-show="isDetailScreen">
					<div class="appCompontsScreen scale-in">
						<div class="titleCont titleContImgT" style="width:100%">
							<div class="titleContText">{{titleScreenName}}</div>
							<div class="titleRight">
                <Icon class="closeIcon" type="ios-close-circle-outline" @click="detailclose('screendetail')"/>
							</div>
						</div>
						<div style="height: calc(100% - 0.4rem);margin-top: 0.4rem;">
							<component :is="componentName" v-bind:detailData="screenDetailData"></component>
						</div>
					</div>
				</div>
        
        <!-- 中间地图部分 -->
				<div style="position:absolution;float: left;" :style="{height: mapHeight,width: mapWidth,padding: mapadding}" v-show="isMapShow">
					<div class="appCompontsContMap scale-in">
					   <arcgisMap></arcgisMap>
					</div>
				</div>

        <!-- 底部详情框 -->
				<div class="appCompontsContDetail fade-in-up" :class="botmShow ? '':''" :style="{height: botmHeight,width: mapWidth, paddingLeft: isDetailDataBotm && !isDetailScreen ?'0.05rem':'0rem'}" v-show="isDetailDataBotm">
					<div class="appCompontsContDetailDiv">
						<div class="titleCont titleContImg" :style="{borderBottom: botmShow ? '1px solid #0161ba':'none'}">
							<div class="titleContText">{{titleBotmName}}</div>
							<div class="titleRight">
	              <Icon class="closeIcon" :type="botmShow ? 'ios-arrow-dropdown':'ios-arrow-dropup'" @click="detailShow('botmdetail', !botmShow)"/>
                <Icon class="closeIcon" type="ios-close-circle-outline" @click="detailclose('botmdetail')"/>
							</div>
						</div>
						<div style="height: calc(100% - 0.4rem);margin-top: 0.4rem;" v-show="botmShow">
							<component :is="componentBotm" v-bind:detailData="botmDetailData"></component>
						</div>
					</div>
				</div>

				<!-- 右侧详情框 -->
				<div class="appCompontsContLeft fade-in-left1" :style="{width: pageWidth +'rem'}" v-show="isDetailDataRight">
					<div class="appCompontsContLeftDiv">
						<div class="titleCont titleContImg">
							<div class="titleContText">{{titleRightName}}</div>
							<div class="titleRight">
                 <Icon class="closeIcon" type="ios-close-circle-outline" @click="detailclose('rightdetail')"/>
							</div>
						</div>
						<div style="height: calc(100% - 0.4rem);margin-top: 0.4rem;">
							<component :is="componentRight" v-bind:detailData="rightDetailData"></component>
						</div>
					</div>
				</div>

			</div>

	</div>
</template>


<script>
  import bus from "../../../eventBus.js";
  import arcgisMap from "../../../components/arcgis_map/index2.vue";
	
	export default {
		name: "application",
		components: {
      arcgisMap
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
        
        //组件名称
				componentName: "",
				componentBotm: "", //底部详情
        componentLeft: "", //左侧详情
        componentRight: "",//右侧详情
        
        //详情框头部名称
				titleName: "",
				titleLeftName: "",
        titleBotmName: "",
        titleRightName: "",
        titleScreenName: "",
				
        detailData: {},
        botmDetailData: {},
        rightDetailData: {},
        leftDetailData: {},
        screenDetailData: {},

        pageWidth: 3.3, //列表宽度
        mapWidth: '100%',
        mapHeight: '100%',
        mapadding: '0', //中间地图边距
        botmHeight: '50%', //底部详情框高度
        botmShow: true, ////底部详情框显示隐藏
        
        isLeftMenu: false,
        isDetailDataLeft: false,
        isDetailDataBotm: false,
        isDetailDataRight: false,
        isDetailScreen: false,
        
				isMapShow:true, //显示地图
			};
    },
		methods: {
			changeMenu(item, index) {
        var _this = this;
        
        this.menuFlag = index;
				this.componentName = item.classname;
        this.titleName = item.menuname;
			
        this.detailclose();

        switch (item.menuname) {
          case "二级菜单1":
          case "二级菜单4":
          case "二级菜单5":
            this.isLeftMenu = true;
            this.pageWidth = 3.3;
            this.mapadding = '0 0 0 0.05rem';
            this.mapWidth = 'calc(100% - '+ (this.pageWidth) +'rem)';
            this.titleLeftName = item.menuname;
            break;
          case "二级菜单2":
            this.isDetailScreen = true;
            this.pageWidth = '49%';
            this.mapWidth = 'calc(100% - '+ (this.pageWidth) +')';
            this.titleScreenName = item.menuname;
            break;
          case "二级菜单3":
            this.isMapShow = false;
            this.isDetailScreen = true;
            this.pageWidth = '100%';
            this.mapWidth = 'calc(100% - '+ (this.pageWidth) +')';
            this.titleScreenName = item.menuname;
            break;
        }
			},
			detailclose(type) {
        this.isMapShow = true; //关闭组件时，将地图显示出来
        this.mapHeight = '100%';
        
				if (type == "leftMenu") {
					this.isLeftMenu = false;
          this.pageWidth = 0;
          this.mapWidth = '100%';
          this.mapadding = '0';
          this.isDetailDataLeft = false;
          this.isDetailDataRight = false;
          this.isDetailDataBotm = false;
          this.isDetailScreen = false;
				}
				else if (type == "leftdetail") {
          this.mapWidth = 'calc(100% - '+ (this.pageWidth) +'rem)';
   
          this.mapadding = '0 0 0 0.05rem';
          this.isDetailDataLeft = false;
          this.isDetailDataBotm = false;
				}
				else if (type == "botmdetail") {
					this.isDetailDataBotm = false;
        }
        else if (type == "screendetail") {
          this.mapWidth = '100%';
          this.isDetailScreen = false;
          this.isDetailDataBotm = false;
				}
        else if (type == "rightdetail") {
          this.mapWidth = 'calc(100% - '+ (this.pageWidth) +'rem)';
          this.mapadding = '0 0 0 0.05rem';
          this.isDetailDataRight = false;
        }
        else {
        	this.isLeftMenu = false;
          this.pageWidth = 0;
          this.mapWidth = '100%';
          this.mapadding = '0';
          this.isDetailDataLeft = false;
          this.isDetailDataRight = false;
          this.isDetailDataBotm = false;
          this.isDetailScreen = false;
        }
			},
			getMenus(menuid) {
				var _this = this;
				_this.menuData = [];
			  let children = [
          {id:1,classname:"test1",menuname:"二级菜单1",img:"",systemid:32,},
          {id:2,classname:"test1",menuname:"二级菜单2",img:"",systemid:32,},
          {id:3,classname:"test4",menuname:"二级菜单3",img:"",systemid:32,},
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
						imgT: "",
						imgF: "",
					})
				}
							
      },
      detailShow(type,flag){
        if (type == "botmdetail") {
          this.botmShow = flag;
          this.botmHeight = this.botmShow ? '50%': '0.5rem';
          this.mapHeight = 'calc(100% - '+ (this.botmHeight) +')'
        }
      },
		},
		mounted() {
			let _this = this;
      
      //通过 $on(eventName, eventHandler) 侦听一个事件
      //通过 $off(eventName, eventHandler) 停止侦听一个事件

      // 返回列表页
			bus.$on("showLeftMenu", function() {
        _this.detailclose()
        _this.isLeftMenu = true;

        _this.mapWidth = 'calc(100% - '+ (_this.pageWidth) +'rem)';
        _this.mapadding = '0 0 0 0.05rem';
      });

      //左侧详情页
			bus.$on("leftDetail", function(componentName, item, title) {
        _this.isDetailDataLeft = true;
        _this.leftDetailData = item;
        _this.componentLeft = componentName;
        _this.titleLeftName = title;

        _this.mapWidth = 'calc(100% - '+ (_this.pageWidth*2 + 0.05) +'rem)';
      });

      //底部详情页
			bus.$on("botmDetail", function(componentName, item, title) {
        _this.isDetailDataBotm = true;
        _this.botmShow = true;
        
				_this.botmDetailData = item;
				_this.componentBotm = componentName;
        _this.titleBotmName = title;
        
        _this.mapHeight = '50%';
        _this.botmHeight =  'calc(100% - '+ (_this.mapHeight) +')'
        if(_this.isLeftMenu)
          _this.mapWidth = 'calc(100% - '+ (_this.pageWidth) +'rem)';

        if (_this.isDetailDataRight)
          _this.mapWidth = 'calc(100% - '+ (_this.pageWidth*2) +'rem)' 
        
        if(_this.isDetailDataLeft) 
          _this.mapWidth = 'calc(100% - '+ (_this.pageWidth*2 + 0.05) +'rem)' 

        if(_this.isDetailScreen) 
          _this.mapWidth = 'calc(100% - '+ (_this.pageWidth) +')'
      
      });
      
			//右侧详情页
			bus.$on("rightDetail", function(componentName, item, title) {
        _this.isDetailDataRight = true;
				_this.rightDetailData = item;
				_this.componentLeft = componentName;
        _this.titleRightName = title;
        
        _this.mapWidth = 'calc(100% - '+ (_this.pageWidth*2 + 0.05) +'rem)';
        _this.mapadding = '0 0.05rem';
			});

      //关闭详情框
			bus.$on("detailclose", function(value) {
				_this.detailclose(value);
      });
      
			var menuid = this.$route.query.id; //序号（id）
			_this.getMenus(menuid);

			_this.detailclose("leftMenu");
			_this.menuFlag = -1;

    },
    beforeDestroy() {
      bus.$off("showLeftMenu");
      bus.$off("leftDetail");
      bus.$off("botmDetail");
      bus.$off("rightDetail");
      bus.$off("detailclose");
    },
	}
</script>

<style lang="less">
.appDiv2 {
    width: 100%;
    height: calc(100% - 0.6rem);
    position: relative;
    padding: 0.05rem;

    .appMenu{
      width: 1.6rem;
      height: 100%;
      border-right: none;
      float: left;
      overflow-y: auto;
      background-image: url("../../../../static/img/newhome/04/bg_left.png");
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
    }
    .menuSel {
        background-image: url("../../../../static/img/newhome/icon/bg_选项_sel.png");
        background-size: 100% 100%;
        margin: 0.15rem;
        height: 0.35rem;
        line-height: 0.35rem;
    }
    .menuNor {
        background-image: url("../../../../static/img/newhome/icon/bg_选项_nor.png");
        background-size: 100% 100%;
        margin: 0.15rem;
        height: 0.35rem;
        line-height: 0.35rem;
    }
    .menuImg{
      width: 0.2rem;
      height: 0.2rem;
      position: relative;
      left: 0.15rem;
      float: left;
      padding-top: 0.06rem;
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
      padding-left: 0.05rem;
    .appCompontsContLeft{
      width: 100%;
      height: 100%;
      float: left;
    }
    .appCompontsContLeftDiv{
      border-radius: 0.1rem;
      background: none;
      width: 3.3rem;
      height: 100%;
      float: left;
      position: relative;
      border: 1px solid #326ab2;
    }

    .appCompontsScreen{
      border: 1px solid #326ab2;
      border-radius: 0.1rem;
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
      border-radius: 0.1rem;
      width: 100%;
      height: 100%;
      position: relative;
    }
    .appCompontsContDetail{
      padding-top: 0.05rem;
      float: left;
    }

    .appCompontsContDetailDiv{
      height: 100%;
      border: 1px solid #2962ab;
      border-radius: 0.1rem;
      position: relative;
    }
    
    .titleCont {
      position: absolute;
    }
    
    .titleContImg {
      width: 100%;
      height: 0.4rem;
      line-height: 0.4rem;
      border-bottom: 1px solid #0161ba;
    }
    .titleContImgT {
      height: 0.4rem;
      line-height: 0.4rem;
      border-bottom: 1px solid #0161ba;
    }
    
    .titleContText {
      position: absolute;
      font-size: 0.14rem;
      color: #ffffff;
      font-weight: bold;
      left: 0.05rem;
      float: left;
    }

    .titleRight {
      position: absolute;
      top: 10%;
      right: 0.05rem;
    }
    
    .closeIcon {
      padding: 0rem;
      font-size:0.25rem;
      color:rgba(255,255,255,0.5);
    }
    .closeIcon:hover {
      padding: 0rem;
      color:rgba(255,255,255,1);
    }
  }
}

</style>
