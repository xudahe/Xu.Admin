/**
 * @description 排序（注意：只对值为日期、数字、字符串为数字的字段进行排序。原数组会改变。）
 * @param {Array} list 需要排序的数组
 * @param {Boolean} isDes 是否倒序
 * @param {String} property 如果排序元素为对象，可指定需要排序的字段
 * @returns {Array} 返回新的数组
 * 示例：let list = [{ name: "旋仔", level: 3 }, { name: "旋仔", level: 1 }, { name: "旋仔", level: 2 }]
 *      this.$sortList(list, 'level', true)
 */
function sortList(list, property, isDes = false) {
  if (property) {
    if ((typeof list[0][property]).toLowerCase() === 'number') {
      return list.sort((a, b) => {
        return isDes ?
          b[property] - a[property] :
          a[property] - b[property]
      })
    } else {
      return list.sort((a, b) => {
        return isDes ?
          new Date(b[property]).getTime() - new Date(a[property]).getTime() :
          new Date(a[property]).getTime() - new Date(b[property]).getTime()
      })
    }
  } else {
    return list.sort((a, b) => {
      return isDes ?
        b - a :
        a - b
    })
  }
}
/**
 * @description 模糊搜索数组
 * @param {Array} list 元素为对象的数组
 * @param {Array} keys 需要搜索的键
 * @param {String} value 需要搜索的值
 * 示例：let list = [{ name: "旋仔", age: 20 }, { name: "小伙子", age: 16 }]
 *      this.$searchResult(list, ['name'], '旋仔') // [{ name: "旋仔", age: 20 }]
 *      this.$searchResult(list, ['name'], 'xxx') // []
 */
function searchResult(list, keys, value) {
  return new Fuse(list, {
    matchAllTokens: true,
    findAllMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys
  }).search(value)
}

/**
 * @description 去重(注意：如果数组元素为对象，仅对key值为第一层的对象进行去重)
 * @param {Array} arr 需要去重的数组
 * @param {String} key 数组元素为对象，可传入key值进行排序（对象键值为一层）
 * @returns {Array} 返回新的数组
 * 示例：const arr_1 = [1, 2, 3, 2, 1]
 *      this.$removeRepeat(arr_1) // [1, 2, 3]
 *      const arr_2 = [{value: "123"}, {value: "321"}, {value: "123"}, {value: "321"}, {value: "123"}]
 *      this.$removeRepeat(arr_1, 'value') 
 */
function removeRepeat(arr, key) {
  let newArr = []
  if (key) {
    let hash = {}
    newArr = arr.reduce((prev, next) => {
      !hash[next[key]] && (hash[next[key]] = true, prev.push(next))
      return prev
    }, [])
  } else {
    arr.forEach(val => {
      if (!newArr.includes(val)) {
        newArr.push(val)
      }
    })
  }
  return newArr
}

export default {
  sortList,
  searchResult,
  removeRepeat
}
