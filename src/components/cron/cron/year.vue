<template lang="html">
  <div :val="value_">
    <div>
      <el-radio v-model="type" label="1" size="mini" border>每年</el-radio>
    </div>
    <div>
      <el-radio v-model="type" label="5" size="mini" border>不指定</el-radio>
      <span style="margin-left: 10px; margin-right: 5px;">允许的通配符[, - * /] 非必填</span>
    </div>
    <div>
      <el-radio v-model="type" label="2" size="mini" border>周期</el-radio>
      <span style="margin-left: 10px; margin-right: 5px;">从</span>
      <el-input-number @change="type = '2'" v-model="cycle.start" :min="2000" size="mini" style="width: 100px;"></el-input-number>
      <span style="margin-left: 5px; margin-right: 5px;">至</span>
      <el-input-number @change="type = '2'" v-model="cycle.end" :min="2000"  size="mini" style="width: 100px;"></el-input-number>
      年
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '*'
    }
  },
  data () {
    let year = new Date().getFullYear()
    return {
      type: '1', // 类型
      cycle: { // 周期
        start: year,
        end: year
      },
    }
  },
  computed: {
    value_ () {
      let result = []
      switch (this.type) {
        case '1': // 每秒
          result.push('*')
          break
        case '2': // 年期
          result.push(`${this.cycle.start}-${this.cycle.end}`)
          break
        default: // 不指定
          result.push('?')
          break
      };
      this.$emit('input', result.join(''))
      return result.join('')
    }
  },
  watch: {
    'value' (a, b) {
      this.updateVal()
    }
  },
  methods: {
    updateVal () {
      if (!this.value) {
        return
      }
      if (this.value === '?') {
        this.type = '5'
      } else if (this.value.indexOf('-') !== -1) { // 2周期
        if (this.value.split('-').length === 2) {
          this.type = '2'
          this.cycle.start = this.value.split('-')[0]
          this.cycle.end = this.value.split('-')[1]
        }
      } else if (this.value.indexOf('*') !== -1) { // 1每
        this.type = '1'
      }
    }
  },
  created () {
    this.updateVal()
  }
}
</script>

<style lang="css">

</style>
