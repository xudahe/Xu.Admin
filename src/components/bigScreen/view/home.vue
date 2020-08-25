<template>
	<div id="homemain" style="height: 100%;width: 100%;">
		<header2></header2>
		<router-view />
	</div>
</template>

<script>
import Vue from 'vue';
import header2 from '../component/header.vue';
import NavConfig from '../router/nav.configCompent.yml';

export default {
	components: {
		header2
	},
	watch: {
		$route(to, from) {
			
		}
	},
	mounted() {
		this.$router.push({
			name: 'homePage',
			query: {
				id: 11
			}
		});
	},
	data() {
		return {
			
		};
	},
	beforeDestroy() {

	},
	methods: {
		regeisterComponent(NavConfig) {
			const routes = [];
			const parentRoutes = {};

			Object.keys(NavConfig).forEach((lang, idx) => {
				const pageNavs = NavConfig[lang];
                
				pageNavs.forEach(nav => {
					const parentName = nav.name;
					const pagetype = nav.type;
					
					if (nav.groups) {
						nav.groups.forEach(group => {
							group.items.forEach(item => {
								regeisterComponent(parentName, item.name, group.name);
								if (item.details) {
									item.details.forEach(item1 => {
										regeisterComponent(parentName, item1.name, group.name, item.name);
									});
								}
							});
						});
					}
				});
			});

			function regeisterComponent(parentName, templateName, groupname, itemName) {
				Vue.component(templateName, function(resolve) {
					// 这个特殊的 require 语法告诉 webpack
					// 自动将编译后的代码分割成不同的块，
					// 这些块将通过 Ajax 请求自动下载。
					if (itemName) {
						require([`@/${parentName}/${groupname}/${itemName}/${templateName}.vue`], resolve);
					} else {
						require([`@/${parentName}/${groupname}/${templateName}.vue`], resolve);
					}
				});
			}
		},
	},
	created() {
		this.regeisterComponent(NavConfig);
	}
};
</script>
<style lang="less" scoped>
 #homemain{
	background-image: url("../../../../static/img/newhome/02/bg2-1.png");
	background-size: 100% 100%;
 }
</style>
