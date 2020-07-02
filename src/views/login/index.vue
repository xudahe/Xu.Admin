<!-- 应用系统登录 -->
<template>
    <div class="login-container">
        <el-form :model="loginForm" :rules="rules"
         status-icon
         ref="loginForm" 
         label-position="left" 
         label-width="0px" 
         class="demo-ruleForm login-page">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" 
                    v-model="loginForm.username" 
                    placeholder="用户名"
                ></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" 
                    v-model="loginForm.password" 
                    placeholder="密码"
                ></el-input>
            </el-form-item>
            <el-checkbox 
                v-model="checkboxValue"
                class="rememberme"
            >记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click.native="loginSubmit" :loading="logining">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import { encrypt } from '@/utils/encrypt' //密码加密
export default {
    data(){
        return {
            logining: false,
            loginForm: {
                username: 'admin',
                password: '123456',
            },
            rules: {
                username: [{required: true, message: 'please enter your account', trigger: 'blur'}],
                password: [{required: true, message: 'enter your password', trigger: 'blur'}]
            },
            checkboxValue: true
        }
    },
    methods: {
        cookies() {
			let name = Cookies.get('username');
			let psw = Cookies.get('password');
			if (name && name != "null") {
				this.loginForm.username = name;
			}
			if (psw && psw != "null") {
				this.loginForm.password = psw;
				this.checkboxValue = true;
			}
			if (name == undefined || psw == undefined) {
				this.$router.push({ path: "/login" });
			}
		},
        loginSubmit(){
            if (!this.loginForm.username) {
				this.$warnTip({
					title: "请填写用户名"
				})
				return
			} else if (!this.loginForm.password) {
				this.$warnTip({
					title: "请填写密码"
				})
				return
            } 
            
            this.$store.dispatch("saveToken", this.loginForm.username).then(() => {
              this.$router.push({path: "/"}) //登录成功之后重定向到首页
            }).catch(res => {
              this.$message({
                showClose: true,
                message: res,
                type: "error"
              })
            })
            
            //获取Token
            // this.$ajax(this.$apiSet.requestToken, {
			// 		name: this.loginForm.username,
			// 		pass: this.loginForm.password
			// 	}).then(
			// 		data => {
			// 			if (data.success == true) {
                            
            //                 var token = data.response.token;
            //                 _this.$store.commit("saveToken", token); // 保存token

            //                 var curTime = new Date();
            //                 var expiredate = new Date(curTime.setSeconds(curTime.getSeconds() + data.response.expires_in)); // 定义过期时间
            //                 _this.$store.commit("saveTokenExpire", expiredate); // 保存token过期时间

            //                 window.localStorage.refreshtime = expiredate;  // 保存刷新时间，这里的和过期时间一致
            //                 window.localStorage.expires_in = data.response.expires_in;

            //                 _this.$notify({
            //                     type: "success",
            //                     message: `成功获取令牌，等待服务器返回用户信息...`,
            //                     duration: 3000
            //                 });
                            
            //                 _this.getUserByToken(token)

			// 			} else {
			// 			}
			// 		},
			// 		error => {
			// 			alert(error);
			// 		}
			// 	);
        },
        // 获取用户数据
        getUserByToken(token) {
            var _this = this;
       
            this.$ajax(this.$apiSet.requestToken, {
			     	token: token
				}).then(
					data => {
						if (res.success == true) {
                            _this.$notify({
                                type: "success",
                                message: `接收到用户数据，开始初始化项目...`,
                                duration: 3000
                            });
                            
                            this.$router.push({path: "/"}) //登录成功之后重定向到首页
                            
                            let userinfo = JSON.stringify(data.response);
                            window.localStorage.user = userinfo

                            if (this.checkboxValue == true) {
								Cookies.set('username', this.loginForm.username);
								Cookies.set('password', this.loginForm.password);
							} else {
                                Cookies.remove('username');
                                Cookies.remove('password');
                            }

                            _this.$notify({
                                type: "success",
                                message: `登录成功 \n 欢迎管理员：${userinfo.uRealName} ！Token 将在 ${window.localStorage.expires_in / 60} 分钟后过期！`,
                                duration: 6000
                            });
                        }
                        else{

                        }
                    },
                	error => {
						alert(error);
					}
				);
        },
    },
    mounted(){
        window.localStorage.clear()
        // console.info('%c 本地缓存已清空!', "color:green")

        this.cookies();
    },
    created(){
        var _self = this;
        document.onkeydown = function(e){
            var key = window.event.keyCode;
            if(key == 13 || key == 100){  //对主键盘和小键盘的Enter都管用
                _self.loginSubmit();
            }
        }
    },
    beforeDestroy(){
        document.onkeydown = undefined;
    }
};
</script>

<style scoped>
.title {
    text-align: center;
    margin: 0 0 22px;
}
.login-container {
    width: 100%;
    height: 100%;
}
.login-page {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    margin: 150px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
    margin: 0px 0px 15px;
    text-align: left;
}
</style>
