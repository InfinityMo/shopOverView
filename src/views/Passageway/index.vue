<template>
  <div class="page">
    <div class="main-wrap">
      <div class="main-content">
        <div class="search-wrap">
          <el-form class="search-form-inline"
                   :model="searchForm"
                   id="form"
                   ref="searchForm"
                   label-width="90px">
            <el-col :span="8">
              <el-form-item label="通道等级："
                            prop="level">
                <el-select placeholder="请选择通道等级"
                           popper-class="reset-select"
                           @change="levelChange"
                           v-model="searchForm.level">
                  <el-option v-for="item in passageWayOption"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="通道选择："
                            prop="channelList">
                <el-cascader placeholder="请选择通道"
                             v-model="searchForm.channelList"
                             :options="channelOptions"
                             :props="{ multiple: true }"
                             collapse-tags
                             clearable>
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="日期选择：">
                <el-date-picker v-model="searchForm.dateTime"
                                :editable="false"
                                :clearable="false"
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
            </el-col>
            <el-col :span="8">
              <el-form-item label="品牌选择："
                            prop="brandList">
                <el-select placeholder="请选择品牌"
                           popper-class="reset-select"
                           v-model="searchForm.brandList">
                  <el-option v-for="item in brandOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品选择："
                            prop="itemList">
                <el-select placeholder="请选择商品"
                           popper-class="reset-select"
                           v-model="searchForm.itemList">
                  <el-option v-for="item in productOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="数据类型："
                            prop="dataType">
                <el-select placeholder="请选择数据类型"
                           popper-class="reset-select"
                           v-model="searchForm.dataType">
                  <el-option v-for="item in dataTypeOption"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="链接名称/Id："
                            prop="linkList">
                <!-- <el-select v-model="searchForm.linkList"
                           filterable
                           placeholder="请输入链接名称或Id">
                  <el-option v-for="item in restaurants"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select> -->
                <el-select v-model="searchForm.linkList"
                           filterable
                           remote
                           placeholder="请输入链接名称或Id"
                           :remote-method="remoteMethod">
                  <el-option v-for="item in linkSearchOption"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
                <!-- <el-autocomplete v-model="searchForm.linkList"
                                 :trigger-on-focus="false"
                                 :fetch-suggestions="querySearch"
                                 placeholder="请输入链接名称或Id">
                                 </el-autocomplete> -->
              </el-form-item>
            </el-col>
            <el-col :span="8"
                    class="search-btn">
              <el-form-item>
                <el-button @click="_resetForm('searchForm')">重置</el-button>
                <el-button type="primary"
                           @click="searchHandle">查询</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div class="table-wrap"
             ref="table">
          <div class="flex-between-center table-info">
            <div class="flex-item-center">
              <p class="select-tip"
                 v-show="timeTypeSelect!==''||shopSelect!==''"><span>{{timeTypeSelect}}</span><em v-show="timeTypeSelect!==''&&shopSelect!==''">，</em><span>{{shopSelect}}</span></p>
            </div>
            <div class="btn-gather">
              <el-button type="primary"
                         @click="downTable"><i class="export-icon"></i>下载报表</el-button>
            </div>
          </div>
          <!-- <Table :form="submitForm"
                 @monthDialog="openMonthDialog"
                 @tableRender="tableRender" /> -->
          <!-- <Table  /> -->
          <Vtable @tableRender="tableRender"
                  :form="submitForm" />
        </div>
      </div>
    </div>
    <!-- <el-dialog custom-class="journal-dialog"
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
    </el-dialog> -->
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
import tableMixin from '@/mixins/dealTable'
import { monthSpliceDay, getLastSevenDay } from '@/common/utils/timeCalc'
import { scrollTo } from '@/common/utils/funcStore'
import watermark from '@/common/utils/watermark'
import { timeTypeArr } from '../index/data'
// import Table from '../index/table'
import Vtable from '@/components/Vtable'
// import {getLastSevenDay} from '@/common/utils/timeCalc.js'
import { searchForm, passageWayOption, dataTypeOption } from './formData'
export default {
  mixins: [tableMixin],
  components: {
    // Table
    Vtable
  },
  data () {
    return {
      // userPowerArr: [],
      searchForm: JSON.parse(JSON.stringify(searchForm)),
      timeSection: [], // 时间范围
      submitForm: {
        level: '3', // 通道等级
        channelList: [], // 通道
        start: '',
        end: '',
        dateTime: getLastSevenDay(), // 日期
        brandList: [], // 品牌
        itemList: [], // 单品
        dataType: '1', // 数据类型
        linkList: '' // 商品
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
      confirmCover: false,
      // 通道
      passageWayOption: passageWayOption,
      dataTypeOption: dataTypeOption,
      channelOptions: [],
      brandOptions: [],
      productOptions: [],
      linkSearchOption: [],
      restaurants: []
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
    })
    // userPowerArr () {
    //   let userPowerArray = []
    //   Object.keys(this.userPower).map(i => {
    //     userPowerArray = this.userPower[i]
    //   })
    //   // userPowerArray = [2, 3, 4]
    //   return userPowerArray
    // }
    // searchBtnAbled () {
    //   let isAbled = true
    //   const judgeForm = {
    //     timeType: String(this.searchForm.timeType),
    //     time: this.searchForm.timeType === 3 ? this.searchForm.month : this.timeSection || [], // 日期
    //     shop: String(this.searchForm.shop),
    //     dataType: this.searchForm.dataType
    //   }
    //   isAbled = Object.keys(judgeForm).every(item => {
    //     return judgeForm[item].length > 0
    //   })
    //   return !isAbled
    // }
  },
  created () {
    this.getSelectData()
    this.searchForm.dateTime = getLastSevenDay()
  },
  mounted () {
    // 创建水印
    this.$nextTick(() => {
      watermark.set(`${this.userData.staffId}`)
    })
  },
  methods: {
    ...mapMutations({ SAVESHOPID: 'SAVESHOPID', SAVESHOPDATA: 'SAVESHOPDATA' }),
    getSelectData () {
      // 0品牌 1单品 2链接
      // , this._getCascader(this.searchForm.level, 3)
      Promise.all([this._getSelectData(0), this._getSelectData(1), this._getSelectData(2), this._getCascader(this.searchForm.level, 3)]).then(res => {
        this.brandOptions = res[0]
        this.productOptions = res[1]
        this.restaurants = res[2]
        this.channelOptions = res[3]
        // this.shopArr = res[0]
        // 缓存当前的所有店铺信息
        // this.SAVESHOPDATA(this.shopArr)
        // this.searchForm.shop = this.shopArr[0].value || ''
        // this.submitForm.shop = this.shopArr[0].value || ''
        // this.channelOptions = res[1]
        // this.extendOptions[0].children.map(i => {
        //   this.searchForm.dataType.push([this.extendOptions[0].value, i.value])
        // })
        // const dataTypeArr = []
        // this.searchForm.dataType.map(i => {
        //   dataTypeArr.push(i[1] || '')
        // })
        // this.submitForm.dataType = dataTypeArr.join()
        // this.submitForm.startDate = this.timeSection[0]
        // this.submitForm.endDate = this.timeSection[1]
        // this.isShowTable = true
      })
    },
    searchHandle () {
      this.submitForm = { ...this.searchForm }
    },
    tableRender (flag) {
      this.$nextTick(() => {
        this.$store.commit('SETSPINNING', false)
        if (flag) {
          setTimeout(() => {
            // const top = document.body.scrollTop || document.documentElement.scrollTop
            scrollTo(screen.height < 1080 ? 140 : 120)
          }, 500)
        }
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.linkSearchOption = this.restaurants.filter(item => {
          return (item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) || item.value.toLowerCase().indexOf(query.toLowerCase()) >= 0
        })
      } else {
        this.linkSearchOption = []
      }
    },
    levelChange (value) {
      this.searchForm.channelList = []
      this.channelOptions = []
      this._getCascader(value, 3).then(res => {
        this.channelOptions = res
      })
    },
    // querySearch (queryString, cb) {
    //   const restaurants = this.restaurants
    //   const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
    //   debugger
    //   // 调用 callback 返回建议列表的数据
    //   cb(results[0].la)
    // },
    // createFilter (queryString) {
    //   return (restaurant) => {
    //     return (restaurant.label.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
    //   }
    // },
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
@import "~@/common/styles/common-page";
</style>
