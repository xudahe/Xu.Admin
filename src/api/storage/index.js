/**
 * @author xuanzai
 * @description 会话缓存
 * @param {String} key
 * @param {Any} data 
 */
function setMemorySes(key, data) { //会话存储，写入
    sessionStorage.setItem(key, JSON.stringify(data))
}

function getMemorySes(key) { //会话存储，读取
    return JSON.parse(sessionStorage.getItem(key))
}

/**
 * @author xuanzai
 * @description 长久缓存
 * @param {String} key
 * @param {Number | Boolean | String | Object} data 
 */
function setMemoryPmt(key, data) { //长久存储，写入
    localStorage.setItem(key, JSON.stringify(data))
}
function getMemoryPmt(key) { //长久存储，读取
    return JSON.parse(localStorage.getItem(key))
}

function clearMemorySes() {
    sessionStorage.clear()
}

function clearMemoryPmt() {
    localStorage.clear()
}

export default {
    setMemorySes,
    getMemorySes,
    setMemoryPmt,
    getMemoryPmt,
    clearMemorySes,
    clearMemoryPmt
}