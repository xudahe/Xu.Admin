<template>
	<div style="width: 100%;height: 100%;">
		<component :is="componentdiv"></component>
	</div>
</template>

<script>
	import bus from "../../../../eventBus.js";

	export default {
		name: "homeRight",
		components: {
			// homepublicLeft,
			// dispatchLeft,
			// purificationLeft,
			// homepublicLeftnew,
			// overviewLeft
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
		computed: {
			componentdiv() {
				let divname = "";
				// switch (this.typename) {
				// 	case "河道":
				// 		divname = homepublicLeft;
				// 		break;
				// 	case "管网":
				// 		divname = homepublicLeftnew;
				// 		break;
				// 	case "净水站":
				// 		divname = purificationLeft;
				// 		break;
				// 	case "泵站":
				// 		divname = dispatchLeft;
				// 		break;
				// 	case "总览":
				// 		divname = overviewLeft;
				// 		break;
				// }
				return divname;
			}
		},
		methods: {},
		mounted() {
			var _this = this;
		}
	};
</script>

<style lang="less" scoped>
</style>
