<template>
  <div class="login">
    <div class="login-content flex-center">
      <!-- <img class="left-pic"
           src="@/assets/img/system/login-bg.png"> -->
      <div class="login-wrap">
        <div class="title"><img src="@/assets/img/system/title.png"></div>
        <div class="login-form">
          <h5>账号登录</h5>
          <p>请使用管理员授权的账号密码登录</p>
          <el-form :model="loginForm"
                   :rules="loginRules"
                   ref="loginForm">
            <el-form-item prop="staffId"
                          class="form-item">
              <el-input class="reset-login-user"
                        :class="{'focus-login-user':tlShow}"
                        @focus="tlShow=true"
                        @blur="userNameBlur"
                        placeholder="请输入用户名"
                        v-model="loginForm.staffId">
                <span slot="prefix">
                  <i class="user-login-userName"></i>
                  <label class="tl"
                         v-show="tlShow">TL -</label>
                </span>
              </el-input>
            </el-form-item>
            <el-form-item prop="password"
                          class="form-item">
              <el-input placeholder="请输入用户密码"
                        v-model="loginForm.password"
                        show-password
                        @keyup.enter.native="login">
                <i slot="prefix"
                   class="user-login-password"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn"
                         type="primary"
                         @click="login">登录</el-button>
            </el-form-item>
          </el-form>
          <div class="bottom-tip flex-item-center">
            <div class="line"></div>
            <span>若忘记密码，请联系管理员 </span>
            <div class="line"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { Base64 } from 'js-base64'
export default {
  data () {
    return {
      loginForm: {
        staffId: '',
        password: ''
      },
      loginRules: {
        staffId: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      tlShow: false
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    login () {
      this.$refs.loginForm.validate((valid) => {
        const loginData = {
          staffId: `TL-${this.loginForm.staffId}`,
          password: Base64.encode(this.loginForm.password)
        }
        if (valid) {
          this.getUserInfo(loginData).then(res => {
            if (res) {
              this.$router.push('./promot')
            }
          })
        } else {
          return false
        }
      })
    },
    userNameBlur () {
      this.loginForm.staffId ? this.tlShow = true : this.tlShow = false
    }
  }
}
</script>
<style lang="less" scoped>
@import "./index";
@import "~@/common/styles/adapt.less";
</style>
