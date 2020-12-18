/**
 * @description 复制粘贴指令
 * 需求：防止按钮在短时间内被多次点击，使用防抖函数限制规定时间内只能点击一次。
 * 
 * 1.定义一个延迟执行的方法，如果在延迟时间内再调用该方法，则重新计算执行时间。
 * 2.将时间绑定在 click 方法上。
 * 
 * 使用：给 Dom 加上 v-debounce 及回调函数即可  <button v-debounce="debounceClick">防抖</button>
 */
const debounce = {
    inserted: function (el, binding) {
      let timer
      el.addEventListener('keyup', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          binding.value()
        }, 1000)
      })
    },
  }
  
  export default debounce
  
/**
<template>
  <button v-debounce="debounceClick">防抖</button>
</template>

<script>
export default {
  methods: {
    debounceClick () {
      console.log('只触发一次')
    }
  }
}
 */