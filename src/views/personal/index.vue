<template>
    <section>
		<el-row :gutter="10">
			<el-col :sm="24" :md="6">
				<el-card class="box-card" shadow="hover">
					<div slot="header" class="header"><span>关于我</span></div>
					<div class="avatar-box">
						<div class="avatar">
							<el-button icon="el-icon-upload" class="upload-button" circle ></el-button>
							<el-avatar :size="120" src="" fit="cover"><img src="https://myinterface.xuanzai.top/getPicture?type=error" /></el-avatar>
							<div class="hover-plus" @click="isShow = true"><svg-icon icon-class="add" class="add-avatar" /></div>
						</div>
						<div class="avatar-detail">
							<div class="role">test</div>
							<div class="name">1234562@qq.com</div>
						</div>
					</div>
					<div class="title">
						<i class="el-icon-reading"></i>
						<span class="word">个人信息</span>
						<div class="border"></div>
					</div>
					<div style="margin: .5rem 0; font-size: .8rem;">
						<i class="el-icon-s-custom"></i>昵称：
					</div>
					<div style="margin: .5rem 0; font-size: .8rem;">
						<i class='el-icon-male' />性别：
					</div>
					<div style="margin: .5rem 0; font-size: .8rem;">
						<i class="el-icon-office-building" />部门：
					</div>
					<div style="margin: .5rem 0; font-size: .8rem;">
						<i class="el-icon-s-check"></i>岗位：
					</div>
					<div style="margin: .5rem 0; font-size: .8rem;">
						<i class="el-icon-phone"></i>电话：
					</div>
				</el-card>
			</el-col>
			<el-col :sm="24" :md="18">
				<el-card class="box-card card-gutter-sm" shadow="hover">
					<div slot="header" class="clearfix"><span class="header">基本资料</span></div>
					<el-tabs>
						<el-tab-pane label="基本资料">
              <keep-alive>
					   		<Basic @updateUserInfo="updateUserInfo" />
              </keep-alive>
						</el-tab-pane>
						<el-tab-pane label="修改邮箱">
              <keep-alive>
						   	<editEmail @updateUserInfo="updateUserInfo" />
              </keep-alive>
						</el-tab-pane>
						<el-tab-pane label="修改密码">
              <keep-alive>
					   		<editPassword />
              </keep-alive>
						</el-tab-pane>
						<el-tab-pane label="操作日志">
              <keep-alive>
					   		<Table />
              </keep-alive>
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</el-col>
		</el-row>
		<upload-avatar :is-show.sync="isShow" :upload-avatar="uploadAvatar" />
    </section>
</template>

<script>

// keep-alive 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。 它是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。

import Basic from './components/basic'
import editPassword from './components/edit_password';
import editEmail from './components/edit_email';
import Table from './components/log_table';

export default {
	name: 'personal',
	components: { Basic, editPassword, editEmail, Table },
    data() {
      return {
        activeName: "first",
		    isShow: false,
		    user: this.$store.getters.role
      }
    },
	methods: {
      // 更新用户数据
      updateUserInfo() {
        // this.$emit("updateUserInfo");
      },
      uploadAvatar(result) {
        // this.$http_file({
        //   url: '/api/user/updateAvatar',
        //   method: 'post',
        //   data: {
        //     file: new window.File([result], "avatar.png", {type: result.type})
        //   }
        // }).then(() => {
        //   this.isShow = false;
        //   this.updateUserInfo()
        //   this.$successMsg('更换头像成功，正在缓慢加载中~');
        // })
      }
    }
};
</script>

<style lang="scss">
.header {
  position: relative;
  font-size: 1rem;
  color: #2f3032;
}
.avatar-box {
  position: relative;
  text-align: center;
}
.avatar {
  position: relative;
  margin: auto;
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.avatar:hover .hover-plus {
  opacity: 1;
}
.hover-plus {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  top: 0;
  left: 0;
  z-index: 99;
  opacity: 0;
  background: rgba(0, 0, 0, .5);
  transition: .3s;
}
.add-avatar {
  position: relative;
  font-size: 2rem;
  color: #d6d6d6;
  top: 50%;
  margin-top: -1rem;
}
.upload-button {
  position: absolute; 
  right: -5px; 
  top: -10px; 
  z-index: 100; 
  opacity: .8
}
.image-box {
  position: relative;
}
.image {
  position: relative;
  width: 100%;
  height: 100%;
}
.role {
  position: relative;
  font-size: 1.1rem;
  font-weight: bold;
}
.name {
  font-size: 1rem;
  color: #7d7d7d;
}
.title {
  position: relative;
  margin: 2rem 0 1rem 0;
}
.word {
  position: relative;
  padding-left: 0.3rem;
}
.content {
  position: relative;
  font-size: 0.9rem;
}
.timeline-title {
  color: #7d7d7d;
}
.timeline-content {
  font-size: 0.8rem;
}
.el-button--text {
  font-size: 0.8rem;
  padding: 0;
}
.el-avatar {
	img {
		width: 100%;
	}
}
</style>
