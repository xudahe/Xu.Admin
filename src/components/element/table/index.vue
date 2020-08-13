<template>
 <section>
  <el-table ref="table" 
    element-loading-text="Loading" 
    :data="dataList" 
    :height="tableHeight"
    border fit highlight-current-row 
    tooltip-effect="dark" 
    style="width:100%;margin-top: 3px;"
    :header-cell-style="{background:'#f2f2f2',color:'#606266'}"
    @row-click="handleRowClick"  
    @sort-change="handleSortChange" 
    @selection-change="handleSelectionChange">
      <template v-for="(item,index) in tableLabel">
        <el-table-column v-if="item.type" :type="item.type" :key="index"></el-table-column>
        <el-table-column v-else
          :width="item.width ? item.width : ''" 
          :key="index" 
          :align="item.align ? item.align : 'center'" 
          :label="item.label" 
          :prop="item.param" 
          :sortable="item.sortable ? 'custom' : false">
            <template slot-scope="scope">
              
              <template  v-if="item.render">
                <ex-slot :render="item.render" :row="scope.row" :index="scope.$index" :column="item" ></ex-slot>
              </template>
              <template v-else>
                  <template v-if="item.formatter">
                    <span v-html="item.formatter(scope.row)"></span>
                  </template>
                  <template v-else>
                    <span>{{scope.row[item.param]}}</span>
                  </template>
              </template>

              <!-- <span v-if="item.render">
                {{item.render(scope.row)}}
              </span>
              <span v-else>{{scope.row[item.param]}}</span> -->
            </template>
        </el-table-column>
      </template>
      <el-table-column v-if="tableOption.label" :width="tableOption.width" :label="tableOption.label" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button  v-for="(item,index) in tableOption.options" :key="index" :type="item.type" :icon="item.icon" @click.native="handleButton(item.methods,scope.row,index)" size="mini">
            {{item.label}}
          </el-button>
        </template>
      </el-table-column>
  </el-table>
  <pagination ref="pagination" :now-page.sync="nowPage" :now-size.sync="nowSize" :total="tableData.length"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"/>
 </section>
</template>

<script>

/**
 * @description 二次封装elementUI table组件，提高开发效率
 * @description 使用方法： <e-table :table-data="tableData" :table-label="tableLabel" :table-option="tableOption" ></e-table>
 */

// 自定义内容的组件
var exSlot = {
  functional: true,
  props: {
      row: Object,
      render: Function,
      index: Number,
      column: {
          type: Object,
          default: null
      }
  },
  render: (h, data) => {
    const params = {
        row: data.props.row,
        index: data.props.index
    }
    if (data.props.column) params.column = data.props.column
      return data.props.render(h, params)
  }
}

import pagination from "../pagination/index"
export default {
  name: "e-table",
  components: { 
    exSlot,
    pagination 
  },
  props:{
    tableData:{
      type:Array,
      default: () => {
        return []
      }
    },
    tableLabel:{
      type:Array,
      default: () => {
        return []
      }
    },
    tableOption:{
      type:Object,
      default: () => {
        return {}
      }
    },

    nowPage: { // 当前页数
      type: Number,
      default: 1
    },
    nowSize: { // 当前页条数
      type: Number,
      default: 10
    },
  },
  data() {
    return {
      currentPage: this.nowPage,
      pageSize: this.nowSize,
      tableHeight: 350,
    }
  },
  computed:{
      dataList(){
        return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
      },
  },
  methods: {
    handleButton(methods,row,index){  //监听按钮事件
      this.$emit('handleButton',{'methods':methods,'row':row,'index':index})
    },
    handleSortChange(val){  //当表格的排序条件发生变化的时候会触发该事件
      this.$emit('handleSortChange',val)
    },
    handleRowClick(val){  //当某一行被点击时会触发该事件
      this.$emit('handleRowClick',val)
    },
    handleSelectionChange(val){ //当选择项发生变化时会触发该事件
      this.$emit('handleSelectionChange',val)
    },

    initialPage(currentPage,pageSize) { //分页初始化
      this.currentPage = currentPage;
      this.pageSize = pageSize;
    },
    handleSizeChange(val) {
      this.initialPage(val.currentPage,val.pageSize);
    },
    handleCurrentChange(val) {
      this.initialPage(val.currentPage,val.pageSize);
    },
  },
  created(){
    let _this = this;
    
    setTimeout(() => {
      let docm = document.getElementsByClassName("el-card")
      _this.tableHeight = docm != undefined ? docm[docm.length-1].offsetHeight - 105: _this.tableHeight;
    }, 100);
    
    window.addEventListener("resize", function() { 
      let docm1 = document.getElementsByClassName("el-card")
      _this.tableHeight = docm1 != undefined ? docm1[docm1.length-1].offsetHeight - 105: _this.tableHeight;
    });
  }
}
</script>