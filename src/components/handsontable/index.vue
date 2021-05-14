<template>
  <div id="hot-preview" style="width:100%;height:100%;">
    <HotTable :root="root" ref="hottable" :settings="hotSettings"></HotTable>
  </div>
</template>

<script>

import { HotTable } from '@handsontable/vue';
import 'handsontable/dist/handsontable.full.css';
import "handsontable/languages/zh-CN"; //引入中文语言包

export default {
  name: "handsontable",
  components: {
    HotTable
  },
  data: function () {
    return {
      root: 'test-hot',
      hotSettings: {
        data: [ //数据可以是二维数组，也可以是数组对象
          ['20080101', 10, 11, 12, 13, true],
          ['20090102', 20, 11, 14, 13, true],
          ['20010103', 30, 15, 12, 13, true],
          ['20010104', 32, 21, 21, 32, true],
          ['20010205', 32, 21, 21, 32, true],
          ['20010306', 32, 21, 21, 32, true],
          ['20010407', 32, 21, 21, 32, true],
          ['20010508', 32, 21, 21, 32, true],
          ['20010609', 32, 21, 21, 32, true]
        ],
        width: '100%', //表格的宽度
        className: "htCenter htMiddle", //垂直水平居中
        // colHeaders: true,
        startRows: 5, //行列范围
        startCols: 5,
        minRows: 5,   //最小行
        minCols: 5,   //最小列
        maxRows: 50,  //最大行
        maxCols: 26,  //最大列
        rowHeaders: true,//自定义行表头or 布尔值
        colHeaders: true,//自定义列表头or 布尔值
        minSpareCols: 1, //列留白
        minSpareRows: 1, //行留白
        currentRowClassName: 'currentRow', //为选中行添加类名，可以更改样式
        currentColClassName: 'currentCol', //为选中列添加类名，可以更改样式
        autoColumnSize: true, // 自适应列大小
        headerTooltips: true, //工具栏启用
        dropdownMenu: true,// 下拉菜单
        filters: true, // 筛选条件
        autoWrapRow: true, //自动换行
        contextMenu: { // 右键单元格菜单
          items: {
            'mergeCells': { name: '合并单元格', },
            'row_above': { name: '上方添加一行', },
            'row_below': { name: '下方添加一行', },
            // 'col_left': { name: '左侧添加一列', },
            // 'col_right': { name: '右侧添加一列', },
            'remove_row': { name: '移除此行', },
            'remove_col': { name: '移除此列', }, //如果是data数据是对象数组，则无法使用
            'copy': { name: '复制', },
            'cut': { name: '剪切', },
            'clear_custom': {
              name: '清空表格数据',
              callback: function () {
                this.clear()
              }
            },
            "freeze_column": { name: '固定列', },
            "unfreeze_column": { name: '取消列固定', },
            "commentsAddEdit": { name: '添加注释', },
            "commentsRemove": { name: '取消注释', },
            'make_read_only': { name: '只读', },
            'alignment': {},
            'undo': { name: '还原上次操作', },
            'redo': { name: '重复上次动作', },
          }
        },
        language: "zh-CN", //声明用中文的语言包
        manualColumnFreeze: true, //手动固定列
        manualColumnMove: true, //手动移动列
        manualRowMove: true,   //手动移动行
        manualColumnResize: true,//手工更改列距
        manualRowResize: true,//手动更改行距
        comments: true, //添加注释
        cell: [
          { row: 1, col: 1, comment: { value: 'this is test' } }, //添加注释
        ],
        customBorders: [],//添加边框
        columnSorting: true,//列排序
        stretchH: 'all',//根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
        trimWhitespace: true,  //过滤掉空格
        fillHandle: true, //选中拖拽复制 possible values: true, false, "horizontal", "vertical"
        fixedColumnsLeft: 0,//固定左边列数
        fixedRowsTop: 0,    //固定上边行数
        // mergeCells：[{row:起始行数,cols:起始列数,rowspan:合并的行数,colspan:合并的列数},...], //指定单元格合并
        mergeCells: true,   //表示允许单元格合并
        columns: [     //添加每一列的数据类型和一些配置
          //   {type: 'checkbox'},  //多选框
          {
            type: 'date',   //时间格式
            dateFormat: 'YYYY-MM-DD',
            correctFormat: true,
            defaultDate: '19000101'
          },
          {
            type: 'dropdown', //下拉选择
            source: ['BMW', 'Chrysler', 'Nissan', 'Suzuki', 'Toyota', 'Volvo'],
            strict: false   //是否严格匹配
          },
          {
            type: 'numeric'
          },  //数值
          {
            type: 'numeric',
            readOnly: true  //设置只读
          },
          {
            type: 'numeric',
            format: '$ 0,0.00'
          },  //指定的数据格式
          {},

        ],
      }
    };
  },
  methods: {

  },
  mounted() {
    var hot = this.$refs.hottable.hotInstance;

    //获取合并的单元格数据
    let mergeData = hot.getPlugin('MergeCells').mergedCellsCollection.mergedCells;

    //1个或多个单元格的值被改变后调用
    hot.addHook('afterChange', function (changeData, source) {
      if (!changeData) return;
      // console.log(this.getData())
    })

    //设置范围结束前被调用
    hot.addHook('beforeSetRangeEnd', function (coords) {
      var rangeCell = hot.getCell(coords.row, coords.col);
      $(rangeCell).addClass("currentTd");
    })

    //添加列后被调用
    hot.addHook('afterCreateCol', function (index, amount) { })
    //添加行后被调用
    hot.addHook('afterCreateRow', function (index, amount) { })

    //鼠标点击单元格之后触发， 获取所选区域单元格数组 当前高亮
    hot.addHook('afterOnCellMouseDown', function (event, cellCoords) {
      var selectRangeArr = []; // 所选区域所有单元格数组
      var rangeRowArr = []; // 所选区域行数组
      var rangeColArr = []; // 所选区域列数组

      var selectRange = hot.getSelected()[0]; // 获取所选区域范围
      var txt = hot.getDataAtCell(selectRange[0], selectRange[1]); // 获取所选区域第一个单元格值

      for (var i = selectRange[0]; i < selectRange[2] + 1; i++) {
        rangeRowArr.push(i);
      }
      for (var i = selectRange[1]; i < selectRange[3] + 1; i++) {
        rangeColArr.push(i);
      }
      for (var i = 0; i < rangeRowArr.length; i++) {
        for (var n = 0; n < rangeColArr.length; n++) {
          selectRangeArr.push({ row: rangeRowArr[i], col: rangeColArr[n] });
        }
      }

      // 添加表格失去焦点时的当前单元格类
      $("td").removeClass("currentTd");
      for (var i = 0; i < selectRangeArr.length; i++) {
        var rangeCell = hot.getCell(selectRangeArr[i].row, selectRangeArr[i].col);
        $(rangeCell).addClass("currentTd");
      }
    });
  },
}
</script>
<style>
.currentTd {
  color: red !important;
  background: #bae8ba !important;
}
</style>