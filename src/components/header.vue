<template>
  <div>
    <div class="head">
      <div class="head-content flex-between-center">
        <h4>店铺信息总览</h4>
        <!-- 用户信息 -->
        <div class="flex-item-center user">
          <p class="journal"
             @click="viewJournal">查看操作日志</p>
          <el-popover placement="bottom"
                      trigger="click"
                      popper-class="user-popover">
            <div slot="reference">
              <div class="flex-item-center user-info">
                <div><img src="@/assets/img/custom/userImg.png"></div>
                <p>欢迎您！{{userData.staffId}}</p>
              </div>
            </div>
            <div class="user-operate">
              <p class="flex-item-center"
                 @click="editPwd"><i class="edit-pwd-icon"></i><span>修改密码</span></p>
              <p class="flex-item-center"
                 @click="logout"><i class="log-out-icon"></i><span>退出登录</span></p>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <el-dialog title="查看日志"
               custom-class="journal-dialog"
               width="1000px"
               top="40px"
               :modal="true"
               :destroy-on-close="true"
               :visible.sync="journalShow">
      <standard-table class="journal-table"
                      :dataSource="tableData"
                      :columns="columns"
                      layout="total, pager"
                      :pagination="PAGING"
                      @tableChange="tableChange" />
    </el-dialog>
    <el-dialog title="更改密码"
               custom-class="edit-pwd"
               :visible.sync="pwdShow"
               :close-on-click-modal="false"
               :destroy-on-close="true"
               @close="editPwdClose"
               width="452px">
      <el-form :model="editForm"
               :rules="editRules"
               label-width="96px"
               ref="editForm">
        <el-form-item prop="oripassword"
                      label="旧密码："
                      class="form-item">
          <el-input placeholder="请输入旧密码"
                    v-model="editForm.oripassword"
                    show-password>
          </el-input>
        </el-form-item>
        <el-form-item prop="newpassword"
                      label="新密码："
                      class="form-item">
          <el-input placeholder="请输入新密码"
                    v-model="editForm.newpassword"
                    show-password>
          </el-input>
        </el-form-item>
        <el-form-item prop="newpasswordTwo"
                      label="确认新密码："
                      class="form-item">
          <el-input placeholder="请输入确认新密码"
                    v-model="editForm.newpasswordTwo"
                    show-password>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer user-edit">
        <el-button @click="pwdShow = false">取 消</el-button>
        <el-button type="primary"
                   @click="editHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Base64 } from 'js-base64'
import axios from 'axios'
export default {
  data () {
    var checkPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editForm.newpassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tabActive: '',
      journalShow: false,
      pwdShow: false,
      PAGING: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      columns: [{
        dataKey: 'time',
        title: '日期',
        align: 'left',
        width: 150
      }, {
        dataKey: 'user',
        title: '用户',
        align: 'left',
        width: 80
      }, {
        dataKey: 'type',
        title: '操作类型',
        align: 'left',
        width: 80
      }, {
        dataKey: 'event',
        title: '操作',
        align: 'left'
      }],
      tableData: [],
      editForm: {
        oripassword: '',
        newpassword: '',
        newpasswordTwo: ''
      },
      editRules: {
        oripassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          // 密码至少包含 数字和英文，长度6-20
          { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, message: '密码至少包含数字和英文，长度为6-20个字符', trigger: 'blur' }
        ],
        newpasswordTwo: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: checkPwd, trigger: 'blur' }
        ]
      },
      fileList: [],
      fileType: ['xlsx', 'xls']
    }
  },
  computed: {
    ...mapGetters({ userData: 'getUserData' })
  },
  created () {
    this.tabActive = this.$route.name
  },
  methods: {
    tabClick (tab, event) {
      this.$router.push(`/${tab.name}`)
    },
    viewJournal () {
      this.getTableData()
    },
    editPwd () {
      this.pwdShow = true
    },
    editPwdClose () {
      this.$refs.editForm.resetFields()
    },
    // 表格分页的变化
    tableChange (changeParams) {
      this.PAGING.pageSize = changeParams.pageSize
      this.PAGING.pageNum = changeParams.pageNum
      this.getTableData()
    },
    getTableData () {
      this.$request.post('/dialog', {
        pageNum: this.PAGING.pageNum,
        pageSize: this.PAGING.pageSize,
        shop: this.$store.state.shopId || ''
      }).then(res => {
        const resData = res.data.result || []
        this.tableData = resData
        this.PAGING.total = res.data.total
        this.journalShow = true
      })
    },
    editHandle () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const pwdData = {
            staffId: this.userData.staffId,
            oripassword: Base64.encode(this.editForm.oripassword),
            newpassword: Base64.encode(this.editForm.newpassword)
          }
          this.$request.post('/changepassword', pwdData).then(res => {
            if (res.errorCode === 1) {
              this.$message.success('密码修改成功')
              sessionStorage.clear()
              this.$router.push('./')
            }
          })
        } else {
          return false
        }
      })
    },
    logout () {
      sessionStorage.removeItem('userData')
      this.$store.dispatch('resetUSerInfo')
      // 跳转登录
      sessionStorage.clear()
      this.$router.go(0)
    },
    beforeUpload (file) {
      const { name } = file
      if (!this.fileType.includes(name.split('.')[name.split.length - 1])) {
        this.$message.warning('文件格式不正确，请检查文件')
        return false
      }
      const fileSize = file.size / 1024 / 1024
      if (fileSize > 5) {
        this.$message.warning('文件上传过大,请检查文件')
        return false
      }
      this.fileList = [...this.fileList, file]
      this.uploadHandel()
    },
    // 上传
    uploadHandel () {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      const submitUrl = `${process.env.VUE_APP_API}/import`
      this.$store.commit('SETSPINNING', true)
      axios.request({
        url: submitUrl,
        method: 'post',
        data: formData,
        timeout: 30000,
        headers: {
          'Content-Type': 'multipart/form-data',
          trackId: this.$store.state.trackId || ''
          // permissionsCode: this.$store.state.permissionsCode || '',
          // user: this.$store.state.userData.staffId || ''
        }
      }).then(res => {
        this.$store.commit('SETSPINNING', false)
        this.fileList = []
        if (res.data.errorCode === 1) {
          this.$message.success('导入成功')
          const msgArr = res.data.data || []
          if (msgArr && msgArr.length > 0) {
            let tipMsg = ''
            msgArr.forEach(i => {
              tipMsg += `<p><span class="tool">${i.tool}</span><span class="date">${i.date}</span>数据有误</p>`
            })
            tipMsg = `<div class="import-tip-content">${tipMsg}</div>`
            setTimeout(() => {
              this.$alert(tipMsg, '以下数据有误，未能成功导入', {
                customClass: 'import-tip',
                dangerouslyUseHTMLString: true
              })
            }, 500)
          }
        } else if (res.data.errorCode === -1) {
          this.$message.error('文件上传失败')
        } else if (res.data.errorCode === 103) {
          this.$message.error('文件名称不正确，请检查文件')
        } else if (res.data.errorCode === 104) {
          this.$message.error('文件内容不正确，请检查文件')
        } else if (res.data.errorCode === 1003) {
          this.$message.warning('用户身份信息过期，请重新登录')
          setTimeout(() => {
            sessionStorage.removeItem('userData')
            this.$store.dispatch('resetUSerInfo')
            // 跳转登录
            sessionStorage.clear()
            this.$router.go(0)
          }, 1500)
        } else if (res.data.errorCode === 1004) {
          this.$message.warning('上传权限不足，请联系管理员')
        }
      }).catch(res => {
        this.$message.error('上传失败，请重新上传')
        this.$store.commit('SETSPINNING', false)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/common/styles/header";
</style>>
