<template>
  <div>
    <el-header id="header">
      <span class="hideAside" @click="collapse">
        <i :class="$store.getters.isCollapse ? 'el-icon-s-unfold':'el-icon-s-fold'" style="font-size:0.24rem;"></i>
      </span>
      <el-menu  class="el-menu-demo"
        mode="horizontal" 
        @select="selectMenu" 
        background-color="#f2f2f2" 
        text-color="#222f3e" 
        active-text-color="#409EFF"
      >
        <template  v-for="(item,index) in  $store.getters.info.menuinfo">
            <el-menu-item :index="item.menuName+''" :key="index">{{item.menuName}}</el-menu-item>
        </template>
      </el-menu>

      <ul class="personal">
        <li class="fullScreen" @click="fullScreen">
          <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
            <i class="fa fa-arrows-alt fa-lg"></i>
          </el-tooltip>
        </li>
        <li>
        	<div :key="index" v-for="(item,index) in  weathers">
						<div style="display:inline-flex;">
							<img class="weathers_img" :src="'../../static/weather/'+item.type+'.gif'" />
							<div class="weathers_type">{{item.type}} </div>
				  		<div class="weathers_text">{{item.txtInfo}}</div>
						</div>
					</div>
        </li>
        <li v-show="$defaultConfig.errorLog">
          <el-tooltip class="item" effect="dark" :content="tooltipContent" placement="bottom">
            <el-badge :max="99" :value="$store.getters.errorLogList.length" style="cursor: pointer;">
              <svg-icon :class="$store.getters.errorLogList.length == 0 ? 'bug-f':'bug-t'" icon-class="bug" @click.native="$emit('showErrorLogBox')" />
            </el-badge>
          </el-tooltip>
        </li>
        <li><colorPicker></colorPicker></li>
        <li>
          <el-dropdown size="large" class="avatar-dropdown">
            <span class="el-dropdown-link">
              {{user.loginName}}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$router.push('/home')">
                <i class="el-icon-s-home" />首页
              </el-dropdown-item>
              <el-dropdown-item @click.native="$router.push('/personal')">
                <i class="el-icon-s-custom" />个人中心
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout">
                <i class="fa fa-paper-plane" />退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <!-- <li class="icon"><img :src="avatar"/></li> -->
      </ul>
    </el-header>
    <tabNav></tabNav>
    <!-- <tagNav></tagNav> -->
  </div>
</template>

<script>
import Cookies from "js-cookie"
import tabNav from "./tabNav"
import tagNav from "./tagNav"

export default {
  name: "Header",
  components: {tabNav,tagNav},
  computed: {
    tooltipContent () {
      return  this.$store.getters.errorLogList.length == 0 ? `无异常`:`${this.$store.getters.errorLogList.length} 个异常`
    }
  },
  data () {
    return {
      user: this.$store.getters.info.userinfo,
      isfullScreen: true,
      avatar: "./static/img/favicon.ico",
      weathers: [], //天气数据
      isFlod: true,
    }
  },
  methods: {
    collapse () {
      this.$store.dispatch("collapse")
    },
    selectMenu(val) {
      let data = (this.$store.getters.info.menuinfo).filter(function(item){
        return item.menuName == val; 
      })
      console.log(data)
    },
    // 退出登录
    logout() {
      window.sessionStorage.clear();
      window.localStorage.clear();
      window.location.reload();
      this.$router.push({ path: "/login" });
    },
    fullScreen () {
      if (this.isfullScreen) {
        var docElm = document.documentElement
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen()
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen()
        }
        this.isfullScreen = false
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.isfullScreen = true
      }
    },
  
    getWeather() {
        this.$ajax({
            url: 'http://wthrcdn.etouch.cn/weather_mini?city=南京',
            dataType: 'jsonp',
            headers: {
                'Accept-Encoding': 'gzip'
            },
            method: 'get'
        }).then(
          res => {
              if (res) {
                  if (res.data) {
                      var rust = res.data.data.forecast;
                      if (rust) {
                          for (let i = 0; i < 1; i++) {
                              this.weathers.push({
                                  txtInfo: rust[i].low.replace('低温', '').replace('℃', '') + '~' + rust[i].high.replace('高温 ', ''),
                                  type: rust[i].type, //图片
                                  date: rust[i].date.substring(0, rust[i].date.length - 3)
                              })
                          }
                      }
                  }
              }
          },
          error => {
              this.$message.error(error);
          }
        );
    },
  },
  mounted(){
    this.getWeather();
  }
}
</script>

<style lang="scss">
  $top: top;
  $bottom: bottom;
  $left: left;
  $right: right;
  $leftright: ($left, $right);
  %w100 {
    width: 100%;
  }

  %h100 {
    height: 100%;
  }

  %cursor {
    cursor: pointer;
  }

  html, body, #app, .el-container, #asideNav, ul.el-menu {
    @extend %h100;
  }

  @mixin set-value($side, $value) {
    @each $prop in $leftright {
      #{$side}-#{$prop}: $value;
    }
  }

  #header {
    max-height: 50px;
    line-height: 50px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    display: flex;
    justify-content: space-between;
    .hideAside {
      @extend %cursor;
    }
    .personal {
      display: flex;
      flex-direction: row;
      li {
        @include set-value(margin, 13px);
        font-size: 0.12rem;
      }
      .fullScreen {
        @extend %cursor;
      }
      .el-dropdown-link {
        @extend %cursor;
      }
      .icon img {
        margin-#{$top}: 7px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        width: 40px;
        height: 40px;
      }
    }

    .weathers_img {
      position: relative;
      top: 0.1rem;
      width: 0.3rem;
      height: 0.3rem;
    }
  
    .weathers_type {
      // color: #FFFFFF;
      left: 0rem;
      position: relative;
      font-size: 0.12rem;
      font-family: "eras medium itc";
    }
  
    .weathers_text {
      // color: #FFFFFF;
      left: 0.05rem;
      position: relative;
      font-size: 0.12rem;
      font-family: "eras medium itc";
    }

    .bug-t {
      width: 24px!important; 
      height: 24px!important; 
      color: red;
      vertical-align: middle;
    }

    .bug-f {
      width: 24px !important; 
      height: 24px !important; 
      color: rgba(0, 0, 0, .5);
      vertical-align: middle;
    }

    .el-menu--horizontal>.el-menu-item{
      height: 50px !important;
      line-height: 50px !important;
    }

    .el-badge__content.is-fixed {
      top:14px !important;
      line-height: 14px !important; 
      padding: 0px 3px !important; 
      cursor: pointer;
    }
   
  }
</style>
