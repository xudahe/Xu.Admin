<template>
  <div class="homeMiddleBot" style="height: 100%; width: 100%;">
    <div class="UnitFrame rotate-in-x" style="height: 100%;float: left;width: 50%;">
			<div class="UnitDiv">
        
			</div>
    </div>

    <div class="UnitFrame rotate-in-x" style="height: 100%;float: left;width: 50%;">
			<div class="UnitDiv">
        
			</div>
    </div>
  </div>
</template>

<script>

export default {
  name: "homeMiddleBot",
  components: {
  },
  data() {
    return {
     
    };
  },
  methods: {
 
  },
  mounted() {
    var _this = this;
 
  },
};
</script>

<style lang="less" scoped>
.homeMiddleBot {
  .UnitFrame{
    padding-bottom:0.05rem;
	}
	
  .UnitDiv {
    position: relative;
    height: 100%;
    background: url("../../../../../static/img/newhome/04/6.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}

</style>
