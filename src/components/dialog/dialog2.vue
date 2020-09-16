<style>
.draggable {
  z-index: 1000;
  top: 0px;
  right: 0px;
  position: absolute !important;
  right: 0px;
  width: 60%;
  height: 550px;
  overflow: auto;
  overflow-x: hidden;
  border-radius: 1px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2), 0 2px 6px 0 rgba(0, 0, 0, 0.19);
}


.dialog_title {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  background: #f6f8f8;
  border-color: #edf1f2;
  background-image: -webkit-linear-gradient(top, #fff 0, #eee 100%);
  height: 35px;
}

.dialog_btn {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
}

.dialog_title font {
  font-size: 14px;
  color: #333;
  margin: 7px 0 6px 10px;
  cursor: default;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.gx-scrollbar {
  background: #ffffff;
}
.gx-scrollbar::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
.gx-scrollbar::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #d3d3d3;
}
.gx-scrollbar::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}

.diaglogpanel {
  position: absolute;
  top: 35px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  overflow: auto;
  border-radius: 5px;
  background-color: rgba(255,255,255,0.8);
  /* opacity:0.5; */
}
</style>
<template>
  <div id="dragPanel" class="draggable">
    <div class="dialog_title handle">
      <font>{{ menuname }}</font>
      <div class="dialog_btn">
        <Button size="small" style="margin:5px;" shape="circle" @click="resize()">
          <font-awesome-icon icon="window-minimize" size="lg" v-if="!MaxSize"/>
          <font-awesome-icon icon="window-maximize" size="lg" v-else/>
        </Button>
        <Button size="small" style="margin:5px;" shape="circle" @click="close()">
          <font-awesome-icon icon="times" size="lg"/>
        </Button>
      </div>
    </div>
    <div class="diaglogpanel gx-scrollbar">
      <component :is="this.$store.state.drag_com" :ref="this.$store.state.drag_ref"></component>
    </div>
  </div>
</template>
<script>

import bus from "../../eventBus.js";

export default {
  components: {

  },
  data() {
    return {
      menuname: "",
      MaxSize: true,
      drag_com: "",
      drag_ref: "",
    };
  },
  methods: {
    close() {
      this.$parent.showDialog = false;

      var dragPanel = document.getElementById("dragPanel");
      dragPanel.style.width = "60%";
      dragPanel.style.height = "400px";
     
      this.$store.state.drag_com = "";
      this.$store.state.drag_ref = "";
    },
    resize() {
      var dragPanel = document.getElementById("dragPanel");
      let panelname = this.$store.state.drag_com;
      if (panelname == "case_statistics") {
        if (dragPanel.style.height == "35px") {
          dragPanel.style.height = "100%";
          dragPanel.style.width = "100%";
          this.MaxSize = false;
        } else {
          dragPanel.style.height = "35px";
          dragPanel.style.width = "100%";
          this.MaxSize = true;
        }
      } else {
        if (dragPanel.style.height == "35px") {
          dragPanel.style.height = "60%";
          this.MaxSize = false;
        } else {
          dragPanel.style.height = "35px";
          this.MaxSize = true;
        }
      }
    },
  },
  mounted() {
    var elem = document.querySelector(".draggable");
    var draggie = new Draggabilly(elem, {
      containment: true,
      handle: ".handle"
    });
  }
};
</script>