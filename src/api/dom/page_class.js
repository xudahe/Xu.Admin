// 获取页面高度
function getPageHeight() {
  var g = document,
    a = g.body,
    f = g.documentElement,
    d = g.compatMode == "BackCompat" ? a : g.documentElement;
  return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
}

// 获取页面scrollLeft
function getPageScrollLeft() {
  var a = document;
  return a.documentElement.scrollLeft || a.body.scrollLeft;
}

// 获取页面scrollTop
function getPageScrollTop() {
  var a = document;
  return a.documentElement.scrollTop || a.body.scrollTop;
}

// 获取页面可视高度
function getPageViewHeight() {
  var d = document,
    a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
  return a.clientHeight;
}

// 获取页面可视宽度
function getPageViewWidth() {
  var d = document,
    a = d.compatMode == "BackCompat" ? d.body : d.documentElement;
  return a.clientWidth;
}

// 获取页面宽度
function getPageWidth() {
  var g = document,
    a = g.body,
    f = g.documentElement,
    d = g.compatMode == "BackCompat" ? a : g.documentElement;
  return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
}

// 获取网页被卷去的位置
function getScrollXY() {
  return document.body.scrollTop
    ? {
        x: document.body.scrollLeft,
        y: document.body.scrollTop
      }
    : {
        x: document.documentElement.scrollLeft,
        y: document.documentElement.scrollTop
      };
}

// 获取移动设备屏幕宽度
function getScreenWidth() {
  var smallerSide = Math.min(screen.width, screen.height);
  var fixViewPortsExperiment =
    rendererModel.runningExperiments.FixViewport ||
    rendererModel.runningExperiments.fixviewport;
  var fixViewPortsExperimentRunning =
    fixViewPortsExperiment && fixViewPortsExperiment.toLowerCase() === "new";
  if (fixViewPortsExperiment) {
    if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
      smallerSide = smallerSide / window.devicePixelRatio;
    }
  }
  return smallerSide;
}

// 获取窗体可见范围的宽与高
function getViewSize() {
  var de = document.documentElement;
  var db = document.body;
  var viewW = de.clientWidth == 0 ? db.clientWidth : de.clientWidth;
  var viewH = de.clientHeight == 0 ? db.clientHeight : de.clientHeight;
  return Array(viewW, viewH);
}