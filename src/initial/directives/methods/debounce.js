/**
 * @description 防抖 单位时间只触发最后一次
 * 需求：防止按钮在短时间内被多次点击，使用防抖函数限制规定时间内只能点击一次。
 * 
 * 1.定义一个延迟执行的方法，如果在延迟时间内再调用该方法，则重新计算执行时间。
 * 2.将时间绑定在 click 方法上。
 * 
 * 例：<el-button v-debounce="[reset,`click`,1000]">刷新</el-button>
 * 也可简写成：<el-button v-debounce="[reset]">刷新</el-button>
 */
const debounce = {
  inserted: function (el, binding) {
    let [fn, event = "click", time = 1000] = binding.value
    let timer
    el.addEventListener(event, () => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => fn(), time)
    })
  },
}

export default debounce
