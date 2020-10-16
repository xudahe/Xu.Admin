/**
 * @description 验证是否为邮箱
 * @param {String} s 
 */
export function isEmail(s) {
	return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}
/**
 * @description 验证是否为电话号码
 * @param {String} s 
 */
export function isPhone(s) {
	return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}
/**
 * @description 验证是否为网络地址
 * 校验规则：
 *    以https://、http://、ftp://、rtsp://、mms://开头、或者没有这些开头
 *    可以没有www开头(或其他二级域名)，仅域名
 *    网页地址中允许出现/%*?@&等其他允许的符号
 */
export function isURL(s) {
	return /^(https:\/\/|http:\/\/|ftp:\/\/|rtsp:\/\/|mms:\/\/)?[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(str);
}

// 获取URL中的某参数值,不区分大小写,
// 默认是取'hash'里的参数，
// 如果传其他参数支持取‘search’中的参数
// @param {String} name 参数名称
export function getUrlParam(name, type = "hash") {
  let newName = name,
    reg = new RegExp("(^|&)" + newName + "=([^&]*)(&|$)", "i"),
    paramHash = window.location.hash.split("?")[1] || "",
    paramSearch = window.location.search.split("?")[1] || "",
    param;

  type === "hash" ? (param = paramHash) : (param = paramSearch);

  let result = param.match(reg);

  if (result != null) {
    return result[2].split("/")[0];
  }
  return null;
}

// 检验URL链接是否有效
export function getUrlState(URL) {
  var xmlhttp = new ActiveXObject("microsoft.xmlhttp");
  xmlhttp.Open("GET", URL, false);
  try {
    xmlhttp.Send();
  } catch (e) {
  } finally {
    var result = xmlhttp.responseText;
    if (result) {
      if (xmlhttp.Status == 200) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

// 提取页面代码中所有网址
export function getUrl() {
	return document.documentElement.outerHTML
        .match(
          /(url\(|src=|href=)[\"\']*([^\"\'\(\)\<\>\[\] ]+)[\"\'\)]*|(http:\/\/[\w\-\.]+[^\"\'\(\)\<\>\[\] ]+)/gi
        )
        .join("\r\n")
        .replace(/^(src=|href=|url\()[\"\']*|[\"\'\>\) ]*$/gim, "");
}
  
// 获得URL中GET参数值
// 用法：如果地址是 test.htm?t1=1&t2=2&t3=3, 那么能取得：GET["t1"], GET["t2"], GET["t3"]
export function getGet() {
  querystr = window.location.href.split("?");
  if (querystr[1]) {
    GETs = querystr[1].split("&");
    GET = [];
    for (i = 0; i < GETs.length; i++) {
      tmp_arr = GETs.split("=");
      key = tmp_arr[0];
      GET[key] = tmp_arr[1];
    }
  }
  return querystr[1];
}

// 校验是否为不含端口号的IP地址
// 校验规则：
//     IP格式为xxx.xxx.xxx.xxx，每一项数字取值范围为0-255
//     除0以外其他数字不能以0开头，比如02
export function isIP(str) {
    return /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/.test(str);
}

// 校验是否为IPv6地址
// 校验规则：支持IPv6正常格式；支持IPv6压缩格式
export function isIPv6(str){
    return Boolean(str.match(/:/g)?str.match(/:/g).length<=7:false && /::/.test(str)?/^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str):/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str));
}

/**
 * @description 验证是否为全小写
 * @param {String} s 
 */
export function isLowerCase(s) {
	return /^[a-z]+$/.test(s)
}
/**
 * @description 验证是否为全大写
 * @param {String} s 
 */
export function isUpperCase(s) {
	return /^[A-Z]+$/.test(s)
}
/**
 * @description 验证是否为颜色值
 * @param {String} s
 */
export function isColor(color) {
	return new RegExp(/^#([\da-f]{3}){1,2}$/gi).test(color)
}
/**
 * @description 判断是否为数字类型
 * @param {String} s
 */
export function isDigit(value) {
	var patrn = /^[0-9]*$/;
	if (patrn.exec(value) == null || value == "") {
	  return false;
	} else {
	  return true;
	}
}
/**
 * @description 验证是否为手机号码
 * @param {String} s
 */
export function isMobileNumber(e) {
	var i =
		"134,135,136,137,138,139,150,151,152,157,158,159,187,188,147,182,183,184,178",
	  n = "130,131,132,155,156,185,186,145,176",
	  a = "133,153,180,181,189,177,173,170",
	  o = e || "",
	  r = o.substring(0, 3),
	  d = o.substring(0, 4),
	  s =
		!!/^1\d{10}$/.test(o) &&
		(n.indexOf(r) >= 0
		  ? "联通"
		  : a.indexOf(r) >= 0
		  ? "电信"
		  : "1349" == d
		  ? "电信"
		  : i.indexOf(r) >= 0
		  ? "移动"
		  : "未知");
	return s;
}

// 校验是否为中国大陆手机号
export function isTel(value) {
    return /^1[3,4,5,6,7,8,9][0-9]{9}$/.test(value.toString());
}

// 校验是否为中国大陆传真或固定电话号码
export function isFax(str) {
    return /^([0-9]{3,4})?[0-9]{7,8}$|^([0-9]{3,4}-)?[0-9]{7,8}$/.test(str);
}

// 校验是否为QQ号码
// 校验规则： 非0开头的5位-13位整数
export function isQQ(value) {
    return /^[1-9][0-9]{4,12}$/.test(value.toString());
}

// 校验是否为 数字
export function isNum(value,floats=null){
    let regexp = new RegExp(`^[1-9][0-9]*.[0-9]{${floats}}$|^0.[0-9]{${floats}}$`);
    return typeof value === 'number' && floats?regexp.test(String(value)):true;
}

// 校验是否为非零的正整数
export function isInt(value,minLength=null,maxLength=undefined){
    if(!isNum(value)) return false;

    let regexp = new RegExp(`^-?[1-9][0-9]${anysicIntLength(minLength,maxLength)}$`);
    return regexp.test(value.toString());
}

// 校验是否为非零的正整数
export function isPInt(value,minLength=null,maxLength=undefined) {
    if(!isNum(value)) return false;

    let regexp = new RegExp(`^[1-9][0-9]${anysicIntLength(minLength,maxLength)}$`);
    return regexp.test(value.toString());
}

// 校验是否为非零的负整数
export function isNInt(value,minLength=null,maxLength=undefined){
    if(!isNum(value)) return false;
    let regexp = new RegExp(`^-[1-9][0-9]${anysicIntLength(minLength,maxLength)}$`);
    return regexp.test(value.toString());
}

// 校验整数是否在取值范围内
// 校验规则： minInt为在取值范围中最小的整数；maxInt为在取值范围中最大的整数
export function checkIntRange(value,minInt,maxInt=9007199254740991){
    return Boolean(isInt(value) && (Boolean(minInt!=undefined && minInt!=null)?value>=minInt:true) && (value<=maxInt));
}

// 校验是否为中国大陆第二代居民身份证
// 校验规则：
//     共18位，最后一位可为X(大小写均可)
//     不能以0开头
//     出生年月日会进行校验：年份只能为18/19/2*开头，月份只能为01-12，日只能为01-31
export function isIDCard(str){
    return /^[1-9][0-9]{5}(18|19|(2[0-9]))[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{3}[0-9Xx]$/.test(str);
}

// 校验是否为中国大陆邮政编码
// 校验规则：共6位，且不能以0开头
export function isPostCode(value){
    return /^[1-9][0-9]{5}$/.test(value.toString());
}

// 验两个参数是否完全相同，包括类型
// 校验规则： 值相同，数据类型也相同
export function same(firstValue,secondValue){
    return firstValue===secondValue;
}

// 校验字符的长度是否在规定的范围内
// 校验规则： minInt为在取值范围中最小的长度；maxInt为在取值范围中最大的长度
export function lengthRange(str,minLength,maxLength=9007199254740991) {
    return Boolean(str.length >= minLength && str.length <= maxLength);
}

// 校验字符是否以字母开头
// 校验规则： 必须以字母开头；开头的字母不区分大小写
export function letterBegin(str){
    return /^[A-z]/.test(str);
}

// 清除所有空格
export function clearSpaces(str){
    return str.replace(/[ ]/g,'');
}

// 清除所有中文字符(包括中文标点符号)
export function clearCNChars(str){
    return str.replace(/[\u4e00-\u9fa5]/g,'');
}

// 清除所有中文字符及空格
export function clearCNCharsAndSpaces(str){
    return str.replace(/[\u4e00-\u9fa5 ]/g,'');
}

// 校验是否包含空格
export function haveSpace(str) {
    return /[ ]/.test(str);
}

// 校验是否包含中文字符(包括中文标点符号)
export function haveCNChars(str){
    return /[\u4e00-\u9fa5]/.test(str);
}