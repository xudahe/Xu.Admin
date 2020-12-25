import formatDate from './formatDate'

// 根据身份证号码判断男女
const sexIdcard = value => {
  return !value ? '' : value.substr(16, 1) % 2 === 1 ? '男' : '女';
}

// 身份证号脱敏('331082199708094687' 转换成 '33108219********87') 第8位开始替换8个
const IDcardHide = num => {
  return num.replace(/(\d{8})\d{8}(\d*)/, '$1********$2')
}

// 手机号脱敏('13912345678' 转换成 '139****5678') 第3位开始替换4个
const telHide = num => {
  return num.replace(/(\d{3})\d{4}(\d*)/, '$1****$2')
}

// 姓名脱敏(小明 转换成 *明   李小明 转换成 李*明   欧阳小明 转换成 欧**明)
const nameHide = name => {
  if (name.length === 2) {
    return new Array(name.length).join('*') + name.substr(-1)
  } else {
    return (
      name.substr(0, 1) + new Array(name.length - 1).join('*') + name.substr(-1)
    )
  }
}

// 注册过滤器,出口文件，所有全局过滤器都在该文件里导出。
export default {
  formatDate,
  sexIdcard,
  IDcardHide,
  telHide,
  nameHide
}
