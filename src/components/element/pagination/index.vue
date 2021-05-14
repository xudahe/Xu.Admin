<template>
  <div class="pagination">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes.sync="defaultPageSizes" :pager-count="5" :small="$defaultConfig.paginationSize" :layout="$defaultConfig.paginationLayout" :current-page.sync="currentPage" :total="total"></el-pagination>
  </div>
</template>
<script>
/**
 * @description 二次封装分页组件，提高开发效率
 * @description 使用方法： <pagination ref="pagination" :get-data="getAuthorityLogList" :now-page.sync="nowPage" :now-size.sync="nowSize" :total="pageTotal" />
 */
export default {
  name: "pagination",
  props: {
    total: {
      type: Number,
      default: 0
    },
    getData: {
      type: Function,
      default: () => { }
    },
    nowPage: {
      type: Number,
      default: 1
    },
    nowSize: {
      type: Number,
      default: 10
    },
    isInit: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    nowPage(val) {
      this.currentPage = val
    },
    // currentPage(val) {
    //   this.$emit("update:nowPage", val)
    // },
    // pageSize(val) {
    //   this.$emit("update:nowSize", val)
    // }
  },
  data() {
    return {
      currentPage: this.nowPage,
      pageSize: this.nowSize,
      defaultPageSizes: [this.nowSize, parseInt(this.nowSize * 2.5), parseInt(this.nowSize * 5), parseInt(this.nowSize * 10)]
    }
  },
  created() {
    // 初始化数据
    this.isInit && this.toFirstPage() //这种写法为：短路条件
  },
  methods: {
    // 跳转到第一页
    toFirstPage() {
      this.currentPage = 1
      this.$emit('handleSizeChange', { 'currentPage': this.currentPage, 'pageSize': this.pageSize });
    },
    handleSizeChange(size) {
      this.currentPage = 1
      this.pageSize = size
      this.$emit('handleSizeChange', { 'currentPage': this.currentPage, 'pageSize': this.pageSize });
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.$emit('handleCurrentChange', { 'currentPage': this.currentPage, 'pageSize': this.pageSize });
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  position: relative;
  text-align: right;
  margin-top: 5px;
}
</style>

