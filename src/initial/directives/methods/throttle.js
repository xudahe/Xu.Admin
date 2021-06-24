/**
 * @description 节流 每单位时间可触发一次
 * 第一次瞬间触发，最后一次不管是否达到间隔时间依然触发
 * 
 * 例：<el-button v-throttle="[reset,`click`,1000]">刷新</el-button>
 * 传递参数则：<el-button v-throttle="[()=>reset(param),`click`,1000]">刷新</el-button>
 */
const debounce = {
  inserted: function (el, binding) {
    let [fn, event = "click", time = 1000] = binding.value
    let timer, timer_end;
    el.addEventListener(event, () => {
      if (timer) {
        clearTimeout(timer_end);
        return timer_end = setTimeout(() => fn(), time);
      }
      fn();
      timer = setTimeout(() => timer = null, time)
    })
  },
}

export default debounce
