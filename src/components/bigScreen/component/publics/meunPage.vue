<style scoped>

/** 左侧菜单 **/
.layout-pane-east{
	position: absolute; 
	margin: 0px;
	right: auto;
	left: 0px;
	top: 0px;
	bottom: 0px; 
	
	z-index:999; width: 74px;
	display: block; 
	visibility: visible;
}

.ui-sub-menu {
    width: 100%;
    height: 100%;
    padding-top: 10px;
    box-sizing: border-box;
    background: #052763;
}
.ui-sub-menu .submenu li {
    margin-bottom: 10px;
    cursor: pointer;
}
.ui-sub-menu .submenu li p {
    text-align: center;
    color: #9db8e5;
    line-height: 18px;
}
.ui-sub-menu .submenu li:hover p {
    color: #fff;
}

.ui-sub-menu .submenu .menu-icon {
    height: 36px;
    width: 38px;
    display: block;
    vertical-align: middle;
    margin: 0 auto;
}

.ui-sub-menu p,.ui-sub-menu li {
    color: #9db8e5; font-size: 14px;
    margin-bottom: 15px;

}
.ui-sub-menu .submenu .actives,.ui-sub-menu .submenu .actives p{
    color: #5dce00;
}
/*.ui-sub-menu .submenu li:hover p {
    color: #fff;
}*/
.ui-sub-menu .submenu li:hover {
    color: #fff;
    
}
</style>
<template>
    <div class="layout-pane-east">
        <div class="ui-sub-menu">
            <ul class="submenu">
                <li v-for="(item,key) in menuData" :key="key" @click="menuClick(item.type,item.index)" style="text-align: center;" :class="cukey==item.index? 'actives':''">
                 <Icon :type="item.icon" size="36"  />
                 <p>{{item.name}}</p>
             </li>
         </ul>
     </div>
 </div>
</template>
<script>
    import bus from "../../../../eventBus.js";
    export default {
       components: {
       },
       data() {
        return{
            cukey:-1
        }
    },
    name: 'menu',
    props: {
        menuData:{
             type: Array,
             default () {
                return []
            }
        }
    },
    methods: {
        menuClick(type,index) {
            //菜单组件 点击事件  type 类型 index 索引
            bus.$emit("meunclick",type,index)
            this.cukey=index;
        }
    },
    mounted() {
        var _this = this;
    }
}
</script>