
import CryptoJS from "crypto-js"

const encryptKey = "WfJTKO9S4eLkrPz2JKrAnzdb"
const encryptIV = "D076D35C"

// 3DES加密
export function desEncrypt (text, key = encryptKey, iv = encryptIV) {
  var cryptoKey = CryptoJS.enc.Utf8.parse(key) // 秘钥
  var cryptoIv = CryptoJS.enc.Utf8.parse(iv.substr(0, 8)) // 偏移量
  var encodeStr = CryptoJS.TripleDES.encrypt(text, cryptoKey, {
    iv: cryptoIv,
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7
  })
  return encodeStr.toString() // 此方式返回base64格式
}

// 3DES解密
export function desDecrypt (text, key = encryptKey, iv = encryptIV) {
  var cryptoKey = CryptoJS.enc.Utf8.parse(key)
  var cryptoIv = CryptoJS.enc.Utf8.parse(iv.substr(0, 8))
  var decryptStr = CryptoJS.TripleDES.decrypt(text, cryptoKey, {
    iv: cryptoIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decryptStr.toString(CryptoJS.enc.Utf8)
}

/**
 * MD5 加密
 * @param {String} text 原始文本
 * @returns {*} 转md5否的文本
 */
export function md5(text) {
  return CryptoJS.MD5(text).toString()
}

/**
 * Base64转码
 * @param {String} text 文本
 * @returns {string} base64文本
 */
export function base64Encode(text) {
  const wordArray = CryptoJS.enc.Utf8.parse(text);
  return CryptoJS.enc.Base64.stringify(wordArray);
}

/**
 * Base64 解码
 * @param {String} text base64密文
 * @returns {string} 原始文本
 */
export function base64Decode(text) {
  const parsedWordArray = CryptoJS.enc.Base64.parse(text);
  return parsedWordArray.toString(CryptoJS.enc.Utf8);
}
