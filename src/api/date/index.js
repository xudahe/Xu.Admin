import moment from 'moment'  //事件格式化第三方插件

// 设置语言
moment.locale('zh-cn')

/**
 * @description 日期格式化
 * 示例：this.$formatDate(new Date()) // 2019-11-05
 * 示例：this.$formatDate(new Date(), true) // 2019-11-05 10:06:31
 */
function formatDate(date, isAccurate = false) {
	return moment(date).format(`YYYY-MM-DD${isAccurate
	? ' HH:mm:ss'
	: ''}`)
}

/**
 * @description 设置天数
 * 示例：this.$setDay(new Date(), 3, true) // 返回后三天 YYYY-MM-DD HH:mm:ss
 * 示例：this.$setDay(new Date(), -3, false) // 返回前三天 YYYY-MM-DD
 */
function setDay(date, number, isAccurate = false) { 
	return moment(date).add(number, 'days').format(`YYYY-MM-DD${isAccurate
	? ' HH:mm:ss'
	: ''}`)
}

/**
 * @description 设置月份
 * @param {Date} date  接收的日期对象
 * @param {Number} number  设置的月数，负数则往前计算
 * @param {Boolean} isAccurate  是否精确到时分秒，默认值为false
 * 示例：this.$setMonth(new Date(), 3, true) // 返回后三个月 YYYY-MM-DD HH:mm:ss
 * 示例：this.$setMonth(new Date(), -3, false) // 返回前三个月 YYYY-MM-DD
 */
function setMonth(date, number, isAccurate = false) {
	return moment(date).add(number, 'months').format(`YYYY-MM-DD${isAccurate
	? ' HH:mm:ss'
	: ''}`)
}

/**
 * @description 设置年份
 * 示例：this.$setYear(new Date(), 3, true) // 返回后三年 YYYY-MM-DD HH:mm:ss
 * 示例：this.$setYear(new Date(), -3, false) // 返回前三年 YYYY-MM-DD
 */
function setYear(date, number, isAccurate = false) {
	return moment(date).add(number, 'years').format(`YYYY-MM-DD${isAccurate
	? ' HH:mm:ss'
	: ''}`)
}

/**
 * @description 设置年月日时分秒
 * 示例：this.$setDate(new Date(), { years: 1 }) // 当前时间往后加一年 YYYY-MM-DD HH:mm:ss
 * 示例：this.$setDate(new Date(), { months: -1, hours: 1 }, 'YYYY-MM') // 当前时间减一个月并加一个小时 YYYY-MM
 */
function setDate(date, {
	years, quarters, months, weeks, days, hours, minutes, seconds, milliseconds
}, isAccurate = false) {
	return moment(date).add({
		years, quarters, months, weeks, days, hours, minutes, seconds, milliseconds
	}).format(`YYYY-MM-DD${isAccurate
	? ' HH:mm:ss'
	: ''}`)
}

/**
 * @description 时间差 date_1 - date_2
 * 示例：this.$dateDiff(new Date('2019-11-05'), new Date('2019-11-01'))
 * { 时间戳 stamp: xxx, 相差总秒数 seconds:xxx, 相差总分钟数 minutes: xxx, 相差总小时数 hours: xxx, 相差总天数 days: xxx, 相差总星期数 weeks: xxx, 时分秒 times: xxx}
 */
function dateDiff(date_1, date_2) {
	let 
		timeLine = moment(date_1).diff(moment(date_2)) / 1000,
		second = parseInt(timeLine % (60 * 60) % 60),
		minute = parseInt(timeLine % (60 * 60) / 60),
		hour= parseInt(timeLine / 60 / 60)
	return {
		stamp: timeLine * 1000,
		seconds: timeLine,
		minutes: parseInt(timeLine / 60),
		hours: parseInt(timeLine / 60 / 60),
		days: parseInt(timeLine / 60 / 60 / 24),
		weeks: parseInt(timeLine / 60 / 60 / 24 / 7),
		time: `${hour < 10
		? `0${hour}`
		: hour}:${minute < 10
		? `0${minute}`
		: minute}:${second < 10
		? `0${second}`
		: second}`
	}
}

/**
 * @description 相对于现在时间
 * 示例：this.$fromNow(new Date()) // 几秒前
 */
function fromNow(date) {
	return moment(date).fromNow()
}

export default {
	formatDate,
	setDay,
	setMonth,
	setYear,
	setDate,
	dateDiff,
	fromNow
}