
<template>
  <div class="v-card">
    <el-row>
      <template v-for="(item,index) in datalist">
        <el-col  v-bind="colProps" style="padding: 0.05rem;" :key="index">
          <el-card class="box-card" shadow="hover" style="border: 1px solid #ebeef5;">
             <div class="panel_body">
                <div class="data-item">
                  <img src="../../../static/img/暂无图片.png" class="imgLeft" v-viewer></img>
                  <div class="text">
                      <div class="card_title">萧杰</div>
                      <div class="card_lable">专根示千常备接亲确调大志只定。儿集得分度断制线开示种然事白给参。共度可却积改率教指识细器具资林术</div>
                  </div>
                </div>
                <div class="corner-mark" >
                  <div class="corner-mark__wrapper">
                    HOT
                  </div>
                </div>
             </div>
             <div v-if="actions && actions.length" class="panel_actions">
               <div class="panel-action_item" v-for="(action,index) in actions" :key="index" :style="{width:`${100/actions.length}%`}">
                  <i :class="action.icon" style="margin-right: 0.05rem;"/>{{action.text}}
               </div>
             </div>
          </el-card>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>

  import responsive, {responsiveArray} from '../../utils/responsive.js'

  export default {
    name: 'v-card',
    props: {
      // 数据
      datalist:{
        type: Array,
        default: [1,2,3,4,5,6,7,8,9]
      },
      // 显示列数，支持响应式对象设置 {xxl,xl,lg,md,sm,xs}
      columns: {
        type: [Number, Object],
        default: 3,
        validator(val) {
          return typeof val === 'number' ? 24 % val === 0 : true
        }
      },
    },
    watch: {
      columns: {
        immediate: true,
        handler() {
          this.setupResponsive()
          this.currentColumn = this.getResponsiveValue()
        }
      },
      screens() {
        this.currentColumn = this.getResponsiveValue()
      },
    },
    data() {
      return {
        screens: {},
        currentColumn: 3,

        actions: [
          {
            text: '查看',
            icon: 'el-icon-view'
          },
          {
            text: '编辑',
            icon: 'el-icon-edit'
          },
          {
            text: '删除',
            icon: 'el-icon-delete'
          }
        ]
      }
    },
    computed: {
      colProps() {
        return {
          span: Math.floor(24 / this.currentColumn)
        }
      },
    },
    methods: {
      // 开启响应式
      setupResponsive() {
        
        this.token && responsive.off(this.token)

        // 参数是对象类型，即开启响应式
        if (typeof this.columns !== 'object') return

        this.token = responsive.on(screens => {
          this.screens = screens
        })
      },
      // 获取当前响应式的列数
      getResponsiveValue() {
        
        const columns = this.columns
        const defaultValue = 3
        if (!columns) return defaultValue
        // 参数是对象类型，即开启响应式
        if (typeof columns === 'object') {
          for (let i = 0; i < responsiveArray.length; i++) {
            const breakpoint = responsiveArray[i]
            if (this.screens[breakpoint]) {
              return columns[breakpoint] || defaultValue
            }
          }
        }
        // 数字类型
        return columns
      },
      handleActionClick(action) {
        this.$emit('action', action)
      }
     
    }
  }
</script>

<style lang="less" scoped>
@deep: ~'>>>';

.v-card {
  height: 100%;
  width: 100%;

  @{deep}.el-card__body {
    padding: 0 !important;
  }

  .panel_body{
    width: 100%;
    height: 100%;
    padding: 0.05rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .panel_actions{
     background: rgba(0,0,0,.02);
     border-top: 1px solid rgba(0,0,0,.04);
  }
  
  .panel-action_item {
    text-align: center;
    display: inline-block;
    width: 50%;
    position: relative;
    line-height: 0.3rem;
    height: 0.3rem;
    cursor: pointer;
    color: rgba(0,0,0,.45);
  }
  .panel-action_item::after {
    content: "";
    border-right: 1px solid rgba(0,0,0,.09);
    height: 0.2rem;
    position: absolute;
    right: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .panel-action_item:last-child::after {
    display: none;
  }

   .panel-action_item:hover {
    color: rgba(24, 144, 255,1);
  }

  .data-item {
    width: 100%;
    height: 1rem;
  }

  .corner-mark {
    width: 0.6rem;
    height: 0.5rem;
    -webkit-transform: translate(50%,-50%);
    transform: translate(50%,-50%);
    float: right;
    margin-top: -0.9rem;
    margin-right: 0.1rem;
  }

  .corner-mark__wrapper {
    height: 0.2rem;
    line-height: 0.2rem;
    font-size: 0.08rem;
    background: #ffffff;
    color: #ffaf02;
    text-align: center;
    -webkit-box-shadow: 0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.12);
    box-shadow: 0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.12);
    position: absolute;
    top: 50%;
    width: 100%;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }

  .data-item .imgLeft {
    width: 0.8rem;
    height: 0.8rem;
    // float: left;
    margin-top: 0.2rem;
  }

  .data-item .text {
    width: calc(~'100% - 0.8rem');
    height: 100%;
    float: left;
    padding-left: 0.05rem;
 
  }

  .card_title {
    font-size: 0.18rem;
    font-weight: 500;
    color: #000;
    height: 0.3rem;
    // line-height: 0.3rem;
  }
  
  .card_lable {
    font-size: 0.12rem;
    height: calc(100% - 0.3rem);
    text-indent: 2em; //首行缩进

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }

}

</style>
