<template>
  <div v-show="show" class="xa-popup ">
    <div class="layer"></div>
    <div ref="popup" class="popup">
      <div ref="title" :class="title.className || 'xa-bg-eee'" class="title">
        <div class="name">{{ title.text || title }}</div>
        <div size="small" @click="close" class="close" style="line-height: 35px;"></div>
        <div icon="android-done" circle size="small" @click="changemax(false)" class="close closemin" style="right:35px;" v-show="bodyshow"></div>
        <div icon="android-done" circle size="small" @click="changemax(true)" class="close closemax" style="right:35px;" v-show="!bodyshow"></div>
      </div>
      <div ref="main" class="main" v-show="bodyshow">
        <slot></slot>
      </div>
      <div v-show="buttons.length" class="buttons">
        <div v-for="btn in buttons" @click="setEvent(btn)" :class="btn.className" class="button" :key="btn.text">{{ btn.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../../eventBus";
var drag = (dragBox, moveBox = dragBox) => {
  var mapview = document.getElementById("elmain"); //地图界面窗口id
  dragBox.onmousedown = e => {
    var disX = e.clientX - moveBox.offsetLeft + mapview.offsetLeft;
    var disY = e.clientY - moveBox.offsetTop + mapview.offsetTop;
    document.onmousemove = e => {
      e.preventDefault();
      var l = e.clientX - disX;
      var t = e.clientY - disY; //'elmain'

      var x = mapview.clientWidth - moveBox.offsetWidth;
      var y = mapview.clientHeight - moveBox.offsetHeight;
      l = l < 0 ? 0 : l > x ? x : l;
      t = t < 0 ? 0 : t > y ? y : t;
      moveBox.style.left = l + mapview.offsetLeft + "px";
      moveBox.style.top = t + mapview.offsetTop + "px";
      return false;
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      return false;
    };
    return false;
  };
  var x = mapview.clientWidth - moveBox.offsetWidth + mapview.offsetLeft;
  var y = mapview.offsetTop;
  moveBox.style.left = x + "px";
  moveBox.style.top = y + "px";
};
export default {
  data() {
    return {
      isshow: false
    };
  },
  methods: {
    // 弹框适配屏幕居中
    autosize() {
      this.$nextTick(() => {
        var dom = this.$refs.popup;
        var CHeight = document.documentElement.clientHeight;
        var CWidth = document.documentElement.clientWidth;
        var PHeight = dom.offsetHeight;
        var PWidth = dom.offsetWidth;
        this.$refs.main.style.maxHeight = CHeight - 100 + "px";
        dom.style.top = "50px";
        dom.style.left = "100px";
      });
    },
    retresize() {
      this.$nextTick(() => {
        var mapview = document.getElementById("elmain");
        var x =
          mapview.clientWidth -
          this.$refs.popup.offsetWidth +
          mapview.offsetLeft;
        var y = mapview.offsetTop;
        this.$refs.popup.style.left = "12.3rem";
        this.$refs.popup.style.top =  "1.05rem";

      });
    },
    setEvent(btn) {
      this.$emit(btn.clickEvent);
      this.$emit("onbtnclick", btn);
    },
    close() {
      this.$emit("input", false);

      if (this.$parent.videourl) {
        this.$parent.videourl = "";
      }
    },
    changemax(val) {
      this.$parent.dialog.bodyshow = val;
    }
  },
  props: {
    title: {
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    },
    buttons: {
      type: Array,
      default() {
        return [];
      }
    },
    bodyshow: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    show() {
      return this.value;
    }
  },
  mounted() {
    var that = this;
    bus.$on("onshowdialog", function(isshwo) {
      if (that.isshow != undefined) {
        if (that.$parent.dialog) that.$parent.dialog.show = true;
      }
    });
    // bus.$
    this.$nextTick(() => {
      drag(this.$refs.title, this.$refs.popup);
    });
  },
  created() {
  },
};
</script>
<style lang="less" scoped>

.xa-popup .popup {
  min-width: 300px;
  z-index: 1001;
  position: fixed;
  left: 15%;
  top: 15%;
  background-color: transparent !important;
  box-shadow: none !important;
  border-radius: 5px;
  background-image: url("../../../static/img/中.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 0.2rem;
}
.xa-popup .popup>.title {
  width: 100%;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 12px;
  cursor: move;
  position: relative;
  background: none !important;
}
.xa-popup .popup>.title>.close {
  height: 35px;
  width: 35px;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  font-size: 30px;
}
.xa-popup .popup>.title>.close:hover{
  background-color: #16499F !important;
}

</style>
