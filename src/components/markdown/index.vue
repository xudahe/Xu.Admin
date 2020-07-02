<template>
    <div class="mavon-editor">
        <mavon-editor :toolbars="toolbars"  @imgAdd="handleEditorImgAdd" @imgDel="handleEditorImgDel" style="height:500px" v-model="content" @change="change" ref=md />
    </div>
</template>

<script>

export default {
    name: 'markdown',
    props:{
        curValue:{
            type:String,
            default:''
        },
    },
    data(){
        return {
            content: this.curValue, // 输入的markdown
            html:'',    // 及时转的html

            toolbars: { //工具栏
              bold: true, // 粗体
              italic: true, // 斜体
              header: true, // 标题
              underline: true, // 下划线
              strikethrough: true, // 中划线
              mark: true, // 标记
              superscript: true, // 上角标
              subscript: true, // 下角标
              quote: true, // 引用
              ol: true, // 有序列表
              ul: true, // 无序列表
              link: true, // 链接
              imagelink: true, // 图片链接
              code: false, // code
              table: true, // 表格
              fullscreen: true, // 全屏编辑
              readmodel: true, // 沉浸式阅读
              htmlcode: true, // 展示html源码
              help: true, // 帮助
              undo: true, // 上一步
              redo: true, // 下一步
              trash: true, // 清空
              save: true, // 保存（触发events中的save事件）
              navigation: true, // 导航目录
              alignleft: true, // 左对齐
              aligncenter: true, // 居中
              alignright: true, // 右对齐
              subfield: true, // 单双栏模式
              preview: true, // 预览
            },
        }
    },
    methods: {
        //监听markdown变化, 可以实时保存等等
        change(value, render) {
            this.html = render;
            // this.blogInfo.blogMdContent = value;
            // this.blogInfo.blogContent = render;
        },
        //指定图片上传调用的方法，该方法主要将图片上传后台，并且返回地址，替换到markdown中
        handleEditorImgAdd(pos , $file){
          var formdata = new FormData();
          formdata.append('file' , $file);
        },
        //删除图片调用的方法，该方法主要调用后台删除图片
        handleEditorImgDel(){
    
        }
    },

};
</script>

<style scoped>

</style>
