<template>
  <div class="header" style="z-index: 9;position: relative;">

    <div class="homePageTitle">

      <div class="left-div" style="width:33.3%;float: left;height: 100%;">
        <div class="leftTool">
          <div style="padding-left:0.1rem;color:rgb(75 236 214);">
            <newDate></newDate>
          </div>
        </div>
        <div :key="index" :class="[ismeunNumLeft == item.id ? 'menuDiv menuDivL' : 'menuDiv']" v-for="(item,index) in menuDataLeft" @click="changeMenu_left(item.id)">
          <a :href="'#/'+item.classname+'?id='+item.id">
            <div style="height: 100%">
              <img class="menuImg menuImgLeft" :src="ismeunNumLeft == item.id ? item.imgT : item.imgF" />
              <div class="homeMenu homeMenuLeft" :class="[ismeunNumLeft == item.id ? 'homeMenuTextT' : 'homeMenuTextF']">
                {{item.menuname}}
              </div>
            </div>
          </a>
        </div>
      </div>

      <div class="center-div" style="width:33.3%;float: left;text-align: center;height: 100%;">
        <div style="display: inline-block;height: 100%;cursor: pointer;" @click="goHomepage()">
          <div class="ptname">{{ptTitle}}</div>
        </div>
      </div>

      <div class="right-div" style="width:33.3%;float: left;height: 100%;">
        <div :key="index" :class="[ismeunNumRight == item.id ? 'menuDiv menuDivR' : 'menuDiv']" v-for="(item,index) in menuDataRight" @click="changeMenu_Right(item.id)">
          <a :href="'#/'+item.classname+'?id='+item.id">
            <div style="height: 100%">
              <img class="menuImg menuImgRight" :src="ismeunNumRight == item.id ? item.imgT : item.imgF" />
              <div class="homeMenu homeMenuRight" :class="[ismeunNumRight == item.id ? 'homeMenuTextT' : 'homeMenuTextF']">
                {{item.menuname}}
              </div>
            </div>
          </a>
        </div>
        <div class="rightTool">
          <ul class="right-menu" style="display: inline-block;vertical-align: middle;">
            <li class="eui-nav-item">
              <Dropdown trigger="click" style="" @on-click='accountSwitches'>
                <span style='cursor: pointer;color: #fff'>
                  <img src="../../../../static/img/menus/用户.png" class="logo-img" />
                  <span>{{$store.getters.info.userinfo.loginName}}</span>
                  <Icon type="arrow-down-b"></Icon>
                </span>
                <DropdownMenu slot="list" style="color: #ffffff">
                  <Dropdown-item name="密码修改">密码修改</Dropdown-item>
                  <Dropdown-item name="平台切换">平台切换</Dropdown-item>
                  <Dropdown-item name="退出登录">退出登录</Dropdown-item>
                </DropdownMenu>
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>

    </div>

  </div>
</template>

<script>

import { MapControl } from "../../arcgis_map/js/MapControl.js";

export default {
  data() {
    return {
      ptTitle: '大屏管理',

      ismeunNumLeft: null,
      ismeunNumRight: null,

      menuDataLeft: [],
      menuDataRight: [],
      menuList: [
        { classname: 'application', menuname: '菜单1', id: 1, children: [] },
        { classname: 'application', menuname: '菜单2', id: 2, children: [] },
        { classname: 'application', menuname: '菜单3', id: 3, children: [] },
        { classname: 'application', menuname: '菜单4', id: 4, children: [] },
        { classname: 'application', menuname: '菜单5', id: 5, children: [] },
        { classname: 'application', menuname: '菜单6', id: 6, children: [] },
      ],
    };
  },
  watch: {
    // 检测路由变化
    $route(to, from) {
      
      this.ismeunNumLeft = null;
      this.ismeunNumRight = null;
      var menuid = this.$route.query.id
      for (let i = 0; i < this.menuDataLeft.length; i++) {
        if (menuid == this.menuDataLeft[i].id) {
          this.ismeunNumLeft = menuid;
        }
      }
      for (let j = 0; j < this.menuDataRight.length; j++) {
        if (menuid == this.menuDataRight[j].id) {
          this.ismeunNumRight = menuid;
        }
      }
    }
  },
  methods: {
    goHomepage() {
      this.$router.push({
        name: 'homePage',
        query: {
          id: 11
        }
      });
    },
    getSysList() {

      this.menuDataLeft = [];
      this.menuDataRight = [];

      if (this.menuList.length > 0) {
        var len = this.menuList.length % 2 == 0 ? this.menuList.length / 2 : parseInt(this.menuList.length / 2 + 1);

        for (let k = 0; k < len; k++) {
          this.menuDataLeft.push({
            classname: this.menuList[k].classname,
            id: this.menuList[k].id,
            imgT: '../../../../static/img/map/ic_flowmeter_online1.png',
            imgF: '../../../../static/img/map/ic_flowmeter_online1.png',
            menuname: this.menuList[k].menuname,
            children: this.menuList[k].children
          })
        }
        for (let l = len; l < this.menuList.length; l++) {
          this.menuDataRight.push({
            classname: this.menuList[l].classname,
            id: this.menuList[l].id,
            imgT: '../../../../static/img/map/ic_flowmeter_online1.png',
            imgF: '../../../../static/img/map/ic_flowmeter_online1.png',
            menuname: this.menuList[l].menuname,
            children: this.menuList[l].children
          })
        }
      }
    },
    changeMenu_left(id) {
      MapControl.setMapClear();
      this.ismeunNumRight = null;
      this.ismeunNumLeft = id;

      _this.$router.push({
        name: 'application',
        query: {
          id: id
        }
      });
    },
    changeMenu_Right(id) {
      MapControl.setMapClear();
      this.ismeunNumLeft = null;
      this.ismeunNumRight = id;

      _this.$router.push({
        name: 'application',
        query: {
          id: id
        }
      });
    },
    accountSwitches(name) {
      switch (name) {
        case "密码修改":

          break;
        case "平台切换":
          this.$router.push({
            name: 'platform'
          });
          break;
        case "退出登录":
          this.$router.push({
            name: 'login'
          });
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    var _this = this;
    this.getSysList();
  },
}
</script>

<style lang="less">
.header {
  width: 100%;

  .ptname {
    font-family: "title";
    color: #fff;
    font-size: 0.32rem;
    font-weight: initial;
    position: relative;
    background-image: -webkit-gradient(
      linear,
      0 0,
      0 bottom,
      from(#ffffff),
      to(#7fc3c3)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }

  .homePageTitle {
    height: 0.6rem;
    width: 100%;
    background-image: url("../../../../static/img/newhome/04/topTitle_02.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
    animation: loadFromTop 2s linear;
    -webkit-animation: loadFromTop 2s linear;
    -webkit-animation-timing-function: ease;
    animation-timing-function: ease;
  }

  .menuDiv {
    float: left;
    position: relative;
    // top: 0.098389rem;
    width: 20%;
    height: 100%;
    height: 0.493616rem;
  }
  .menuDivL {
    background-image: url("../../../../static/img/newhome/04/BG_navigation_s.png");
    background-repeat: no-repeat;
    background-size: contain;
    height: 100%;
  }
  .menuDivR {
    background-image: url("../../../../static/img/newhome/04/BG_navigation_s.png");
    background-repeat: no-repeat;
    background-size: contain;
    height: 100%;
  }

  .menuDivRight {
    margin-left: 0.252342rem;
  }
  .homeMenuLeft {
    left: 0.4rem;
  }
  .homeMenuRight {
    left: 0.4rem;
  }
  .homeMenuTextT {
    font-size: 0.14rem;
    top: 0.18rem;
    color: #ffffff;
  }
  .homeMenuTextF {
    font-size: 0.14rem;
    top: 0.18rem;
    color: rgba(255, 255, 255, 0.53);
  }
  .homeMenu {
    position: absolute;
    width: max-content;
    font-weight: bold;
  }
  .menuDiv a {
    outline: none;
  }

  .menuImgLeft {
    left: 0.12rem;
  }
  .menuImg {
    width: 0.2rem;
    position: absolute;
    top: 0.18rem;
  }
  .menuImgRight {
    left: 0.12rem;
  }

  .leftTool {
    float: left;
    position: relative;
    top: 0.098389rem;
    width: 40%;
    height: 100%;
  }

  .rightTool {
    float: left;
    position: relative;
    top: 0.098389rem;
    width: 40%;
    height: 100%;

    .logo-img {
      width: 0.2rem;
      border-radius: 0.3rem;
      margin: 0 auto;
      vertical-align: middle;
    }
    .right-menu {
      position: absolute;
      right: 0.05rem;
    }

    .eui-nav-item {
      line-height: 0.15rem;
    }
  }

  .ivu-select-dropdown {
    background-color: #003786 !important;
    left: -17px !important;
  }
  .ivu-dropdown-item {
    padding: 7px 10px !important;
    color: #fff !important;
    font-size: 0.12rem !important;
  }
  .ivu-dropdown-item:hover {
    background: #7db2ea !important;
  }
}
</style>
