<template>
  <div style="height: 100%;">
    <div class="file-search">
      <el-input v-model="filterText" placeholder="搜索目录..."> </el-input>
      <el-dropdown style="margin-left:5px;">
        <el-button type="primary" icon="el-icon-circle-plus-outline" circle />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>新建文件夹</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-scrollbar class="scrollbar-list" wrap-class="scrollbar-wrapper" :noresize="false">
      <el-tree ref="tree" :data="fileData" :props="defaultProps" :default-expand-all="true" :filter-node-method="filterNode" @node-click="handleNodeClick" @node-contextmenu="rightClick" style="background-color: #f5f5f5;" highlight-current node-key="id">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <!-- 编辑状态 -->
          <template v-if="node.isEdit">
            <el-input v-model="data.fileName" autofocus size="mini" :ref="'slotTreeInput' + node.id" @keyup.enter.native="handleInput(node, data)" @blur.stop="handleInput(node, data)">
            </el-input>
          </template>
          <!-- 非编辑状态 -->
          <template v-else>
            <span class="tree-lable" :title="node.label">
              <img src="../../../static/img/file/folder.png" style="width:0.15rem;margin-right: 0.05rem;" />
              {{ node.label }}
            </span>
          </template>
        </div>
      </el-tree>
    </el-scrollbar>
    <!-- 鼠标右键产生的选项 -->
    <div v-show="menuVisible" id="menu" class="rightMenu">
      <el-menu class="el-menu-vertical rightClickMenu" @select="handleRightSelect" text-color="#303133" active-text-color="#303133">
        <el-menu-item index="1" class="menuItem">
          <i class="el-icon-folder-add" style="font-size: 15px;"></i>
          <span slot="title">新建文件夹</span>
        </el-menu-item>
        <el-menu-item index="2" class="menuItem">
          <i class="el-icon-folder-add" style="font-size: 15px;"></i>
          <span slot="title">上传</span>
        </el-menu-item>
        <el-menu-item index="3" class="menuItem">
          <i class="el-icon-edit" style="font-size: 15px;"></i>
          <span slot="title">重命名</span>
        </el-menu-item>
        <el-menu-item index="4" class="menuItem">
          <i class="el-icon-delete" style="font-size: 15px;"></i>
          <span slot="title">删除</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

//参考： https://blog.csdn.net/qq_42194357/article/details/108398218
<script>
export default {
  name: "sidebar",
  data() {
    return {
      filterText: "",

      treeClickCount: 0, //定义点击次数,默认0次
      isLoading: false, // 是否加载
      menuVisible: false, // 菜单展示弹窗
      objectID: null, // 当前树节点记录ID
      DATA: {}, // 当前右击节点对应数据
      NODE: {}, // 当前右击节点node
      MAX_LEVEL: 4, // 允许文件存在最大层数
      NODE_ID_START: 0, // 新增节点id，逐次递减
      startId: null,

      // 所有文件名Data
      fileData: [
        {
          id: "1",
          fileName: "1 WA",
          icon: "el-icon-success",
          children: [
            {
              id: "1.1",
              fileName: "1.1 SQR相关",
              children: [
                {
                  id: "1.11",
                  fileName: "QFD"
                },
                {
                  id: "1.12",
                  fileName: "产品开发要求规格"
                },
                {
                  id: "1.13",
                  fileName: "测试清单"
                }
              ]
            },
            {
              id: "1.2",
              fileName: "1.2 项目计划",
              children: [
                {
                  id: "1.21",
                  fileName: "项目开发计划"
                },
                {
                  id: "1.22",
                  fileName: "问题解决计划"
                },
                {
                  id: "1.23",
                  fileName: "送样计划 "
                }
              ]
            },
            {
              id: "1.3",
              fileName: "1.3 立项任务书"
            },
            {
              id: "1.4",
              fileName: "1.4 成本/BOM",
              children: [
                {
                  id: "1.41",
                  fileName: "项目成本要求"
                },
                {
                  id: "1.42",
                  fileName: "项目预算"
                },
                {
                  id: "1.43",
                  fileName: "项目实际花费"
                },
                {
                  id: "1.44",
                  fileName: "BOM"
                }
              ]
            },
            {
              id: "1.5",
              fileName: "1.5 每阶段设计构想",
              children: [
                {
                  id: "1.51",
                  fileName: "设计构想书"
                },
                {
                  id: "1.52",
                  fileName: "DOE方案"
                }
              ]
            },
            {
              id: "1.6",
              fileName: "1.6 试验/试产总结",
              children: [
                {
                  id: "1.61",
                  fileName: "试验总结"
                },
                {
                  id: "1.62",
                  fileName: "试产总结"
                }
              ]
            },
            {
              id: "1.7",
              fileName: "1.7 问题清单及问题解决报告",
              children: [
                {
                  id: "1.71",
                  fileName: "问题清单"
                },
                {
                  id: "1.72",
                  fileName: "问题解决报告"
                }
              ]
            },
            {
              id: "1.8",
              fileName: "1.8 FMEA",
              children: [
                {
                  id: "1.81",
                  fileName: "DFMEA"
                },
                {
                  id: "1.82",
                  fileName: "PFMEA"
                }
              ]
            },
            {
              id: "1.9",
              fileName: "1.9 CC/SC; PFD; CP",
              children: [
                {
                  id: "1.91",
                  fileName: "CC/SC"
                },
                {
                  id: "1.92",
                  fileName: "PFD"
                },
                {
                  id: "1.93",
                  fileName: "CP"
                }
              ]
            },
            {
              id: "2.0",
              fileName: "2.0 生产工艺文件相关",
              children: [
                {
                  id: "2.01",
                  fileName: "生产规格书"
                },
                {
                  id: "2.02",
                  fileName: "测试清单"
                }
              ]
            },
            {
              id: "2.1",
              fileName: "2.1 图纸"
            },
            {
              id: "2.2",
              fileName: "2.2 各阶段评审报告"
            },
            {
              id: "2.3",
              fileName: "2.3 原材料规格书"
            }
          ]
        },
        {
          id: "2",
          fileName: "2 WA",
          icon: "el-icon-success",
          children: [
            {
              id: "2.0",
              fileName: "2.0 生产工艺文件相关",
              children: [
                {
                  id: "2.01",
                  fileName: "生产规格书"
                },
                {
                  id: "2.02",
                  fileName: "测试清单"
                }
              ]
            },
            {
              id: "2.1",
              fileName: "2.1 图纸"
            },
            {
              id: "2.2",
              fileName: "2.2 各阶段评审报告"
            },
            {
              id: "2.3",
              fileName: "2.3 原材料规格书"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "fileName",
        isLeaf: "leaf"
      },
      treeModel: {
        id: "", //当前节点id
        parentId: "", //父级节点id
        fileName: "", // 当前文件名称
        isDirectory: true, // 当前文件是否为文件夹
        leaf: true // 是否无子节点
      },
      oldFileName: "", // 旧的文件名称
      folderName: "新建文件夹", // 记录新建文件夹名称
      subscript: 1 // 重复文件下标
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val.trim());
    }
  },
  created() {
    // 初始值
    this.startId = this.NODE_ID_START;
    this.subscript = 1;
  },
  methods: {
    handleNodeClick(data, node) {
      let _self = this;
      //记录点击次数
      this.treeClickCount++;
      //单次点击次数超过2次不作处理,直接返回,也可以拓展成多击事件
      if (this.treeClickCount >= 2) {
        return;
      }
      //计时器,计算300毫秒为单位,可自行修改
      window.setTimeout(() => {
        if (_self.treeClickCount == 1) {
          //把次数归零
          _self.treeClickCount = 0;
          //单击事件处理
          console.log("单击事件,可在此处理对应逻辑");
        } else if (_self.treeClickCount > 1) {
          //把次数归零
          _self.treeClickCount = 0;
          //双击事件
          console.log("双击事件,可在此处理对应逻辑");
          _self.handleEdit(node, data);
        }
      }, 300);

      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(node.id);
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //修改节点
    handleInput(node, data) {
      var _self = this;
      // 退出编辑状态
      if (node.isEdit) {
        _self.$set(node, "isEdit", false);
      }

      // 校验当前文件名在父文件夹中是否重复，并进行修改
      var _childData =
        node.childNodes.length > 0
          ? node.childNodes
          : _self.fileData.filter(
            d => d.Level == (data.isDirectory ? node.level - 1 : node.level)
          );
      let flag = _self.checkLoadlRepeat(_childData, data.fileName);
      if (!flag) {
        _self.$set(node, "isEdit", true);
        return this.$message.error("文件名重复，请重命名！");
      }

      if (_self.oldFileName === data.fileName) {
      } else {
        ChkUtil.Ajax(
          "/FileStore/ChangeFileDirectoryName",
          "post",
          {
            oldFileName: _self.oldFileName,
            newFileName: data.fileName
          },
          function (cndata) {
            if (cndata.success) {
              _self.$successMsg("重命名成功！");
            } else {
              _self.$errorMsg("重命名失败！");
            }
          }
        );
      }
    },

    //重命名方法
    handleEdit(node, data) {
      var _self = this;
      // 模板文件夹名称不能重命名
      if (data.isTemplate === 1) {
        _self.$message.error("该文件夹无法重命名");
      } else {
        // 设置编辑状态
        if (!node.isEdit) {
          _self.$set(node, "isEdit", true);
        }

        // 输入框聚焦
        _self.$nextTick(() => {
          if (_self.$refs["slotTreeInput" + node.id]) {
            _self.$refs["slotTreeInput" + node.id].$refs.input.focus();
          }
        });
        _self.oldFileName = data.fileName;
      }
    },

    //新增节点
    handleAdd(node, data) {
      var _self = this;
      // 判断层级
      if (node.level >= _self.MAX_LEVEL) {
        _self.$message.warning(
          "当前已达到" + _self.MAX_LEVEL + "级，无法新增！"
        );
        return false;
      }

      // 判断字段是否存在
      if (!data.children) {
        _self.$set(data, "children", []);
      }

      // 校验当前文件名在父文件夹中是否重复，并进行修改
      var _childData =
        node.childNodes.length > 0
          ? node.childNodes
          : _self.fileData.filter(
            d => d.Level == (data.isDirectory ? node.level - 1 : node.level)
          );
      _self.checkLoadlRepeat(_childData);

      // 参数修改
      let obj = Object.assign({}, this.treeModel); // copy参数
      obj.id = --_self.startId; // 当前节点id：逐次递减id
      obj.fileName = _self.folderName; //当前节点名称
      obj.parentId = data.parentId; // 父级节点id
      obj.parentName = data.fileName; //父级节点名称
      obj.level = node.level + 1; //当前节点显示等级

      // 新增数据
      data.children.push(obj);
      // 展开节点
      data.isDirectory ? node.parent.expand() : node.expand();
    },

    //校验数据中loadl文件名重复
    checkLoadlRepeat(data, fileName) {
      var _self = this;

      var isFile = !this.$isNull(fileName);
      var _folderName = isFile
        ? fileName
        : "新建文件夹(" + _self.subscript + ")";

      var _dobData = data.filter(
        d => d.label == _folderName || d.fileName == _folderName
      );

      _self.subscript++;

      // 如果为文件时直接返回是否有重复文件
      if (isFile) return _dobData.length < 1;

      if (_dobData.length < 1) return (_self.folderName = _folderName);

      _self.checkLoadlRepeat(data);
    },

    //删除文件节点
    handleDelete(node, data) {
      var _self = this;
      if (data.children && data.children.length !== 0) {
        this.$message.error("此文件夹内含有其他文件夹，不可删除！");
        return;
      }

      // 删除操作
      let DeletOprate = () => {
        let _list = node.parent.data.children || node.parent.data; //节点同级数据
        let _index = _list.map(c => c.id).indexOf(data.id);
        _list.splice(_index, 1);
        node.parent.expand();
        _self.$message.success("删除成功！");
      };

      //二次确认
      let ConfirmFun = () => {
        this.$confirm(`是否删除${node.label}？`, "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            DeletOprate();
          })
          .catch(() => { });
      };

      // 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
      parseFloat(data.id) < this.NODE_ID_START ? DeletOprate() : ConfirmFun();
    },

    //鼠标右击事件出现菜单栏
    rightClick(event, object, value, element) {
      var _self = this;
      _self.oldFileName = object.fileName;

      if (_self.objectID !== value.id) {
        _self.objectID = value.id;
        _self.menuVisible = true;
        _self.DATA = object;
        _self.NODE = value;
      } else {
        _self.menuVisible = !_self.menuVisible;
      }

      document.addEventListener("click", e => {
        _self.menuVisible = false;
      });

      _self.hiddenMenu();

      let menu = document.querySelector(".rightClickMenu");
      menu.style.zIndex = 9;
      menu.style.height = 40 * 3 + "px";

      /* 菜单定位基于鼠标点击位置 */
      let height =
        document.documentElement.clientHeight || document.body.clientHeight;

      if (event.clientY + 168 > height) {
        menu.style.left = event.clientX - 5 + "px";
        menu.style.top = event.clientY - 10 - 168 + "px";
      } else {
        menu.style.left = event.clientX + 10 + "px";
        menu.style.top = event.clientY + 5 + "px";
      }
      // 为新建的DIV创建绝对定位
      menu.style.position = "fixed";
    },

    //鼠标右键选择菜单事件
    handleRightSelect(key) {
      var _self = this;
      var _key = parseInt(key);
      _self.menuVisible = false;
      switch (_key) {
        case 3:
          _self.handleEdit(_self.NODE, _self.DATA);
          break;
        case 1:
          _self.handleAdd(_self.NODE, _self.DATA);
          break;
        case 4:
          _self.handleDelete(_self.NODE, _self.DATA);
          break;
      }
    },

    //隐藏菜单
    hiddenMenu() {
      document.addEventListener("click", this.hide, true);
      document.removeEventListener("click", this.hide);
    },

    //隐藏菜单
    hide() {
      this.menuVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";

.file-search {
  display: flex;
  align-items: center;
  padding: 12px 10px;
  background: #daecfe;

  .el-dropdown {
    .el-button--small {
      margin-left: 10px;
      padding: 6px;
      font-size: 14px;
      border-radius: 30%;
    }
  }
}

.scrollbar-list {
  height: calc(100% - 60px);
  padding: 5px;
  background-color: #f5f5f5;

  .tree-lable,
  .custom-tree-node {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
  }

  @{deep}.el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    color: #fff !important;
    background-color: #398dee !important;
  }
}
.el-menu-item {
  padding-left: 10px !important;
  height: 30px !important;
  line-height: 30px !important;
  font-size: 14px !important;
  color: #999 !important;
}
</style>
