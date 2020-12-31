<template>
  <div class="personal card_css">
		<el-row :gutter="10" style="height: 100%;width:100%;">
			<el-col :sm="24" :md="6" style="height: 100%;">
				<el-card class="box-card" shadow="hover">
					<el-Divider>
            <span >信息绑定</span>
          </el-Divider>
					<div class="avatar-box">
						<div class="avatar">
							<el-button icon="el-icon-upload" class="upload-button" circle @click="$refs.avatarForm.dialogVisible = true"></el-button>
							<el-avatar :size="120" src="" fit="cover">
                <img src="../../../../static/img/menus/11.png"/>
              </el-avatar>
							<div class="hover-plus" @click="isShow = true"><svg-icon icon-class="add" class="add-avatar"/></div>
						</div>
						<div class="avatar-detail">
							<div class="role">{{userInfo.realName}}</div>
							<div class="date">注册日期：{{$formatDate(userInfo.createTime, true)}}</div>
						</div>
					</div>
				  <CellGroup style="margin: 20px;">
            <Cell :title="'手机：'+(userInfo.phone||'未绑定')" style="padding-top:20px;">
              <Button
                type="success"
                size="small"
                icon="md-phone-portrait"
                slot="extra"
              >修改手机</Button>
            </Cell>
            <Cell :title="'邮箱：'+(userInfo.email||'未绑定')" style="padding-top:20px;">
              <Button
                type="info"
                size="small"
                icon="ios-mail-outline"
                slot="extra"
              >绑定邮箱</Button>
            </Cell>
          </CellGroup>
          <div style="padding: 0 17px 17px;">
            <el-button type="danger" icon="el-icon-lock" style="width: 100%;">修改密码</el-button>
          </div>
				</el-card>
			</el-col>
			<el-col :sm="24" :md="8" style="height: 100%;">
				<el-card class="box-card" shadow="hover" style="padding:0 10px 10px;">
          <el-Divider>
            <span >个人信息</span>
          </el-Divider>
					<el-form status-icon  label-position="right" label-width="80px">
            <el-form-item  label="账号：">
              <el-input type="text" v-model="userInfo.loginName" autocomplete="off" :disabled="true" clearable/>
            </el-form-item>
            <el-form-item  label="角色：">
              <el-input type="text" v-model="userInfo.username" autocomplete="off" :disabled="true" clearable/>
            </el-form-item>
            <el-form-item  label="姓名：">
              <el-input type="text" v-model="userInfo.realName" autocomplete="off" placeholder="请输入姓名" clearable/>
            </el-form-item>
            <el-form-item  label="地址：">
              <el-input type="text" v-model="userInfo.address" autocomplete="off" placeholder="请输入地址" clearable/>
            </el-form-item>
            <el-form-item  label="性别：">
               <el-select v-model="userInfo.sex" placeholder="请选择性别" clearable>
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  label="备注：">
              <el-input type="textarea" v-model="userInfo.remark" :autosize="{ minRows: 2, maxRows: 4}" autocomplete="off" placeholder="请输入备注"/>
            </el-form-item>
          </el-form>
          <div style="padding-bottom: 5px;">
            <el-button type="primary" icon="el-icon-check" style="width: 100%;" @click="updateInfo">保存</el-button>
          </div>
				</el-card>
			</el-col>
      <el-col :sm="24" :md="10" style="height: 100%;">
        	<el-card class="box-card" shadow="hover">
           <logTable></logTable>
          </el-card>
      </el-col>
		</el-row>
		<upload-avatar :is-show.sync="isShow" :upload-avatar="uploadAvatar" />
  </div>
</template>

<script>

// keep-alive 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。 它是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。

import basic from './components/basic'
import editPassword from './components/edit_password';
import editEmail from './components/edit_email';
import logTable from './components/log_table';

export default {
	name: 'personal',
	components: { basic, editPassword, editEmail, logTable },
  data() {
    return {
      activeName: "first",
	    isShow: false,
      userInfo: Object.assign({},this.$store.getters.info.userinfo),
    }
  },
	methods: {
    updateInfo(){},
    // 更新用户数据
    updateUserInfo() {
      // this.$emit("updateUserInfo");
    },
    uploadAvatar(result) {
      let file = new window.File([result], "avatar.png", {type: result.type})
      console.log(file)
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

<style lang="scss" scoped>
.personal{
  height: 100%;
  width: 100%;
}

.header {
  position: relative;
  font-size: 0.18rem;
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
  font-size: 0.18rem;
  color: #d6d6d6;
  top: 45%;
  // margin-top: -1rem;
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
  margin-top: 10px;
  position: relative;
  font-size: 0.18rem;
  font-weight: bold;
}
.date {
  margin-top: 10px;
  font-size: 0.14rem;
  color: #7d7d7d;
}
.title {
  position: relative;
  margin: 0.1rem 0;
}
.word {
  position: relative;
  font-size: 0.15rem;
}
.content {
  position: relative;
  font-size: 0.18rem;
}
.timeline-title {
  color: #7d7d7d;
}
.timeline-content {
  font-size: 0.18rem;
}
.el-button--text {
  font-size: 0.18rem;
  padding: 0;
}
.el-avatar {
	img {
		width: 100%;
	}
}
.divTitle {
    margin: 0.05rem 0.2rem;
    font-size: 0.14rem;
}

</style>
