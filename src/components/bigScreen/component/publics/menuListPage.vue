<template>
	<div style="height: 100%;">
		<div style="padding:0.10rem;width: 2.00rem">
			<div v-if="list.length > 0" :key="index" v-for="(item, index) in list" @click="expandlist(index, item)" style="padding-top: 0.1rem;">
                
                <img :class="index==currentindex ?'divImgSel':'divImgNor'" :src="index==currentindex ? optionImgUrl1:optionImgUrl2"/>
				
                <div :key="index" class="navtrans-type-nav" :class="index == currentindex ? 'bgActive-ja' : 'bgActiveF-ja'">
					<div class="navtrans-navlist-title" style="position: absolute;float: left; line-height: 0.74rem;color: #495060;padding: 0 0.2rem;">
						<span class="last labelname_color" style="float: left;">{{ item.name }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import bus from '../../../../eventBus.js';

export default {
	components: {},
	props: {},
	data() {
		return {
			list: [
                {id: 23, name: '数据1'},
                {id: 22, name: '数据2'},
                {id: 24, name: '数据3'},
            ],
			optionImgUrl1: require('../../../../../static/img/newhome/bg_选项_sel.png'),
			optionImgUrl2: require('../../../../../static/img/newhome/bg_选项_nor.png'),
			currentindex: -1,
		};
	},
	methods: {
		//列表操作
		expandlist(indx, item) {
            let _this = this;
            _this.currentindex = indx;
			
		},
		emitlist(data){

		},
	},
	mounted() {
		var _this = this;
	}
};
</script>

<style lang="less" scoped>
    .divImgSel{
        width: 1.6rem;
        cursor: pointer;
        position: initial;
        height: 0.4rem;
        z-index: -2;
    }
    .divImgNor{
        width: 1.6rem;
        cursor: pointer;
        position: relative;
        height: 0.4rem;
        z-index: -2;
    }
    .navtrans-navlist-title {
        margin-top: -0.7rem !important;
    }

    .bgActive-ja {
        // background-image: linear-gradient(to right, #0084db, #0151a8) !important;

        .labelname_color {
            font-size: 0.16rem;
            color: #ffffff !important;
        }
    }
    .bgActiveF-ja {
        // background-image: linear-gradient(to right, #01459d, #0b4893) !important;

        .labelname_color {
            font-size: 0.16rem;
            color: rgba(255, 255, 255, 0.53) !important;
        }
    }

    span .last {
        text-overflow: ellipsis;
        display: block;
        width: 148px;
        color: #fff;
        word-break: keep-all;
        white-space: nowrap;
        float: left;
    }

</style>
