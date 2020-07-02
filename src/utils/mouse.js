//判断鼠标是否移出事件
function isMouseOut(e, handler) {
    if (e.type !== "mouseout") {
      return false;
    }
    var reltg = e.relatedTarget
      ? e.relatedTarget
      : e.type === "mouseout"
      ? e.toElement
      : e.fromElement;
    while (reltg && reltg !== handler) {
      reltg = reltg.parentNode;
    }
    return reltg !== handler;
}
  
export default {
    isMouseOut
}