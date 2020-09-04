<template>
	<div class="homeRight" style="width: 100%;height: 100%;">
        <div class="UnitFrame fade-in-left1" style="height: 25%;float: left;width: 100%;">
			<div class="UnitDiv">

			</div>
        </div>
		<div class="UnitFrame fade-in-left1" style="height: 25%;float: left;width: 100%;">
			<div class="UnitDiv">

			</div>
        </div>
		<div class="UnitFrame fade-in-left1" style="height: 50%;float: left;width: 100%;">
			<div class="UnitDiv">

			</div>
        </div>
	</div>
	</div>
</template>

<script>
	import bus from "../../../../eventBus.js";

	export default {
		name: "homeRight",
		components: {
			
		},
		props: {
			typename: {
				type: String,
				default () {
					return "河道";
				}
			}
		},
		data() {
			return {};
		},
		methods: {},
		mounted() {
			var _this = this;
		}
	};
</script>

<style lang="less" scoped>
.homeRight {
    .UnitFrame{
        padding: 0 0.05rem 0.05rem 0.05rem;
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
