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
              <el-form-item label="店铺选择：">
                <el-select placeholder="请选择店铺"
                           popper-class="reset-select"
                           @change="shopChange"
                           v-model="searchForm.shop">
                  <el-option v-for="item in shopOption"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8"
                    v-show="searchForm.shop==='-1'">
              <el-form-item label="日期选择：">
                <el-date-picker v-model="searchForm.date"
                                :editable="false"
                                :clearable="false"
                                :picker-options="pickerOptionsNow"
                                type="date"
                                placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8"
                    v-show="searchForm.shop!=='-1'">
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
            <el-col :span="8"
                    class="search-btn">
              <el-form-item>
                <el-button type="primary"
                           @click="searchHandle">查询</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div class="table-wrap"
             ref="table">
          <div class="flex-between-center table-info">
            <!-- <div class="flex-item-center">
              <p class="select-tip"
                 v-show="timeTypeSelect!==''||shopSelect!==''"><span>{{timeTypeSelect}}</span><em v-show="timeTypeSelect!==''&&shopSelect!==''">，</em><span>{{shopSelect}}</span></p>
            </div> -->
            <div class="btn-gather">
              <el-button type="primary"
                         @click="downTable"><i class="export-icon"></i>下载报表</el-button>
            </div>
          </div>
          <standard-table :dataSource="tableData"
                          :columns="columnAllShop"
                          :hidePagination="true" />
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import tableMixin from '@/mixins/dealTable'
import { getYesterday, getLastSevenDay, monthSpliceDay } from '@/common/utils/timeCalc'
import { scrollTo } from '@/common/utils/funcStore'
import watermark from '@/common/utils/watermark'

// import {getLastSevenDay} from '@/common/utils/timeCalc.js'
import { searchForm, shopOption } from './formData'
import StandardTable from '@/common/components/standardTable.vue'
import { columnsAllShopsData, tableData } from './columnsData.js'
export default {
  mixins: [tableMixin],
  components: {
    StandardTable
    // Table

  },
  data () {
    return {
      searchForm: JSON.parse(JSON.stringify(searchForm)),
      shopOption: shopOption,
      columnAllShop: columnsAllShopsData(this.$createElement, this),
      // columnAllShop: columnsSingleShopsData(this.$createElement, this),
      tableData: tableData
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
      userData: 'getUserData'
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
    this.searchForm.shop = '-1'
    this.searchForm.date = getYesterday()
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
    shopChange (value) {
      this.searchForm.date = getYesterday()
      // this.searchForm.date = ''
      this.searchForm.dateTime = getLastSevenDay()
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
    }

  }
}
</script>
<style lang="less" scoped>
@import "~@/common/styles/page-table";
@import "~@/common/styles/common-page";
@import "./index";
</style>
