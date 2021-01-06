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

    <el-scrollbar
      class="scrollbar-list"
      wrap-class="scrollbar-wrapper"
      :noresize="false"
    >
      <el-tree
        ref="tree"
        :data="fileData"
        :props="defaultProps"
        :default-expand-all="true"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
        @node-contextmenu="rightClick"
        style="background-color: #f5f5f5;"
        highlight-current
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <!-- 编辑状态 -->
          <template v-if="node.isEdit">
            <el-input
              v-model="data.fileName"
              autofocus
              size="mini"
              :ref="'slotTreeInput' + node.id"
              @keyup.enter.native="handleInput(node, data)"
              @blur="handleInput(node, data)"
            >
            </el-input>
          </template>
          <!-- 非编辑状态 -->
          <template v-else>
            <span class="tree-lable" :title="node.label">
              <img
                src="../../../static/img/file/folder.png"
                style="width:0.15rem;margin-right: 0.05rem;"
              />
              {{ node.label }}
            </span>
          </template>
        </div>
      </el-tree>
    </el-scrollbar>
    <!-- 鼠标右键产生的选项 -->
    <div v-show="menuVisible" id="menu" class="rightMenu">
      <el-menu
        class="el-menu-vertical rightClickMenu"
        @select="handleRightSelect"
        text-color="#303133"
        active-text-color="#303133"
      >
        <el-menu-item index="1" class="menuItem">
          <i class="el-icon-edit" style="font-size: 15px;"></i>
          <span slot="title">重命名</span>
        </el-menu-item>
        <el-menu-item index="2" class="menuItem">
          <i class="el-icon-folder-add" style="font-size: 15px;"></i>
          <span slot="title">新建</span>
        </el-menu-item>
        <el-menu-item index="3" class="menuItem">
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

      isLoading: false, // 是否加载
      menuVisible: false, // 菜单展示弹窗
      objectID: null, // 当前树节点记录ID
      DATA: {}, // 当前右击节点对应数据
      NODE: {}, // 当前右击节点node
      MAX_LEVEL: 4, // 允许文件存在最大层数

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
                  id: "1.1.1",
                  fileName: "QFD"
                },
                {
                  id: "1.1.2",
                  fileName: "产品开发要求规格"
                },
                {
                  id: "1.1.3",
                  fileName: "测试清单"
                }
              ]
            },
            {
              id: "1.2",
              fileName: "1.2 项目计划",
              children: [
                {
                  id: "1.2.1",
                  fileName: "项目开发计划"
                },
                {
                  id: "1.2.2",
                  fileName: "问题解决计划"
                },
                {
                  id: "1.2.3",
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
                  id: "1.4.1",
                  fileName: "项目成本要求"
                },
                {
                  id: "1.4.2",
                  fileName: "项目预算"
                },
                {
                  id: "1.4.3",
                  fileName: "项目实际花费"
                },
                {
                  id: "1.4.4",
                  fileName: "BOM"
                }
              ]
            },
            {
              id: "1.5",
              fileName: "1.5 每阶段设计构想",
              children: [
                {
                  id: "1.5.1",
                  fileName: "设计构想书"
                },
                {
                  id: "1.5.2",
                  fileName: "DOE方案"
                }
              ]
            },
            {
              id: "1.6",
              fileName: "1.6 试验/试产总结",
              children: [
                {
                  id: "1.6.1",
                  fileName: "试验总结"
                },
                {
                  id: "1.6.2",
                  fileName: "试产总结"
                }
              ]
            },
            {
              id: "1.7",
              fileName: "1.7 问题清单及问题解决报告",
              children: [
                {
                  id: "1.7.1",
                  fileName: "问题清单"
                },
                {
                  id: "1.7.2",
                  fileName: "问题解决报告"
                }
              ]
            },
            {
              id: "1.8",
              fileName: "1.8 FMEA",
              children: [
                {
                  id: "1.8.1",
                  fileName: "DFMEA"
                },
                {
                  id: "1.8.2",
                  fileName: "PFMEA"
                }
              ]
            },
            {
              id: "1.9",
              fileName: "1.9 CC/SC; PFD; CP",
              children: [
                {
                  id: "1.9.1",
                  fileName: "CC/SC"
                },
                {
                  id: "1.9.2",
                  fileName: "PFD"
                },
                {
                  id: "1.9.3",
                  fileName: "CP"
                }
              ]
            },
            {
              id: "2.0",
              fileName: "2.0 生产工艺文件相关"
            },
            {
              id: "2.0",
              fileName: "2.0 生产工艺文件相关",
              children: [
                {
                  id: "2.0.1",
                  fileName: "生产规格书"
                },
                {
                  id: "2.0.2",
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
        children: [], // 当下子节点
        fileName: "", // 文件名称
        isDirectory: "", // 当前是都为文件夹
        entityPath: "", // 文件的实体路径
        leaf: false // 是否无子节点
      },
      oldFileName: "", // 旧的文件名称
      dialogFileUrl: "", // 模态窗文件显示路径
      folderName: "新建文件夹", // 记录新建文件夹名称
      subscript: 1 // 重复文件下标
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    //树状图懒加载
    loadNode: function(node, resolve) {
      var _self = this;
      var treeList = [];
      var _cloneTree = deepClone(_self.treeModel);
      if (node.level === 0) {
        var _dataList = _self.fileData.filter(d => d.Level == 0);
        _dataList.forEach(item => {
          _cloneTree.fileName = item.FileName;
          _cloneTree.isDirectory = item.IsDirectory;
          _cloneTree.entityPath = item.EntityPath;
          _cloneTree.leaf = false;
          treeList.push(deepClone(_cloneTree));
        });
      } else {
        var _dataList = _self.fileData.filter(
          d => d.ParentName === node.data.fileName
        );
        _dataList.forEach(item => {
          _cloneTree.fileName = item.FileName;
          _cloneTree.isDirectory = item.IsDirectory;
          _cloneTree.entityPath = item.EntityPath;
          _cloneTree.leaf =
            _self.fileData.filter(d => d.ParentName === item.FileName).length <
            1;
          treeList.push(deepClone(_cloneTree));
        });
      }

      return resolve(treeList);
    },

    //修改节点
    handleInput(node, data) {
      var _self = this;
      // 退出编辑状态
      if (node.isEdit) {
        _self.$set(node, "isEdit", false);
      }
      if (_self.oldFileName === data.fileName) {
      } else {
        ChkUtil.Ajax(
          "/FileStore/ChangeFileDirectoryName",
          "post",
          {
            entityPath: data.entityPath,
            oldFileName: _self.oldFileName,
            newFileName: data.fileName
          },
          function(cndata) {
            if (cndata.success) {
              data.entityPath = data.entityPath.replace(
                _self.oldFileName,
                data.fileName
              );
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

      var _parentPath = data.isDirectory
        ? node.parent.data.entityPath
        : data.entityPath;
      var _level = data.isDirectory ? node.level : ++node.level;

      // 新增文件夹需要的参数
      var _addFloderData = {
        file: "",
        data: {
          IsUploadFile: 1,
          ParentPath: _parentPath,
          FolderName: _self.folderName,
          Level: _level
        }
      };

      // 新增文件夹
      interPhyVm.uploadFile(_addFloderData);
      var _data = interPhyVm.FileDirList;

      if (!ChkUtil.isNull(_data)) {
        $.each(_data, function(idx, item) {
          _self.fileData.push(_data);
          var _cloneTree = deepClone(_self.treeModel);

          _cloneTree.fileName = item.FileName;
          _cloneTree.isDirectory = item.IsDirectory;
          _cloneTree.entityPath = item.EntityPath;
          _cloneTree.leaf = true;

          // 新增数据
          data.isDirectory
            ? _self.NODE.parent.data.children.push(deepClone(_cloneTree))
            : data.children.push(deepClone(_cloneTree));
        });

        // 展开节点
        data.isDirectory ? node.parent.expand() : node.expand();
      }
    },

    //校验数据中loadl文件名重复
    checkLoadlRepeat(data, fileName) {
      var _self = this;
      var isFile = !ChkUtil.isNull(fileName);

      var _folderName = isFile ? fileName : _self.folderName + _self.subscript;
      var _dobData = data.filter(
        d => d.label == _folderName || d.FileName == _folderName
      );

      // 如果为文件时直接返回是否有重复文件
      if (isFile) return _dobData.length < 1;

      if (_dobData.length < 1)
        return (_self.folderName = _self.folderName + _self.subscript);

      _self.subscript++;
      _self.checkLoadlRepeat(data);
    },

    //删除文件节点
    handleDelete(node, data) {
      _self = this;
      if (data.children && data.children.length !== 0) {
        this.$message.error("此文件夹内含有其他文件夹，不可删除！");
        return;
      }

      var paraData = {
        IsDeleteFile: data.isDirectory ? 0 : 1,
        ParentPath: node.parent.data.entityPath,
        FolderName: data.fileName
      };

      this.$confirm(`是否删除${node.label}？`, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          interPhyVm.handleRemove("", paraData);
          if (interPhyVm.DeleteSuc) {
            var _delData = _self.fileData.filter(
              d =>
                d.FileName == data.fileName && d.EntityPath == data.entityPath
            )[0];
            ChkUtil.removeFromArr(_self.fileData, _delData);
            ChkUtil.removeFromArr(node.parent.childNodes, node);

            node.parent.expand();
          }
        })
        .catch(() => {});
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
      menu.style.height = 30 * 3 + "px";

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
        case 1:
          _self.handleEdit(_self.NODE, _self.DATA);
          break;
        case 2:
          _self.handleAdd(_self.NODE, _self.DATA);
          break;
        case 3:
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
<style lang="scss" scoped>
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
}

.el-menu-item {
  padding-left: 10px !important;
  height: 30px !important;
  line-height: 30px !important;
  font-size: 14px !important;
  color: #999 !important;
}
</style>
