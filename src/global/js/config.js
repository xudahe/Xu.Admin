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
   }`,
  options: {  
    duration: '0.3',              //转场动画时长，默认为0.3，单位秒   
    firstEntryDisable: false,     //值为true时禁用首次进入应用时的渐现动画，默认为false  
    firstEntryDuration: '.6',     //首次进入应用时的渐现动画时长，默认为.6  
    forwardAnim: 'fadeInRight',   //前进动画，默认为fadeInRight  
    backAnim: 'fadeInLeft',       //后退动画，默认为fedeInLeft   
    sameDepthDisable: false,      //url深度相同时禁用动画，默认为false   
    tabs: [{
            name:'home'
        },{
            name:'my'
        }],                       //默认为[]，'name'对应路由的name,以实现类似app中点击tab页面水平转场效果，如tabs[1]到tabs[0]，会使用backAnim动画，tabs[1]到tabs[2]，会使用forwardAnim动画  
    tabsDisable: false,           //值为true时，tabs间的转场没有动画，默认为false  
    shadow:true,                  //值为false，转场时没有阴影的层次效果
    disable: false,               //禁用转场动画，默认为false，嵌套路由默认为true  
  }  
}


