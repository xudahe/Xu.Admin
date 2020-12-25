import dialogDrag from './methods/dialogDrag'
import copy from './methods/copy' //复制粘贴指令 v-copy
import emoji from './methods/emoji' //禁止表情及特殊字符 v-emoji
import longpress from './methods/longpress'
import debounce from './methods/debounce' //输入框防抖指令 v-debounce
import waterMarker from './methods/waterMarker' //实现页面水印 v-waterMarker
import color from './methods/color'

//注册指令,出口文件，所有全局指令都在该文件里导出。
export default {
  dialogDrag,
  copy,
  emoji,
  longpress,
  debounce,
  waterMarker,
  color
}
