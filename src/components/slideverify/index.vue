<template>
    <div class="slide-verify" :style="{width: w + 'px'}" id="slideVerify" onselectstart="return false;">
        <!-- 图片加载遮蔽罩 -->
        <div :class="{'slider-verify-loading': loadBlock}"></div>
        <canvas :width="w" :height="h" ref="canvas" ></canvas>
        <div v-if="show" title="刷新验证码" @click="refresh" class="slide-verify-refresh-icon"></div>
        <canvas :width="w" :height="h" ref="block"  class="slide-verify-block"></canvas>
        <!-- container -->
        <div class="slide-verify-slider" :class="{'container-active': containerActive, 'container-success': containerSuccess, 'container-fail': containerFail}">
            <div class="slide-verify-slider-mask" :style="{width: sliderMaskWidth}">
                <!-- slider -->
                <div @mousedown="sliderDown"
                    @touchstart="touchStartEvent"
                    @touchmove="touchMoveEvent"
                    @touchend="touchEndEvent"
                    class="slide-verify-slider-mask-item"
                    :style="{left: sliderLeft}">
                    <div class="slide-verify-slider-mask-item-icon"></div>
                </div>
                <!-- {{sliderText}} -->
            </div>
            <span class="slide-verify-slider-text">{{sliderText}}</span>
        </div>
    </div>
</template>

//https://gitee.com/monoplasty/vue-monoplasty-slide-verify

<script>
    // touchstart : 手指触摸屏幕时触发
    // touchmove : 手指在屏幕中拖动时触发
    // touchend : 手指离开屏幕时触发

    const PI = Math.PI;

    function sum(x, y) {
        return x + y
    }

    function square(x) {
        return x * x
    }
    
    export default {
        name: 'SlideVerify',
        props: {
            // 滑块边长
            l: {
                type: Number,
                default: 42,
            },
            // 滑块突出圆的半径
            r: {
                type: Number,
                default: 10,
            },
            // canvas width
            w: {
                type: Number,
                default: 310,
            },
            // canvas height
            h: {
                type: Number,
                default: 155,
            },
            sliderText: {
                type: String,
                default: '向右滑动填充拼图',
            },
            // 滑动验证的误差范围，若accuracy为 -1，则表示关闭检测非人为操作，默认开启。开启之后，若检测到为非人为操作，则会触发 again 回调函数
            accuracy: {
              type: Number,
              default: 5, 
            },
            show: {
              type: Boolean,
              default: true,
            },
            imgs: {
              type: Array,
              default: () => [],
            },
        },
        data() {
            return {
                containerActive: false, // container active class
                containerSuccess: false, // container success class
                containerFail: false, // container fail class
                canvasCtx: null,
                blockCtx: null,
                block: null,
                block_x: undefined, // container random position
                block_y: undefined,
                L: this.l + this.r * 2 + 3, // 滑块实际边长
                img: undefined,
                originX: undefined,
                originY: undefined,
                isMouseDown: false, //鼠标是否按下 
                trail: [],
                sliderLeft: 0, // 滑块偏移量（距离左边）
                sliderMaskWidth: 0, // mask width,
                success: false,
                loadBlock: true, // Features 图片加载提示，防止图片没加载完就开始验证
                timestamp: null, //滑动耗时(毫秒)
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.initDom()
                this.initImg()
                this.bindEvents()
            },
            initDom() {
                this.block = this.$refs.block;
                this.canvasCtx = this.$refs.canvas.getContext('2d')
                this.blockCtx = this.$refs.block.getContext('2d')
            },
            initImg() {
                const img = this.createImg(() => {
                    // 图片加载完关闭遮蔽罩
                    this.loadBlock = false;
                    this.drawBlock()
                    this.canvasCtx.drawImage(img, 0, 0, this.w, this.h) //向画布上绘制背景图片
                    this.blockCtx.drawImage(img, 0, 0, this.w, this.h)  //向画布上绘制滑块
                    let {
                        block_x: x,
                        block_y: y,
                        r,
                        L
                    } = this
                    let _y = y - r * 2 - 1
                    let ImageData = this.blockCtx.getImageData(x, _y, L, L);
                    this.block.width = L;
                    this.blockCtx.putImageData(ImageData, 0, _y)
                });
                this.img = img;
            },
            // 随机创建滑块的位置
            drawBlock() {
                this.block_x = this.getRandomNumberByRange(this.L + 10, this.w - (this.L + 10))
                this.block_y = this.getRandomNumberByRange(10 + this.r * 2, this.h - (this.L + 10))
                this.draw(this.canvasCtx, this.block_x, this.block_y, 'fill') //填充
                this.draw(this.blockCtx, this.block_x, this.block_y, 'clip')  //剪切
            },
            // 绘制拼图
            draw(ctx, x, y, operation) {
                //知识点：https://www.w3school.com.cn/tags/html_ref_canvas.asp

                let { l, r } = this;
                //绘制
                ctx.beginPath() //起始一条路径，或重置当前路径
                ctx.moveTo(x, y) //把路径移动到画布中的指定点，不创建线条

                //top
                ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI, false) //创建弧/曲线（用于创建圆形或部分圆）
                ctx.lineTo(x + l, y) //添加一个新点，然后在画布中创建从该点到最后指定点的线条
                //right
                ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI, false)
                ctx.lineTo(x + l, y + l)
                //bottom
                ctx.lineTo(x, y + l)
                //left
                ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
                ctx.lineTo(x, y)

                //修饰，没有会看不出效果
                ctx.lineWidth = 2
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
                ctx.stroke()
                ctx[operation]()
                ctx.globalCompositeOperation = "destination-over"
            },
            createImg(onload) {
                const img = document.createElement('img');
                img.crossOrigin = "Anonymous";
                img.onload = onload;
                img.onerror = () => {
                    img.src = this.getRandomImg()
                }
                
                img.src = this.getRandomImg()
                return img;
            },
            // 随机生成图片 src
            getRandomImg() {
                const len = this.imgs.length;
                return len > 0 ?
                  this.imgs[this.getRandomNumberByRange(0, len)] :
                  'https://picsum.photos/300/150/?image=' + this.getRandomNumberByRange(0, 1084);
            },
            getRandomNumberByRange(start, end) {
                return Math.round(Math.random() * (end - start) + start)
            },
            refresh() {
                this.reset()
                this.$emit('refresh') //点击刷新按钮后的回调函数
            },
            // 鼠标按下
            sliderDown(e) {
                if (this.success) return;
                this.originX = e.clientX;
                this.originY = e.clientY;
                this.isMouseDown = true;
                this.timestamp = + new Date();
            },
            touchStartEvent(e) {
                if (this.success) return;
                this.originX = e.changedTouches[0].pageX;
                this.originY = e.changedTouches[0].pageY;
                this.isMouseDown = true;
                this.timestamp = + new Date();
            },
            bindEvents() {
                document.addEventListener('mousemove', (e) => {
                    if (!this.isMouseDown) return false;
                    const moveX = e.clientX - this.originX;
                    const moveY = e.clientY - this.originY;
                    if (moveX < 0 || moveX + 38 >= this.w) return false;
                    this.sliderLeft = moveX + 'px';
                    let blockLeft = (this.w - 40 - 20) / (this.w - 40) * moveX;
                    this.block.style.left = blockLeft + 'px';

                    this.containerActive = true; // add active
                    this.sliderMaskWidth = moveX + 'px';
                    this.trail.push(moveY);
                });
                document.addEventListener('mouseup', (e) => {
                    if (!this.isMouseDown) return false
                    this.isMouseDown = false
                    if (e.clientX === this.originX) return false;
                    this.containerActive = false; // remove active
                    this.timestamp = + new Date() - this.timestamp;

                    const { spliced, TuringTest } = this.verify();
                    if (spliced) {
                        if(this.accuracy === -1) {
                            this.containerSuccess = true;
                            this.success = true;
                            this.$emit('success', this.timestamp);
                            return;
                        }
                        if (TuringTest) {
                            // succ
                            this.containerSuccess = true;
                            this.success = true;
                            this.$emit('success', this.timestamp) //验证码匹配成功的回调
                        } else {
                            this.containerFail = true;
                            this.$emit('again') //检测到非人为操作滑动时触发的回调函数
                        }
                    } else {
                        this.containerFail = true;
                        this.$emit('fail') //验证码未匹配的回调
                        setTimeout(() => {
                            this.reset()
                        }, 1000)
                    }
                })
            },
            touchMoveEvent(e) {
                if (!this.isMouseDown) return false;
                const moveX = e.changedTouches[0].pageX - this.originX;
                const moveY = e.changedTouches[0].pageY - this.originY;
                if (moveX < 0 || moveX + 38 >= this.w) return false;
                this.sliderLeft = moveX + 'px';
                let blockLeft = (this.w - 40 - 20) / (this.w - 40) * moveX;
                this.block.style.left = blockLeft + 'px';

                this.containerActive = true;
                this.sliderMaskWidth = moveX + 'px';
                this.trail.push(moveY);
            },
            touchEndEvent(e) {
                if (!this.isMouseDown) return false
                this.isMouseDown = false
                if (e.changedTouches[0].pageX === this.originX) return false;
                this.containerActive = false;
                this.timestamp = + new Date() - this.timestamp;

                const {
                    spliced,
                    TuringTest
                } = this.verify();
                if (spliced) {
                    if(this.accuracy === -1) {
                        this.containerSuccess = true;
                        this.success = true;
                        this.$emit('success', this.timestamp);
                        return;
                    }
                    if (TuringTest) {
                        // succ
                        this.containerSuccess = true;
                        this.success = true;
                        this.$emit('success', this.timestamp)
                    } else {
                        this.containerFail = true;
                        this.$emit('again')
                    }
                } else {
                    this.containerFail = true;
                    this.$emit('fail')
                    setTimeout(() => {
                        this.reset()
                    }, 1000)
                }
            },
            verify() {
                const arr = this.trail  // 拖动时y轴的移动距离
                const average = arr.reduce(sum) / arr.length // average
                const deviations = arr.map(x => x - average) // deviation array
                const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length) // standard deviation
                const left = parseInt(this.block.style.left)
                const accuracy = this.accuracy <= 1 ? 1 : this.accuracy > 10 ? 10 : this.accuracy;
                return {
                    spliced: Math.abs(left - this.block_x) <= accuracy,
                    TuringTest: average !== stddev, //简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
                }
            },
            reset() {
                this.success = false;
                this.containerActive = false;
                this.containerSuccess = false;
                this.containerFail = false;
                this.sliderLeft = 0;
                this.block.style.left = 0;
                this.sliderMaskWidth = 0;
                // canvas
                let {
                    w,
                    h
                } = this;
                this.canvasCtx.clearRect(0, 0, w, h)
                this.blockCtx.clearRect(0, 0, w, h)
                this.block.width = w

                // generate img
                this.img.src = this.getRandomImg();
                this.$emit('fulfilled') //刷新成功之后的回调函数
            },
        }
    }
</script>
<style scoped>
    .slide-verify {
        position: relative;
    }

    /* 图片加载样式 */
    .slider-verify-loading{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        z-index: 999;
        animation: loading 1.5s infinite;
    }

    @keyframes loading {
        0%{
            opacity: .7;
        }
        100% {
            opacity: 9;
        }
    }

    .slide-verify-block {
        position: absolute;
        left: 0;
        top: 0
    }

    .slide-verify-refresh-icon {
        position: absolute;
        right: 0;
        top: 0;
        width: 34px;
        height: 34px;
        cursor: pointer;
        background: url("../../assets/img/slide/icon_light.png") 0 -437px;
        background-size: 34px 471px
    }

    .slide-verify-slider {
        position: relative;
        text-align: center;
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-top: 15px;
        background: #f7f9fa;
        color: #45494c;
        border: 1px solid #e4e7eb
    }

    .slide-verify-slider-mask {
        position: absolute;
        left: 0;
        top: 0;
        height: 40px;
        border: 0 solid #1991FA;
        background: #D1E9FE
    }

    .slide-verify-slider-mask-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 40px;
        background: #fff;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: background .2s linear
    }

    .slide-verify-slider-mask-item:hover {
        background: #1991FA
    }

    .slide-verify-slider-mask-item:hover .slide-verify-slider-mask-item-icon {
        background-position: 0 -13px
    }

    .slide-verify-slider-mask-item-icon {
        position: absolute;
        top: 15px;
        left: 13px;
        width: 14px;
        height: 12px;
        background: url("../../assets/img/slide/icon_light.png") 0 -26px;
        background-size: 34px 471px
    }
    .container-active .slide-verify-slider-mask-item {
        height: 38px;
        top: -1px;
        border: 1px solid #1991FA;
    }

    .container-active .slide-verify-slider-mask {
        height: 38px;
        border-width: 1px;
    }

    .container-success .slide-verify-slider-mask-item {
        height: 38px;
        top: -1px;
        /* border: 1px solid #52CCBA; */
        background-color: #52CCBA !important;
    }

    .container-success .slide-verify-slider-mask {
        height: 38px;
        /* border: 1px solid #52CCBA; */
        background-color: #D2F4EF;
    }

    .container-success .slide-verify-slider-mask-item-icon {
        background-position: 0 0 !important;
    }

    .container-fail .slide-verify-slider-mask-item {
        height: 38px;
        top: -1px;
        border: 1px solid #f57a7a;
        background-color: #f57a7a !important;
    }

    .container-fail .slide-verify-slider-mask {
        height: 38px;
        border: 1px solid #f57a7a;
        background-color: #fce1e1;
    }

    .container-fail .slide-verify-slider-mask-item-icon {
        top: 14px;
        background-position: 0 -82px !important;
    }

    .container-active .slide-verify-slider-text,
    .container-success .slide-verify-slider-text,
    .container-fail .slide-verify-slider-text {
        display: none;
    }
</style>
