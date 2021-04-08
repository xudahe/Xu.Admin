<template>
    <div class="v-video"> 
        <video :id="videoId" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto"  width="400" height="300" poster="auto" autoplay
			data-setup="{}">
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
        default:  'http://221.178.195.2:83/openUrl/wsKmyKA/live.m3u8'
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
              aspectRatio: "4:3", //视频的宽高比
				bigPlayButton: true,
				textTrackDisplay: false,
				posterImage: false,
				errorDisplay: false,
				controlBar: {
					captionsButton: false,
					chaptersButton: false,
					subtitlesButton: false,
					liveDisplay: false,
					playbackRateMenuButton: false
				},
				hls: {
					withCredentials: true
				}
            }, function(){
                console.log(this)
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