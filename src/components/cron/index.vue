<template lang="html">
  <div class="cron" :val="value_">
    <Row>
      <Col :span = 'isResult ? 18:24'>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="秒" name="s">
            <second-and-minute v-model="sVal" lable="秒"></second-and-minute >
          </el-tab-pane>
          <el-tab-pane label="分" name="m">
            <second-and-minute v-model="mVal" lable="分"></second-and-minute >
          </el-tab-pane>
          <el-tab-pane label="时" name="h">
            <hour v-model="hVal" lable="时"></hour>
          </el-tab-pane>
          <el-tab-pane label="日" name="d">
            <day v-model="dVal" lable="日"></day>
          </el-tab-pane>
          <el-tab-pane label="月" name="month">
            <month v-model="monthVal" lable="月"></month>
          </el-tab-pane>
          <el-tab-pane label="周" name="week">
            <week v-model="weekVal" lable="周"></week>
          </el-tab-pane>
          <el-tab-pane label="年" name="year">
            <year v-model="yearVal" lable="年"></year>
          </el-tab-pane>
        </el-tabs>
      </Col>
      <Col :span = '6' v-if = 'isResult'>
        <el-tabs>
          <el-tab-pane label="结果">
            <Table stripe :columns="columns" :data="tableData" :show-header="false" size="small"/>
          </el-tab-pane>
        </el-tabs>
      </Col>
    </Row>
  </div>
</template>

<script>
import SecondAndMinute from './cron/secondAndMinute'
import hour from './cron/hour'
import day from './cron/day'
import month from './cron/month'
import week from './cron/week'
import year from './cron/year'
export default {
  name: "cron",
  props: {
    value: {
      type: String
    },
    isResult:{
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      activeName: 's',
      sVal: '',
      mVal: '',
      hVal: '',
      dVal: '',
      monthVal: '',
      weekVal: '',
      yearVal: '',

      columns: [
        { title: ' ', width: '80', key: 'name' }, 
        { title: ' ', key: 'value', 
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: params.row.name == "表达式" ? 'red':''
                  }
                },
                params.row.value
              )
            ]);
          } 
        }
      ]
    }
  },
  watch: {
    'value' (a, b) {
      this.updateVal()
    }
  },
  computed: {
    tableData () {
      return [
        { name: '秒', value: this.sVal },
        { name: '分', value: this.mVal },
        { name: '时', value: this.hVal },
        { name: '日', value: this.dVal },
        { name: '月', value: this.monthVal },
        { name: '周', value: this.weekVal },
        { name: '年', value: this.yearVal },
        { name: '表达式', value: this.value },
      ]
    },
    value_ () {
      
      if (!this.dVal && !this.weekVal) {
        return ''
      }
      if (this.dVal === '?' && this.weekVal === '?') {
        this.$message.error('日期与星期不可以同时为“不指定”')
      }
      if (this.dVal !== '?' && this.weekVal !== '?') {
        this.$message.error('日期与星期必须有一个为“不指定”')
      }
      let v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`
      if (v !== this.value) {
        this.$emit('input', v)
      }
      return v
    },
  },
  methods: {
    updateVal () {
      if (!this.value) {
        return
      }
      let arrays = this.value.split(' ')
      this.sVal = arrays[0]
      this.mVal = arrays[1]
      this.hVal = arrays[2]
      this.dVal = arrays[3]
      this.monthVal = arrays[4]
      this.weekVal = arrays[5]
      this.yearVal = arrays[6] == undefined ? '*' : arrays[6]
    },
  },
  created () {
    this.updateVal()
  },
  components: {
    SecondAndMinute, hour, day, month, week, year
  },
}
</script>

<style lang="less">
.cron {
  text-align: left;
  // padding: 0 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);

  .el-checkbox {
    margin-right: 15px !important;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 10px;
  }
}

</style>
