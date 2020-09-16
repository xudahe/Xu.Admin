<template>
  <el-container id="box">
       {{ date }}
  </el-container>
</template>
<script>
 //创建一个函数来增加月日时小于10在前面加0
   var padaDate = function(value){
      return value<10 ? '0'+value : value;
   };
export default {
  name: "newDate",
  data() {
    return {
      date: new Date(), //实时时间
      timeId: null,
    };
  },
  methods: {
   
  },
  created() {
    
  },
  mounted() {
    //创建定时器更新最新的时间
    var _this = this;
    this.timeId = setInterval(function() {
      _this.date = _this.$formatDate(new Date(), true);
    }, 1000);
  },
  beforeDestroy: function() {
    //实例销毁前青出于定时器
    if (this.timeId) {
      clearInterval(this.timeId);
    }
  }
};
</script>
<style lang="scss" scoped>

</style>