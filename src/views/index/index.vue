<template>
  <div class="page">
    <div class="main-wrap">
      <Header-Top />
      <div class="main-content">
        <div class="search-wrap">
          <el-form :model="searchForm"
                   id="form"
                   ref="searchForm"
                   label-width="70px">
            <el-row class="row ">
              <el-col :span="8">
                <el-form-item label="时间类型："
                              prop="timeType">
                  <el-select placeholder="请选择时间类型"
                             popper-class="reset-select"
                             @change="timeTypeChange"
                             v-model="searchForm.timeType">
                    <el-option v-for="item in timeTypeArr"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <div class="flex-center">
                  <el-form-item label="精确月份："
                                prop="month"
                                v-show="searchForm.timeType===3">
                    <el-date-picker v-model="searchForm.month"
                                    :clearable="false"
                                    :editable="false"
                                    value-format="yyyy-MM"
                                    format="yyyy-MM"
                                    type="month"
                                    :picker-options="monthPickerOptions"
                                    placeholder="请选择选择月份">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="月度范围："
                                v-show="searchForm.timeType===7">
                    <el-date-picker v-model="timeSection"
                                    :key="monthRangeRadomLey"
                                    :editable="false"
                                    value-format="yyyy-MM"
                                    format="yyyy-MM"
                                    type="monthrange"
                                    range-separator="~"
                                    :picker-options="monthRangePickerOptions"
                                    start-placeholder="开始月份"
                                    end-placeholder="结束月份">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="日期区间："
                                class="time-range"
                                v-show="searchForm.timeType!==3&&searchForm.timeType!==7">
                    <el-date-picker v-model="timeSection"
                                    :disabled="timeDisabled"
                                    :editable="false"
                                    value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd"
                                    type="daterange"
                                    align="right"
                                    range-separator="~"
                                    :picker-options="pickerOptions"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="flex-end">
                  <el-form-item label="店铺选择："
                                prop="shop">
                    <el-select placeholder="请选择店铺"
                               v-model="searchForm.shop">
                      <el-option v-for="item in shopArr"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row class="row ">
              <el-col :span="8">
                <el-form-item label="推广工具："
                              prop="dataType">
                  <el-cascader placeholder="请选择推广工具"
                               v-model="searchForm.dataType"
                               :options="extendOptions"
                               :props="{ multiple: true }"
                               collapse-tags
                               clearable>
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item class="search-btn">
                  <!-- <el-button @click="resetForm('searchForm')">重置</el-button> -->
                  <el-button type="primary"
                             @click="searchHandle"
                             :disabled="searchBtnAbled">查询</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="table-wrap"
             ref="table">
          <div class="flex-between-center table-info">
            <div class="flex-item-center">
              <!-- 表格标题 -->
              <p class="select-tip"
                 v-show="timeTypeSelect!==''||shopSelect!==''"><span>{{timeTypeSelect}}</span><em v-show="timeTypeSelect!==''&&shopSelect!==''">，</em><span>{{shopSelect}}</span></p>
            </div>
            <!-- 右侧功能 -->
            <div class="btn-gather">
              <el-link type="primary"
                       v-if="userPowerArr.includes(3)"
                       class="down-btn flex-item-center"
                       :underline="false">
                <el-tooltip class="item"
                            effect="dark"
                            content="请使用表格模板导入数据"
                            placement="top">
                  <i class="down-template"></i>
                </el-tooltip>
                <span class="down-text"
                      @click="downMold">下载表格模板</span>
              </el-link>
              <el-upload v-if="userPowerArr.includes(3)"
                         accept=".xlsx,.xls"
                         action=""
                         :before-upload="beforeUpload"
                         :file-list="fileList"
                         :show-file-list="false">
                <el-button plain
                           class="import-btn"><i class="import-icon"></i>导入数据</el-button>
              </el-upload>
              <el-button v-if="userPowerArr.includes(2)"
                         type="primary"
                         @click="downTable"><i class="export-icon"></i>下载报表</el-button>
            </div>
          </div>
          <!-- table -->
          <Table :form="submitForm"
                 :userPowerArr="userPowerArr"
                 v-if="isShowTable"
                 @monthDialog="openMonthDialog"
                 @tableRender="tableRender" />
        </div>
      </div>
    </div>
    <el-dialog custom-class="journal-dialog"
               :class="{'confirm-cover-dialog':confirmCover}"
               width="1000px"
               top="40px"
               :modal="true"
               v-if="monthDataShow"
               :visible.sync="monthDataShow">
      <div slot="title">
        <span>{{monthDialogTitle}}</span>
        <em v-show="monthDialogTitle!==''&&shopSelect!==''">，</em>
        <span>{{shopSelect}}</span>
      </div>
      <Table :form="monthForm"
             :monthDialogBoolean="true"
             :userPowerArr="userPowerArr"
             @confirmCoverDialog="confirmCoverDialog"
             @tableRender="dialogTableRender" />
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
import tableMixin from '@/mixins/dealTable'
import HeaderTop from '@/components/header'
import { monthSpliceDay } from '@/common/utils/timeCalc'
import { scrollTo } from '@/common/utils/funcStore'
import watermark from '@/common/utils/watermark'
import { timeTypeArr } from './data'
import Table from './table'
export default {
  mixins: [tableMixin],
  components: { HeaderTop, Table },
  data () {
    return {
      // userPowerArr: [],
      searchForm: {
        timeType: 1,
        month: '', // 日期
        // monthRange: '', // 月度范围
        shop: '',
        dataType: []
      },
      timeSection: [], // 时间范围
      submitForm: {
        timeType: 1,
        startDate: '',
        endDate: '',
        shop: '',
        dataType: []
      },
      monthForm: {
        timeType: '',
        startDate: '',
        endDate: '',
        shop: '',
        dataType: []
      },
      timeTypeArr: timeTypeArr,
      shopArr: [],
      extendOptions: [],
      monthDataShow: false,
      randomKey: 1,
      isShowTable: false,
      searchClick: false,
      fileList: [],
      fileType: ['xlsx', 'xls'],
      monthDialogTitle: '',
      cacheMonth: '',
      cacheTimeSection: [],
      monthRangeRadomLey: 1,
      confirmCover: false
    }
  },
  watch: {
    'searchForm.shop': {
      deep: true,
      handler: function (newVal, oldVal) {
        this.SAVESHOPID(newVal)
      }
    }
  },
  computed: {
    ...mapGetters({
      userData: 'getUserData',
      userPower: 'getUserPower'
    }),
    userPowerArr () {
      let userPowerArray = []
      Object.keys(this.userPower).map(i => {
        userPowerArray = this.userPower[i]
      })
      // userPowerArray = [2, 3, 4]
      return userPowerArray
    },
    searchBtnAbled () {
      let isAbled = true
      const judgeForm = {
        timeType: String(this.searchForm.timeType),
        time: this.searchForm.timeType === 3 ? this.searchForm.month : this.timeSection || [], // 日期
        shop: String(this.searchForm.shop),
        dataType: this.searchForm.dataType
      }
      isAbled = Object.keys(judgeForm).every(item => {
        return judgeForm[item].length > 0
      })
      return !isAbled
    }
  },
  created () {
    this.getSelectData()
    this.timeTypeChange(1)
  },
  mounted () {
    // 创建水印
    this.$nextTick(() => {
      watermark.set(`${this.userData.staffId}`)
    })
  },
  methods: {
    ...mapMutations({ SAVESHOPID: 'SAVESHOPID', SAVESHOPDATA: 'SAVESHOPDATA' }),
    dealUserPower () {
      Object.keys(this.userPower).map(i => {
        this.userPowerArr = this.userPower[i]
      })
    },
    getSelectData () {
      Promise.all([this._getSelectData(1), this._getCascader(2)]).then(res => {
        this.shopArr = res[0]
        // 缓存当前的所有店铺信息
        this.SAVESHOPDATA(this.shopArr)
        this.searchForm.shop = this.shopArr[0].value || ''
        this.submitForm.shop = this.shopArr[0].value || ''
        this.extendOptions = res[1]
        this.extendOptions[0].children.map(i => {
          this.searchForm.dataType.push([this.extendOptions[0].value, i.value])
        })
        const dataTypeArr = []
        this.searchForm.dataType.map(i => {
          dataTypeArr.push(i[1] || '')
        })
        this.submitForm.dataType = dataTypeArr.join()
        this.submitForm.startDate = this.timeSection[0]
        this.submitForm.endDate = this.timeSection[1]
        this.isShowTable = true
      })
    },
    searchHandle () {
      this.searchClick = true
      const dataTypeArr = []
      this.searchForm.dataType.map(i => {
        dataTypeArr.push(i[1] || '')
      })
      this.submitForm = Object.assign({}, {
        timeType: this.searchForm.timeType,
        startDate: this.timeSection[0] || this.fromatMonth()[0],
        endDate: this.timeSection[1] || this.fromatMonth()[1],
        shop: this.searchForm.shop,
        dataType: dataTypeArr.join() || ''
      })
      if (this.submitForm.timeType === 7) {
        this.submitForm.startDate = monthSpliceDay(this.submitForm.startDate)[0]
        this.submitForm.endDate = monthSpliceDay(this.submitForm.endDate)[1]
      }
      this.cacheTimeSection = [...this.timeSection]
      this.cacheMonth = this.searchForm.month || ''
    },
    tableRender (flag) {
      this.$nextTick(() => {
        this.$store.commit('SETSPINNING', false)
        if (this.searchClick && flag) {
          setTimeout(() => {
            scrollTo(120)
          }, 500)
        }
      })
    },
    confirmCoverDialog (flag) {
      this.confirmCover = flag
    },
    dialogTableRender (flag) {
      if (flag) {
        this.$nextTick(() => {
          this.$store.commit('SETSPINNING', false)
        })
      }
    },
    openMonthDialog (columnKey, columnValue) {
      this.monthDialogTitle = columnValue
      const monthKey = `${columnKey.substr(3, 4)}-${columnKey.substr(7)}`
      const startDate = monthSpliceDay(monthKey)[0]
      const endDate = monthSpliceDay(monthKey)[1]
      this.monthForm = { ...this.submitForm, timeType: 3, startDate: startDate, endDate: endDate }
      this.monthDataShow = true
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
    // 下载模板
    downMold () {
      const src = `${process.env.VUE_APP_API}/mold?user=${this.userData.staffId || ''}&trackId=${this.$store.state.trackId || ''}&permissionsCode=${this.$store.state.permissionsCode || ''}`
      location.href = src
    },
    // 下载报表
    downTable () {
      const dataTypeArr = []
      this.searchForm.dataType.map(i => {
        dataTypeArr.push(i[1] || '')
      })
      const downForm = Object.assign({}, {
        timeType: this.searchForm.timeType,
        startDate: this.timeSection[0] || this.fromatMonth()[0],
        endDate: this.timeSection[1] || this.fromatMonth()[1],
        shop: this.searchForm.shop,
        dataType: dataTypeArr.join() || ''
      })
      if (downForm.timeType === 7) {
        downForm.startDate = monthSpliceDay(downForm.startDate)[0]
        downForm.endDate = monthSpliceDay(downForm.endDate)[1]
      }
      const src = `${process.env.VUE_APP_API}/export?timeType=${downForm.timeType}&startDate=${downForm.startDate}&endDate=${downForm.endDate}&shop=${downForm.shop}&dataType=${downForm.dataType}&trackId=${this.$store.state.trackId || ''}&permissionsCode=${this.$store.state.permissionsCode || ''}&user=${this.userData.staffId || ''}`
      location.href = src
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
          trackId: this.$store.state.trackId || '',
          permissionsCode: this.$store.state.permissionsCode || '',
          user: this.$store.state.userData.staffId || ''
        }
      }).then(res => {
        this.$store.commit('SETSPINNING', false)
        this.fileList = []
        if (res.data.errorCode === 1) {
          this.$message.success('导入成功，汇总数据显示可能会有延迟')
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
@import "~@/common/styles/page-table";
@import "./index";
</style>
