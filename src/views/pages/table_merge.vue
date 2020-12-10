<template>
  <Table
    ref="table"
    :columns="columns11"
    :data="datalist"
    border
    :height="tableheight"
    show-summary
    :summary-method="handleSummary"
    :span-method="handleSpan"
  ></Table>
</template>
<script>
export default {
  name:"table_merge",
  data() {
    return {
      columns11: [
        {
          title: "用地情况汇总表",
          align: "center",
          children: [
            {
              title: "统计面积",
              align: "center",
              children: [
                {
                  title: "地块类别",
                  key: "地块类别",
                  align: "left",
                  width: 180
                },
                {
                  title: "首字母",
                  key: "首字母",
                  align: "center",
                  width: 130
                },
                {
                  title: "用地代码",
                  key: "用地代码",
                  align: "center",
                  width: 100
                },
                {
                  title: "用地类别",
                  key: "用地类别",
                  align: "center",
                  width: 100
                }
              ]
            },
            {
              title: "",
              align: "center",
              children: [
                {
                  title: "图斑小计(个)",
                  key: "图斑小计",
                  align: "center",
                  width: 100
                },
                {
                  title: "面积小计(㎡)",
                  key: "面积小计",
                  align: "center",
                  width: 100
                }
              ]
            },
            {
              title: "已让出",
              align: "center",
              children: [
                {
                  title: "已出让面积(㎡)",
                  key: "已出让面积",
                  align: "center",
                  width: 120
                }
              ]
            },
            {
              title: "未出让",
              align: "center",
              children: [
                {
                  title: "未出让面积(㎡)",
                  key: "未出让面积",
                  align: "center",
                  width: 120
                },
                {
                  title: "未出让中允许建设用地面积(㎡)",
                  key: "未出让中允许建设用地面积",
                  align: "center",
                  width: 150
                },
                {
                  title: "待更新面积(㎡)",
                  key: "待更新面积",
                  align: "center",
                  width: 120
                },
                {
                  title: "待更新中允许建设用地面积(㎡)",
                  key: "待更新中允许建设用地面积",
                  align: "center",
                  width: 150
                }
              ]
            }
          ]
        }
      ],
      tableData: [
        {
          图斑小计: 2,
          面积小计: 22450,
          已出让面积: 9476,
          未出让面积: 0,
          未出让中允许建设用地面积: 0,
          待更新面积: 0,
          待更新中允许建设用地面积: 12974.42,
          用地代码: "A21",
          用地类别: "图书展览",
          首字母: "A",
          地块类别: "公共管理与公共服务设施用地"
        },
        {
          图斑小计: 10,
          面积小计: 718464,
          已出让面积: 714356,
          未出让面积: 0,
          未出让中允许建设用地面积: 0,
          待更新面积: 4107.16,
          待更新中允许建设用地面积: 0,
          用地代码: "A31",
          用地类别: "高等院校",
          首字母: "A",
          地块类别: "公共管理与公共服务设施用地"
        },
        {
          图斑小计: 2,
          面积小计: 43518,
          已出让面积: 43518,
          未出让面积: 0,
          未出让中允许建设用地面积: 0,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "A33",
          用地类别: "中小学",
          首字母: "A",
          地块类别: "公共管理与公共服务设施用地"
        },
        {
          图斑小计: 1,
          面积小计: 4516.1,
          已出让面积: 4516,
          未出让面积: 0,
          未出让中允许建设用地面积: 0,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "A51b",
          用地类别: "社区医院",
          首字母: "A",
          地块类别: "公共管理与公共服务设施用地"
        },
        {
          图斑小计: 5,
          面积小计: 50909,
          已出让面积: 25763,
          未出让面积: 20603.82,
          未出让中允许建设用地面积: 4541.98,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "B1",
          用地类别: "商业",
          首字母: "B",
          地块类别: "商业服务业设施用地"
        },
        {
          图斑小计: 49,
          面积小计: 738186,
          已出让面积: 504314,
          未出让面积: 187429.29,
          未出让中允许建设用地面积: 0,
          待更新面积: 0,
          待更新中允许建设用地面积: 46443.44,
          用地代码: "B29a",
          用地类别: "科研设计",
          首字母: "B",
          地块类别: "商业服务业设施用地"
        },
        {
          图斑小计: 1,
          面积小计: 6225.15,
          已出让面积: 0,
          未出让面积: 6225.15,
          未出让中允许建设用地面积: 0,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "B3",
          用地类别: "娱乐康体",
          首字母: "B",
          地块类别: "商业服务业设施用地"
        },
        {
          图斑小计: 2,
          面积小计: 5634,
          已出让面积: 3051,
          未出让面积: 2582.76,
          未出让中允许建设用地面积: 0,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "B41",
          用地类别: "加油加气站",
          首字母: "B",
          地块类别: "商业服务业设施用地"
        },
        {
          图斑小计: 30,
          面积小计: 291671,
          已出让面积: 200624,
          未出让面积: 80953.26,
          未出让中允许建设用地面积: 0,
          待更新面积: 10094.52,
          待更新中允许建设用地面积: 0,
          用地代码: "Bb",
          用地类别: "商办混合",
          首字母: "B",
          地块类别: "商业服务业设施用地"
        },
        {
          图斑小计: 28,
          面积小计: 188945,
          已出让面积: 113062,
          未出让面积: 8085.63,
          未出让中允许建设用地面积: 0,
          待更新面积: 67795.49,
          待更新中允许建设用地面积: 0,
          用地代码: "E1",
          用地类别: "水域",
          首字母: "E",
          地块类别: "非建设用地"
        },
        {
          图斑小计: 32,
          面积小计: 329641,
          已出让面积: 198695,
          未出让面积: 42857.7,
          未出让中允许建设用地面积: 41263.03,
          待更新面积: 46826.31,
          待更新中允许建设用地面积: 0,
          用地代码: "G1",
          用地类别: "公园绿地",
          首字母: "G",
          地块类别: "绿地与广场用地"
        },
        {
          图斑小计: 85,
          面积小计: 291918,
          已出让面积: 276452,
          未出让面积: 12144.18,
          未出让中允许建设用地面积: 0,
          待更新面积: 2855.12,
          待更新中允许建设用地面积: 465.37,
          用地代码: "G1c",
          用地类别: "街旁绿地",
          首字母: "G",
          地块类别: "绿地与广场用地"
        },
        {
          图斑小计: 4,
          面积小计: 11077,
          已出让面积: 11078,
          未出让面积: 0,
          未出让中允许建设用地面积: 0,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "G2",
          用地类别: "防护绿地",
          首字母: "G",
          地块类别: "绿地与广场用地"
        },
        {
          图斑小计: 3,
          面积小计: 32264,
          已出让面积: 0,
          未出让面积: 0,
          未出让中允许建设用地面积: 0,
          待更新面积: 32263.82,
          待更新中允许建设用地面积: 0,
          用地代码: "H41",
          用地类别: "军事",
          首字母: "H",
          地块类别: "建设用地"
        },
        {
          图斑小计: 16,
          面积小计: 256765,
          已出让面积: 197047,
          未出让面积: 8147.71,
          未出让中允许建设用地面积: 51569.64,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "R2",
          用地类别: "二类居住",
          首字母: "R",
          地块类别: "居住用地"
        },
        {
          图斑小计: 1,
          面积小计: 15008.5,
          已出让面积: 15008,
          未出让面积: 0,
          未出让中允许建设用地面积: 0,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "Ra",
          用地类别: "其他居住",
          首字母: "R",
          地块类别: "居住用地"
        },
        {
          图斑小计: 2,
          面积小计: 9044,
          已出让面积: 3940,
          未出让面积: 5103.85,
          未出让中允许建设用地面积: 0,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "Rac",
          用地类别: "单身职工公寓",
          首字母: "R",
          地块类别: "居住用地"
        },
        {
          图斑小计: 2,
          面积小计: 18283,
          已出让面积: 5278,
          未出让面积: 0,
          未出让中允许建设用地面积: 13004.74,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "Rax",
          用地类别: "幼托",
          首字母: "R",
          地块类别: "居住用地"
        },
        {
          图斑小计: 1,
          面积小计: 2747.64,
          已出让面积: 0,
          未出让面积: 0,
          未出让中允许建设用地面积: 0,
          待更新面积: 2747.64,
          待更新中允许建设用地面积: 0,
          用地代码: "S41",
          用地类别: "公共交通场站",
          首字母: "S",
          地块类别: "道路与交通设施用地"
        },
        {
          图斑小计: 1,
          面积小计: 5117.82,
          已出让面积: 5118,
          未出让面积: 0,
          未出让中允许建设用地面积: 0,
          待更新面积: 0,
          待更新中允许建设用地面积: 0,
          用地代码: "U22",
          用地类别: "环卫",
          首字母: "U",
          地块类别: "公用设施用地"
        }
      ],
      datalist: [],
      tableheight: 420
    };
  },
  mounted() {
    this.assembleData(this.tableData);
    this.calculatorheight();
  },
  methods: {
    calculatorheight() {
      let _this = this;

      var height = document.documentElement.clientHeight;
      this.tableheight = height - 150;

      window.addEventListener("resize", function() {
        var height = document.documentElement.clientHeight;
        _this.tableheight = height - 150;
      });
    },
    handleSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        //计算合并的行数列数
        let x = row.num == 0 ? 0 : row.num;
        let y = row.num == 0 ? 0 : 1;
        return [x, y];
      }

      if (columnIndex == 1) {
        //计算合并的行数列数
        let x = row.agenum == 0 ? 0 : row.agenum;
        let y = row.agenum == 0 ? 0 : 1;
        return [x, y];
      }

      //列合并
      if (row.用地类别 === "小计")
        if (columnIndex === row.i) {
          return [1, row.long];
        } else if (columnIndex > row.i && columnIndex < row.i + row.long) {
          return [0, 0];
        }
    },
    assembleData(data) {
      if (data.length == 0) return;

      let item3 = {};

      for (var i = 0; i < data.length; i++) {
        let item = {
          用地代码: "小计",
          用地类别: "小计"
        };

        if (data[i].already !== 1) {
          item.图斑小计 = data[i].图斑小计;
          item.面积小计 = data[i].面积小计;
          item.已出让面积 = data[i].已出让面积;
          item.未出让面积 = data[i].未出让面积;
          item.未出让中允许建设用地面积 = data[i].未出让中允许建设用地面积;
          item.待更新面积 = data[i].待更新面积;
          item.待更新中允许建设用地面积 = data[i].待更新中允许建设用地面积;
          item.首字母 = data[i].首字母;
          item.地块类别 = data[i].地块类别;

          if (data[i + 1]) {
            let index = 0;
            for (var a = i + 1; a < data.length + 1; a++) {
              index = a;

              //最后一行小计.有问题
              if (a == data.length) {
                item3 = item;
                break;
              }

              if (data[i].地块类别 === data[a].地块类别) {
                item.图斑小计 += data[a].图斑小计;
                item.面积小计 += data[a].面积小计;
                item.已出让面积 += data[a].已出让面积;
                item.未出让面积 += data[a].未出让面积;
                item.未出让中允许建设用地面积 +=
                  data[a].未出让中允许建设用地面积;
                item.待更新面积 += data[a].待更新面积;
                item.待更新中允许建设用地面积 +=
                  data[a].待更新中允许建设用地面积;

                data[a].already = 1;
              } else {
                if (data[a - 1].用地代码 !== "小计") {
                  item.未出让面积 =
                    item.未出让面积 != 0 ? item.未出让面积.toFixed(2) : 0;
                  item.已出让面积 =
                    item.已出让面积 != 0 ? item.已出让面积.toFixed(2) : 0;
                  data.splice(a, 0, item);
                }
                break;
              }
            }
          } else if (i == data.length - 1) {
            item3 = item;
          }
        }
      }

      item3.未出让面积 =
        item3.未出让面积 != 0 ? item3.未出让面积.toFixed(2) : 0;
      data.splice(data.length, 0, item3);

      // 数据处理算法，处理后，便于单元格的合并
      for (var i = 0; i < data.length; i++) {
        if (data.小计 === data.用地类别) {
          data[i].i = 2;
          data[i].long = 2;
        }

        if (data[i].already !== 1) {
          if (data[i + 1]) {
            data[i].num = 1;
            for (var a = i + 1; a < data.length; a++) {
              if (data[i].地块类别 === data[a].地块类别) {
                data[i].num++;
                data[a].num = 0;
                data[a].already = 1;
              } else {
                break;
              }
            }
          }
        }
      }

      for (var j = 0; j < data.length; j++) {
        //  > 1 表示name 有合并  需要在name合并的row中 再合并age
        if (data[j].num > 1) {
          for (var k = 0; k < data[j].num; k++) {
            if (data[j + k].agealready !== 1) {
              if (k + 1 < data[j].num) {
                data[j + k].agenum = 1;
                for (var b = k + 1; b < data[j].num; b++) {
                  if (data[j + k].首字母 === data[j + b].首字母) {
                    data[j + k].agenum++;
                    data[j + b].agenum = 0;
                    data[j + b].agealready = 1;
                  } else {
                    break;
                  }
                }
              }
            }
          }
        }
      }
      //将整理后的数据交给表格渲染
      this.datalist = data;
    },

    //合计
    handleSummary({ columns, data }) {
      const sums = {};
      columns.forEach((column, index) => {
        const key = column.key;
        if (index === 0) {
          sums[key] = {
            key,
            value: "合计"
          };
          return;
        }
        const values = data
          .filter(item => item.用地代码 != "小计")
          .map(item => Number(item[key]));
        if (!values.every(value => isNaN(value))) {
          const v = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[key] = {
            key,
            value: v.toFixed(2)
          };
        } else {
          sums[key] = {
            key,
            value: "--"
          };
        }
      });

      return sums;
    }
  }
};
</script>
