// 秒转换时分秒
export function transverterMss(result) {
  var h = Math.floor(result / 3600) < 10 ? "0" + Math.floor(result / 3600) : Math.floor(result / 3600)
  var m = Math.floor((result / 60 % 60)) < 10 ? "0" + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
  var s = Math.floor((result % 60)) < 10 ? "0" + Math.floor((result % 60)) : Math.floor((result % 60))
  return h + ":" + m + ":" + s
}

//时间差,返回格式：0天10时4分50秒
export function dateDiff(stime, etime) {
  var begin = new Date(stime);
  var end = new Date(etime);
  //时间相差毫秒数
  var span = end.getTime() - begin.getTime();
  //计算相差天数
  var result = '';
  var days = Math.floor(span / (24 * 3600 * 1000));
  result += days + '天';
  //相差小时数
  var leave1 = span % (24 * 3600 * 1000);
  var hours = Math.floor(leave1 / (3600 * 1000))
  result += (hours < 10 ? '0' + hours : hours) + '时';
  //相差分钟
  var leave2 = leave1 % (3600 * 1000)
  var minutes = Math.floor(leave2 / (60 * 1000));
  result += (minutes < 10 ? '0' + minutes : minutes) + '分';
  //相差秒
  var level3 = leave2 % (60 * 1000)
  var seconds = Math.round(level3 / 1000);
  result += (seconds < 10 ? '0' + seconds : seconds) + '秒';

  return result; //0天10时4分50秒
}

// 获取日期时间戳
export function getTime(dayNum) {
  var myDate = new Date()
  var lw = new Date(myDate - 1000 * 60 * 60 * 24 * dayNum) // 最后一个数字多少天前的意思
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
export function getData(dayNum) {
  var myDate = new Date()
  var lw = new Date(myDate - 1000 * 60 * 60 * 24 * dayNum) // 最后一个数字多少天前的意思
  var lastY = lw.getFullYear()
  var lastM = lw.getMonth() + 1
  var lastD = lw.getDate()
  var startdate = lastY + "-" + (lastM < 10 ? "0" + lastM : lastM) + "-" + (lastD < 10 ? "0" + lastD : lastD)
  return startdate
}

// 日期转换时间戳
export function getNewTime(dayNum) {
  var b = dayNum.split(/\D/)
  var date = new Date(b[0], b[1] - 1, b[2])
  var time = date.getTime()
  return time
}

// 获取当月第一天
export function getCurrentMonthLast() {
  var date = new Date();
  date.setDate(1);
  return date;
}

// 获取当月最后一天
export function getCurrentMonthLast() {
  var date = new Date();
  var currentMonth = date.getMonth();
  var nextMonth = ++currentMonth;
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  var oneDay = 1000 * 60 * 60 * 24;
  return new Date(nextMonthFirstDay - oneDay);
}
