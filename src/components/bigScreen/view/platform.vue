<!-- 平台切换页面 -->
<style lang="less" scoped="scoped">
.menuApp {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: url("../../../../static/img/menus/bg.jpg") no-repeat;
  background-attachment: fixed;
  background-size: cover;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-repeat: round;
  text-align: center;
}

.div_head {
  text-align: center;
  height: 10%;
}

.div_title {
  position: relative;
  /* 相对定位或绝对定位均可 */
  width: 100%;
  height: 90%;
  text-align: center;
  /* 外边距为自身宽高的一半 */
  //background-color: pink;     /* 方便看效果 */
}

.img_head {
  position: absolute;
  top: 15px;
}

.lingx_div:hover {
  -webkit-transform: scale(1.3);
}

.lingx_div {
  margin: 0 0.5rem;
  height: 2.2rem;
  width: 2.2rem;
  display: inline-block;
  background-repeat: no-repeat;
  cursor: pointer;

  -moz-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  -webkit-transition: -webkit-transform 0.3s;
  -moz-transition: -moz-transform 0.3s;
  transition: transform 0.3s;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;

  .lingx_divTitle {
    font-weight: bold;
    color: #fff;
    font-size: 0.3rem;
    position: relative;
    bottom: 1.5rem;
  }

  .img {
    height: auto;
    width: 100%;
  }

  .lingx_div_background {
    height: 165px;
    position: static;
    padding-top: 40px;
  }
}
.ptTitle {
  font-family: "login";
  color: #fff;
  font-size: 0.35rem;
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
.weathers_img {
  height: 0.3rem;
  position: relative;
  left: 0%;
  top: 5px;
}
.weathers_text {
  line-height: 1;
  color: #ffffff;
  font-size: 0.11rem;
  font-family: "eras medium itc";
}
.weathers_type {
  color: #ffffff;
  font-size: 0.13rem;
  font-family: "eras medium itc";
}

span .Img2 {
  color: white;
  font-size: 15px;
  text-align: center;
}

.ButDiv1 {
  height: 50px;
  width: 700px;
  position: absolute;
  top: 93%;
  left: 25%;
}

.div_text {
  margin-top: 7%;
}
.fade-in-right {
  -webkit-animation: fade-in-right 1s;
  animation: fade-in-right 1s;
  -webkit-animation-timing-function: ease-out;
  animation-timing-function: ease-out;
}
@-webkit-keyframes fade-in-right {
  0% {
    -webkit-transform: translateY(100%);

    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0%);

    opacity: 1;
  }
}
@keyframes fade-in-right {
  0% {
    transform: translateY(100%);

    opacity: 0;
  }
  100% {
    transform: translateY(0%);

    opacity: 1;
  }
}
</style>
<template>
  <div id="menus" class="menuApp">
    <div class="div_head" style="background: url('../../../../static/img/menus/title.png') no-repeat;background-size: 100% 100%;height: 0.9rem;">
      <div style="position:absolute; left: 0.1rem;">
        <img class="weathers_img" :src="'../../static/weather/' + weathers.type + '.gif'" />
        <span class="weathers_text">{{ weathers.txtInfo }}</span>
        <span class="weathers_type">{{ weathers.type }}</span>
      </div>
      <div class="ptTitle">{{ptTitle}}</div>
      <div class="img_head" style="right: 2%;" @click="logout">
        <img style="position: relative;top:6px;cursor:pointer;" src="../../../../static/img/menus/退出.png" />
        <span style="cursor:pointer;height:100px;width:50px;color:#fff;position:relative;">退出</span>
      </div>
      <div class="img_head" style="right: 5%;">
        <img style="position:relative;right:3%;cursor:pointer;" src="../../../../static/img/menus/用户.png" />
        &nbsp;
        <span style="height:20px;width:50px;color:#fff;position:relative;right: 3%;top:-20px;cursor:pointer;">欢迎!</span>
        <span style="height:20px;width:100px;color:#fff;position:relative;right:32%;top:-5px;cursor:pointer;">{{ user.loginName }}</span>
      </div>
    </div>
    <div class="div_title fade-in-right">
      <div class="div_text">
        <div @click="goHome(item)" :key="index" class="lingx_div" v-for="(item, index) in platform">
          <div :style="{ backgroundSize: '100% 100%' }" class="lingx_div_background">
            <img :src="item.imgurl" class="img" />
            <div class="lingx_divTitle">{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="ButDiv1"><span class="Img2" style="color:#BFD7F0;">&#12288; &#12288;&#12288;技术支持：XXXX</span></div>
  </div>
</template>

<script>


export default {
  components: {},
  data() {
    return {
      ptTitle: '项目管理平台',
      user: this.$store.getters.info.userinfo,
      platform: [
        { name: '综合展示', imgurl: '../../../../static/img/menus/11.png', path: "/bighome" },
        { name: '综合展示', imgurl: '../../../../static/img/menus/22.png', path: "/bighome" },
        { name: '综合展示', imgurl: '../../../../static/img/menus/33.png', path: "/bighome" },
      ],
      weathers: {
        type: '晴',
        txtInfo: ''
      },
    };
  },
  methods: {
    getWeather() {
      this.$http({
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
                this.weathers.type = rust[0].type;
                this.weathers.txtInfo = rust[0].low.replace('低温', '') + '~' + rust[0].high.replace('高温 ', '');
              }
            }
          }
        },
        error => {
          this.$Message.error(error);
        }
      );
    },
    goHome(item) {
      this.$router.push({ path: item.path });
    },
    logout() {
      this.$router.push({ path: "/login" });
    }
  },
  mounted() {
    var _this = this;
    var flag = this.$route.params.flag;
    if (flag) {
      window.location.reload(true);
    }


    document.getElementById('menus').style.width = window.innerWidth + 'px';
    document.getElementById('menus').style.height = window.innerHeight + 'px';

    window.addEventListener('resize', function () {
      document.getElementById('menus').style.width = window.innerWidth + 'px';
      document.getElementById('menus').style.height = window.innerHeight + 'px';
    });

    _this.getWeather();

  }
};
</script>
