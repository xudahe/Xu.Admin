<!-- 应用系统登录 -->
<template>
    <div class="login-container">
        <el-form :model="loginForm" :rules="rules" status-icon ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-page">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" placeholder="密码" ></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-row :span="24">
                    <el-col :span="14">
                        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" size=""></el-input>
                    </el-col>
                    <el-col :span="10">
                        <div class="login-code" @click="setRefreshCode">
                        <s-identify :identifyCode="identifyCode"></s-identify>
                    </div>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-checkbox v-model="checkboxValue" class="rememberme">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click.native="loginSubmit" :loading="logining">{{loadName}}</el-button>
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
            loadName: '登录',
            timeCode: null,
            timeCount: 60,
            timeSum: 0,
            identifyCode:"",
            identifyCodes: [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
            'S','T','U','V','W','X','Y','Z'],

            logining: false,
            loginForm: {
                username: 'admin',
                password: '123456',
                code:''
            },
            rules: {
                username: [{required: true, message: 'please enter your account', trigger: 'blur'}],
                password: [{required: true, message: 'enter your password', trigger: 'blur'}]
            },
            checkboxValue: true
        }
    },
    methods: {
        randomNum (min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },
        refreshCode () {
            this.timeSum = this.timeCount;
            this.identifyCode = ''
            for (let i = 0; i < 5; i++) {
                this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
            }
        },
        setRefreshCode(){
            window.clearInterval(this.timeCode)
            this.refreshCode();

            let _this = this;
            this.timeSum = this.timeCount;
            this.timeCode = setInterval(() => {
                if(_this.timeSum >1 && _this.timeSum <= _this.timeCount)
                  _this.timeSum --;
                else {
                  _this.refreshCode();
                  _this.timeSum = _this.timeCount;
                }
            }, 1000);
        },
        cookies() {
			let name = Cookies.get('username');
			let psw = Cookies.get('password');
			if (name && name != undefined) {
				this.loginForm.username = name;
			}
			if (psw && psw != undefined) {
				this.loginForm.password = psw;
				this.checkboxValue = true;
			}
			if (name == undefined || psw == undefined) {
				this.$router.push({ path: "/login" });
			}
		},
        loginSubmit(){
            let _this = this;
            if (!this.loginForm.username) {
				this.$warnTip({ title: "请填写用户名" })
				return
			} else if (!this.loginForm.password) {
				this.$warnTip({ title: "请填写密码" })
				return
            } 
            
            this.logining = true;
            this.loadName = "登录中...";
            this.$loading.showLoading()//打开

            //获取Token
            this.$ajax(this.$apiSet.requestToken, {
					name: this.loginForm.username,
					pass: encrypt(this.loginForm.password)
				}).then(res => {
                     if (!res.data.success) {
                        _this.logining = false;
                        _this.loadName = "重新登录";
                        _this.$loading.hideLoading(); //关闭

                        _this.$message({
                            message: res.data.message,
                            type: 'error'
                        });
                    } else {
                        var token = res.data.token;
                        _this.$store.commit("saveToken", token); // 保存token

                        var curTime = new Date();
                        var expiredate = new Date(curTime.setSeconds(curTime.getSeconds() + res.data.expires_in)); // 定义过期时间
                        _this.$store.commit("saveTokenExpire", expiredate); // 保存token过期时间
                        
                        window.localStorage.refreshtime = expiredate;  // 保存刷新时间，这里的和过期时间一致
                        window.localStorage.expires_in = res.data.expires_in;

                        _this.$notify({
                            type: "success",
                            message: `成功获取令牌，等待服务器返回用户信息...`,
                            duration: 3000
                        });
                        
                        _this.getUserByToken(token)
			    	}
				}).catch(err => {
     
                })
        },
        // 获取用户
        getUserByToken(token) {
            var _this = this;
            
            this.$ajax(this.$apiSet.getUserByToken, {
			     	token: token
				}).then(res => {
                    if (!res.data.success) {
                        _this.logining = false;
                        _this.loadName = "重新登录";
                        _this.$loading.hideLoading();//关闭

                        _this.$message({
                            message: res.data.message,
                            type: 'error'
                        });
                    } else {
                        
                        let userinfo = res.data.response;
                        window.localStorage.userInfo = JSON.stringify(userinfo)
                        if (this.checkboxValue == true) {
							Cookies.set('username', this.loginForm.username);
							Cookies.set('password', this.loginForm.password);
						}
                       
                        if (userinfo.id > 0) {
                            _this.getRoleData(userinfo)
                        }
                    }
                }).catch(err => {

                })
        },
        // 获取角色
        getRoleData(userinfo) {
            var _this = this;
            
            this.$ajax(this.$apiSet.getRoleInfo, {
			     	ids: userinfo.roleIds
				}).then(res => {
                    if (!res.data.success) {
                        _this.logining = false;
                        _this.loadName = "重新登录";
                        _this.$loading.hideLoading();//关闭

                        _this.$message({
                            message: res.data.message,
                            type: 'error'
                        });
                    } else {
                        let roleinfo = res.data.response;
                        window.localStorage.roleInfo = JSON.stringify(roleinfo)
                        
                        let menuIds = roleinfo.map(item => item.menuIds);
                        if (menuIds.length > 0) {
                            _this.getMenuData(menuIds)
                        }
                    }
                }).catch(err => {

                })
        },
        // 获取菜单
        getMenuData(menuIds) {
            var _this = this;

            this.$ajax(this.$apiSet.getMenuByIds, {
			     	ids: menuIds.join(',')
				}).then(res => {
                    _this.logining = false;
                    _this.$loading.hideLoading();//关闭

                    if (!res.data.success) {
                        _this.loadName = "重新登录";
                        _this.$message({
                            message: res.data.message,
                            type: 'error'
                        });
                    } else {
                        window.localStorage.menuInfo = JSON.stringify(res.data.response)
                        _this.loadName = '登录成功'
                        _this.$router.push({path: "/"}) //登录成功之后重定向到首页
                        
                        setTimeout(() => {
                            let userinfo = JSON.parse(window.localStorage.userInfo ? window.localStorage.userInfo : null);

                            _this.$notify({
                                type: "success",
                                message: `登录成功 \n 欢迎管理员：${userinfo.realName} ！Token 将在 ${window.localStorage.expires_in / 60} 分钟后过期！`,
                                duration: 4000
                            });
                        }, 1000);
                    }
                }).catch(err => {
                
                })
        }
    },
    mounted(){
        window.localStorage.clear()
        // console.info('%c 本地缓存已清空!', "color:green")
 
        this.cookies();
        this.setRefreshCode()
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
        window.clearInterval(this.timeCode)
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
    margin: 120px auto;
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
