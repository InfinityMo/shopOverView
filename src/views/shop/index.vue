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
                           v-model="searchForm.shopid">
                  <el-option v-for="item in shopOption"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8"
                    v-show="searchForm.shopid==='-1'">
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
                    v-show="searchForm.shopid!=='-1'">
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
                <span v-show="shopName">{{shopName}}—</span>
                <span>{{timeSelect}}</span>
                <span>{{tipDataName}}</span>
              </p>
            </div>
            <div class="btn-gather">
              <el-button type="primary"
                         @click="downTable">
                <i class="export-icon"></i>下载报表
              </el-button>
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
import { mapGetters } from 'vuex'
import tableMixin from '@/mixins/dealTable'
import { getYesterday, getLastSevenDay } from '@/common/utils/timeCalc'
import watermark from '@/common/utils/watermark'
import { searchForm } from './formData'
import StandardTable from '@/common/components/standardTable.vue'
import { columnsAllShopsData, columnsSingleShopsData } from './columnsData.js'
export default {
  mixins: [tableMixin],
  components: {
    StandardTable
  },
  data () {
    return {
      searchForm: JSON.parse(JSON.stringify(searchForm)),
      shopOption: [],
      columns: [],
      // columnAllShop: columnsSingleShopsData(this.$createElement, this),
      tableData: [],
      shopName: '',
      timeSelect: '',
      tipDataName: ''
    }
  },
  computed: {
    ...mapGetters({
      userData: 'getUserData'
    })

  },
  created () {
    //
    // this.searchForm.shopid = '-1'
    // this.searchForm.date = getYesterday()
    this.getSelectData().then(res => {
      if (res) {
        this.searchForm.shopid = '-1'
        this.searchForm.date = getYesterday()
        this.columns = columnsAllShopsData(this.$createElement, this)
        this.setTable()
        this.getTable()
      }
    })
  },
  mounted () {
    // 创建水印
    this.$nextTick(() => {
      watermark.set(`${this.userData.staffId}`)
    })
  },
  methods: {
    getSelectData () {
      return new Promise((resolve, reject) => {
        this.$request.post('/shopinfo/getAllShopInfo').then(res => {
          if (res) {
            const dropData = res.data || []
            dropData.forEach((i) => {
              this.shopOption.push({
                value: i.shopId,
                label: i.shopName
              })
            })
            this.shopOption.unshift({
              value: '-1',
              label: '全部店铺'
            })
            resolve(true)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    searchHandle () {
      this.setTable()
      this.getTable()
      // this.submitForm = { ...this.searchForm }
    },
    shopChange (value) {
      this.searchForm.date = getYesterday()
      this.searchForm.dateTime = getLastSevenDay()
    },
    setTable () {
      this.columns = []
      this.shopName = this.shopOption.filter(item => item.value === this.searchForm.shopid)[0].label || ''
      if (this.searchForm.shopid === '-1') {
        this.columns = columnsAllShopsData(this.$createElement, this)
        this.timeSelect = this.searchForm.date
        this.tipDataName = '数据'
      } else {
        this.columns = columnsSingleShopsData(this.$createElement, this)
        this.timeSelect = `${this.searchForm.dateTime[0]}~${this.searchForm.dateTime[1]}`
        this.tipDataName = '趋势数据'
      }
    },
    getTable () {
      this.searchForm.shopid === '-1' ? this.getAllShopTable() : this.getSingleShopTable()
    },
    getAllShopTable () {
      this.$request.post('/shopinfo/getsummary', { dataDate: this.searchForm.date }).then(res => {
        // debugger
        if (res) {
          this.tableData = []
          this.tableData = res.data || []
        }
      })
    },
    getSingleShopTable () {
      this.$request.post('/shopinfo/gethistorysummary', {
        shopid: this.searchForm.shopid,
        startDate: this.searchForm.dateTime[0] || '',
        endDate: this.searchForm.dateTime[1] || ''
      }).then(res => {
        this.tableData = []
        this.tableData = res.data || []
      })
    },
    // 下载报表
    downTable () {
      const downForm = Object.assign({}, {
        shopid: this.searchForm.shopid,
        startDate: this.searchForm.shopid === '-1' ? this.searchForm.date || '' : this.searchForm.dateTime[0] || '',
        endDate: this.searchForm.shopid === '-1' ? this.searchForm.date || '' : this.searchForm.dateTime[1] || ''
      })
      const src = `${process.env.VUE_APP_API}/export?shopid=${downForm.timeType}&startDate=${downForm.startDate}&endDate=${downForm.endDate}&trackId=${this.$store.state.trackId || ''}&permissions=${this.$store.state.permissionsCode || ''}&userName=${this.userData.staffId || ''}`
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
