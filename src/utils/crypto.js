
import CryptoJS from "crypto-js"

const encryptKey = "WfJTKO9S4eLkrPz2JKrAnzdb"
const encryptIV = "D076D35C"

// 3DES加密
export function desEncrypt (str, key = encryptKey, iv = encryptIV) {
  var cryptoKey = CryptoJS.enc.Utf8.parse(key) // 秘钥
  var cryptoIv = CryptoJS.enc.Utf8.parse(iv.substr(0, 8)) // 偏移量
  var encodeStr = CryptoJS.TripleDES.encrypt(str, cryptoKey, {
    iv: cryptoIv,
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7
  })
  return encodeStr.toString() // 此方式返回base64格式
}

// 3DES解密
export function desDecrypt (str, key = encryptKey, iv = encryptIV) {
  var cryptoKey = CryptoJS.enc.Utf8.parse(key)
  var cryptoIv = CryptoJS.enc.Utf8.parse(iv.substr(0, 8))
  var decryptStr = CryptoJS.TripleDES.decrypt(str, cryptoKey, {
    iv: cryptoIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decryptStr.toString(CryptoJS.enc.Utf8)
}
