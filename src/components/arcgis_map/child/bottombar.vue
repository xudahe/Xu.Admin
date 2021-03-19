<template>
	<div style="z-index: 4;position: absolute;bottom: 0px;left: 10px;">
		<div style="float:left;width: 500px;" ref="bottom_label"></div>
	</div>
</template>
<script>
	export default {
		props: {
			datasource: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {}
		},
		watch: {
			datasource: {
				handler: function(val, oldVal) {
					var x = Number(val.mapPoint.x);
					var y = Number(val.mapPoint.y);
					var scale = parseInt(val.scale)
					if (scale % 2) {
						scale = scale + 1
					}
					this.$refs.bottom_label.innerHTML =
						'<div style="line-height:30px;color:rgba(0,0,0,0.8)"><strong>X坐标：' +
						x.toFixed(3) +
						"</strong><span>&nbsp;&nbsp;</span><strong>Y坐标：" +
						y.toFixed(3) +
						"</strong><strong>&nbsp;&nbsp;&nbsp;比例尺: 1:" + scale + "</strong></div>";
				},
				deep: true
			}

		},
		mounted() {},
		methods: {}
	}
</script>
