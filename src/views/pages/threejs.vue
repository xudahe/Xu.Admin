<style scoped>
.tag {
  position: absolute;
  background-color: MidnightBlue;
  background-color: rgba(0, 10, 40);
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  opacity: 0.5;
  font-size: 4px;
  color: aqua;
  padding: 1px 1px 1px;
}
</style>

<template>
  <div id="container" style="width: 100%;height: 100%;">
    <div class="tag" id="tag">
      <span style="color:white;font-size: 10px;padding: 5px">楼宇名称：</span>
      <span style="font-size: 11px;font-weight: bold">XXX大厦</span>
      <p style="padding: 5px;margin-top: -3px;">占地面积：25541平方米</p>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js"; //性能检测插件
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

/**
 *
 * https://blog.csdn.net/qq_36266612/article/details/89851618
 * https://blog.csdn.net/mmiaochong/article/details/111045265
 * https://blog.csdn.net/qq_37540004/article/details/102862348
 */

var camera = null;
//三维坐标转换为屏幕坐标
function transPosition(position) {
  let container = document.getElementById("container");

  let world_vector = new THREE.Vector3(position.x, position.y, position.z);
  let vector = world_vector.project(camera);
  let halfWidth = container.clientHeight / 2,
    halfHeight = container.clientWidth / 2;
  return {
    x: Math.round(vector.x * halfWidth + halfWidth),
    y: Math.round(-vector.y * halfHeight + halfHeight)
  };
}
export default {
  name: "threejs",
  data() {
    return {
      scene: null,
      renderer: null,
      controls: null,
      clock: new THREE.Clock(),
      mixer: null,
  
      width: null,
      height: null,
      timer: null
    };
  },
  mounted() {
    let container = document.getElementById("container");

    this.height = container.clientHeight;
    this.width = container.clientWidth;

    this.init();
    this.animate();
  },
  methods: {
    /* 场景 */
    initScene() {
      this.scene = new THREE.Scene();
    },
    /* 相机 */
    initCamera() {
      camera = new THREE.PerspectiveCamera(
        45,
        this.width / this.height,
        0.1,
        1000
      );
      camera.position.set(30, 30, 30);
      camera.lookAt(new THREE.Vector3(-30, 20, 30)); //相机看向哪个坐标
    },
    /* 地面 */
    initMesh() {
      let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 20),
        new THREE.MeshLambertMaterial({ color: 0xffffff }) //转换对光源有渲染的材质
      );
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.x = 15;
      plane.position.y = 0;
      plane.position.x = 0;
      this.scene.add(plane);
      plane.receiveShadow = true;
    },

    initAxes() {
      // 辅助工具：一个轴对象，以一种简单的方式可视化三个轴。
      // X轴为红色。 Y轴为绿色。 Z轴为蓝色。
      var helper = new THREE.AxesHelper(1000);
      this.scene.add(helper);
    },

    //添加材质灯光阴影
    initSpot() {
      var spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-10, 20, 10);
      spotLight.castShadow = true;
      this.scene.add(spotLight);
    },

    /* 渲染器 */
    initRender() {
      const container = document.getElementById("container");

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true // 设置透明
      });

      this.renderer.setPixelRatio(window.devicePixelRatio); // 兼容高清屏幕
      this.renderer.domElement.style.outline = "none"; // 消除canvas的外边框
      this.renderer.setClearColor(0xeeeeee); // 设置颜色
      this.renderer.setSize(container.clientWidth, container.clientHeight); // 设置渲染尺寸
      this.renderer.shadowMapEnabled = true; //激活阴影

      container.appendChild(this.renderer.domElement);
      // document.body.appendChild(this.renderer.domElement);
    },

    /* 点光源 */
    pointLight() {
      var point = new THREE.PointLight(0xffffff, 0.4);
      point.position.set(400, 200, 300); //点光源位置
      this.scene.add(point); //点光源添加到场景中
    },
    /* 环境光 */
    ambientLight() {
      var ambient = new THREE.AmbientLight(0x999999, 0.4);
      this.scene.add(ambient);
    },

    /* 控制器 */
    initControls() {
      this.controls = new OrbitControls(camera, this.renderer.domElement);

      /* 属性参数默认 */
      // this.controls.enableDamping = true; // 惯性
      // this.controls.dampingFactor = 0.25; // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
      // this.controls.enableZoom = true; // 缩放
      // this.controls.enablePan = true; // 右键拖拽
      // this.controls.autoRotate = false; // 是否自动旋转
      // this.controls.minDistance = 1; // 设置相机距离原点的最近距离
      // this.controls.maxDistance = 1000; // 设置相机距离原点的最远距离
      // this.controls.enablePan = true; // 是否开启右键拖拽
      // // 水平旋转范围
      // this.controls.maxAzimuthAngle = Math.PI / 6;
      // this.controls.minAzimuthAngle = -Math.PI / 6;
      // // 垂直旋转范围
      // this.controls.maxPolarAngle = Math.PI / 6;
      // this.controls.minPolarAngle = -Math.PI / 6;
    },

    // 加载 gltf 格式的模型
    initContent() {
      let that = this;
      var p;

      let loader = new GLTFLoader(); /*实例化加载器*/
      loader.load(
        "../../static/threejs/floor.gltf",
        function(gltf) {
          var mesh = gltf.scene;

          console.log(gltf, "gltf");
          that.scene.add(mesh);

          // let group = new THREE.Group();
          // group.add(mesh);

          // let box = new THREE.Box3();
          // box.setFromObject(group);

          // let wrapper = new THREE.Object3D();
          // wrapper.add(group);
          // wrapper.position.set(100, -300, 120); // 根据自己模型的大小设置位置

          // that.scene.add(wrapper); // 将模型加入到场景中 ! important

          // 调用动画
          // that.mixer = new THREE.AnimationMixer(mesh);
          // that.mixer.clipAction(gltf.animations[0]).play();
          // that.render();
        },
        function(xhr) {
          // 模型加载期间的回调函数
          console.log(
            "模型加载 " + parseInt((xhr.loaded / xhr.total) * 100) + "%"
          );
        },
        function(error) {
          console.log("load error!", error);
        }
      );
    },

    // 加载 obj 格式的模型
    initContent1() {
      let that = this;

      function onProgress(xhr) {
        if (xhr && xhr.lengthComputable) {
          console.log(
            (xhr.loaded / xhr.total) * 100 + "% building model loaded"
          );
        }
      }
      function onError(xhr) {
        console.log("load error!", xhr);
      }

      let objLoader = new OBJLoader();
      let mtlLoader = new MTLLoader();
      mtlLoader.setPath("../../static/threejs/受电柜/");
      mtlLoader.load("受电柜.mtl", function(mtl) {
        console.log(mtl, "mtl");
        mtl.preload(); // 预加载
        objLoader.setMaterials(mtl); // 设置当前加载的纹理
        objLoader.setPath("../../static/threejs/受电柜/");
        objLoader.load(
          "受电柜.obj",
          function(obj) {
            console.log(obj, "obj");
            obj.position.y = 0;
            obj.rotation.y = 0.5;
            obj.scale.set(0.05, 0.05, 0.05);
            that.scene.add(obj);
          },
          onProgress(),
          onError()
        );
      });
    },

    /* 监听窗口自适应 */
    onWindowResize() {
      camera.aspect = this.width / this.height;
      camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    },

    /* 初始化 */
    init() {
      this.initScene();
      this.initCamera();
      this.initRender();
      this.initMesh();
      this.initAxes();
      this.initSpot();
      // this.pointLight();
      // this.ambientLight();
      this.initControls();
      this.initContent();

      /* 监听事件 */
      window.addEventListener("resize", this.onWindowResize, false);
    },

    /* 循环渲染 */
    animate() {
      let _self = this;

      this.timer = requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, camera);

      // 重复播放动画
      var delta = this.clock.getDelta();
      if (this.mixer) {
        this.mixer.update(delta);
      }

      divRender();
      function divRender() {
        //计算三维坐标对应的屏幕坐标
        var position = new THREE.Vector3(0, 5, 0);
        var windowPosition = transPosition(position);
        var left = windowPosition.x;
        var top = windowPosition.y;

        //设置div屏幕位置
        let div = document.getElementById("tag");
        div.style.display = "";
        div.style.left = left + "px";
        div.style.top = top + "px";
      }
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.timer);
    window.removeEventListener("resize", this.onWindowResize);
  }
};
</script>

<style scoped></style>
