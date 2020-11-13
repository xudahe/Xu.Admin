/**
 * @description 防抖函数
 * @description 就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
 * @param {Function} callback 回调函数
 * @param {Number} time 单位ms
 * @param {Boolean} immediate 第一次是否调用
 * @returns {Function}
 */
function debounce(callback, time, immediate = true) {
  var timeout, result;

  var debounced = function() {
    // 保存this指向
    var context = this
    // 如果定时器存在,就清除定时器引用
    timeout && clearTimeout(timeout)
    // 如果参数为true, 则为即执行函数
    if(immediate) {
      // 如果定时器引用不存在,则立刻调用函数;如果定时器存在,则不调用函数
      var isCall = !timeout
      // 给定时器添加引用
      timeout = setTimeout(() => {
        // time秒后去除定时器引用
        timeout = null
      }, time)
      isCall && (result = callback.apply(context, arguments))
    }else {
      // time秒后执行函数
      timeout = setTimeout(() => {
        callback.apply(context, arguments)	
      }, time)
    }
    // 返回函数结果(一般用于即执行函数)
    return result
  }
  
  //取消
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };
  
  return debounced;
} 
  
  /**
   * @description 节流函数
   * @description 就是指连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。
   * @param {Function} callback 回调函数
   * @param {Number} wait 单位ms
   * @param {object} options  leading：false 表示禁用第一次执行 trailing: false 表示禁用停止触发的回调
   * @returns {Function}
   */
  function throttle(callback, wait, options) {
    var timeout, context, args, previous = 0
    if (!options) options = {};

    // 设置一个函数,用于收尾调用(最后一次调用)
    var later = function() {
      previous = options.leading === false ? 0 : new Date();
      timeout = null
      callback.apply(context, args)
      if (!timeout) context = args = null;  
    }

    var throttled = function() {
      // 设置当前时间
      var now = +new Date() 
      if (!previous && options.leading === false) previous = now;
      // 保存当前时间差
      var remaining = wait - (now - previous)
      context = this
      args = arguments
      
      /**
       * 如果时间差小于零,表示已经超过等待时间,可以立刻执行.
       * 第二种情况就是修改了系统时间
       * 如果将系统时间改为以前，则使得当前时间小于上一次的时间，出现remaining比wait大的情况
       * 如果将系统时间改为久远的未来，则使得当前时间远大于上一次的时间，出现remaining为负数的情况
       */
      if(remaining <= 0 || remaining > wait) {
        // 定时器存在,去除定时器,保存当前时间,立刻执行函数.
        if(timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        previous = now
        callback.apply(context, args)
        if (!timeout) context = args = null;
      }else if(!timeout) {
        // 如果定时器不存在,将延迟函数的执行
        timeout = setTimeout(later, remaining)
      }
    }

    //取消
    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = null;
    }

    return throttled;
  } 
  
  export default {
    debounce,
    throttle
  }