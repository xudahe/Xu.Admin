/*
 ** 三维模型渲染模板
 ** Created by ysq
 */
define([
    'widgets/BaseWidget',
    'text!./renderPump.html',
    'frameworkthree/render3DPlatForm',
    'frameworkthree/webgl/tween',
    'frameworkthree/webgl/EffectComposer'
], function (BaseWidget, template, render3DPlatForm) {
    var widgets = BaseWidget.extend({
        className: "tabWidget",
        events: {
            "click .rotate": "_switchRotate",
        },

        render: function (config) {
            this.$el.html(_.template(template));
            config.rotate && this.$el.find(".rotate").css(config.rotate)
            this.config = config;
            this.platform = new render3DPlatForm(); //三维平台初始化
            this.platform.render(config);
            if (this.platform.scene) {
                this.platform.stopListening();
                this.platform.listenTo(this.platform, 'success', function () {
                    config.then && config.then();
                    this._createPump(config);
                    this._renderScene();
                    this._afterLoading(config.afterLoading);
                }.bind(this))
            }
            this.config.fitResolution && this._resolutionCheck();


            //transformControls挂上监听器
            this.platform.transformControls.addEventListener('mouseDown', () => {
                this.platform.controls.enabled = false;
            });
            this.platform.transformControls.addEventListener('mouseUp', () => {
                this.platform.controls.enabled = true;
            });
        },

        _switchRotate: function () {
            if (this.rotate) {
                if (!this.$el.find(".rotate").hasClass("change")) this.$el.find(".rotate").addClass("change")
                this.rotate = 0
                this._moveCamera(this.config._this.camera.init.x, this.config._this.camera.init.y, this.config._this.camera.init.z, this.config._this.camera.target.x, this.config._this.camera.target.y, this.config._this.camera.target.z)
                this.model.rotation.y = 0;
                if (this.selected) {
                    this.selected.rotation.y = 0;
                    this.platform.selectedBox.rotation.y = 0;
                    this.platform.selectedBox.updateMatrix();
                }
            } else {
                if (this.$el.find(".rotate").hasClass("change")) this.$el.find(".rotate").removeClass("change")
                this.rotate = 0.002;
            }
        },

        _closePage: function () {
            window.removeEventListener('resize', this.onResize, false);
            this.platform.container.removeEventListener('mousedown', this.clickSceneDown, false);
            this.platform.container.removeEventListener('mouseup', this.clickSceneUp, false);
            $(":root").removeAttr("style");
        },

        _createPump: function (config) {
            this.config = config;
            this._moveCamera(this.config._this.camera.init.x, this.config._this.camera.init.y, this.config._this.camera.init.z, this.config._this.camera.target.x, this.config._this.camera.target.y, this.config._this.camera.target.z)
            if (config.url || (config.name && config.name.split('.')[0] && config.name.split('.')[1])) {
                this.platform.msgBox.style.display = 'block';
                this.platform.msgBox.innerHTML = '正在加载泵房设备';
                if (this.model) {
                    this.platform.scene.remove(this.model);
                    this.model.traverse(function (child) {
                        if (child.name !== '') {
                            child.geometry && child.geometry.dispose();
                            var m = child.material && child.material.length;
                            if (m) {
                                for (var i = 0; i < m; i++) {
                                    child.material[i] && child.material[i].dispose();
                                }
                            }
                        }
                    });
                }
                if (this.selected) {
                    this.platform.scene.remove(this.selected);
                    this.selected.traverse(function (child) {
                        if (child.name !== '') {
                            child.geometry && child.geometry.dispose();
                            var m = child.material && child.material.length;
                            if (m) {
                                for (var i = 0; i < m; i++) {
                                    child.material[i] && child.material[i].dispose();
                                }
                            }
                        }
                    });
                }
                if (this.selectedPosition) {
                    this.selectedPosition.traverse(function (child) {
                        if (child.name !== '') {
                            child.geometry && child.geometry.dispose();
                            var m = child.material && child.material.length;
                            if (m) {
                                for (var i = 0; i < m; i++) {
                                    child.material[i] && child.material[i].dispose();
                                }
                            }
                        }
                    });
                }
                if (!config.url) {
                    var name = config.name && config.name.split('.')[0];
                    var type = config.name && config.name.split('.')[1];
                }
                this.model = new THREE.Object3D; //泵房里的其他设备
                this.selected = new THREE.Object3D; //泵房可选择交互设备
                this.selectedPosition = new THREE.Object3D; // 泵房可选择交互设备位置信息
                this.lines = [];  //泵房里的连线
                this.platform.modelLoader(config.url, type, name, this.model, this.selected, this.selectedPosition,this.lines, config._this.tipHtml, config._this.position, config._this.positionLine, config._this.divStyle, config._this.camera, config.renderData);
            }
        },

        _onResize: function () {
            this.config.fitResolution && this.platform.throttle(this._resolutionCheck.bind(this));
            this.platform.throttle(this.platform.onResize);
        },

        _resolutionCheck: function () {
            var radioX = 1920 / window.innerWidth
            $(":root").css("font-size", (10 / radioX) + $(":root").css("font-size").replace(/[0-9]/ig, "").replace(".", ""))
        },

        _afterLoading: function (then) {
            this.onResize = this._onResize.bind(this);
            window.removeEventListener('resize', this.onResize, false)
            window.addEventListener('resize', this.onResize, false);
            if (this.config.selected) {
                this.clickSceneDown = this._clickSceneDown.bind(this);
                this.clickSceneUp = this._clickSceneUp.bind(this);
                this.onDownPosition = new THREE.Vector2();
                this.onUpPosition = new THREE.Vector2();
                this.platform.container.removeEventListener('mousedown', this.clickSceneDown, false);
                this.platform.container.addEventListener('mousedown', this.clickSceneDown, false);
            }
            this.platform.listenTo(this.platform, 'finish', function () {
                this.platform.stopListening();
                then && then();
            }.bind(this))
        },
        _moveCamera: function (cx, cy, cz, tx, ty, tz) {
            new TWEEN.Tween(this.platform.camera.position).to({
                x: cx,
                y: cy,
                z: cz
            }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
            new TWEEN.Tween(this.platform.controls.target).to({
                x: tx,
                y: ty,
                z: tz
            }, 1000).easing(TWEEN.Easing.Quadratic.Out).start();
        },


        _clickSceneDown: function () {
            var array = this.getMousePosition(this.platform.container, event.clientX, event.clientY);
            this.onDownPosition.fromArray(array);
            this.platform.container.removeEventListener('mouseup', this.clickSceneUp, false);
            this.platform.container.addEventListener('mouseup', this.clickSceneUp, false);
        },

        _clickSceneUp: function (event) {
            var array = this.getMousePosition(this.platform.container, event.clientX, event.clientY);
            this.onUpPosition.fromArray(array);
            if (this.onDownPosition && this.onDownPosition.distanceTo(this.onUpPosition) === 0) {
                var object = null;
                this.selected && this.selected.children && this.selected.children.forEach(function (child) {
                    if (this.getIntersects(this.onUpPosition, child.children) && this.getIntersects(this.onUpPosition, child.children).length > 0) {
                        object = child;
                    }
                }.bind(this))
                if (object && !this.config.hideBox) {
                    if (object.userData.object !== undefined) {
                        this.objectSelected(object.userData.object);
                    } else {
                        this.objectSelected(object);
                    }
                } else if (object && this.config.animation) {
                    this.config.animation(object, this.config);
                } else {
                    this.objectSelected(null);
                }
            }
        },

        getMousePosition: function (dom, x, y) {
            var rect = dom.getBoundingClientRect();
            return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
        },

        getIntersects: function (point, objects) {
            var raycaster = new THREE.Raycaster();
            var mouse = new THREE.Vector2();
            mouse.set((point.x * 2) - 1, -(point.y * 2) + 1);
            raycaster.setFromCamera(mouse, this.platform.camera);
            return raycaster.intersectObjects(objects);
        },

        //隐藏连线
        hideLine:function(index){
            this.lines[index].material.transparent = true;
            this.lines[index].material.opacity = 0;
        },

        // 选中效果
        objectSelected: function (obj) {
            this.platform.selectedBox && (this.platform.selectedBox.visible = false);
            this.platform.selectObj = null;
            if (obj) {
                this.platform.transformControls.attach(obj);
                console.log(this);

                // this.platform.outlinePass.selectedObjects = [obj];
                var object = obj.clone();
                var box = new THREE.Box3();
                box.setFromObject(object);

                //调整transform位置
                var objPosition = obj.children[0].geometry.boundingSphere.center;
                this.platform.transformControls.position.set(objPosition.x, objPosition.y, objPosition.z);


                if (box.isEmpty() === false) {
                    this.platform.selectObj = obj;
                    this.moveBox3();
                }
            } else {
                this.platform.transformControls.detach();
            }
        },

        //box3移动渲染
        moveBox3: function () {
            this.platform.selectedBox.setFromObject(this.platform.selectObj);
            this.platform.selectedBox.visible = true;
        },

        _renderScene: function (time) {
            if (this.model && this.rotate) {
                this.model.rotation.y += this.rotate;
            }

            if (this.selected && this.rotate) {
                this.selected.rotation.y += this.rotate;
                this.platform.selectedBox.rotation.y += this.rotate;
                this.platform.selectedBox.updateMatrix();
            }

            TWEEN.update();
            this.platform && this.platform.controls && this.platform.controls.update();

            if (this.platform.material.waterTexture) {
                this.platform.material.waterTexture.material.uniforms.time.value += 0.02;
                this.platform.material.waterTexture.render();
            }

            if (this.platform.material.pTexture && this.model.playFlow) {
                this.platform.material.pTexture.offset.y = (time * 0.002 % 1);
            }

            if (this.platform.material.pSlowTexture && this.model.playSlowFlow) {
                this.platform.material.pSlowTexture.offset.y = (time * 0.001 % 1);
            }

            if (this.platform.material.pyTexture && this.model.playOriginFlow) {
                this.platform.material.pyTexture.offset.y = -(time * 0.003 % 1);
            }

            if (this.platform.material.pgTexture && this.model.playFreshFlow) {
                this.platform.material.pgTexture.offset.y = -(time * 0.003 % 1);
            }

            if( this.config.needsUpdateTexture) this.config.needsUpdateTexture.offset.x += 0.005


            requestAnimationFrame(this._renderScene.bind(this));
            this.platform.labelRenderer && this.platform.labelRenderer.render(this.platform.scene, this.platform.camera);
            this.platform.renderer.render(this.platform.scene, this.platform.camera);
            // console.log(this.platform.camera.position,this.platform.controls.target);
            if (this.platform.selectObj) this.moveBox3(); //box3渲染
        }
    });
    return widgets
});