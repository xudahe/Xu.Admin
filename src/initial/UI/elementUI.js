import Vue from 'vue'
// 引入element-ui框架
import ElementUI from 'element-ui'

// 加入element-ui组件
// Vue.use(ElementUI)

// 修改input组件默认有清空按钮
// ElementUI.Input.props.clearable.default=true;

 //全局配置：size 用于改变组件的默认尺寸，zIndex 设置弹框的初始 z-index（默认值：2000）
Vue.use(ElementUI, { size: 'medium', zIndex: 3000 });