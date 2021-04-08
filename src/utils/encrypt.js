// import {
//   JSEncrypt
// } from 'jsencrypt'

//非对称加密公钥
const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCD84Pei8dcNzhz8JqaL0d0j0og4YZL++BWNCxBumgBGGPl7dKkTO1hzeF3ixudgrp1TPafc0pCGXvvnczwBxuAb7nseoP5Oj4H9TVsOxmV1fqLMmikLGdwjvPlK1Yclck+9bbe+h8fzv0bWM3uvQb8fF6qhNMhJGs/oZTEQB2BSwIDAQAB`

//非对称加密私钥
const privateKey = `MIICWwIBAAKBgQCD84Pei8dcNzhz8JqaL0d0j0og4YZL++BWNCxBumgBGGPl7dKkTO1hzeF3ixudgrp1TPafc0pCGXvvnczwBxuAb7nseoP5Oj4H9TVsOxmV1fqLMmikLGdwjvPlK1Yclck+9bbe+h8fzv0bWM3uvQb8fF6qhNMhJGs/oZTEQB2BSwIDAQABAoGAQENjIAnXiFPkjKLLyPfpxxzaL3Vm4K7FLXavbzuH17C3Ro4zHo3Qtud8PapkQqwef26CVlnh+ptKvwKNgwETJRohUlM6Fwhl/CJpdRDnbV1w5y8/NlFyXgI4mS35H8wj0N7OWO1aRgsZ3g55o6w1iajSb0yys4ME0kdXTUQk0uECQQDzbGEw7zgJA1SfDGJC3+fIiEHAWL/LxzB6l9BmbXpEkKKsqYbxLaeBnNUusWa40hb/+Jej4+wX/sxVdRb6YDjzAkEAisTCCASLBH+f+MWzWEJrjiBDglcyw9nLS6ogO+YymMy1vNO588aAKts4SUQF+O+hyiIXL0Nbb+hr8wCyVG6sSQJASdYbGQPG5Hz9Iw1XlN9j6CDkiNqiusYdv2HjVd5pUvjoTyVRCEEH6TnQNEydUvxu+4/FN3JAP/sKsfVFVgbv3wJAQOcdyRo22vfGHlh5NUJ7g5HbgU6/U5K93rnHMbzM1WKJbbOpOTcSIvk9Lic+k9ugVCX1qgla7tBKDPG6dnr84QJAaWKR8MfVRpOUC7yANLj/+mbh9NTcBEt4grpziKpj5Plt8B6pQFdZtEJHOr4Vlc8f3MbzQPgC9vNcC4XY1bSQGg==`

//注意：如果需要对一个对象加密，需要先使用JSON.stringify()将对象转为字符串

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}
