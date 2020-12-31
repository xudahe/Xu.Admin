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
            <li><b>Name: </b>{{item.user}}</li>
            <li><b>Message: </b>{{item.message}}</li>
            <li><b>：</b>{{item.item1}}</li>
            <li><b>：</b>{{item.item2}}</li>
        </ul>
        <el-button type="primary" @click="submitCard">登录</el-button>
        <el-button type="primary" @click="getLogs">查询</el-button>
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
                loading: true,
                tableData: [],
                userName: "Tom",
                userMessage: "123",
                connection: "",
                messages: [],
                t: ""
            }
        },
        methods: {
            getRoles() {
                let _this=this;
                let para = {
                    page: this.page,
                    key: this.filters.LinkUrl
                };
                this.loading = true;

                // getLogs(para).then((res) => {
                    // 开始通讯，并成功呼叫服务器
                    _this.connection.start().then(() => {
                        _this.connection.invoke('GetLatestCount', 1).catch(function (err) {
                            return console.error(err);
                        });

                    });
                // });
            },
            submitCard: function () {
                if (this.userName && this.userMessage) {
                    this.connection.invoke('SendMessage', this.userName, this.userMessage).catch(function (err) {
                        return console.error(err);
                    });
                }
            },
            getLogs: function () {
                this.loading = true;
                this.connection.invoke('GetLatestCount', 1).catch(function (err) {
                    return console.error(err);
                });
            }
        },
        created: function () {
            let _this = this;
            //参考案列：https://www.cnblogs.com/laozhang-is-phi/p/netcore-vue-signalr.html#autoid-4-1-0
            //1、首先我们实例化一个连接器
            _this.connection = new signalR.HubConnectionBuilder()
                .withUrl(`http://localhost:1082/api/chatHub`,{
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets
                })  //然后配置通道路由
                .configureLogging(signalR.LogLevel.Information) //日志信息
                .build(); //创建

            _this.connection.on('ReceiveMessage', function (user, message) {
                 console.info(message)
                _this.messages.push({user, message, item1: encrypt(user),item2: decrypt(encrypt(user))});
            });

            _this.connection.on('ReceiveUpdate', function (update) {
                console.info('update success!')
                console.info(update)
                _this.loading = false;
                _this.tableData = update;
                window.clearInterval(this.t)
            })
        },
        mounted() {
            this.getRoles();

            //  this.t =  setTimeout(() => {
            //      this.getLogs();
            // }, 1000);

        },
        beforeDestroy() {
            window.clearInterval(this.t)
            this.connection.stop();
        }
    }

</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 30%;
    }

    .EXC {
        color: red;
    }
</style>
