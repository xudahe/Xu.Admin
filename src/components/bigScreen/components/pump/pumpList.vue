<style lang="less">
.tpumplists {
  margin: 0px;
  padding: 0px;
  font-size: 0px;

  .box {
    -moz-page-break-inside: avoid;
    -webkit-column-break-inside: avoid;
    padding: 1em;
    margin: 1em 0.5em;
    break-inside: avoid;
    border: none;
    background-color: #1042e3b3;
  }

  .ivu-card-head {
    border-bottom: 1px solid rgb(37, 68, 245) !important;
    padding: 0.1rem !important;
  }
  .ivu-card-body {
    padding: 0.11rem !important;
  }

  #typedataselect {
    .ivu-select-selected-value {
      font-size: 0.14rem;
    }
    .ivu-checkbox-wrapper-checked {
      font-size: 0.14rem;
      color: #73c5ff;
    }
  }

  .spe {
    cursor: pointer;
  }

  .box-wrapper {
    -moz-column-count: 4;
    -webkit-column-count: 4;
    -moz-column-gap: 1em;
    -webkit-column-gap: 1em;

    column-count: 4;
    column-gap: 1em;
    padding: 0.1rem 0.15rem;
  }

  .pumtables,
  tr,
  th,
  td {
    font-size: 0.14rem;
  }

  .pumtables {
    width: 100%;
  }

  .pumtables tr {
    width: 100%;
    text-align: center;
  }
  .nav-div:hover {
    outline: 0;
  }
  .nav-div {
    width: 30%;
    height: 100%;
    vertical-align: top;
    display: inline-block;
    text-align: center;
  }

  .nav-div span {
    display: inline-block;
    width: 20%;
    height: 100%;
    font-size: 0.14rem;
    font-weight: 700;
    line-height: 0.3rem;
    cursor: pointer;
  }
  .tagselects {
    border-bottom: 1px #1037c1 solid;
  }
  .tagselect {
    border-bottom: 3px #005afe solid;
  }

  .nav-tl {
    height: 100%;
    float: right;
    display: inline-block;
  }

  .nav-tldiv {
    display: flex;
    height: 100%;
    margin: 0px 0.2rem;
    align-items: center;

    float: left;
    img {
      height: 50%;
      font-size: 0.14rem;
    }
    span {
      font-size: 0.14rem;
      margin-right: 5px;
      color: #ffffff;
    }
  }

  .conton td span {
    width: 94%;
    margin: auto;
    display: block;
    line-height: 2;
  }

  @keyframes turn {
    0% {
      -webkit-transform: rotate(0deg);
    }
    25% {
      -webkit-transform: rotate(90deg);
    }
    50% {
      -webkit-transform: rotate(180deg);
    }
    75% {
      -webkit-transform: rotate(270deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  .lixian {
    background-color: rgba(80, 80, 80, 0.85);
    color: #9e9a9c;
    .ivu-card-head {
      border-bottom: 1px solid #9e9a9c !important;
    }
    .titlelist {
      color: #9e9a9c;
    }
    .concolor {
      color: #9e9a9c;
    }
  }

  .zhengchang {
    background-color: #1042e3b3;
    .ivu-card-head {
      border-bottom: 1px solid rgb(2, 135, 244) !important;
    }
    .titlelist {
      color: #ffffff;
    }
    .conton td:nth-child(1) {
      color: #ffffff;
    }
    .concolor th:nth-child(1) {
      color: rgb(2, 135, 244);
    }
    .conton td:nth-child(2) {
      color: #ffffff;
    }
    .concolor th:nth-child(2) {
      color: rgb(2, 135, 244);
    }
    .conton td:nth-child(3) {
      color: #ffffff;
    }
    .concolor th:nth-child(3) {
      color: rgb(2, 135, 244);
    }
  }

  .baojin {
    background-color: rgba(63, 10, 74);
    .ivu-card-head {
      border-bottom: 1px solid #9e252b !important;
    }
    .titlelist {
      color: #ffffff;
    }
    .conton td:nth-child(1) {
      color: red;
    }
    .concolor th:nth-child(1) {
      color: red;
    }
    .conton td:nth-child(2) {
      color: #afafaf;
    }
    .concolor th:nth-child(2) {
      color: #afafaf;
    }
    .conton td:nth-child(3) {
      color: red;
    }
    .concolor th:nth-child(3) {
      color: red;
    }
  }
}
</style>
<template>
  <div class="tpumplists" style="width: 100%;height: 99%">
    <div style="height: 0.3rem;color: #ffffff;width: 85%;" class="tagselects">
      <div class="nav-div">
        <span @click="chagetag('全部')" :class="tageindex == '全部' ? 'tagselect' : '' ">全部({{lygpupmlist.alllist != undefined ? lygpupmlist.alllist.length : 0}})</span>
        <span @click="chagetag('正常')" :class="tageindex == '正常' ? 'tagselect' : '' ">正常({{lygpupmlist.在线 != undefined ? lygpupmlist.在线.length : 0}})</span>
        <span @click="chagetag('报警')" :class="tageindex == '报警' ? 'tagselect' : '' ">报警({{lygpupmlist.报警 != undefined ? lygpupmlist.报警.length : 0}})</span>
        <span @click="chagetag('离线')" :class="tageindex == '离线' ? 'tagselect' : '' ">离线({{lygpupmlist.离线 != undefined ? lygpupmlist.离线.length : 0}})</span>
      </div>
      <div class="nav-tl">
        <div class="nav-tldiv"><span class="close">污水开</span><img src="static/img/pump/污水开.png" alt=""></div>
        <div class="nav-tldiv"><span class="open">污水关</span><img src="static/img/pump/污水关.png" alt=""></div>
        <div class="nav-tldiv"><span class="close">雨水开</span><img src="static/img/pump/雨水开.png" alt=""></div>
        <div class="nav-tldiv"><span class="open">雨水关</span><img src="static/img/pump/雨水关.png" alt=""></div>
        <div class="nav-tldiv"><span class="open">机组关</span><img src="static/img/pump/泵站机组关.png" alt=""></div>
      </div>
      <div style="display: inline-block; height: 100%;padding: 0.05rem 0px;margin-left: 0.5rem;">
        <CheckboxGroup id="typedataselect" @on-change='selectdatachange' v-model="selectdata">
          <Checkbox label="雨水">
            <span>雨水泵站</span>
          </Checkbox>
          <Checkbox label="污水">
            <span>污水泵站</span>
          </Checkbox>
        </CheckboxGroup>
      </div>
    </div>
    <div style="width: 100%;height: calc(100% - 5%);overflow: auto">
      <div class="box-wrapper">
        <Card @click.native="expandlist(key,item)" :dis-hover="true" :class="boxclassfun(item,index,key)" v-for="(item,index,key) in lygpupmlist.showlist" :key="index" :style="firstbox(item,index,key)">
          <div slot="title" style="width: 100%;height: 100%">
            <div class="titlelist" style=" width:65%;display: inline-block;">
              <div style="height: 100%;display: inline-block;width: 17%;float: left;"><img style="margin-right: 0.2rem;width:100%;" :src=" 'static/img/pump/'+(item.category+item.status)+'.png' " /></div>
              <div style="height: 100%;display: inline-block;width: calc(100% - (17% + 2%));">
                <span style="font-size: 0.14rem;font-weight: 700;display: block;width: 100%;margin-bottom: 0.1rem;">{{item.pumpname}}</span>
                <span style="font-size: 0.12rem;font-weight: inherit;display: block;">{{item.timestamp | capitalize}}</span>
              </div>
            </div>
            <div style=" display: inline-block;  width:35% ; float: right;">
              <template v-for="(itema,index,key) in item.pznum">
                <img :src="imgssrc(itema,item,index,key)" style="width: 0.20rem;height: 0.20rem;margin: 0rem 0.03rem;" />
              </template>
            </div>
          </div>
          <div>
            <table class="pumtables">
              <tr class="conton">
                <td><span :style="{'font-size':' 0.16rem','font-weight':' bold','color':item.liquidlevel > item.jjsw ? '#ff6c6c':''}">{{parseFloat(item.liquidlevel).toFixed(2) | capitalize}}</span></td>
                <td><span style="font-size: 0.16rem;font-weight: bold;">{{item.jjsw | capitalize}}</span></td>
                <td><span style="font-size: 0.16rem;font-weight: bold;">{{item.status | capitalize}}</span></td>
              </tr>
              <tr class="concolor">
                <th><span :style="{'color':item.liquidlevel > item.jjsw ? '#ff6c6c':''}">当前水位(m)</span></th>
                <th><span>警戒水位(m)</span></th>
                <th><span>泵站状态</span></th>
              </tr>
            </table>
          </div>
        </Card>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "pumpList",
  props: {
    pumpdata: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    pumpdata: {
      handler(newdata, olddata) {
        var _this = this;
        _this.initlistdata(newdata);
      },
      deep: true
    }
  },
  filters: {
    capitalize: function (value) {
      if (value == '' || value == undefined || value == "NaN") return '--';
      return value
    }
  },
  data() {
    return {
      lygpupmlist: {
        alllist: [],
        showlist: [],
      },
      tageindex: '正常',
      selectdata: ["雨水", "污水"],
    }
  },
  beforeDestroy() {

  },
  mounted() {
    this.initlistdata(this.pumpdata);
  },
  methods: {
    selectdatachange() {
      var olddata = this.tageindex == '全部' ? this.lygpupmlist.alllist : this.lygpupmlist[this.tageindex == '正常' ? '在线' : this.tageindex];
      var list = JSON.parse(JSON.stringify(olddata));
      list = list.filter(item => {
        if (this.selectdata.indexOf('雨水') != 0) {
          return item.category == 1;
        }
        if (this.selectdata.indexOf('污水') != 0) {
          return item.category == 2;
        }
      });
      this.lygpupmlist.showlist = list;
    },
    boxclassfun(item, index, key) {
      var strclass = 'box spe';
      if (item.status == '离线') strclass += ' lixian';
      if (item.status == '在线') strclass += ' zhengchang';
      if (item.status == '报警') strclass += ' baojin';
      return strclass
    },
    firstbox(item, index, key) {
      var json = "";
      if (index == 0) json += 'margin-top:0px;';
      // if(item.status =='离线') json+='background-color:#505050d9;' ;
      return json
    },
    imgssrc(itema, item, index) {
      if (item.status == '离线') return 'static/img/pump/泵站机组关.png';
      var srcname = '污水';
      if (item.category == 1) srcname = '雨水';
      if (item.category == 2) srcname = '污水';

      var indexs = 'p_' + (index + 1);
      var indexid = item[indexs];
      if (indexid != '') {
        return 'static/img/pump/' + srcname + '开.png'
      } else {
        return 'static/img/pump/' + srcname + '关.png'
      }
      return ''
    },
    chagetag(indexstatic) {
      this.tageindex = indexstatic;
      this.lygpupmlist.showlist = [];
      if (indexstatic == '正常') indexstatic = '在线';

      if (indexstatic == '全部') {
        this.lygpupmlist.showlist = this.lygpupmlist.alllist;
      } else {
        for (var i = 0; i < this.lygpupmlist.alllist.length; i++) {
          var item = this.lygpupmlist.alllist[i];
          switch (indexstatic) {
            case '在线':
              if (item.status == indexstatic) this.lygpupmlist.showlist.push(item);
              break;
            case '报警':
              if (item.status == indexstatic) this.lygpupmlist.showlist.push(item);
              break;
            case '离线':
              if (item.status == indexstatic) this.lygpupmlist.showlist.push(item);
              break;
          }
        }
      }
      this.selectdatachange(this.selectdata);
    },
    expandlist(indx, item, indev) {

    },
    initlistdata(data) {
      if (data.length <= 0) return;
      var _this = this;
      let source = data;

      _this.lygpupmlist.alllist = source; //所有

      _this.lygpupmlist['在线'] = [];
      _this.lygpupmlist['报警'] = [];
      _this.lygpupmlist['离线'] = [];

      for (var i = 0; i < source.length; i++) {
        var item = source[i];
        switch (item.status) {
          case '在线':
            this.lygpupmlist['在线'].push(item);
            break;
          case '报警':
            this.lygpupmlist['报警'].push(item);
            break;
          case '离线':
            this.lygpupmlist['离线'].push(item);
            break;
        }
      }

      if (_this.tageindex == '全部') _this.lygpupmlist.showlist = source;
      else _this.lygpupmlist.showlist = _this.lygpupmlist[_this.tageindex == '正常' ? '在线' : _this.tageindex];
      this.selectdatachange(this.selectdata);
    },
  },
}
</script>
