<style lang="less">
.videoPage {
  .leftimg {
    height: calc(100%);
    width: calc(100%);
    display: inline-block;
    overflow-y: auto;
  }
  .rightimg {
    width: 100%;
    height: calc(100%);
    display: inline-block;
    overflow-y: auto;
  }

  .leftmenu {
    color: #1597ec;
    line-height: 0.4rem;
    height: 0.4rem;
    padding-left: 0.4rem;
    cursor: pointer;
  }
  .leftmenuC {
    color: #ffffff;
    line-height: 0.4rem;
    height: 0.4rem;
    padding-left: 0.4rem;
    background-position: 0% 57%;
  }
  .leftmenu:hover {
    color: #ffffff;
    line-height: 0.4rem;
    height: 0.4rem;
    padding-left: 0.4rem;
    background-position: 0% 57%;
  }

  .changebtnnext {
    position: absolute;
    width: 99%;
    top: 47%;
    * {
      font-size: 0.24rem;
    }
  }

  .demo-spin-container {
    display: inline-block;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .chagebtn {
    * {
      font-size: 0.24rem;
    }

    position: absolute;
    top: 1%;
    left: 20%;
    z-index: 3;
  }

  .select-nav {
    * {
      font-size: 0.24rem !important;
    }
  }

  .fenye {
    position: absolute;
    bottom: 1.3%;
    color: #ffffff;
    width: 100%;
    z-index: 99;
    text-align: center;

    * {
      font-size: 0.24rem;
    }
  }

  .videoBorder {
    width: 100%;
    height: 85%;
    position: relative;
  }

  .videoTitle {
    position: relative;
    top: 25px;

    .videoTitleText {
      text-align: center;
      position: absolute;
      width: 100%;
      top: 17%;
      font-size: 15px;
      color: aliceblue;
      font-weight: 600;
    }
  }

  .videoRow {
    position: absolute;
    top: 85px;

    .videoList {
      font-size: 15px;
      color: #88cef7;
      cursor: pointer;
      padding: 10px;
    }
  }

  // ==================================
  .flip-in-y {
    // opacity:0;
    -webkit-animation: flip-in-y 1.5s;
    animation: flip-in-y 1.5s;
    -webkit-animation-timing-function: ease;
    animation-timing-function: ease;
    animation-direction: alternate;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    // -webkit-animation-delay:1.5s;  /**延迟动画**/
    // animation-delay:1.5s;
  }

  @keyframes flip-in-y {
    0% {
      transform: perspective(500px) rotateY(70deg);

      opacity: 0.2;
    }
    50% {
      transform: perspective(500px) rotateY(-50deg);
      opacity: 0.6;
    }

    100% {
      transform: perspective(500px) rotateY(0deg);
      opacity: 1;
    }
  }
  @-webkit-keyframes flip-in-y {
    0% {
      -webkit-transform: perspective(500px) rotateY(70deg);

      opacity: 0.2;
    }
    50% {
      -webkit-transform: perspective(500px) rotateY(-50deg);
      opacity: 0.6;
    }

    100% {
      -webkit-transform: perspective(500px) rotateY(0deg);
      opacity: 1;
    }
  }

  .slide-in-right {
    -webkit-animation: slide-in-right 1.2s;
    animation: slide-in-right 1.2s;
    -webkit-animation-timing-function: ease;
    animation-timing-function: ease;
  }

  @-webkit-keyframes slide-in-right {
    0% {
      -webkit-transform: translateX(-2000px);
    }
    100% {
      -webkit-transform: translateX(0px);
    }
  }
  @keyframes slide-in-right {
    0% {
      transform: translateX(-2000px);
    }
    100% {
      transform: translateX(0px);
    }
  }
}
</style>
<template>
  <div class="videoPage" style="width:100%;height: 100%;">
    <!-- 左侧 -->
    <div
      id="circleLeft"
      style="height: 100%;width:2.2rem;float: left;padding-bottom: 0.1rem;"
      class=" fade-in-right"
    >
      <div class="leftimg">
        <div style="margin:0.1rem;height: calc(100% - 0.2rem);">
          <div style="padding: 0rem;  height: 100%;    overflow: auto;">
            <div
              v-for="(item, index) in selectlist"
              :key="index"
              @click="expandlist(item, index)"
              :class="index == currentindex ? 'leftmenuC' : 'leftmenu'"
              :style="index == 0 ? 'margin-top: 0.1rem' : ''"
            >
              <span>{{ item.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧 -->
    <div
      id="circleMiddle"
      style="height: 100%;width:calc(100% - 2.2rem);float: left;position: relative;padding-bottom: 0.1rem;"
      class=" fade-in-left"
    >
      <div class="rightimg" v-show="waterList.length > 0">
        <div class="fenye">
          <span>{{ this.current }}</span> <span>/</span>
          <span>{{ this.pageSizenum }}</span>
        </div>
        <div id="videos" style="width:100%;height: 100%;padding: 0.12%"></div>
        <div class="changebtnnext">
          <Button
            shape="circle"
            size="small"
            v-show="leftbtn"
            style="float: left;display: block;"
            icon="ios-arrow-back"
            type="primary"
            @click="changecurrent(1)"
          ></Button>
          <Button
            shape="circle"
            size="small"
            v-show="rightbtn"
            style="float: right;display: block;"
            icon="ios-arrow-forward"
            type="primary"
            @click="changecurrent(0)"
          ></Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import videojs from "video.js";
import "videojs-contrib-hls";

export default {
  name: "videojs",
  data() {
    return {
      leftbtn: false,
      rightbtn: true,
      page: {
        pagesize: 9,
        currentPage: 1,
        list: [],
        total: 0
      },
      current: 1,
      pagenum: 0,
      pageSizenum: 0,
      selectlist: [],
      khmyVideojs: [],
      currentRow: 0, //视频行
      currentCol: 0, //视频列
      currentindex: -1,
      waterList: [],
      waterListChildren: []
    };
  },
  methods: {
    //获取左侧河道列表
    getLeftWaterList() {
      var _this = this;
      _this.waterList = [];
      _this.selectlist = [];

      this.$ajax(this.$apiSet.getwaterlistData, {
        type: "",
        isgroup: 1
      }).then(
        res => {
          if (res.data.success && res.data.source.length > 0) {
            var mydata = res.data.source;

            _this.waterList = mydata;
            _this.selectlist = mydata;
            _this.expandlist(_this.selectlist[0], 0);
          } else {
            _this.$Message.error("暂无视频");
          }
        },
        error => {}
      );
    },
    //列表点击事件
    expandlist(item, index) {
      this.pageSizenum = 0;
      this.current = 1;
      this.currentindex = index;
      this.waterListChildren = [];
      this.waterListChildren = item.children;
      this.page.list = item.children;
      this.changePage();
    },
    changeType(type) {
      bus.$emit("changetype", type);
    },

    showVideo() {
      var _this = this;
      this.clearvideo();
      //视频总数
      var spCount = _this.list.length;
      //行：平方根后四舍五入
      var pfgNum = Math.sqrt(spCount); //开平方根
      var sswrNum = Math.round(pfgNum); //平方根后如果遇到小数，则进行四舍五入
      // 列：小数点后进一位
      _this.currentCol = Math.ceil(spCount / sswrNum);
      _this.currentRow = sswrNum;

      let elementList = document.getElementById("videos");
      elementList.innerHTML = "";
      let dom = "";

      for (let j = 0; j < _this.list.length; j++) {
        var url = _this.list[j].hls;
        var name = _this.list[j].stationname;

        dom +=
          "<div style='height:" +
          (1 / _this.currentRow) * 100 +
          "%;width:" +
          (1 / _this.currentCol) * 100 +
          "%;float:left;text-align: center;position: relative;'><video khvideoid='" +
          j +
          "' indexcode='" +
          url +
          "'  id='khVideos" +
          j +
          "'" +
          " class='video-js vjs-default-skin vjs-big-play-centered khvideojs' muted='muted' controls preload='auto'  poster='auto' style='width: 100%;height: 100%;'></video><div style='position: absolute;top: 0%;width: 100%;text-align: right;z-index: 2;'><span style='background-color: black;padding: 5px;color:#ffffff;font-size:16px;font-weight: 700;margin-right: 6%;'>" +
          name +
          "</span></div></div>";

        this.$ajax(this.$apiSet.getaddress_kh, {
          indexcode: url,
          protocol: "hls"
        }).then(
          res => {
            if (res != undefined) {
              if (res.data.success) {
                let khvideojs = document.querySelectorAll(".khvideojs");
                for (let ss = 0; ss < khvideojs.length; ss++) {
                  let indexcode = khvideojs[ss].getAttribute("indexcode");
                  let khvideoid = parseInt(
                    khvideojs[ss].getAttribute("khvideoid")
                  );
                  if (indexcode == res.config.params.indexcode) {
                    let khurl = res.data.source;
                    _this.khmyVideojs[ss].src({
                      src: khurl,
                      type: "application/x-mpegURL"
                    });
                    _this.khmyVideojs[ss].play();
                  }
                }
              }
            }
          },
          error => {
            alert(error);
          }
        );
      }

      elementList.innerHTML += dom;
      _this.setvideodom();
    },
    setvideodom() {
      var _this = this;
      let khvideojs = document.querySelectorAll(".khvideojs");

      for (let ss = 0; ss < khvideojs.length; ss++) {
        var khvideojsid = khvideojs[ss].getAttribute("id");
        _this.khmyVideojs.push(
          videojs(khvideojsid, {
            bigPlayButton: true,
            textTrackDisplay: false,
            posterImage: false,
            errorDisplay: false,
            hls: {
              withCredentials: true
            }
          })
        );
      }
    },
    changecurrent(ins) {
      let _this = this;
      if (ins == 0) {
        if (_this.current >= _this.pageSizenum) {
          this.$Message.error("已经是最后一页了");
          _this.rightbtn = false;
          return;
        } else {
          _this.current++;
          _this.changePage();
          if (_this.current >= _this.pageSizenum) {
            _this.rightbtn = false;
            _this.leftbtn = true;
          } else {
            _this.rightbtn = true;
            _this.leftbtn = true;
          }
        }
      } else if (ins == 1) {
        if (_this.current == 1) {
          this.$Message.error("已经是第一页了");
          _this.leftbtn = false;
          return;
        } else {
          _this.current--;
          _this.changePage();
          if (_this.current == 1) {
            _this.rightbtn = true;
            _this.leftbtn = false;
          } else {
            _this.rightbtn = true;
            _this.leftbtn = true;
          }
        }
      }
    },
    //分页
    changePage() {
      let _this = this;
      _this.list = [];

      let pagesize = this.page.pagesize; //每页显示条数
      let result = this.page.list; //数据
      this.page.total = result.length; //总数
      _this.pageSizenum = parseInt(this.page.list.length / pagesize); //分了几页
      //计算总页数
      _this.pageSizenum = Math.ceil(this.page.total / pagesize);

      if (_this.current == _this.pageSizenum) {
        _this.rightbtn = false;
        _this.leftbtn = false;
      } else {
        _this.rightbtn = true;
      }

      let startIndex = (_this.current - 1) * pagesize; //开始下标
      let pagenum = 0;
      if (result.length < startIndex + pagesize) {
        pagenum = result.length;
      } else {
        pagenum = startIndex + pagesize;
      }
      for (let j = startIndex; j < pagenum; j++) {
        _this.list.push(result[j]);
      }
      _this.showVideo();
    },

    clearvideo() {
      //重置清空视频
      for (let j = 0; j < this.khmyVideojs.length; j++) {
        this.khmyVideojs[j].pause();
        videojs(this.khmyVideojs[j].id_).dispose();
      }

      this.khmyVideojs = [];
    }
  },
  mounted() {
    var _this = this;
    this.getLeftWaterList();
  },
  destroyed() {},
  beforeDestroy() {
    this.clearvideo();
  }
};
</script>
