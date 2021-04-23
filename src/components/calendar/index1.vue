<template>
  <div class="clander-plan">
    <div class="plan-finish-header">
      <div class="plan-finish-bg"></div>
      <div style="width: 100%;height: 100%;">
        <div style="width: 60%;float: left;position: relative;text-align: left;height:100%;top: 10%; left: 5%;"></div>
        <div style="width: 40%;float: left;position: relative;text-align: right;line-height: 0.3rem;top: 10%; right: 5%;">
          <div>{{weekday}}</div>
          <div>{{newday}}</div>
        </div>
      </div>
    </div>
    <div style="padding:0 0.1rem; position: relative; width: 100%;">
      <v-header icon="el-icon-date" text="个人日程" style="height:0.35rem;">
        <div slot="content">
        </div>
        <div style="text-align: right;padding-top: 5px;">
          <el-link type="info" :underline="false" href="#">新建日程</el-link>
        </div>
      </v-header>
    </div>
    <div class="plan-finish-calendar mtop1">
      <div class="calendar">
        <!-- 年份 月份 -->
        <ul class="month bottom-line">
          <!--点击会触发pickpre函数，重新刷新当前日期 -->
          <li class="arrow">
            <i class="el-icon-arrow-left" style="cursor: pointer;" @click="pickPre(currentYear,currentMonth)"></i>
          </li>
          <li class="year-month">
            <span v-text="currentYear+'年'+currentMonth+'月'"></span>
          </li>
          <li class="arrow">
            <i class="el-icon-arrow-right" style="cursor: pointer;" @click="pickNext(currentYear,currentMonth)"></i>
          </li>
        </ul>
        <!-- 星期 -->
        <ul class="weekdays">
          <li>日</li>
          <li>一</li>
          <li>二</li>
          <li>三</li>
          <li>四</li>
          <li>五</li>
          <li>六</li>
        </ul>
        <!-- 日期 -->
        <ul class="days bottom-line">
          <li v-for="day in days" @click="dayCheck(day)">
            <!--本月已签到日期-->
            <span :day="day.day" :class="['day-li',day.isChecked?'day-checked':'']">
              <span :class="['day-span',day.isSign?'day-sign':'',day.day.getMonth()+1 !== currentMonth?'other':'',day.isSigned?'day-signed':'',,day.isChecked?'day-selected':'']" v-text="day.day.getDate()"></span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div style="padding:0.2rem 0.1rem; position: relative; width: 100%;">
      <v-header icon="el-icon-s-marketing" text="日程安排" style="height:0.35rem;">
        <div slot="content">
        </div>
        <div style="text-align: right;padding-top: 5px;">
          <el-link type="info" :underline="false" href="#">查看全部</el-link>
        </div>
      </v-header>
      <div class="plan-calendar-info" v-show="currentPlan.date">
        <div class="calendar-info-date">
          <span v-text="currentPlan.date"></span>
        </div>
        <div class="calendar-info-title">
          <span v-text="currentPlan.title"></span>
        </div>
        <ul class="calendar-info-list">
          <li v-for="item in currentPlan.list">
            <span v-text="item.name"></span>
          </li>
        </ul>
        <div class="calendar-info-text" v-if="currentPlan.nums">
          <p v-text="currentPlan.name"></p>
          <p class="calendar-info-nums" v-text="'完成题目：'+ currentPlan.nums+'道'"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 日历事件
 */

export default {
  data: function () {
    return {
      // 日历
      currentDay: 1, // 当前天
      currentMonth: 1, // 当前月
      currentYear: 1970,
      currentWeek: 0, // 一号所在的星期
      days: [], // 当月所有天数
      content: {},
      sign_days: [], // 签到日期
      is_sign: false,
      currentPlan: {},
      weekday: "",
      newday: "",
    }
  },
  created: function () {
    this.getSign();
  },
  mounted() {
    let day = {
      day: new Date(),
      isSign: false,
      isSigned: false
    }

    this.strDate();

    setTimeout(() => {
      this.dayCheck(day)
    }, 1000);

  },
  methods: {
    strDate() {
      var d = new Date();

      var month = d.getMonth() + 1;
      var day = d.getDate();
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;

      //天数
      this.newday = d.getFullYear() + '/' + month + '/' + day;

      //星期
      var myddy = d.getDay(); //获取存储当前日期
      var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      this.weekday = weekday[myddy];
    },
    /**
     * 获取签到日期
     */
    getSign: function () {
      // 模拟数据
      var sign_days = [{
        day: '2021/4/8',
        is_sign: 0
      }, {
        day: '2021/4/9',
        is_sign: 0
      }, {
        day: '2021/4/10',
        is_sign: 0
      }, {
        day: '2021/4/11',
        is_sign: 0
      }, {
        day: '2021/4/12',
        is_sign: 1
      }, {
        day: '2021/4/13',
        is_sign: 1
      }];
      this.sign_days = sign_days;
      this.initData(null);
    },
    initData: function (cur) {
      var date;
      if (cur) { // 切换上一月、下一月
        date = new Date(cur);
      } else {
        var now = new Date(); // 此处取本机时间，应改为服务器时间
        var d = new Date(this.formatDate(now.getFullYear(), now.getMonth() + 1, 1));
        d.setDate(35); // 设置天数为35天（32~59都可以，既设置到下一个月的某一天）
        date = new Date(this.formatDate(d.getFullYear(), d.getMonth(), 1));
      }
      this.currentDay = new Date().getDate(); // 今日日期 几号
      this.currentYear = date.getFullYear(); // 当前年份
      this.currentMonth = date.getMonth() + 1; // 当前月份
      this.currentWeek = date.getDay(); // 当前月1号是星期几？ 0表示星期天
      // 当前月最后一天是星期几？ 0表示星期天
      this.nextWeek = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
      var str = this.formatDate(this.currentYear, this.currentMonth, 1); // 2020/01/01
      var nextStr = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleDateString(); // 2020/01/01
      // console.log(nextStr)
      this.days = []; // 初始化日期
      // 设置上一个月 需显示 的最后几天  铺满一周
      for (var i = this.currentWeek; i > 0; i--) {
        var d = new Date(str);
        d.setDate(d.getDate() - i);
        var dayobject = {
          day: d,
          isSign: this.isVerDate(d),
          isSigned: this.isSigned(d)
        }; // 用一个对象包装Date对象  以便为以后预定功能添加属性
        this.days.push(dayobject); // 将日期放入data 中的days数组 供页面渲染使用
      }
      // 显示当前月的天数  第二个循环为 j<= 36- this.currentWeek，
      // 因为1号是星期六的时候当前月需显示6行，如2020年8月
      this.num = 0; //第几个月 每遇到1号加1
      for (var j = 0; j <= 36 - this.currentWeek; j++) {
        var d = new Date(str);
        d.setDate(d.getDate() + j);
        var dddd = d.getDate();
        var dayobject = {
          day: d,
          isSign: this.isVerDate(d),
          isSigned: this.isSigned(d)
        };
        if (dddd == 1) {
          this.num++
        }
        if (this.num == 2) {
          break
        }
        this.days.push(dayobject);
      }
      // console.log('当前月1号是星期' + this.currentWeek)
      // console.log('当前月最后一天是星期' + this.nextWeek)
      // 设置下一个月 需显示 的最前几天铺满一周
      for (var k = 1; k <= 6 - this.nextWeek; k++) {
        var d = new Date(nextStr);
        d.setDate(d.getDate() + k);
        var dayobject = {
          day: d,
          isSign: this.isVerDate(d),
          isSigned: this.isSigned(d)
        }; // 用一个对象包装Date对象  以便为以后预定功能添加属性
        this.days.push(dayobject); // 将日期放入data 中的days数组 供页面渲染使用
      }
    },
    /**
     * 判断该日期是否有任务
     * @param d
     * @returns {boolean}
     */
    isVerDate: function (d) {
      var signdays = [];
      for (var i in this.sign_days) {
        signdays.push(this.sign_days[i].day);
      }
      return signdays.includes(d.toLocaleDateString());
    },
    /**
     * 判断该日期是否有任务并且已完成
     * @param d
     * @returns {boolean}
     */
    isSigned: function (d) {
      var signdays = [];
      for (var i in this.sign_days) {
        if (this.sign_days[i].is_sign) {
          signdays.push(this.sign_days[i].day);
        }
      }
      return signdays.includes(d.toLocaleDateString());
    },
    /**
     * 上一月
     * @param year
     * @param month
     */
    pickPre: function (year, month) {
      var d = new Date(this.formatDate(year, month, 1));
      d.setDate(0);
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
    },
    /**
     * 下一月
     * @param year
     * @param month
     */
    pickNext: function (year, month) {
      var d = new Date(this.formatDate(year, month, 1));
      d.setDate(35);
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
    },
    // 返回 类似 2020/01/01 格式的字符串
    formatDate: function (year, month, day) {
      month < 10 && (month = '0' + month);
      day < 10 && (day = '0' + day);
      var data = year + '/' + month + '/' + day;

      return data;
    },
    /**
     * 点击日期查询
     * @param index
     */
    dayCheck: function (day) {
      console.log('day', day.day)
      var currentPlan = {
        title: '',
        date: '',
        list: []
      };
      currentPlan.date = day.day.toLocaleDateString().split('/')[1] + '月' + day.day.toLocaleDateString().split('/')[2] + '日';

      for (var i in this.days) {
        if (this.$formatDate(this.days[i].day) == this.$formatDate(day.day)) {
          this.$set(this.days[i], 'isChecked', 1);
        } else {
          this.$set(this.days[i], 'isChecked', 0)
        }
      }
      if (day.isSign) {
        if (day.isSigned) {
          currentPlan.list = [{
            name: '重做计划1',
          }, {
            name: '重做计划2',
          }, {
            name: '重做计划3',
          }, {
            name: '重做计划4',
          }, {
            name: '重做计划5',
          }, {
            name: '重做计划6',
          }, {
            name: '重做计划7',
          }, {
            name: '重做计划8',
          }];
          currentPlan.title = '已完成计划×' + currentPlan.list.length;
          currentPlan.name = '学习考点：财务成本管理《第一章 财务管理基本管理》财务成本管理';
          currentPlan.nums = 100;
        } else {
          currentPlan.title = '未完成计划'
        }

      } else {
        currentPlan.title = '暂无任务'
      }
      this.currentPlan = currentPlan
    }
  }
};
</script>
<style>
.clander-plan {
  height: 100%;
  width: 100%;
}
li,
ol,
ul {
  list-style: none;
}

.plan-finish-header {
  position: relative;
  width: 100%;
  height: 1rem;
}

.plan-finish-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0.5rem;
  /* background: linear-gradient(135deg, rgba(5, 201, 221, 1) 0%, rgba(23, 196, 160, 1) 100%); */
  background: linear-gradient(
    135deg,
    rgb(104, 171, 254, 1) 0%,
    rgb(130, 185, 254, 1) 100%
  );
}

.plan-finish-bg::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.2rem;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
}

.plan-finish-bg::after {
  content: "";
  position: absolute;
  bottom: -0.5rem;
  left: 0rem;
  width: 100%;
  height: 0.9rem;
  background: rgba(170, 233, 221, 1);
  border-radius: 1px;
  opacity: 0.5;
  filter: blur(24px);
}

.plan-finish-head {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.3rem;
  color: #fff;
}

.plan-finish-info {
  flex: 1;
  padding-top: 0.2rem;
}

.plan-finish-tit {
  width: 100%;
  text-align: center;
  font-size: 0.44rem;
}

.plan-finish-info ul {
  padding-top: 0.3rem;
  display: flex;
  font-size: 0.24rem;
}

.plan-finish-info ul li {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.plan-finish-calendar {
  position: relative;
  top: 3rem;
  width: 100%;
  /* left: 50%; */
  /* transform: translateX(-50%); */
  font-size: 0.24rem;
  padding: 0 0.1rem;
}

/* 日历 */
.calendar {
  width: 100%;
  min-height: 3rem;
  background: #fff;
  box-shadow: 0px 3px 24px 0px rgba(0, 0, 0, 0.1);
  border-radius: 0.2rem;
  overflow: hidden;
  font-size: 0.24rem;
  padding: 0 0.1rem;
}

.calendar .month {
  background: #ffffff;
  padding: 0.15rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.calendar .month li {
  text-transform: uppercase;
  letter-spacing: 0;
}

.calendar .month .arrow {
  color: #333;
  width: 2rem;
  font-size: 0.18rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar .month .year-month {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.18rem;
  color: #2d2d2d;
}

.calendar .weekdays {
  /*头部星期*/
  font-size: 0.18rem;
  padding: 0.1rem 0;
  background-color: rgba(21, 188, 195, 0.1);
  border-radius: 0.4rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 0.1rem;
}

.calendar .weekdays li {
  display: inline-block;
  text-align: center;
}

.calendar .days {
  /*日期*/
  background: #ffffff;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 0.2rem;
}

.calendar .days li {
  list-style-type: none;
  width: 14.2%;
  padding: 1%;
  box-sizing: border-box;
  text-align: center;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar .days li .day-li {
  cursor: pointer;
  position: relative;
  width: 0.35rem;
  height: 0.35rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.18rem;
  border-radius: 50%;
}

.calendar .days li .day-checked {
  background-color: #f2f6fc;
  border-radius: 15px;
}

.calendar .days li .day-selected {
  background-color: #409eff;
  color: #fff;
  border-radius: 15px;
}

.calendar .days li .day-li .day-span {
  position: relative;
  width: 0.3rem;
  height: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.18rem;
  border: 1px solid #fff;
  border-radius: 50%;
}

.calendar .other {
  color: #ccc;
}

.calendar .day-sign {
  /*签到的日期*/
  background-color: #f5f5f5;
  color: #15bcc3;
}

.calendar .day-signed {
  background-color: #15bcc3;
  color: #fff;
}

.mtop1 {
  top: 0.05rem;
}

.plan-calendar-info {
  width: 100%;
  padding: 0.12rem 0;
}

.calendar-info-date {
  position: relative;
  width: 1rem;
  height: 0.32rem;
  display: flex;
  padding-left: 0.2rem;
  align-items: center;
  font-size: 0.16rem;
  color: #fff;
  background-color: #5bc0de;
  border-radius: 0.2rem;
}

.calendar-info-date span {
  position: relative;
}

.calendar-info-title {
  color: #2d2d2d;
  font-size: 0.2rem;
  padding: 0.2rem 0;
  font-weight: bold;
}

.calendar-info-list {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 0.2rem;
}

.calendar-info-list li {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.54rem;
  height: 0.5rem;
  background: #fff;
  border-radius: 0.25rem;
  color: #333333;
  font-size: 0.24rem;
  margin-bottom: 0.2rem;
  margin-right: 0.2rem;
}

.calendar-info-list li:nth-child(4n) {
  margin-right: 0;
}

.calendar-info-text {
  width: 6.9rem;
  padding: 0.24rem;
  background: #ffffff;
  border-radius: 0.2rem;
  font-size: 0.26rem;
  color: #2d2d2d;
}

.calendar-info-nums {
  color: #999999;
  padding-top: 0.15rem;
}
</style>
