<template>
  <el-color-picker
    class="can-hover"
    :value="value"
    :predefine="predefine"
    size="mini"
    @change="setChange"/>
</template>

<script>

export default {
  name: 'colorPicker',
  data () {
    return {
        value: '#BCB2AE',
        predefine: [
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585'
        ]
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    setChange(){
          
    },
  },
  mounted(){
     
  }
}
</script>
<style lang="less" scoped>
 .can-hover{
    vertical-align: middle;
 }
</style>