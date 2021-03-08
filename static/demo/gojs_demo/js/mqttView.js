/* 
 * @Author: lijiwen
 * @Date:   2019-09-17 11:24:16
 * @Title：MQTT组件
 * @参数：name: 画板名称 ；devices：站点code集合
 * @url： configuration/ConfigurationsInterface/mqttView
 */
define(["backbone", "MqttView"], function(Backbone, MqttView) {
    return Backbone.View.extend({
        events: {},
        render: function(options) {
            var me = this;
            me.site_code = _config.mqtt_site_code;
            me.callback = options.callback || function() {}; //订阅回调
            me.controlback = options.controlback || function() {}; //控制回调
            me.devices = options.devices;
            this.flag = true;
            me.messageAtt = [];
            me.renderSaveWaterMqtt();
            return this;
        },
        //主题--第一步
        renderSaveWaterMqtt: function() {
            var site = this.site_code;
            var hostname = _config.mqtt_iotIP.split(":")[0],
                port = _config.mqtt_iotIP.split(":")[1] * 1,
                clientId = 'PandaWeb-' + this._createGuid(),
                timeout = 5,
                keepAlive = 50,
                cleanSession = true,
                ssl = _config.mqtt_IsSSL,
                userName = 'admin',
                path = _config.mqtt_path,
                password = 'public';
            this.saveWaCount = 0;
            this.saveWaClient = new MqttView.Client(hostname, port, path, clientId);
            this.saveWaOptions = {
                invocationContext: {
                    host: hostname,
                    port: port,
                    path: path,
                    clientId: clientId
                },
                timeout: timeout,
                keepAliveInterval: keepAlive,
                cleanSession: cleanSession,
                useSSL: ssl,
                userName: userName,
                password: password,
                onSuccess: this.onSaveWaConnect.bind(this),
                onFailure: function(e) {
                    console.log(e);
                }
            };
            this.saveWaClient.connect(this.saveWaOptions);
            //注册连接断开处理事件  
            this.saveWaClient.onConnectionLost = this.onSaveWaConnectionLost.bind(this);

            //注册消息接收处理事件  
            this.saveWaClient.onMessageArrived = this.onSaveWaMessageArrived.bind(this);
        },
        //消息接收方法
        onSaveWaMessageArrived: function(message) {
            this.onMessageArrived(message, "saveWaType");
        },
        //主题建立连接
        onSaveWaConnect: function() {
            var me = this;
            this.devices.forEach(function(item) {
                if(item) {
                    var saveWaTopic = this.site_code + "/" + item.replace(/[#+]/g, '@');
                    this.saveWaClient.subscribe(saveWaTopic);
                    this.saveWaClient.subscribe("callback/control/" + this.site_code + "/" + item.replace(/[#+]/g, '@') + "/#");
                }
            }.bind(this));
        },
        //  主题断开连接
        disSaveWaconnect: function() {
            if (this.saveWaClient) {
                this.flag = false;
                // this.saveWaClient.disconnect();
                if(this.saveWaClient.isConnected()) this.saveWaClient.disconnect();
                if (this.saveWatester) {
                    clearInterval(this.saveWatester);
                    this.saveWatester = null;
                }
            }
        },
        // 主题掉线重连接
        onSaveWaConnectionLost: function(responseObject) {
            var me = this;
            if (this.flag)
                this.saveWaClient.connect(me.saveWaOptions);
            this.saveWatester = setInterval(function() {
                if (me.saveWaClient.isConnected()) {
                    clearInterval(me.saveWatester);
                    me.saveWatester = null;
                } else {
                    me.saveWaClient.connect(me.saveWaOptions);
                }
            }, 1000);
        },
        //  消息接收
        onMessageArrived: function(message, infoType) {
            var me = this;
            var topic = message.topic;
            var code = topic.split("/")[topic.split("/").length - 1];
            if (topic.indexOf("callback/control/" + this.site_code) > -1) {
                me.controlback(message.payloadString, code, topic);
                return false;
            }
            me.callback(message.payloadString, code, topic);
        },
        // 消息发送
        onSendWaMessageArrived: function(userName, password, callbackGuid, devicecode, tag, type, val, controlMode) {
            var info = {
                "userName": userName,
                "password": password,
                "callbackGuid": callbackGuid,
                "type": "",
                "operateType": type,
                "controlValue": val ? val : "",
                "sitecode": _config.mqtt_site_code,
                "devicecode": devicecode,
                "controlMode": controlMode ? controlMode : "",
                "tag": tag
            };
            var message = new MqttView.Message(JSON.stringify(info));
            message.destinationName = "setdata/" + _config.mqtt_site_code + "/" + devicecode;
            // message.retained = false;
            this.saveWaClient.send(message);
        },
        _createGuid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }).toUpperCase();
        }
    });
});