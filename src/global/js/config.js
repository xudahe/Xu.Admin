import { isMobile, isIpad } from '@/utils/agent'
// 全局统一配置信息。操作这些信息方便改后打包使用。
// 布尔类型的值改为false则表示不允许设置,保存后刷新页面即可生效
export default {
  // 错误日志icon
  errorLog: true,
  // 分页组件
  paginationLayout: `${
    // 是否为ipad
    isIpad()
      ? 'total, sizes, prev, pager, next'
      // 是否为移动设备
      : isMobile()
        ? 'prev, pager, next'
        // pc设备
        : 'total, sizes, prev, pager, next, jumper'
  }`,
  // 分页大小
  paginationSize: isMobile() && !isIpad(),
  // 图片预览尺寸
  previewImageSize: `${
   isMobile() && !isIpad()
     ? '90%'
     : '500px'
   }`
}


