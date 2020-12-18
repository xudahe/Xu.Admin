<style>
/*分屏样式*/
#mapviewbase {
  height: 100%;
  width: 100%;
}
.mapclass {
  left: 0px;
  width: 100%;
  height: 100%;
  bottom: 0px;
  border: 1px solid #186fdc;
}
</style>
<template>
  <div id="mapviewbase">
    <Row style="width: 100%;  height: 100%;">
      <template v-for="(item, index) in items">
        <Col :span="12" style="height: 100%;">
          <mapview
            :id="item"
            class="mapclass"
            @ExtentChange="ExtentChange"
          ></mapview>
        </Col>
      </template>
    </Row>
  </div>
</template>
<script>
import mapview from "./splitsceen";
import bus from "../../eventBus.js";
import { MapControl } from "../map/js/MapControl";
import mapconfig from "../map/js/mapconfig";

export default {
  components: { mapview },
  props: {
    items: Array
  },
  data() {
    return {
      startid: "", //记录开始变化的id
      endid: "" //记录变化后的id
      // items: ['mapbox0','mapbox1'] //获取全局地图id名称变量
    };
  },
  methods: {
    clearMapControl() {
      mapconfig.MapControl = {}; //置空
    },
    isEmptyObject(obj) {
      for (var key in obj) {
        return false;
      }
      return true;
    },
    isEmptyObject2key(obj, keyname) {
      for (var key in obj) {
        if (key == keyname) return true;
      }
      return false;
    },
    getmapid(value) {
      this.startid = value;
      for (let key in mapconfig.MapControl) {
        if (key == value) mapconfig.MapControl[key] = true;
        else mapconfig.MapControl[key] = false;
      } //第一次切换地图窗口时，以切换后的窗体作为主体，同步其他窗口
      // bus.$off("getmapid", "off");
    },
    ExtentChange(value) {
      if (
        this.isEmptyObject(mapconfig.MapControl) ||
        !this.isEmptyObject2key(mapconfig.MapControl, value.id)
      ) {
        mapconfig.MapControl[value.id] = false;
        if (
          this.items.length > 1 &&
          this.items.length ==
            Object.getOwnPropertyNames(mapconfig.MapControl).length
        ) {
          mapconfig.MapControl[value.id] = true;
          MapControl.ExtentChange(value.event, this.items);
          bus.$off("ExtentChange", "off");
        }
      }
      if (this.items.length < 2) {
        // bus.$off("ExtentChange", "off");
        return;
      }
      if (this.startid != value.id) {
        // bus.$off("ExtentChange", "off");
        return;
      }
      //当鼠标在同一个地图窗口中；地图四角坐标变化，将重置地图窗口同步要素；
      MapControl.ExtentChange(value.event, this.items);
    },
    Splitscreenclick() {
      this.items = this.$store.state.mapitems;
    }
  },
  mounted() {
    this.clearMapControl();
    bus.$on("getmapid", this.getmapid);
    bus.$on("ExtentChange", this.ExtentChange);
  },
  beforeDestroy() {
    bus.$off("getmapid", this.getmapid);
    bus.$off("ExtentChange", this.ExtentChange);
  }
};
</script>
