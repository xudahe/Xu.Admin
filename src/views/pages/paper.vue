<template>
  <examination-paper :type="type" :data-source="paperData" @paperHand="paperHand" @paperRead="paperRead"></examination-paper>
</template>

<script>
export default {
  name: "paper",
  data() {
    return {
      type: 1, //试卷类型 1 考试 2 阅卷 3 查看
      paperData: {
        paperId: "0695", //试卷ID
        paperName: "测试试卷", //试卷名称
        examineId: "201402171233", //考生ID
        examineName: "张三", //考生名称
        score: 0, //分数
        examDuration: 90, //考试时长
        submissionTime: "2019-11-25 16:30:26", //交卷时间
        //题目集合
        list: [
          {
            type: 2, //题目类型 1.单选题 2.多选题 3.判断题 4.填空题 5.简答题
            no: 1, //题号
            totalScore: 6, //题目总分
            subject: "以下属于南方电网员工职业操守中明文规定的有()",
            answers: [
              { no: "A", answer: "热爱祖国、热爱南网、热爱岗位" },
              { no: "B", answer: "遵纪守法、忠于职守、令行禁止" },
              { no: "C", answer: "客户至上、诚实守信、优质服务" }
            ],
            examineAnswer: [], //考生答案
            correctAnswer: ["A", "B", "C"], //正确答案
            answerAnalysis: "答案解析.......",
            isHook: null, //答案是否对错
            score: 0 //得分
          },
          {
            //题目类型 1.单选题 2.多选题 3.判断题 4.填空题 5.简答题
            type: 1,
            no: 1,
            subject:
              "在生产管理信息系统中，下列操作步骤能正确将工单推进流程的是()",
            totalScore: 1,
            answers: [
              { no: "A", answer: "在工具栏中点击“workflow”标签" },
              { no: "B", answer: "在缺陷单界面中点击“推进流程”按钮" },
              { no: "C", answer: "在缺陷单界面中点击“提交”按钮" }
            ],
            examineAnswer: "",
            correctAnswer: "B",
            answerAnalysis: "答案解析.......",
            isHook: null,
            score: 0
          },
          {
            //题目类型 1.单选题2.多选题 3.判断题 4.填空题 5.简答题
            type: 1,
            no: 2,
            subject:
              "在营销系统中查询客户有无欠费、余额及抄表数据接待客户时应做到哪些最基本的礼仪？",
            totalScore: 5,
            answers: [
              { no: "A", answer: "起身、微笑、示坐、问候客户" },
              { no: "B", answer: "坐着，问候客户" },
              { no: "C", answer: "请问需要办理什么业务" }
            ],
            examineAnswer: "",
            correctAnswer: "A",
            answerAnalysis: "答案解析.......",
            isHook: null,
            score: 5
          },
          {
            //题目类型 1.单选题2.多选题 3.判断题 4.填空题 5.简答题
            type: 1,
            no: 3,
            subject:
              "在营销系统中查询客户有无欠费、余额及抄表数据接待客户时应做到哪些最基本的礼仪？",
            totalScore: 5,
            answers: [
              { no: "A", answer: "起身、微笑、示坐、问候客户" },
              { no: "B", answer: "坐着，问候客户" },
              { no: "C", answer: "请问需要办理什么业务" }
            ],
            examineAnswer: "",
            correctAnswer: "A",
            answerAnalysis: "答案解析.......",
            isHook: null,
            score: 5
          },
          {
            //题目类型 1.单选题2.多选题 3.判断题 4.填空题 5.简答题
            type: 1,
            no: 4,
            subject:
              "在营销系统中查询客户有无欠费、余额及抄表数据接待客户时应做到哪些最基本的礼仪？",
            totalScore: 5,
            answers: [
              { no: "A", answer: "起身、微笑、示坐、问候客户" },
              { no: "B", answer: "坐着，问候客户" },
              { no: "C", answer: "请问需要办理什么业务" }
            ],
            examineAnswer: "",
            correctAnswer: "A",
            answerAnalysis: "答案解析.......",
            isHook: null,
            score: 5
          },
          {
            //题目类型 1.单选题2.多选题 3.判断题 4.填空题 5.简答题
            type: 1,
            no: 5,
            subject:
              "在营销系统中查询客户有无欠费、余额及抄表数据接待客户时应做到哪些最基本的礼仪？",
            totalScore: 5,
            answers: [
              { no: "A", answer: "起身、微笑、示坐、问候客户" },
              { no: "B", answer: "坐着，问候客户" },
              { no: "C", answer: "请问需要办理什么业务" }
            ],
            examineAnswer: "",
            correctAnswer: "A",
            answerAnalysis: "答案解析.......",
            isHook: null,
            score: 5
          },
          {
            //题目类型 1.单选题2.多选题 3.判断题 4.填空题 5.简答题
            type: 1,
            no: 6,
            subject:
              "在营销系统中查询客户有无欠费、余额及抄表数据接待客户时应做到哪些最基本的礼仪？",
            totalScore: 5,
            answers: [
              { no: "A", answer: "起身、微笑、示坐、问候客户" },
              { no: "B", answer: "坐着，问候客户" },
              { no: "C", answer: "请问需要办理什么业务" }
            ],
            examineAnswer: "",
            correctAnswer: "A",
            answerAnalysis: "答案解析.......",
            isHook: null,
            score: 5
          },
          {
            //题目类型 1.单选题2.多选题 3.判断题 4.填空题 5.简答题
            type: 1,
            no: 7,
            subject:
              "在营销系统中查询客户有无欠费、余额及抄表数据接待客户时应做到哪些最基本的礼仪？",
            totalScore: 5,
            answers: [
              { no: "A", answer: "起身、微笑、示坐、问候客户" },
              { no: "B", answer: "坐着，问候客户" },
              { no: "C", answer: "请问需要办理什么业务" }
            ],
            examineAnswer: "",
            correctAnswer: "A",
            answerAnalysis: "答案解析.......",
            isHook: null,
            score: 5
          },
          {
            //题目类型 1.单选题 2.多选题 3.判断题 4.填空题 5.简答题
            type: 3,
            no: 1,
            subject: "记录一次与人有效沟通的案例？",
            totalScore: 10,
            answers: [],
            examineAnswer: "",
            correctAnswer: "对",
            answerAnalysis: "答案解析.......",
            isHook: null,
            score: 10
          },
          {
            //题目类型 1.单选题 2.多选题 3.判断题 4.填空题 5.简答题
            type: 4,
            no: 1,
            subject: "打招呼的方式一般有哪几种？",
            totalScore: 10,
            answers: [],
            examineAnswer: "",
            correctAnswer: ["寒暄式", "问候式", "致意式", "致礼式"],
            answerAnalysis: "答案解析.......",
            isHook: null,
            score: 10
          },
          {
            //题目类型 1.单选题 2.多选题 3.判断题 4.填空题 5.简答题
            type: 5,
            no: 1,
            subject: "请简单说一下你对礼仪的认识与理解？",
            totalScore: 10,
            answers: [],
            examineAnswer: "",
            correctAnswer: "",
            answerAnalysis: "答案解析.......",
            isHook: null,
            score: 10
          }
        ]
      }
    };
  },
  methods: {
    paperHand(value) {
      this.type = 2;
      this.submissionTime = this.$formatDate(new Date(), true);

      this.paperData.list.forEach(function (item) {
        if (item.examineAnswer == "" || item.examineAnswer.length == 0) {
          item.isHook = 2;
          item.score = 0;
        } else {
          if (item.type == 1 || item.type == 3) {
            //单选题，判断题
            if (item.examineAnswer == item.correctAnswer) {
              item.isHook = 1;
              item.score = item.totalScore;
            } else {
              item.isHook = 2;
              item.score = 0;
            }
          }
        }
      });
    },
    paperRead(value) {
      this.type = 3;

      let data = value.list.map(item => {
        return item.score;
      });

      this.paperData.score = sum(data);
      function sum(arr) {
        return arr.reduce(function (prev, curr, idx, arr) {
          return parseFloat(prev) + parseFloat(curr);
        });
      }
    }
  }
};
</script>

<style scoped></style>
