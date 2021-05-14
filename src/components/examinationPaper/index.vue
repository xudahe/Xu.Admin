<template>
  <div class="paper-main">
    <div class="paper-header">
      <el-form label-width="100px" :model="tempDataSource" style="padding-top:0px; ">
        <el-row>
          <el-col :span="4" :offset="1">
            <el-form-item label="试卷：">
              <span>{{dataSource.paperName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="考生：">
              {{dataSource.examineName}}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="分数：" v-if="this.type===2 || this.type===3">
              <span style="color:red;">{{dataSource.score}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="考试时长：">
              {{dataSource.examDuration}}分
            </el-form-item>
          </el-col>
          <el-col :span="4" v-if="this.type===1">
            <el-form-item label="倒计时间：">
              <span class="downTime">{{hour? hourString+':'+minuteString+':'+secondString : minuteString+':'+secondString}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="交卷时间：" v-if="this.type===2 || this.type===3">
              {{dataSource.submissionTime}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-row style="height:calc(100% - 40px);">
      <el-col :span="5" style="height: 100%;">
        <div ref="paperLeft" class="paper-left">
          <div class="paper-title">
            <h1><i class="el-icon-s-grid"></i>答题卡</h1>
          </div>
          <el-collapse v-model="answerCardActiveName">
            <el-collapse-item v-for="item in convertDatas" :key="item.code" :name="item.code">
              <template slot="title">
                <h2>{{item.name}}</h2><span>（共{{item.count}}题）</span>
              </template>
              <el-button style="margin-bottom: 5px;margin-left: 10px;" class="answer-button" circle size="small" v-for="index of item.count" :key="'answer'+item.code+index" :id="'answer'+item.code+index" @click.native="jump(item.code,index)">{{index}}</el-button>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
      <el-col :span="19" style="height: 100%;">
        <div ref="paperContent" class="paper-content">
          <div class="subject" v-for="item in convertDatas">
            <div class="subject-title">
              <h2>{{item.name}}</h2><span>（共 {{item.count}} 题，合计 {{item.totalScore}} 分）</span>
            </div>
            <el-card class="box-card" v-for="(sub,index) in item.childs" :key="item.code+(index+1)" :id="item.code+(index+1)">
              <div slot="header" class="clearfix">
                <el-tag effect="dark"> {{sub.no}} </el-tag>
                <span>{{sub.subject}}</span>
                <span>({{sub.totalScore}}分)</span>
                <div v-if="type===2 || type===3" style="float: right;">
                  <el-radio-group v-model="sub.isHook" size="mini">
                    <el-radio-button :disabled="disabledRead" :label="1" @change.native="isHookButtionCheck(sub)"><i class="el-icon-check" /></el-radio-button>
                    <el-radio-button :disabled="disabledRead" :label="2" @change.native="isHookButtionCheck(sub)"><i class="el-icon-close" /></el-radio-button>
                  </el-radio-group>
                  <div v-if="sub.type===1 ||sub.type===2||sub.type===3" style="display: inline;">
                    <el-input :disabled="true" v-model="sub.score" style="width:40px" size="medium"></el-input><span>分</span>
                  </div>
                  <div v-else style="display: inline;">
                    <el-input :disabled="disabledRead" v-model="sub.score" style="width:40px" size="medium"></el-input><span>分</span>
                  </div>
                </div>
              </div>
              <el-radio-group v-if="sub.type===1" v-model="sub.examineAnswer">
                <el-radio :disabled="disabledAnswer" v-for="o in sub.answers" :key="o.no" :label="o.no" class="answer-radio" @change="answerButtionCheck($event,item,sub)">{{o.no}}.{{o.answer}}</el-radio>
              </el-radio-group>
              <el-checkbox-group v-if="sub.type===2" v-model="sub.examineAnswer">
                <el-checkbox :disabled="disabledAnswer" v-for="o in sub.answers" :key="o.no" :label="o.no" class="answer-checkbox" @change="answerButtionCheck($event,item,sub)">{{o.no}}.{{o.answer}}</el-checkbox>
              </el-checkbox-group>
              <el-radio-group v-if="sub.type===3" v-model="sub.examineAnswer">
                <el-radio :disabled="disabledAnswer" label="对" class="answer-radio" @change="answerButtionCheck($event,item,sub)">对</el-radio>
                <el-radio :disabled="disabledAnswer" label="错" class="answer-radio" @change="answerButtionCheck($event,item,sub)">错</el-radio>
              </el-radio-group>
              <el-input :disabled="disabledAnswer" v-if="sub.type===4" type="textarea" :rows="2" v-model="sub.examineAnswer" resize="none" maxlength="150" @blur="answerButtionCheck($event,item,sub)"> </el-input>
              <el-input :disabled="disabledAnswer" v-if="sub.type===5" type="textarea" :rows="10" v-model="sub.examineAnswer" resize="none" maxlength="2000" @blur="answerButtionCheck($event,item,sub)"> </el-input>
              <div v-if="type!==1" class="subject-remark">
                <div class="item">
                  <span class="title">考生答案：</span>
                  <span>{{converAnswerStr(sub.examineAnswer)}}</span>
                </div>
                <div class="item">
                  <span class="title">正确答案：</span>
                  <span>{{converAnswerStr(sub.correctAnswer)}}</span>
                </div>
                <div class="item">
                  <span class="title">答案解析：</span>
                  <span>{{sub.answerAnalysis}}</span>
                </div>
              </div>
            </el-card>
          </div>
          <div class="paper-footer">
            <el-button v-if="type===1" type="success" @click.native="btnClick('handPaper')">交卷</el-button>
            <el-button v-if="type===2" type="success" @click.native="btnClick('readPaper')">阅卷</el-button>
            <el-button v-if="type===3" type="success" @click.native="btnClick('readPaperUpper')">上一张</el-button>
            <el-button v-if="type===3" type="success" @click.native="btnClick('readPaperNext')">下一张</el-button>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'examinationPaper',
  props: {
    //试卷类型 1 考试 2 阅卷 3 查看
    type: {
      type: Number,
      default: 1
    },
    //数据源
    dataSource: {
      type: Object,
      default: () => {
        return {
          paperId: '',//试卷ID
          paperName: '',//试卷名称
          examineId: '',//考生ID
          examineName: '',//考生名称
          score: null,//分数
          examDuration: null,//考试时长(分钟)
          submissionTime: '',//交卷时间
          //题目集合
          list: [
            {
              type: null, //题目类型 1.单选题 2.多选题 3.判断题 4.填空题 5.简答题
              no: null,//题号
              subject: '',//题目
              totalScore: null, //题目总分
              //答案集合
              answers: [
                {
                  no: '', //答案序号
                  answer: '' //答案
                }
              ],
              examineAnswer: null, //考生答案
              correctAnswer: null, //正确答案
              answerAnalysis: '', //答案解析
              isHook: null,  //答案是否对错  1.对 2.错
              score: null //得分
            }
          ]
        }
      }
    }
  },
  data() {
    return {
      hour: '',//倒计小时
      minute: '',//倒计分钟
      second: '',//倒计秒
      promiseTimer: '',//计时器
      tempDataSource: {}, //数据源
      answerCardActiveName: [],//答题卡激活项
      convertDatas: [],//组装后数据集
      disabledAnswer: false,//禁止答题
      disabledRead: false,//禁止阅卷
    }
  },
  watch: {
    dataSource(newValue, oldValue) {
      Object.assign(this.tempDataSource, newValue)
      this.convertData()
    }
  },
  created() {
    Object.assign(this.tempDataSource, this.dataSource)
    this.convertData()
    if (this.type === 2) {
      this.disabledAnswer = true
    }
    if (this.type === 3) {
      this.disabledAnswer = true
      this.disabledRead = true
    }
  },
  computed: {
    hourString() {
      return this.hour < 10 ? '0' + this.hour : '' + this.hour
    },
    minuteString() {
      return this.minute < 10 ? '0' + this.minute : '' + this.minute
    },
    secondString() {
      return this.second < 10 ? '0' + this.second : '' + this.second
    }
  },
  mounted() {
    if (this.type === 1) {
      let remainTime = this.dataSource.examDuration * 60;
      if (remainTime > 0) {
        this.hour = Math.floor((remainTime / 3600) % 24)
        this.minute = Math.floor((remainTime / 60) % 60)
        this.second = Math.floor(remainTime % 60)
        this.countDowm()
      }
    }

    if (this.type === 2 || this.type === 3) {
      this.convertDatas.forEach(t => {
        t.childs.forEach(c => {
          this.answerButtionCheck(c.examineAnswer, t, c);
        });
      });
    }

  },
  methods: {
    /**
     * 按钮点击事件
     */
    btnClick(type) {
      console.log(this.tempDataSource);
      switch (type) {
        //交卷
        case 'handPaper':
          this.disabledAnswer = true
          this.$emit('paperHand', this.tempDataSource)
          break
        //阅卷
        case 'readPaper':
          this.disabledAnswer = true
          this.disabledRead = true
          this.$emit('paperRead', this.tempDataSource)
          break
        //阅卷 上一个
        case 'readPaperUpper':
          this.$emit('paperReadUpper')
          break
        //阅卷 下一个
        case 'readPaperNext':
          this.$emit('paperReadNext')
          break
      }
    },
    /**
     * 锚点定位
     */
    jump(code, index) {
      let jump = this.$refs.paperContent.querySelectorAll("#" + code + index);
      // 获取需要滚动的距离
      let total = index == 1 ? jump[0].offsetTop - 55 : jump[0].offsetTop;

      this.$nextTick(() => {
        //实现form锚点定位
        this.$refs.paperContent.scrollTop = total;
      })
    },
    /**
     *对错选择
     */
    isHookButtionCheck(val) {
      if (val.type === 1 || val.type === 2 || val.type === 3) {
        if (val.isHook === 1) {
          val.score = val.totalScore;
        }
        if (val.isHook === 2) {
          val.score = 0;
        }
      }
    },
    /**
     *答题卡选中
     */
    answerButtionCheck(value, parent, child) {
      console.log(value, parent, child)
      let answerId = 'answer' + parent.code + child.no
      let but = this.$refs.paperLeft.querySelectorAll("#" + answerId);

      if (but.length > 0) {
        if (but[0].className.indexOf('answer-button-check') > -1) {
          if (!child.examineAnswer || child.examineAnswer == "" || child.examineAnswer.length == 0) {
            but[0].classList.remove("answer-button-check");
          }
        }
        else {
          if (child.examineAnswer && child.examineAnswer.length > 0) {
            but[0].classList.add("answer-button-check");
          }
        }
      }
    },
    /**
     * 转换答案
     */
    converAnswerStr(answer) {
      if (answer instanceof Array) {
        return answer.join('  ')
      }
      return answer
    },
    /**
     * 转换数据
     */
    convertData() {
      let sorted = this.groupBy(this.tempDataSource.list, function (item) {
        return [item.type]
      })
      this.convertDatas = []
      this.answerCardActiveName = []
      this.orderBy(sorted, 'key', 'asc')
      sorted.forEach(item => {
        let totalScore = 0
        item.value.forEach(t => {
          totalScore += t.totalScore
        })
        switch (item.key) {
          case "[1]":
            this.convertDatas.push({
              name: '单选题',
              code: 'Single',
              count: item.value.length,
              totalScore: totalScore,
              childs: item.value
            })
            this.answerCardActiveName.push('Single')
            break
          case "[2]":
            this.convertDatas.push({
              name: '多选题',
              code: 'Multiple',
              count: item.value.length,
              totalScore: totalScore,
              childs: item.value
            })
            this.answerCardActiveName.push('Multiple')
            break
          case "[3]":
            this.convertDatas.push({
              name: '判断题',
              code: 'Judgment',
              count: item.value.length,
              totalScore: totalScore,
              childs: item.value
            })
            this.answerCardActiveName.push('Judgment')
            break
          case "[4]":
            this.convertDatas.push({
              name: '填空题',
              code: 'Blank',
              count: item.value.length,
              totalScore: totalScore,
              childs: item.value
            })
            this.answerCardActiveName.push('Blank')
            break
          case "[5]":
            this.convertDatas.push({
              name: '简答题',
              code: 'Answer',
              count: item.value.length,
              totalScore: totalScore,
              childs: item.value
            })
            this.answerCardActiveName.push('Answer')
            break
        }

      })
      console.log(this.convertDatas)
    },
    /**
     * 排序
     * @param {} datas 数组
     * @param {} col 列
     * @param {} type 类型 desc,asc
     * @returns {}
     */
    orderBy(datas, col, type) {
      let m
      for (let i = 0; i < datas.length; i++) {
        for (let k = 0; k < datas.length; k++) {
          if (type === 'asc') {
            if (datas[i][col] < datas[k][col]) {
              m = datas[k]
              datas[k] = datas[i]
              datas[i] = m
            }
          } else if (type === 'desc') {
            if (datas[i][col] > datas[k][col]) {
              m = datas[k]
              datas[k] = datas[i]
              datas[i] = m
            }
          }
        }
      }
      return datas
    },
    /**
     * 分组
     * @param array 数据集
     * @param f 函数
     * let sorted = groupBy(list, function(item){ return [item.name];});
     */
    groupBy(array, f) {
      const groups = {}
      const keyValues = []
      array.forEach(function (o) {
        const group = JSON.stringify(f(o))
        groups[group] = groups[group] || []
        groups[group].push(o)
      })
      Object.keys(groups).map(function (group) {
        return keyValues.push({ key: group, value: groups[group] })
      })
      return keyValues
    },
    /**
     * 倒计时
     */
    countDowm() {
      let self = this
      clearInterval(this.promiseTimer)
      this.promiseTimer = setInterval(function () {
        if (self.hour === 0 && self.minute === 0 && self.second === 0) {
          self.disabledAnswer = true;
        }
        if (self.hour === 0) { //最后1小时
          if (self.minute !== 0 && self.second === 0) { //分钟
            self.second = 59
            self.minute -= 1
          } else if (self.minute === 0 && self.second === 0) {  //小时
            self.second = 0
            self.$emit('countDowmEnd', true)
            clearInterval(self.promiseTimer)
          } else {  //每秒
            self.second -= 1
          }
        } else { //大于1小时
          if (self.minute !== 0 && self.second === 0) { //分钟
            self.second = 59
            self.minute -= 1
          } else if (self.minute === 0 && self.second === 0) { //小时
            self.hour -= 1
            self.minute = 59
            self.second = 59
          } else { //每秒
            self.second -= 1
          }
        }
      }, 1000)
    },
    beforeDestroy() {
      clearInterval(this.promiseTimer)
    },
  }

}
</script>

<style lang="less">
.paper-main {
  .el-collapse-item__content {
    padding: 0 10px 5px !important;
  }
  .el-input__inner {
    text-align: center;
    padding: 0 5px !important;
  }
}
</style>

<style scoped>
.paper-main {
  height: 100%;
  width: 100%;
}

.paper-header {
  width: 100%;
  background-color: #f7f7f7;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.paper-left {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid #e4e4e4;
}

.paper-content {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  border: 1px solid #e4e4e4;
}

.paper-footer {
  padding: 5px 10px;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #f7f7f7;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}

.paper-title {
  padding-left: 10px;
  width: 100%;
  height: 45px;
  line-height: 45px;
  background: #f7f7f7;
}

.paper-title h1 {
  font-size: 1.2em;
  margin: 0;
}

.downTime {
  color: rgb(230, 93, 110);
  font-size: 16px;
  font-weight: bold;
}
.answer-button {
  padding: 0px;
  color: #0a0a0a;
  background-color: #ffffff;
  border-color: #e4e4e4;
  width: 30px;
  height: 30px;
}
.answer-button:hover {
  background: #ecf1ef;
  border-color: #e4e4e4;
  color: #0a0a0a;
}
.answer-button-check {
  background: #13ce66;
  border-color: #30b08f;
}

.answer-radio {
  display: block;
  margin: 5px 0px;
}

.answer-checkbox {
  display: block;
  margin: 5px 0px;
}

.subject-title {
  padding-left: 10px;
  width: 100%;
  height: 45px;
  line-height: 45px;
  background: #f7f7f7;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}
.subject-title h2 {
  font-size: 16px;
  display: inline-block;
}
.subject-title span {
  font-size: 13px;
  display: inline-block;
}

.subject-remark {
  background: #f7f7f7;
}
.subject-remark .item {
  display: block;
  padding: 5px;
}
.subject-remark .title {
  font-weight: bold;
}

.el-radio >>> .el-radio__input.is-checked .el-radio__inner {
  background-color: #13ce66;
  border-color: #13ce66;
}

.el-radio-button >>> .el-radio-button__inner {
  padding: 10px;
}

.el-collapse-item h2 {
  margin-left: 10px;
  font-size: 14px;
  display: inline-block;
}

.el-form-item {
  margin-bottom: 0px !important;
}

.el-form--label-top >>> .el-form-item__label {
  float: none;
  display: inline-block;
  text-align: left;
  padding: 0px;
}

.el-card {
  margin: 5px 0 5px 5px;
}

.el-card >>> .el-card__header {
  background-color: #ffffff;
  padding: 0px 10px;
  line-height: 35px;
  font-size: 16px;
}
.el-card >>> .el-card__body {
  padding: 5px 20px;
}
</style>

