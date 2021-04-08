<template>
  <div class="recordrtc">
    <el-button @click="start" :disabled="disabled.start">开始录制</el-button>
    <el-button @click="stop" :disabled="disabled.stop">结束录制</el-button>
    <el-button @click="download" :disabled="disabled.download">下载文件</el-button>
  </div>
</template>

<script>
/**
 * https://blog.csdn.net/u013451157/article/details/106197912
 */

export default {
  name: "screenRecord",
  data() {
    return {
      // 本地流
      stream: null,
      // 媒体录制
      mediaRecorder: null,
      // 数据块
      chunks: [],
      // 录制结果
      recording: null,
      // 按钮禁用
      disabled: {
        start: false,
        stop: true,
        download: true
      },
      fileName: new Date().getTime()
    };
  },
  methods: {
    // 获取屏幕分享的权限
    openScreenCapture() {
      // 用于指定请求哪种轨道（音频，视频或两者）
      const constraints = { audio: false, video: true };

      // 在Chrome和Edge浏览器中使用屏幕分享可用getDisplayMedia，而Firefox用getUserMedia。

      if (navigator.getDisplayMedia) {
        return navigator.getDisplayMedia(constraints);
      } else if (navigator.mediaDevices.getDisplayMedia) {
        return navigator.mediaDevices.getDisplayMedia(constraints);
      } else {
        return navigator.mediaDevices.getUserMedia({
          video: { mediaSource: "screen" }
        });
      }
    },
    // 开始屏幕分享录制
    async start() {
      this.disabled.start = true;
      this.disabled.stop = false;
      this.disabled.download = true;

      // 如果之前录制的内容没有清空，那么就用revokeObjectURL方法移除
      if (this.recording) {
        window.URL.revokeObjectURL(this.recording);
      }

      // 获取屏幕分享权限
      this.stream = await this.$options.methods.openScreenCapture();
      // 实例化一个MediaRecorder对象，进行录制存储
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: "video/webm;codecs=vp8"
      });
      // 监听可用数据
      this.mediaRecorder.addEventListener("dataavailable", event => {
        if (event.data && event.data.size > 0) {
          this.chunks.push(event.data); //当有可用数据时，将其push进数据块中进行存储
        }
      });
      // 开始录制
      this.mediaRecorder.start(10);
    },
    // 当点击“停止录制”按钮后，需要将数据块保存到一个内存URL中方便后续下载使用
    stop() {
      this.disabled.start = true;
      this.disabled.stop = true;
      this.disabled.download = false;

      // 停止录制
      this.mediaRecorder.stop();
      // 释放MediaRecorder
      this.mediaRecorder = null;
      // 停止所有流式视频轨道
      this.stream.getTracks().forEach(track => track.stop());
      // 释放getDisplayMedia或getUserMedia
      this.stream = null;

      // 获取当前文件的一个内存URL
      this.recording = window.URL.createObjectURL(
        new Blob(this.chunks, { type: "video/webm" })
      );
    },
    // 当点击“下载文件”按钮时，更新下载元素的链接href，并自动触发点击事件进行弹窗提示下载
    download() {
      console.log(this.recording);
      this.disabled.start = false;
      this.disabled.stop = true;
      this.disabled.download = true;

      let link = document.createElement("a");
      document.body.appendChild(link);
      link.style.display = "none";
      link.href = this.recording;
      link.setAttribute("download", this.fileName + ".webm");
      link.click();
    }
  }
};
</script>

<style lang="less"></style>
