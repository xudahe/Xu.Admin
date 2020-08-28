/**
 * @author xu
 * @description 创建websocket实例
 * @param {Object} option 
 * @returns {WebSocket}
 */
export default ({
    url,
    onOpen,
    onMessage,
    onError,
    onClose
  }) => {
  if (!url) {
    throw new Error("请填写连接url")
  }
  const ws = new WebSocket(url)
  ws.addEventListener('open', e => {
    onOpen && onOpen(e)
  })
  ws.addEventListener('message', e => {
    onMessage && onMessage(e)
  })
  ws.addEventListener('error', e => {
    onError && onError(e)
  })
  ws.addEventListener('close', e => {
    onClose && onClose(e)
  })
  return ws
}

// 示例：
// this.$createSocket(
//     {
//       url: "ws://xxx.com/xxx", // 连接websocket地址（必填）
//       onOpen(e) {}, // websokcet打开后的回调（选填）
//       onMessage(e) {}, // websocket接收到信息后的回调（选填）
//       onError(e) {}, // websocket出错后的回调（选填）
//       onClose(e) {} // websocket关闭后的回调（选填）
//     }
//   ) // 返回WebSocket实例

