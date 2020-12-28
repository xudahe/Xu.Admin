<template>
  <div id="loyout">
    <el-container  >
      <layoutAside></layoutAside>
      <el-container direction="vertical">
        <layoutHeader @showErrorLogBox="$refs.errorLogBox.dialogVisible = true"></layoutHeader>
        <el-main id="elmain" class="elmain">
          <transition name="main" mode="out-in">
            <keep-alive>
              <router-view v-transition></router-view>
            </keep-alive>
          </transition>
          <back-top :options="{ target: '#elmain' , isMove: true }" />
        </el-main>
        <!-- <el-footer>
          <bottom></bottom>
        </el-footer> -->
      </el-container>
    </el-container>
    <error-log ref="errorLogBox" />
  </div>
</template>

<script>
import layoutAside from "./aside/aside"
import layoutHeader from "./header/header"
import bottom from "./footer/bottom"
import { isMobile, isSafari } from '@/utils/agent'
export default {
  name: "layout",
  components: {
    layoutHeader,
    bottom,
    layoutAside
  },
  methods: {
    isMobile,
    isSafari,
  }
}
</script>

<style lang="scss">
  * {
    margin: 0px;
    padding: 0px;
  }

  body {
    background-color: #f2f2f2;
    font-size: 14px;
    color: #333333;
  }

  li {
    list-style: none;
  }

  a {
    text-decoration: none;
  }

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

  html, body, #loyout, .el-container, #asideNav, ul.el-menu {
    @extend %h100;
  }

  @mixin set-value($side, $value) {
    @each $prop in $leftright {
      #{$side}-#{$prop}: $value;
    }
  }

  #elmain {
    background-color: #fff;
    padding: 5px !important;
  }

  
  .el-footer{
    height: 1.5rem !important;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }


</style>