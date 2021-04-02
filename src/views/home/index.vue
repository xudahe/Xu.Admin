<template>
  <div ref="home" class="home card_css">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card" shadow="hover">
          <swiper :imgList="imgList"></swiper>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" shadow="hover">
          <el-button @click.native="showdialog1">弹出框</el-button>
          <el-button @click.native="showdialog2">弹出框</el-button>
          <el-button @click.native="button1">打印</el-button>
          <slide></slide>
        </el-card>
      </el-col>
    </el-row>

    <v-dialog
      ref="dialog"
      v-model="dialog.show"
      :title="dialog.title"
      :buttons="dialog.buttons"
      :bodyshow="dialog.bodyshow"
    >
      <div style="height: 300px;">
        <countdown></countdown>
      </div>
    </v-dialog>
    <dialog1 ref="dragdialog" v-show="showDialog"></dialog1>
  </div>
</template>

<script>
import dialog1 from "../../components/dialog/dialog1";
import slide from "../../components/slideverify/slide";
import countdown from "../../components/countdown/index1";

export default {
  components: {
    dialog1,
    slide,
    countdown
  },
  data() {
    return {
      options: [],
      imgList: [
        { img: "./static/img/home/b1.png" },
        { img: "./static/img/home/b2.png" },
        { img: "./static/img/home/b3.png" },
        { img: "./static/img/home/b4.png" }
      ],

      dialog: {
        show: false,
        title: {
          text: "分析",
          className: "xa-bg-blue" //标题样式类名
        },
        bodyshow: true
      },
      showDialog: false
    };
  },
  mounted() {},
  methods: {
    showdialog1() {
      this.dialog.show = true;
      this.$refs.dialog.retresize();
    },
    showdialog2() {
      this.showDialog = true;
      this.$store.state.drag_com = "handsontable";
      this.$store.state.drag_ref = "handsontable";
      this.$refs.dragdialog.retresize();
    },
    button1() {
      this.$print(this.$refs.home);
    },
    handleEchartUpdated() {
      console.log("echarts组件的updated钩子函数被触发");
    }
  }
};
</script>
<style>
.home {
  height: 100%;
  width: 100%;
}
</style>
