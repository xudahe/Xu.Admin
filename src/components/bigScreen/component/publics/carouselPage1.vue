	<!-- 中间主体部分 -->
<template>
	<div class="middlePageDiv" style="width: 100%;height: 100%;">
		<!-- 左侧 -->
		<div id="circleLeft" style="height: 100%;width: 25%;float: left;" class="fade-in-right2">
			<homeLeft ref="homeLeft"></homeLeft>
		</div>
		<!-- 中间 -->
		<div id="circleMiddle" style="height: 100%;width: 50%;float: left;">
			<div id="circleMiddleTop" style="height: 75%" class="scale-in1">
				<homeMiddleTop :typename="typename" ref="homeMiddleTop"></homeMiddleTop>
			</div>
			<div id="circleMiddleBot" style="height: 25%;" class="fade-in-up">
				<homeMiddleBot :typename="typename" ref="homeMiddleBot"></homeMiddleBot>
			</div>
		</div>
		<!-- 右侧 -->
		<div id="circleRight" style="height: 100%;width: 25%;float: left;" class="fade-in-left2">
			<homeRight :typename="typename" ref="homeRight"></homeRight>
		</div>
	</div>
</template>
<script>
    
import homeLeft from "../newcompt/homeLeft.vue";
import homeMiddleBot from "../newcompt/homeMiddleBot.vue";
import homeMiddleTop from "../newcompt/homeMiddleTop.vue";
import homeRight from "../newcompt/homeRight.vue";
export default {
	name: "carouselPage1",
	components: {
		homeLeft,
        homeMiddleBot,
        homeMiddleTop,
        homeRight,
	},
	data() {
		return {
			time: null,
			typename: "",
		};
	},
	methods: {
	},
	mounted() {
		var _this = this;
		var data = this.$route.params;
	},
	beforeDestroy() {
	},
};
</script>

<style lang="less">
	// @import url("../style/iconfont.css");
</style>
