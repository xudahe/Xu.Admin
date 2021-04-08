<template>
  <div class="notes-wrapper">
    <el-row style="width: 100%;height: 100%;">
      <el-col :span="5" style="height: 100%;border-right: 1px solid #eaeefb;">
        <sidebar />
      </el-col>
      <el-col :span="5" style="height: 100%;border-right: 1px solid #eaeefb;">
        <file-list
          :fileList="fileList"
          @selectItem="selectItem"
          @createFile="createFile"
        />
      </el-col>
      <el-col :span="14" style="height: 100%;">
        <file-edit
          ref="md"
          v-model="fileItem.content"
          :title.sync="fileItem.title"
          :boxShadow="false"
          :subfield="false"
          :shortCut="false"
          @change="onSubmit"
          @imgAdd="imgAdd"
          @imgDel="imgDel"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Sidebar from "./sidebar";
import FileList from "./fileList";
import FileEdit from "./fileEdit";

export default {
  name: "notice",
  components: { Sidebar, FileList, FileEdit },
  data() {
    return {
      fileList: [
        {
          id: 1,
          title: "文件名 1",
          time: new Date(),
          showTool: false,
          content: "内容1"
        },
        {
          id: 2,
          title: "文件名 2",
          time: new Date(),
          showTool: false,
          content: "内容2"
        },
        {
          id: 3,
          title: "文件名 3",
          time: new Date(),
          showTool: false,
          content: "内容3"
        },
        {
          id: 4,
          title: "文件名 4",
          time: new Date(),
          showTool: false,
          content: "内容4"
        },
        {
          id: 5,
          title: "文件名 5",
          time: new Date(),
          showTool: false,
          content: "内容5"
        },
        {
          id: 6,
          title: "文件名 6",
          time: new Date(),
          showTool: false,
          content: "内容6"
        },
        {
          id: 7,
          title: "文件名 7",
          time: new Date(),
          showTool: false,
          content: "内容7"
        },
        {
          id: 8,
          title: "文件名 8",
          time: new Date(),
          showTool: false,
          content: "内容8"
        },
        {
          id: 9,
          title: "文件名 9",
          time: new Date(),
          showTool: false,
          content: "内容9"
        },
        {
          id: 1,
          title: "文件名 1",
          time: new Date(),
          showTool: false,
          content: "内容1"
        },
        {
          id: 2,
          title: "文件名 2",
          time: new Date(),
          showTool: false,
          content: "内容2"
        },
        {
          id: 3,
          title: "文件名 3",
          time: new Date(),
          showTool: false,
          content: "内容3"
        }
      ],
      fileItem: {
        title: "",
        content: "",
        html: ""
      }
    };
  },
  methods: {
    //md格式(文本)，html格式
    onSubmit(value, render) {
      this.fileItem.html = render;
      console.log(value);
      console.log(this.fileItem);
    },
    selectItem(value) {
      this.fileItem = value;
    },
    createFile() {
      this.fileList.unshift({
        id: this.fileList.length + 1,
        title: "无标题文件" + (this.fileList.length + 1),
        time: new Date(),
        showTool: false,
        content: ""
      });
    },
    // 添加图片
    imgAdd(pos, file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("file", file);
      this.$ajax(this.$apiSet.imgUpload, formdata)
        .then(res => {
          if (!res.data.success) {
            this.$errorMsg(res.data.message);
          } else {
            // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
            var url = res.data.response;
            /**
             * $vm 指为mavonEditor实例，可以通过如下两种方式获取
             * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，此时`$vm`为`mavonEditor`
             * 2. 通过$refs获取: html声明ref : <mavon-editor ref=md ></mavon-editor>`，此时`$vm`为 `this.$refs.md`
             */
            this.$refs.md.$img2Url(pos, url); //$vm.$img2Url(pos, url);
          }
        })
        .catch(err => {});
    },
    // 删除图片
    imgDel(pos) {
      console.log("imgDel pos:" + pos);
    }
  }
};
</script>

<style lang="less" scoped>
.notes-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>

<style lang="less">
.scrollbar-wrapper {
  overflow-x: hidden !important;
}
.el-scrollbar__bar {
  opacity: 1;

  &.is-vertical {
    right: 0px;
    width: 5px;
    .el-scrollbar__thumb {
      background-color: rgba(144, 147, 153, 0.5);
    }
  }
}
</style>
