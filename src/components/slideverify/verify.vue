<template>
  <div style="width:300px;">
    <el-form>
      <el-form-item label="验证">
        <div class="form-inline-input">
          <div class="code-box" id="code-box">
            <input type="text" name="code" class="code-input" />
            <p></p>
            <span>>>></span>
            {{sliderText}}
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sliderText:'向右滑动验证'
    };
  },
  mounted() {
    var _this = this;
    // window.addEventListener('load',function(){
    //code是后台传入的验证字符串
    var code = "jsaidaisd656",
      codeFn = new _this.moveCode(code, _this);
    // });
  },
  methods: {
    //获取元素距离页面边缘的距离
    getOffset(box, direction) {
      var setDirection = direction == "top" ? "offsetTop" : "offsetLeft";
      var offset = box[setDirection];
      var parentBox = box.offsetParent;
      while (parentBox) {
        offset += parentBox[setDirection];
        parentBox = parentBox.offsetParent;
      }
      parentBox = null;
      return parseInt(offset);
    },
    moveCode(code, _this) {
      var fn = { codeVluae: code };
      var box = document.querySelector("#code-box"),
        progress = box.querySelector("p"),
        codeInput = box.querySelector(".code-input"),
        evenBox = box.querySelector("span");
      //默认事件
      var boxEven = ["mousedown", "mousemove", "mouseup"];
      //改变手机端与pc事件类型
      if (typeof document.ontouchstart == "object") {
        boxEven = ["touchstart", "touchmove", "touchend"];
      }
      
      function handel(e) {
        e = boxEven["0"] == "touchstart" ? e.touches[0] : e || window.event;
        (goX = e.clientX),
          (offsetLeft = getOffset(box, "left")),
          (deviation = this.clientWidth),
          (evenWidth = box.clientWidth - deviation),
          endX;
        document.addEventListener(boxEven["1"], moveFn, false);
        document.addEventListener(boxEven["2"], removeFn, false);
      }

      var goX, offsetLeft, deviation, evenWidth, endX;
      function moveFn(e) {
        e.preventDefault();
        e = boxEven["0"] == "touchstart" ? e.touches[0] : e || window.event;
        endX = e.clientX - goX;
        endX = endX > 0 ? (endX > evenWidth ? evenWidth : endX) : 0;
        if (endX > evenWidth * 0.7) {
          progress.innerText = "松开验证";
          progress.style.backgroundColor = "#66CC66";
        } else {
          progress.innerText = "";
          progress.style.backgroundColor = "#FFFF99";
        }
        progress.style.width = endX + deviation + "px";
        evenBox.style.left = endX + "px";
      }
      function removeFn(e) {
        document.removeEventListener(boxEven["2"], removeFn, false);
        document.removeEventListener(boxEven["1"], moveFn, false);
        if (endX > evenWidth * 0.7) {
          progress.innerText = "验证成功";
          progress.style.width = evenWidth + deviation + "px";
          evenBox.style.left = evenWidth + "px";
          codeInput.value = fn.codeVluae;
          // evenBox.removeEventListener(boxEven["0"], handel, false);
        } else {
          progress.style.width = "0px";
          evenBox.style.left = "0px";
        }
      }
      function getOffset(box, direction) {
        var setDirection = direction == "top" ? "offsetTop" : "offsetLeft";
        var offset = box[setDirection];
        var parentBox = box.offsetParent;
        while (parentBox) {
          offset += parentBox[setDirection];
          parentBox = parentBox.offsetParent;
        }
        parentBox = null;
        return parseInt(offset);
      }

      evenBox.addEventListener(boxEven["0"], handel, false);

      fn.setCode = function(code) {
        if (code) fn.codeVluae = code;
      };
      fn.getCode = function() {
        return fn.codeVluae;
      };
      fn.resetCode = function() {
        evenBox.removeAttribute("style");
        progress.removeAttribute("style");
        codeInput.value = "";
      };
      return fn;
    }
  }
};
</script>

<style lang="less" scoped>
.code-box {
  position: relative;
  text-align: center;
}
.code-box p,
.code-box span {
  display: block;
  position: absolute;
  left: 0;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 5px;
  padding: 0;
  margin: 0;
}
.code-box span {
  width: 40px;
  background-color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-right: 1px;
}
.code-box p {
  width: 0;
  background-color: #ffff99;
  overflow: hidden;
  text-indent: -20px;
  transition: background 1s ease-in;
}
.code-box .code-input {
  display: none;
}
.code-box .code-input {
  display: none;
}
.form-inline-input {
  border: 1px solid #dadada;
  border-radius: 5px;
}
.form-inline-input input,
.code-box {
  padding: 0 3px;
  width: 100%;
  height: 40px;
  color: #fff;
  text-shadow: 1px 1px 1px black;
  background: #efefef;
  border: 0;
  border-radius: 5px;
  outline: none;
}
.code-box {
  position: relative;
}
.code-box p,
.code-box span {
  display: block;
  position: absolute;
  left: 0;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 5px;
  padding: 0;
  margin: 0;
}
.code-box span {
  width: 40px;
  background-color: #fff;
  font-size: 16px;
  cursor: pointer;
  margin-right: 1px;
}
.code-box p {
  width: 0;
  background-color: #ffff99;
  overflow: hidden;
  text-indent: -20px;
  transition: background 1s ease-in;
}
.code-box .code-input {
  display: none;
}
.code-box .code-input {
  display: none;
}
</style>
