<template>
    <div class="v-video"> 
        <video :id="videoId" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" style='width: 100%;height: 100%' poster="auto">
			<!-- <source id="source" src="http://58.213.48.106/CCTV/无人机河道巡检/大庙沟视频/大庙沟_20200512/Index.m3u8" type="application/x-mpegURL"> -->
        </video>
    </div>
</template>

<script>

import videojs from 'video.js'
import 'videojs-contrib-hls'

import { randomWord } from '../../utils/index.js'

export default {
    name: "v-video",
    props: {
      videoUrl: {
        type: String,
        default:  'http://cctvalih5ca.v.myalicdn.com/live/cctv1_2/index.m3u8'
      },
    },
    watch: {
      'videoUrl' (a, b) {
        this.updateUrl()
      }
    },
    data () {
        return {
            videoId: 'video'+ randomWord(true,2,4),
            myVideojs: '',
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initialVideo();
            this.updateUrl()
        })
    },
    methods: {
        initialVideo() {
            this.myVideojs = videojs(this.videoId, {
              bigPlayButton: true,
              textTrackDisplay: false,
              posterImage: false,
              errorDisplay: false,
              hls: {
                withCredentials: true
              }
            }, function(){
                console.log('videojs播放器初始化成功')
            });
        },
        updateUrl() {
            if(this.videoUrl.indexOf(".m3u8") != -1){
                this.myVideojs.src({src: this.videoUrl, type: "application/x-mpegURL"})
                // this.myVideojs.play()
            } else if(this.videoUrl.indexOf(".mp4") != -1){
                this.myVideojs.src({src: this.videoUrl, type: "video/mp4"})
            } else if(this.videoUrl.indexOf(".ogg") != -1){
                this.myVideojs.src({src: this.videoUrl, type: "video/ogg"})
            } else if(this.videoUrl.indexOf("rtmp:") != -1){
                this.myVideojs.src({src: this.videoUrl, type: "rtmp/flv"})
            }
        }
    },
    beforeDestroy(){
        this.myVideojs.dispose();
    },
};
</script>

<style lang="less" scoped>
.v-video{
    height: 100%;
    width: 100%;
}
</style>