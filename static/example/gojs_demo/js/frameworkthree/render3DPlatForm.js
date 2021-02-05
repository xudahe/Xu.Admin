/*
 ** 三维平台渲染处理
 ** Created by ysq
 */
define([
    'backbone',
    'frameworkthree/application/sceneManager',
    'frameworkthree/application/materialManager',
    'frameworkthree/loader/GLTFLoader',
    'frameworkthree/loader/OBJLoader'
], function (Backbone, sceneManager, materialManager) {
    return Backbone.View.extend({
        scene: null,
        camera: null,
        renderer: null,
        labelRenderer: null,
        container: null,
        controls: null,
        msgBox: null,
        tipContainer: null,
        material: null,
        selectedBox: null,
        transformControls:null,
        render: function (config) {
            //界面渲染
            if (config && config._this) {
                this.checkScene(config);
            }
            return this;
        },

        checkScene: function (config) {
            this.container = this.renderHTMLTarget(config, "container")
            this.msgBox = this.renderHTMLTarget(config, "loadingInfo")
            this.tipContainer = this.renderHTMLTarget(config, "threeTips")

            if(config.msgBoxNeedTop) $(this.msgBox).addClass("more-top")
            

            if (!Detector.webgl) {
                Detector.addGetWebGLMessage();
                this.container.innerHTML = '';
                this.msgBox && (this.msgBox.innerHTML = '当前浏览器不支持WebGL')
            } else {
                this.renderScene(config);
            }
        },

        renderScene: function (config) {
            var scene = new sceneManager();
            scene.render(_.extend(config, {
                _self: this
            }));
            this.material = new materialManager();
            this.material.stopListening();
            this.material.listenTo(this.material, 'success', function () {
                this.trigger("success");
            }.bind(this))

            this.material.render(_.extend(config, {
                msgBox: this.msgBox,
                renderer: this.renderer,
                camera: this.camera,
                scene: this.scene
            }))
        },

        renderHTMLTarget: function (scene, el) {
            return scene._this.$el.find("." + el).length ? scene._this.$el.find("." + el)[0] : scene._this.$el.find("#" + el).length ? scene._this.$el.find("#" + el)[0] : null
        },

        onResize: function () {
            if (this.camera) {
                this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
                this.camera.updateProjectionMatrix();
            }
            this.renderer && this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
            this.labelRenderer && this.labelRenderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        },

        // 模型加载
        modelLoader: function (url, type, name, parent, selected, selectedPosition, linesArr,tipHtml, position, positionLine, divStyle, camera, renderData) {
            if (type == "gltf" || (url && url.indexOf(".gltf") == (url.length - 5))) {
                var loader = new THREE.GLTFLoader();
            } else if (type == "obj" || (url && url.indexOf(".obj") == (url.length - 4) )) {
                var loader = new THREE.OBJLoader();
            }
            if (loader) {
                var p;
                loader.load(url ? url : './threedimensional/assets/models/' + name + '.' + type, function (object) {
                    if (type == "gltf" || (url && url.indexOf(".gltf") == (url.length - 5))) {
                        object.scene.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                var ot = child.name.split('_');
                                if (ot[0] === 'PQ' || child.name === 'VisualBasic') { //用于定位的
                                    p = this.GetChildPos(child);
                                } else {
                                    var material = this.material.materialRender(ot[0], child, parent);
                                    material && !this.selectedLoader(material, selected, selectedPosition) && parent.add(child.clone());
                                }
                                child.geometry && child.geometry.dispose();
                                child.material && child.material.dispose();
                            }
                        }.bind(this));
                    } else if (type == "obj" || (url && url.indexOf(".obj") == (url.length - 4) )) {
                        object.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                var ot = child.name.split('_');
                                if (ot[0] === 'PQ' || child.name === 'VisualBasic') { //用于定位的
                                    p = this.GetChildPos(child);
                                } else {
                                    var material = this.material.materialRender(ot[0], child, parent);
                                    material && !this.selectedLoader(material, selected, selectedPosition) && parent.add(child.clone());
                                }
                                child.geometry && child.geometry.dispose();
                                child.material && child.material.dispose();
                            }
                        }.bind(this));
                    }

                    if (parent) {
                        if (camera && camera.init && camera.target) {
                            this.camera.position.set(camera.init.x, camera.init.y, camera.init.z);
                            this.controls.target.set(camera.target.x, camera.target.y, camera.target.z);
                            this.camera.lookAt(camera.target.x, camera.target.y, camera.target.z);
                        }
                        if (p) {
                            parent.children.forEach(function (child) {
                                child.position.set(-p.x, -p.y, -p.z);
                            }.bind(this));
                            selected && selected.children && selected.children.forEach(function (child) {
                                child.position.set(-p.x, -p.y, -p.z);
                            }.bind(this));
                            // this.platform.transformControls.position.set(-p.x, -p.y, -p.z);
                        }
                        $(this.tipContainer).find('.tipPump').remove();
                        tipHtml && tipHtml.forEach(function (text, index) {
                            html = `<div class="tipPump" style="width:${divStyle[index].width};height:${divStyle[index].height};padding:${divStyle[index].padding};">${text}</div>`;
                            var tip = new THREE.Object3D;
                            var point = new THREE.CSS2DObject($(html).get(0));
                            point.position.set(positionLine[index].x, positionLine[index].y, positionLine[index].z);
                            tip.add(point);
                            this.AddLb(position[index], positionLine[index], tip,linesArr)
                            tip.name = "tip_" + index;
                            if(p) tip.position.set(-p.x, -p.y, -p.z);
                            parent.add(tip);
                        }.bind(this))
                        this.scene.add(parent);
                        this.scene.add(selected);
                    }
                    this.msgBox.style.display = 'none';
                    setTimeout(function(){
                        this.trigger("finish");
                        renderData && renderData();
                    }.bind(this), 500)
                }.bind(this), this.Progress.bind(this));
            }
        },

        selectedLoader: function(child, selected, selectedPosition){
            if(child.name && child.name.indexOf('_Selected') > -1 && child.name.indexOf('_Selected') === (child.name.length - 9) && child.name.split('_')){
                var select = new THREE.Object3D;
                select.name = child.name.split('_')[child.name.split('_').length - 2];
                var add = false;
                selected.traverse(function(model){
                    if (model.name === select.name) {
                        model.add(child.clone());
                        add = true;
                    }
                })
                if(!add) selected.add(select.add(child.clone()));
                return true;
            }
            if(child.name && child.name.indexOf("VisualBasic") === 0) {
                selectedPosition.add(child.clone());
            }
            return false;
        },

        Progress: function( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                this.msgBox.innerHTML = '模型加载 ' +parseInt(percentComplete) + '%';
            }
        },

        //取得模型内部元素的位置
        GetChildPos: function (child) {
            var cg = child.geometry;
            cg.computeBoundingBox();
            var centroid = new THREE.Vector3();
            centroid.addVectors(cg.boundingBox.min, cg.boundingBox.max);
            centroid.multiplyScalar(0.5);
            return (centroid);
        },

        // 根据子物体创造标签连线
        AddLb: function (lf, lt, parent,linesArr) {
            if (!lf.point) {
                var material = new THREE.LineBasicMaterial({
                    color: 0x67a1ce
                });

                var geometry = new THREE.Geometry();
                geometry.vertices.push(
                    new THREE.Vector3(lf.x, lf.y, lf.z),
                    new THREE.Vector3(lt.x, lt.y, lt.z)
                );
                var line = new THREE.Line(geometry, material);
                parent.add(line);
                linesArr.push(line);
            }
        },

        throttle: function(f) {
            clearTimeout(f.oid);
            f.oid = setTimeout(()=>{
                f.call(this);
            },100)
        },
    })
});