/*
 ** 场景管理
 ** Created by ysq
 */
define([
    'backbone',
    'frameworkthree/webgl/Detector',
    'frameworkthree/webgl/OrbitControls',
    'frameworkthree/webgl/TransformControls',
    'frameworkthree/webgl/CSS2DRenderer',
], function (Backbone) {
    return Backbone.View.extend({
        render: function (config) {
            //界面渲染
            if (config && config._self) {
                this.renderScene(config);
            }
            return this;
        },

        renderScene: function (config) {
            config._self.scene = new THREE.Scene(); // define scene : save and track rendered obj and used light source; if there is no THREE.Scene,Three.js can't render any obj;
            config._self.camera = new THREE.PerspectiveCamera(
                config.camera && config.camera.angle ? config.camera.angle : 50,
                config._self.container.offsetWidth / config._self.container.offsetHeight,
                config.camera && config.camera.near ? config.camera.near : 1,
                config.camera && config.camera.far ? config.camera.far : 3000000);
            config._self.renderer = new THREE.WebGLRenderer((config.webgl ? config.webgl : {
                antialias: true,
                alpha: true,
                logarithmicDepthBuffer: true,
                gammaFactor: 2.2,
            })); // define renderer: based on camera to calculate how to render a obj in the chrome
            if (config.render && config.render.color) {
                config._self.renderer.setClearColor(new THREE.Color(config.render.color), isNaN(config.render.opacity) ? 1 : config.render.opacity); // scene background 
            } else {
                config._self.renderer.setClearColor(new THREE.Color(0x1c2a52), 1); // scene background 
            }
            config._self.renderer.setPixelRatio(window.devicePixelRatio);
            config._self.renderer.setSize(config._self.container.offsetWidth, config._self.container.offsetHeight); // scene size 
            config._self.scene.add(new THREE.AmbientLight(0xffffff, 0.6));

            if (config.light == "highLight") {
                config._self.scene.add(new THREE.AmbientLight(0xffffff, 0.2));
                var light_B = new THREE.DirectionalLight(0xffffff, 0.25);
                light_B.position.x = -448.0043900004614;
                light_B.position.y = 59.11612712393428;
                light_B.position.z = 27.734613327481476;
                config._self.scene.add(light_B);
            } else {
                var light_A = new THREE.DirectionalLight(0xffffff, 0.6);
                light_A.position.x = -50000;
                light_A.position.y = 100000;
                light_A.position.z = -100000;
                light_A.castShadow = true;
                light_A.shadow.camera.near = -1000000;
                light_A.shadow.camera.far = 500000;
                light_A.shadow.camera.right = 600000;
                light_A.shadow.camera.left = -600000;
                light_A.shadow.camera.top = 300000;
                light_A.shadow.camera.bottom = -400000;
                light_A.shadow.bias = 0.1;
                light_A.shadow.mapSize.width = 1024;
                light_A.shadow.mapSize.height = 1024;
                config._self.scene.add(light_A);

                var light_B = new THREE.DirectionalLight(0xffffff, 0.4);
                light_B.position.x = 9000;
                light_B.position.y = 10000;
                light_B.position.z = 2000;
                config._self.scene.add(light_B);
            }

            config._self.labelRenderer = new THREE.CSS2DRenderer();
            config._self.labelRenderer.setSize(config._self.container.offsetWidth, config._self.container.offsetHeight);
            config._self.labelRenderer.domElement.style.position = 'absolute';
            config._self.labelRenderer.domElement.style.top = 0;
            config._self.tipContainer.appendChild(config._self.labelRenderer.domElement)

            if (config.background && typeof config.background === "string") {
                var texture = new THREE.TextureLoader().load(config.background);
                config._self.scene.background = texture;
            } else if (config.background && typeof config.background === "object") {
                var cubeLoader = new THREE.CubeTextureLoader().load(config.background, 0);
                config._self.scene.background = cubeLoader;
            }

            config._self.container.appendChild(config._self.renderer.domElement);
            config._self.controls = new THREE.OrbitControls(config._self.camera, config._self.labelRenderer.domElement);
            config._self.transformControls = new THREE.TransformControls(config._self.camera, config._self.renderer.domElement);
            config._self.transformControls.setSize(0.05);
            // config._self.transformControls.showY = false;
            config._self.scene.add(config._self.transformControls);
            config._self.controls.maxDistance = config.controls && config.controls.maxDistance ? config.controls.maxDistance : 40000;
            config._self.controls.maxPolarAngle = Math.PI * 0.48;
            config._self.controls.target.set(0, 0, 0);

            config._self.selectedBox = new THREE.BoxHelper();
            config._self.selectedBox.material.depthTest = false;
            config._self.selectedBox.material.transparent = true;
            config._self.selectedBox.material.color.set("#00FFFF");
            config._self.selectedBox.visible = false;
            config._self.scene.add(config._self.selectedBox);
        }

    })
});