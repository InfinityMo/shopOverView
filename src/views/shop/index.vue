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
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
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
            <div class="flex-item-center">
              <p class="select-tip">
                <span>{{shopName}}—</span>
                <span>{{timeSelect}}</span>
                <span>{{tipDataName}}</span>
              </p>
            </div>
            <div class="btn-gather">
              <el-button type="primary"
                         @click="downTable"><i class="export-icon"></i>下载报表</el-button>
            </div>
          </div>
          <standard-table :dataSource="tableData"
                          :columns="columns"
                          :hidePagination="true" />
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import tableMixin from '@/mixins/dealTable'
import { getYesterday, getLastSevenDay } from '@/common/utils/timeCalc'
import watermark from '@/common/utils/watermark'
// import {getLastSevenDay} from '@/common/utils/timeCalc.js'
import { searchForm, shopOption } from './formData'
import StandardTable from '@/common/components/standardTable.vue'
import { columnsAllShopsData, columnsSingleShopsData, tableData } from './columnsData.js'
export default {
  mixins: [tableMixin],
  components: {
    StandardTable
  },
  data () {
    return {
      searchForm: JSON.parse(JSON.stringify(searchForm)),
      shopOption: shopOption,
      columns: [],
      // columnAllShop: columnsSingleShopsData(this.$createElement, this),
      tableData: tableData,
      shopName: '',
      timeSelect: '',
      tipDataName: ''
    }
  },
  watch: {
    // 'searchForm.shop': {
    //   deep: true,
    //   handler: function (newVal, oldVal) {
    //     this.SAVESHOPID(newVal)
    //   }
    // }
  },
  computed: {
    ...mapGetters({
      userData: 'getUserData'
    })

  },
  created () {
    this.columns = columnsAllShopsData(this.$createElement, this)
    this.searchForm.shop = '-1'
    this.searchForm.date = getYesterday()
    this.setTable()
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
      this.setTable()
      // this.submitForm = { ...this.searchForm }
    },
    shopChange (value) {
      this.searchForm.date = getYesterday()
      this.searchForm.dateTime = getLastSevenDay()
    },
    setTable () {
      this.columns = []
      this.shopName = this.shopOption.filter(item => item.value === this.searchForm.shop)[0].label || ''
      if (this.searchForm.shop === '-1') {
        this.columns = columnsAllShopsData(this.$createElement, this)
        this.timeSelect = this.searchForm.date
        this.tipDataName = '数据'
      } else {
        this.columns = columnsSingleShopsData(this.$createElement, this)
        this.timeSelect = `${this.searchForm.dateTime[0]}~${this.searchForm.dateTime[1]}`
        this.tipDataName = '趋势数据'
      }
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
