<template>
    <div style="width:100%;height:100%;">
        <el-form ref="form" label-width="80px" @submit.prevent="onSubmit"
                 style="margin:20px;width:60%;min-width:300px;">
            <el-form-item label="用户名">
                <el-input v-model="userName"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="userMessage"></el-input>
            </el-form-item>
        </el-form>
        <ul v-for="(item, index) in messages" v-bind:key="index + 'itemMessage'" style="width:100%;">
            <li><b>返回信息：</b>User：{{item.user}}&nbsp;&nbsp;Message：{{item.message}}</li>
        </ul>
        <el-button type="primary" @click="submitCard">发送</el-button>
        <el-button type="primary" @click="getLogs"></el-button>
    </div>
</template>

<script>
    
    import {encrypt,decrypt} from "@/utils/encrypt.js"
    import * as signalR from "@aspnet/signalr";

    export default {
        name:'signalr_manager',
        data() {
            return {
                filters: {
                    LinkUrl: ''
                },
                tableData: [],
                userName: "Tom",
                userMessage: "123",
                connection: "",
                messages: [],
                t: ""
            }
        },
        methods: {
            initStart() {
                let _this = this;
        
                // 打开连接
                this.connection.start().then(() => {
                    _this.connection.invoke('GetLatestCount', 1).catch(function (err) {
                        return console.error(err);
                    });
                });
            },
            submitCard() {
                if (this.userName && this.userMessage) {
                    this.connection.invoke('SendMessage', this.userName, this.userMessage).catch(function (err) {
                        return console.error(err);
                    });
                }
            },
            getLogs() {
                this.connection.invoke('GetLatestCount', 1).catch(function (err) {
                    return console.error(err);
                });
            }
        },
        created() {
            let _this = this;
            //参考案列：https://www.cnblogs.com/laozhang-is-phi/p/netcore-vue-signalr.html#autoid-4-1-0
            //1、首先我们实例化一个连接器
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(`http://localhost:1082/api/chatHub`,{
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets //通讯方式：webSockets
                })  //然后配置通道路由
                .configureLogging(signalR.LogLevel.Information) //日志信息
                .build(); //创建

            this.connection.on('ReceiveMessage', function (user, message) {
                console.info('ReceiveMessage')
                _this.messages.push({user, message});
            });

            this.connection.on('ReceiveUpdate', function (update) {
                console.info('ReceiveUpdate')
                console.info(update)
                _this.tableData = update;
                window.clearInterval(this.t)
            })
        },
        mounted() {
            this.initStart();

            // this.t =  setTimeout(() => {
            //      this.initStart();
            // }, 1000);

        },
        beforeDestroy() {
            window.clearInterval(this.t)
            this.connection.stop(); //关闭连接
        }
    }

</script>

<style scoped>

</style>
