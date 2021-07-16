<template>
  <div style="height:100%;width:100%;" class="test3 bgActive collapse simple_page form">
    <div style="padding: 0.05rem;height: 100%;">

      <div class="mulist" style="padding-bottom: 0.05rem;">
        <Form :label-width="80" style="padding: 10px 0px;">
          <FormItem label="供图范围:" >
            <ButtonGroup>
              <tooltip content="绘制点" @mousemove.native="moveindex=1" @mouseleave.native="moveindex=-1">
                <Button size="small" @click="draw('point')" style="height: 24px;width: 29px;text-align: center;">
                  <img :src="'../../../static/img/images/menu'+ (moveindex==1?'light':'')+'img/点.png'" style="margin-top: 0px;margin-left: -2px;" />
                </Button>
              </tooltip>
              <Tooltip content="绘制多段线"  @mousemove.native="moveindex=2" @mouseleave.native="moveindex=-1">
                <Button size="small" @click="draw('polyline')" style="height: 24px;width: 29px;text-align: center;">
                  <img :src="'../../../static/img/images/menu'+ (moveindex==2?'light':'')+'img/线.png'" style="margin-top: 0px;margin-left: -3px;" />
                </Button>
              </Tooltip>
              <Tooltip content="绘制多边形"  @mousemove.native="moveindex=3" @mouseleave.native="moveindex=-1">
                <Button size="small" @click="draw('polygon')" style="height: 24px;width: 29px;text-align: center;">
                  <img :src="'../../../static/img/images/menu'+ (moveindex==3?'light':'')+'img/多边形.png'" style="margin-top: 1px;margin-left: -1px;" />
                </Button>
              </Tooltip>
              <Tooltip content="绘制矩形框"  @mousemove.native="moveindex=4" @mouseleave.native="moveindex=-1">
                <Button size="small" @click="draw('extent')" style="height: 24px;width: 29px;text-align: center;">
                  <img :src="'../../../static/img/images/menu'+ (moveindex==4?'light':'')+'img/矩形.png'" style="margin-top: 1px;margin-left: -3px;" />
                </Button>
              </Tooltip>
              <Tooltip content="上传范围面"  @mousemove.native="moveindex=5" @mouseleave.native="moveindex=-1">
                <input type="file" value id="uploadgeofile9" @change="uploadConfig($event,1)" multiple hidden />
                <Button size="small" @click="handleclick(9)" style="height: 24px;width: 29px;text-align: center;">
                  <img :src="'../../../static/img/images/menu'+ (moveindex==5?'light':'')+'img/上传.png'" style="margin-top: 0px;margin-left: -2px;" />
                </Button>
              </Tooltip>
              <Tooltip content="下载范围面"  @mousemove.native="moveindex=6" @mouseleave.native="moveindex=-1">
                <Button size="small" @click="outputPolygon" style="height: 24px;width: 29px;text-align: center;">
                  <img :src="'../../../static/img/images/menu'+ (moveindex==6?'light':'')+'img/下载.png'" style="margin-top: 0px;margin-left: -2px;" />
                </Button>
              </Tooltip>
              <Tooltip content="清空"  @mousemove.native="moveindex=7" @mouseleave.native="moveindex=-1">
                <Button size="small" @click="clearDraw" style="height: 24px;width: 29px;text-align: center;">
                  <img :src="'../../../static/img/images/menu'+ (moveindex==7?'light':'')+'img/清理.png'" style="margin-top: 0px;margin-left: -3px;" />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </FormItem>
          <FormItem label="缓冲半径:" >
            <Input v-model="checkBuffer" placeholder><span slot="append">m</span></Input>
          </FormItem>
        </Form>
      </div>

      <div style="overflow: auto;height: calc(100% - 0.65rem);" class="borderdiv">

      </div>

      <div class="row at-row flex-end" style="padding-top: 0.1rem;">
        <Page simple show-total :current="page.current" :total="page.total" @on-change="changePage" size="small" style="padding-right: 0.1rem;float: right;"></Page>
        <span style="color:#fff;font-size: 0.12rem;padding-left: 0.1rem;">共{{page.total}}条</span>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../../../eventBus.js";
import { MapControl } from "../../arcgis_map/js/MapControl.js";

export default {
  components: {

  },
  data() {
    return {
      moveindex: -1, //摸上去效果
      checkGeometry: "",
      checkBuffer: "",
      page: {
        pageSize: 10, //每页记录数
        current: 1, //当前页码
        total: 0,
        pageList: [],
      },
      selectId: -1, //已选择的编号
      tableList: [],

    };
  },
  methods: {
    clearDraw() {
      MapControl.setMapClear();
    },
    draw(val) {
      MapControl.setMapClear();
      bus.$on("mapDrawresult", this.checkGeometryString);
      MapControl.mapDraw(val);
    },
    checkGeometryString(value) {
      var _self = this;
      if (!value) {
        this.$Message.error("绘制出的范围面有误,请重新绘制！");
      }
      this.checkGeometry = value;
      bus.$off("mapDrawresult", _self.checkGeometryString);
    },
    handleclick(index) {
      document.getElementById("uploadgeofile" + index).value = "";
      document.getElementById("uploadgeofile" + index).click();
    },
    uploadConfig(e) {
      let formData = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append("file", e.target.files[i]);
      }
      if (e.target.files.length > 0) {
        // this.$Loading.start();
      } else {
        return;
      }
      formData.append("cmd", "FileUpload");
      //   let url = mapconfig.onewebservices + "dxmin/DxApply.ashx";
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      let that = this;
      axios.post(url, formData, config).then(function (response) {
        that.handleFormatTrue(response.data, index, that);
      });
    },
    handleFormatTrue(response, index, that) {
      //   that.$Loading.finish();
      if (response.success == true) {
        that.$Message.success("文件上传成功");
        let data = response.source;
        for (let i = 0; i < data.length; i++) {
          let file = data[i];
          if (file.RECTINFO && file.RECTINFO.length > 0 && index == 1) {
            let geometry = file.RECTINFO[0].geostr;

            if (geometry && geometry != "") {
              let geo = MapControl.WktToAgs(geometry);
              MapControl.showGraphic(geo, undefined, "gralyr1");
            }
          }
        }
      } else {
        that.$Message.error("文件上传失败：" + response.source);
      }
    },
    outputPolygon() {
      //   this.$http
      //     .post(
      //       mapconfig.onewebservices + "dxmin/DxApply.ashx?cmd=FileDownloasload",
      //       {
      //         geometry: "", //范围面
      //         buffer: "", //缓冲范围
      //         geotype: "", //文件格式 shp或dwg
      //       }
      //     )
      //     .then(function (response) {
      //       if (response.data.success == true) {
      //         let tmpa = document.createElement("a");
      //         tmpa.href = response.data.source;
      //         tmpa.target = "_blank";
      //         tmpa.click();
      //       } else {
      //         this.$Message.error(response.data.source);
      //       }
      //     });
    },

    changePage(index) {
      this.page.current = index;
      this.page.total = this.page.pageList.length;

      var _start = (index - 1) * this.page.pageSize;
      var _end = index * this.page.pageSize;
      this.tableList = this.page.pageList.slice(_start, _end);
    },
    goto(item, index) {

    }
  },
  mounted() {
    var _this = this;
    // this.changePage(1);
  },
  beforeDestroy() {

  },
  created() {
  }
};
</script>

<style lang="less">
.test4 {

}
</style>
