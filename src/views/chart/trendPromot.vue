<template>
  <div class="trend-wrap">
    <div class="title-wrap flex-between-center">
      <div class="title">{{dateShop}}{{title}}数据趋势图</div>
      <div class="flex-item-center">
        <p>选择数据类型(最多选8种)：</p>
        <el-select class="select"
                   :multiple-limit=8
                   v-model="dataType"
                   multiple
                   collapse-tags
                   placeholder="请选择数据类型"
                   @change="selectChange">
          <el-option v-for="item in promotOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="chart-wrap"
         ref="chart">
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { dealTrendData, setChartOption } from './trendSeting'
import { Base64 } from 'js-base64'
import { mapGetters } from 'vuex'
import watermark from '@/common/utils/watermark'
export default {
  data () {
    return {
      form: {},
      promotId: '',
      nData: '',
      dateShop: '',
      isPrecent: false,
      title: '',
      trendChart: null,
      dataType: [],
      cacheDataType: [],
      promotOptions: [],
      filterData: [], // 当前图表数据源
      tableAllData: []
    }
  },
  computed: {
    ...mapGetters([
      'getUserData',
      'getShopData'
    ])
  },
  created () {
    this.form = JSON.parse(Base64.decode(this.$route.query.form))
    this.promotId = Base64.decode(this.$route.query.promotId) || ''
    this.nData = Base64.decode(this.$route.query.nData) || ''
    this.getChartData()
  },
  mounted () {
    // 创建水印
    this.$nextTick(() => {
      watermark.set(`${this.getUserData.staffId}`, 80)
    })
    // 窗口变化重置图表
    window.addEventListener('resize', this.resizeChart, false)
  },
  methods: {
    getChartData () {
      this.$request.post('/getList', this.form).then(res => {
        this.tableAllData = res.data || []
        // eslint-disable-next-line
        this.filterData = this.tableAllData.filter(i => i.promoID == this.promotId)
        this.title = this.filterData[0].promoType
        this.setPromotOption() // 生成选择数据类型
      })
    },
    setTitle (timeArr) {
      // eslint-disable-next-line eqeqeq
      const target = this.getShopData.filter(i => i.value == this.form.shop)[0]
      if (target) {
        this.dateShop = `${timeArr[0]}~${timeArr[timeArr.length - 1]}—${target.label}—`
      }
    },
    setPromotOption () {
      this.filterData.forEach(i => {
        this.promotOptions.push({
          value: i.dataID,
          label: i.dataType
        })
      })
      if (this.promotOptions.length >= 2) {
        // 默认选择前两项类型
        this.dataType = [this.promotOptions[0].value, this.promotOptions[1].value]
      } else {
        this.dataType = [this.promotOptions[0].value]
      }

      const returnObj = dealTrendData(this.filterData, this.dataType, this.nData)
      this.isPrecent = returnObj.isPrecent
      this.setTitle(returnObj.timeArr)
      this.createChart()
    },
    createChart () {
      this.trendChart = echarts.init(this.$refs.chart)
      this.setChart()
    },
    setChart (trendChart) {
      this.trendChart.setOption({}, true)
      this.trendChart.setOption(setChartOption(this.isPrecent))
    },
    selectChange (value) {
      if (value.length === 1) {
        this.cacheDataType = value
      }
      if (value.length === 0) {
        this.$message.warning('请至少选择一个数据类型')
        this.dataType.push(this.cacheDataType[0])
      }
      const returnObj = dealTrendData(this.filterData, this.dataType, this.nData)
      this.isPrecent = returnObj.isPrecent
      this.setChart()
    },
    resizeChart () {
      this.trendChart.resize()
    }
  },
  beforeRouteLeave (to, from, next) {
    // 页面走掉把事件给清除掉
    window.removeEventListener('resize', this.resizeChart, false)
    next()
  }
}
</script>
<style lang="less" scoped>
@import "./promot";
</style>
