<template>
  <!-- 主体瀑布流区域，无限滚动 -->
  <div
    id="waterfall"
    class="v-waterfall-content"
    ref="abc"
    v-infinite-scroll="getMoreData"
    infinite-scroll-disabled="disabled"
    infinite-scroll-distance="10"
    style="overflow:auto"
  >
    <back-top :options="{ target: '#waterfall', isMove: true }" />
    <div
      v-for="img in waterfallList"
      :key="img.key"
      class="v-waterfall-item img-scale"
      :style="{
        top: img.top + 'px',
        left: img.left + 'px',
        width: imageWidth + 'px',
        height: img.height + 'px'
      }"
    >
      <!-- 图片卡片 -->
      <el-card
        shadow="hover"
        :body-style="{ padding: '0px', 'border-radius': '10px' }"
        @click.native="openDialog(img.id)"
      >
        <!-- 图片懒加载 -->
        <el-image :src="img.src" class="image" :key="img.src" lazy>
          <!-- 加载前占位 -->
          <div slot="placeholder" class="image-slot">
            <div
              :style="{
                height: img.height + 'px',
                width: imageWidth + 'px',
                backgroundColor: img.colour
              }"
            ></div>
          </div>
          <!-- 加载失败占位 -->
          <div slot="error" class="image-slot">
            <div
              :style="{
                height: img.height + 'px',
                width: imageWidth + 'px',
                backgroundColor: img.colour
              }"
            ></div>
          </div>
        </el-image>
      </el-card>
    </div>
  </div>
</template>

<script>
/**
 *瀑布流区域，无限滚动
 */

export default {
  name: "v-waterfall",
  data() {
    return {
      //存放计算好的数据
      waterfallList: [],
      //每一列的宽度
      imageWidth: 200,
      //多少列
      waterfallImgCol: 5,
      //右边距
      waterfallImgRight: 20,
      //下边距
      waterfallImgBottom: 10,
      //存放瀑布流各个列的高度
      waterfallColHeight: [],
      imgList: [],
      //整体左偏移量，左右相同
      colLeft: 0,
      //是否还有数据
      noMore: false,

      //点击的图片ID
      picId: "",
      //随机占位色卡的颜色
      suijicolour: [
        "#b4ffe3",
        "#66CDAA",
        "#acc2e6",
        "#d7b0d8",
        "#95abe6",
        "#ffc47b",
        "#b6d288",
        "#f49586",
        "#bcaf7a"
      ]
    };
  },
  mounted() {
    this.initial();
    window.addEventListener("resize", this.initial, false);
  },
  methods: {
    initial() {
      this.waterfallList = [];

      //计算可视区域能够容纳的最大列数,向下取整
      let fullWidth = this.$refs.abc.clientWidth;
      if (fullWidth > 1500) {
        this.imageWidth = 240;
      } else if (fullWidth < 800) {
        this.imageWidth = 150;
      }
      let maxColNum = Math.floor(
        fullWidth / (this.imageWidth + this.waterfallImgRight)
      );
      // console.log("可视宽度：" + fullWidth + ",列数：" + maxColNum);
      if (maxColNum == 0) {
        maxColNum = 1;
      }
      let contentWhith = (this.imageWidth + this.waterfallImgRight) * maxColNum;
      if (fullWidth - contentWhith < this.imageWidth * 0.8) {
        maxColNum--;
        contentWhith = (this.imageWidth + this.waterfallImgRight) * maxColNum;
      }
      console.log("计算列数：" + maxColNum);
      this.waterfallImgCol = maxColNum;
      //获取左边距
      this.colLeft = (fullWidth - contentWhith) / 2;
      console.log(
        "总宽度：" +
          fullWidth +
          ",内容宽度：" +
          contentWhith +
          "左偏移：" +
          this.colLeft
      );
      //初始化偏移高度数组
      this.waterfallColHeight = new Array(this.waterfallImgCol);
      for (let i = 0; i < this.waterfallColHeight.length; i++) {
        this.waterfallColHeight[i] = 0;
      }

      //加载数据
      this.getMoreData();
    },
    // 获取数据
    getMoreData() {
      let moreList = [
        { id: 1, width: 45, height: 50, imgUrl: "" },
        { id: 2, width: 45, height: 40, imgUrl: "" },
        { id: 3, width: 45, height: 55, imgUrl: "" },
        { id: 4, width: 45, height: 30, imgUrl: "" },
        { id: 5, width: 45, height: 20, imgUrl: "" },
        { id: 6, width: 45, height: 20, imgUrl: "" },
        { id: 7, width: 45, height: 25, imgUrl: "" },
        { id: 8, width: 45, height: 35, imgUrl: "" },
        { id: 9, width: 45, height: 45, imgUrl: "" }
      ];

      if (moreList.length == 0) {
        this.noMore = true;
      } else {
        this.imgPreloading(moreList);
        this.noMore = false;
      }
    },
    //图片预加载
    imgPreloading(moreList) {
      for (let i = 0; i < moreList.length; i++) {
        let aImg = new Image();
        //图片渲染列表，先把高宽和占位颜色赋值直接push到waterfallList，图片的实际url等图片加载上了在赋值
        let imgData = {};
        imgData.height =
          (this.imageWidth / moreList[i].width) * moreList[i].height;
        // console.log("第" + i + "张图片的高度是：" + imgData.height);
        imgData.id = moreList[i].id;
        //获取随机占位背景色
        imgData.colour = this.suijicolour[i % 9];
        this.waterfallList.push(imgData);

        aImg.onload = e => {
          aImg.src = moreList[i].imgUrl;
        };
        this.rankImg(imgData);
        imgData.src = moreList[i].imgUrl;
      }
    },
    //瀑布流布局核心，计算高度和左偏移
    rankImg(imgData) {
      let {
        imageWidth,
        waterfallImgRight,
        waterfallImgBottom,
        waterfallColHeight,
        waterfallImgCol,
        colLeft
      } = this;

      //找出当前最短列的索引
      let minIndex = waterfallColHeight.indexOf(
        Math.min.apply(null, waterfallColHeight)
      );

      //获取最短列底部高度，既下一张图片的顶部高度
      imgData.top = waterfallColHeight[minIndex];
      //计算左侧偏移，最短列索引*（右边距+列宽度）
      imgData.left = minIndex * (waterfallImgRight + imageWidth) + colLeft;
      //改变当前列高度
      waterfallColHeight[minIndex] += imgData.height + waterfallImgBottom;
    },
    //打开图片详情
    openDialog(picId) {
      this.picId = picId;
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.initial);
  },
  computed: {
    //如果该属性的值为true，则将禁用无限滚动。
    disabled() {
      return this.noMore;
    }
  }
};
</script>

<style lang="less">
.v-waterfall-content {
  position: relative;
  height: 100%;
  width: 100%;

  .v-waterfall-item {
    position: absolute;
    float: left;
  }

  .el-card,
  .el-card__body {
    height: 100%;
  }

  .image {
    height: 100%;
    display: flex !important;
  }

  /*效果二：放大 修改scale(放大的值)*/
  .img-scale {
    transition: All 0.4s ease-in-out;
    -webkit-transition: All 0.4s ease-in-out;
    -moz-transition: All 0.4s ease-in-out;
    -o-transition: All 0.4s ease-in-out;
  }
  .img-scale:hover {
    z-index: 9;
    transform: scale(1.2);
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -o-transform: scale(1.2);
    -ms-transform: scale(1.2);
  }
}
</style>
