/**
 * @author xuanzai
 * @description 获取url后的参数
 * @param { url } 传入的url，默认为空
 * @returns { Object }
 * 示例：this.$urlQuery([url]) // url: http://myinterface.xuanzai.top/getPicture?type=头像&id=1  result: { type: '头像', id: 1 }
 */
function urlQuery(url = "") {
  let
    query = {},
    param = ""
  if (url) {
    param = url.split("?")[1]
  } else if (window.location.search) {
    param = window.location.search.replace("?", "")
  } else {
    return query
  }
  if(!param) {
    return  {}
  }
  param.split("&").forEach(val => {
    const
      key = val.split("=")[0],
      value = val.split("=")[1]
    query[key] = value
  })
  return query
}

export default urlQuery
