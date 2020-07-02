<template>
    <section>
        <div style="display: none1">
            <el-form ref="form" label-width="80px" @submit.prevent="onSubmit"
                     style="margin:20px;width:60%;min-width:600px;">
                <el-form-item label="用户名">
                    <el-input v-model="userName"></el-input>
                </el-form-item>

                <el-form-item label="密码">
                    <el-input v-model="userMessage"></el-input>
                </el-form-item>
            </el-form>
            <ul v-for="(item, index) in messages" v-bind:key="index + 'itemMessage'">
                <li><b>Name: </b>{{item.user}}</li>
                <li><b>Message: </b>{{item.message}}</li>
            </ul>
            <el-button type="primary" @click="submitCard">登录</el-button>
            <el-button type="primary" @click="getLogs">查询</el-button>
        </div>


    </section>
</template>

<script>

    import * as signalR from "@aspnet/signalr";

    export default {
        name:'operation_log',
        data() {
            return {
                filters: {
                    LinkUrl: ''
                },
                listLoading: true,
                tableData: [],
                userName: "Tom",
                userMessage: "123",
                connection: "",
                messages: [],
                t: ""
            }
        },
        methods: {
            //获取用户列表
            getRoles() {
                let thisvue=this;
                let para = {
                    page: this.page,
                    key: this.filters.LinkUrl
                };
                this.listLoading = true;

                // getLogs(para).then((res) => {
                    // 开始通讯，并成功呼叫服务器
                    thisvue.connection.start().then(() => {
                        thisvue.connection.invoke('GetLatestCount', 1).catch(function (err) {
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
                this.listLoading = true;
                this.connection.invoke('GetLatestCount', 1).catch(function (err) {
                    return console.error(err);
                });
            }
        },
        created: function () {
            let thisVue = this;
            //参考案列：https://www.cnblogs.com/laozhang-is-phi/p/netcore-vue-signalr.html#autoid-4-1-0
            //1、首先我们实例化一个连接器
            thisVue.connection = new signalR.HubConnectionBuilder()
                .withUrl(`http://localhost:1082/api/chatHub`)  //然后配置通道路由
                .configureLogging(signalR.LogLevel.Information) //日志信息
                .build(); //创建

            thisVue.connection.on('ReceiveMessage', function (user, message) {
                thisVue.messages.push({user, message});
            });

            thisVue.connection.on('ReceiveUpdate', function (update) {
                console.info('update success!')
                thisVue.listLoading = false;
                thisVue.tableData = update;
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
