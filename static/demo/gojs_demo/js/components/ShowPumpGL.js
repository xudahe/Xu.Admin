/*
 ** 三维二供监控
 ** Created by ysq
 */
define([
    'frameworkthree/components/renderBIPump',
    "text!./ShowPumpGL.html",
    'frameworkthree/components/renderPump'
], function (renderBIPump, template, renderPump) {
    var widgets = renderBIPump.extend({
        tipHtml: ['<span style="margin: auto 10%;line-height: 2rem;">Ua：<span style="color: #0AF1F5;"> ---</span> v<span style="margin: auto 9%;">Ia：<span style="color: #0AF1F5;"> ---</span> A</span></span><span style="margin: auto 10%;line-height: 2rem;">Ub：<span style="color: #0AF1F5;"> ---</span> v<span style="margin: auto 9%;">Ib：<span style="color: #0AF1F5;"> ---</span> A</span></span><span style="margin: auto 10%;line-height: 2rem;">Uc：<span style="color: #0AF1F5;"> ---</span> v<span style="margin: auto 9%;">Ic：<span style="color: #0AF1F5;"> ---</span> A</span></span>', 
        '<span style="margin: auto 10%;line-height: 2rem;">压力：<span style="color: #0AF1F5;">0.65</span> MPa</span>', 
        '<span style="margin: auto 10%;line-height: 3rem;">瞬流：<span style="color: #0AF1F5;">7.80</span> m³/h</span><span style="margin: auto 10%;line-height: 3rem;">累计：<span style="color: #0AF1F5;">15023.00</span> m³</span>', 
        '<span style="margin: auto 10%;line-height: 2rem;">1#：<span style="color: #0AF1F5;">32.4</span> HZ</span>', 
        '<span style="margin: auto 10%;line-height: 2rem;">2#：<span style="color: #0AF1F5;">32.4</span> HZ</span>'],
        position: [{x: 43740.46484375,y: 1549.3911972045898,z: 66469.0703125}, {x: 42520.46484375,y: 666.3911972045898,z: 68705.0703125}, {x: 42537.46484375,y: 622.3911972045898,z: 68164.0703125}, {point:true}, {point:true}],
        positionLine: [{x: 43740.46484375,y: 1549.3911972045898,z: 66469.0703125}, {x: 42626.46484375,y: 1550.3911972045898,z: 69118.0703125}, {x: 42537.46484375,y: 1394.3911972045898,z: 67564.0703125}, {x: 41844.46484375,y: 1938.3911972045898,z: 69316.0703125}, {x: 41844.46484375,y: 1938.3911972045898,z: 69901.0703125}],
        divStyle: [{width:"18rem"},{width:"13.5rem"},{width:"16.5rem"},{width:"11rem"},{width:"11rem"}],
        camera:{
            init: {x: 3655.450948049255,y: 3103.692884565188,z: 3435.292210957605},
            target: {x: 0,y: 779.6804491514665,z: 0}
        },

        render: function () {
            $("#leftrightMain").css("z-index", "1000");
            $(this.el).empty().html(_.template(template)());
            $(this.el).css('z-index', 1001);
            $(document.body).append(this.el);
            return this;
        },

        widgetOpen: function () {
            this.open = true;
            this.oldWidth = 1920;
            this.oldHeight = 1080;
            this.rotate = 0;

            this.renderPump = new renderPump(); //三维平台初始化
            this.renderPump.setElement(this.$el.find("#webgl")).render({
                name: "ep_e04.gltf",
                fitResolution: true,
                rotate: {
                    top:'9%',
                    right: '26%'
                },
                render: {
                    color: "#ffffff",
                    opacity: 0
                },
                _this: this,
                then: function() {
                    this.pieWaterChart = this._renderEnergyPie("pie_right", 409, "千吨水百米扬程能耗", 670, "kWh/(km³·MPa)");
                    this.pieFactoryChart = this._renderEnergyPie("pie_left", 0.409, "实时吨水能耗", 0.67, "kWh/m³");
                    this.energyChart = this._renderEnergyChart();
                    this.lineChart = this._renderLineChart();
                    this.flowChart = this._renderFlowChart();
                    this.$el.find(".pumpStatus.active").trigger("click");
                }.bind(this),
                afterLoading: this._afterLoading.bind(this)
            })
        },

        videoHandle: function () {
            var project = 'panda_Laboratory';
            var url = window.location.origin + "/web4/video/index.html?project=" + project + "&ID=29" + "&site=" + _config.userInfo.site;
            window.open(url);
        },
        _onResize: function () {
            this.renderPump.platform.throttle(this._resizeChart.bind(this));
        },

    });
    return widgets
});