/**
 * Created by WebStorm.
 * User: nirongxu
 * Date: 2020/4/15
 * Description: 全局工具方法
 */

// 深度复制
export function deepClone (obj) {
  let result = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object") {
        result[key] = deepClone(obj[key])
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

// 随机生成由字母+数字的字符串
export function randomWord (randomFlag, min, max) {
  // randomFlag: Boolean 是否随机个数
  // min 最少个数
  // max 最大个数
  var str = ""
  var range = min
  var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  var pos = ""
  for (var i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

// base64ToFile
export function base64ToFile (base64Data, tempfilename, contentType) {
  contentType = contentType || ""
  var sliceSize = 1024
  var byteCharacters = atob(base64Data)
  var bytesLength = byteCharacters.length
  var slicesCount = Math.ceil(bytesLength / sliceSize)
  var byteArrays = new Array(slicesCount)

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize
    var end = Math.min(begin + sliceSize, bytesLength)

    var bytes = new Array(end - begin)
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0)
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes)
  }
  var file = new File(byteArrays, tempfilename, { type: contentType })
  return file
}

// 将base64转换为文件
export function dataURLtoFile (dataurl, filename) {
  var arr = dataurl.split(",")
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// 将图片转换为Base64
export function getImgToBase64 (url, callback, outputFormat) {
  var canvas = document.createElement("canvas")
  var ctx = canvas.getContext("2d")
  var img = new Image()
  img.crossOrigin = "Anonymous"
  img.onload = function () {
    canvas.height = img.height
    canvas.width = img.width
    ctx.drawImage(img, 0, 0)
    var dataURL = canvas.toDataURL(outputFormat || "image/png")
    callback(dataURL)
    canvas = null
  }
  img.src = url
}


// 秒转换时分秒
export function transverterMss (result) {
  var h = Math.floor(result / 3600) < 10 ? "0" + Math.floor(result / 3600) : Math.floor(result / 3600)
  var m = Math.floor((result / 60 % 60)) < 10 ? "0" + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
  var s = Math.floor((result % 60)) < 10 ? "0" + Math.floor((result % 60)) : Math.floor((result % 60))
  return h + ":" + m + ":" + s
}

// 获取日期时间戳
export function getTime (dayNum) {
  var myDate = new Date()
  var lw = new Date(myDate - 1000 * 60 * 60 * 24 * dayNum)// 最后一个数字多少天前的意思
  var lastY = lw.getFullYear()
  var lastM = lw.getMonth() + 1
  var lastD = lw.getDate()
  var startdate = lastY + "-" + (lastM < 10 ? "0" + lastM : lastM) + "-" + (lastD < 10 ? "0" + lastD : lastD)
  var b = startdate.split(/\D/)
  var date = new Date(b[0], b[1] - 1, b[2])
  var time = date.getTime()
  return time
}

// 获取几天之前日期
export function getData (dayNum) {
  var myDate = new Date()
  var lw = new Date(myDate - 1000 * 60 * 60 * 24 * dayNum)// 最后一个数字多少天前的意思
  var lastY = lw.getFullYear()
  var lastM = lw.getMonth() + 1
  var lastD = lw.getDate()
  var startdate = lastY + "-" + (lastM < 10 ? "0" + lastM : lastM) + "-" + (lastD < 10 ? "0" + lastD : lastD)
  return startdate
}

// 日期转换时间戳
export function getNewTime (dayNum) {
  var b = dayNum.split(/\D/)
  var date = new Date(b[0], b[1] - 1, b[2])
  var time = date.getTime()
  return time
}
