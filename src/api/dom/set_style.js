/**
 * @author xu
 * @description 设置样式（注意：设置的样式为内联样式，不会覆盖所有内联样式，而是通过追加的形式添加样式）
 * @param {DOM} el  	DOM元素
 * @param {String | Object} ruleName    	CSS属性或组合CSS对象
 * @param {String} value  当ruleName字段为String类型时，该字段必传
 * // 设置单个属性 this.$setStyle(this.$refs.background, 'background-image', 'url(xxxx)')
 * // 设置多个属性 this.$setStyle(this.$refs.background, { backgroundImage: 'url(xxx)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' })
 */
function setStyle(el, ruleName, value) {
  if ((typeof ruleName).toLowerCase() === 'string') {
    el.style[ruleName] = value
  } else {
    for (let key in ruleName) {
      el.style[key] = ruleName[key]
    }
  }
}

/**
 * @author xu
 * @description 设置内联样式（注意：设置后会覆盖原有的内联样式，效果等同于在html标签中写样式）
 * @param {DOM} el 
 * @param {String} rule
 * 示例： this.$setCssText(this.$refs.background, ` background: #666; padding: 20px;`)
 */
function setCssText(el, rule) {
  el.style.cssText = rule
}

/**
 * @author xu
 * @description 设置全局样式（注意：通过创建style标签并动态追加到head标签内完成样式的全局覆盖）
 * @param {String} css css代码
 * @param {String} className 类名（如果不填该属性，则每次调用都会创建一个新的style标签）
 * 示例： this.$createStyle(`body { background: #666; padding: 20px; }`)
 */
function createStyle(css = "", className = "") {
  const style = className
    ? document.querySelector(`.${className}`)
    : null
  if (style) {
    style.innerText = css
  } else {
    const style = document.createElement('style')
    className && (style.className = className)
    style.innerText = css
    document.querySelector('head').appendChild(style)
  }
}

export default {
  setStyle,
  setCssText,
  createStyle,
}

