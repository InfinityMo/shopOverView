<template>
  <div>
    <div class="trend-wrap">
      <div class="title-wrap flex-between-center">
        <div class="title">{{datatitle}}<br />{{shopTitle}}</div>
        <div class="flex-item-center">
          <el-form label-width="70px"
                   class="flex">
            <el-form-item label="数据类型："
                          class="chart-select">
              <el-select class="select"
                         v-model="dataType"
                         placeholder="请选择数据类型"
                         @change="dataTypeSelectChange">
                <el-option v-for="item in dataTypeOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="推广类型："
                          class="chart-select select-promot">
              <el-select class="select"
                         :multiple-limit=5
                         v-model="promotType"
                         multiple
                         collapse-tags
                         placeholder="请选择推广类型"
                         @change="promotsSelectChange">
                <el-option v-for="item in promotOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="chart-wrap"
           ref="chart">
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { Base64 } from 'js-base64'
import trendDataTypeMix from '@/mixins/trendDataType'
import watermark from '@/common/utils/watermark'
export default {
  mixins: [trendDataTypeMix],
  data () {
    return {
      form: {},
      pkDataFrom: {},
      dataType: '',
      promotType: '',
      dataTypeOptions: [],
      promotOptions: [],
      tableAllData: [],
      tempFetchPromot: [],
      setChartData: [],
      isNormalData: 1,
      trendChart: null,
      chartOption: {}
    }
  },
  computed: {
    ...mapGetters([
      'getUserData',
      'getShopData',
      'getPkCheckData'
    ]),
    shopTitle () {
      const target = this.getShopData.filter(i => i.value === this.form.shop)[0]
      return target ? target.label : ''
    },
    titlePromot () {
      const target = this.dataTypeOptions.filter(i => i.value === this.dataType)[0]
      return target ? target.label : ''
    }
  },
  created () {
    this.form = JSON.parse(Base64.decode(this.$route.query.form))
    this.pkDataFrom = JSON.parse(Base64.decode(this.$route.query.pkDataFrom))
    this.getChartData()
  },
  mounted () {
    this.setDataTypeOption()
    this.setPromotOption()
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
        // this.fetchData()
        this.initChart()
      })
    },
    setDataTypeOption () {
      this.dataTypeOptions = this.getPkCheckData.pkDataTypeArr
      this.dataType = this.pkDataFrom.dataType
    },
    setPromotOption () {
      this.promotOptions = this.getPkCheckData.pkPromotArr
      this.promotType = this.pkDataFrom.promot
    },
    dataTypeSelectChange (value) {
      this.promotType = []
      this.promotOptions = []
      this.tableAllData.forEach(item => {
        if (item.dataID === this.dataType) {
          if (!this.promotOptions.find(i => i.value === item.promoID)) {
            this.promotOptions.push({
              value: item.promoID,
              label: item.promoType
            })
          }
        }
      })
    },
    promotsSelectChange (value) {
      // 选择了推广类型
      if (this.promotType.length > 0) {
        this.createChart()
      }
    },
    fetchData () {
      this.tempFetchPromot = []
      this.promotType.forEach(i => {
        this.tempFetchPromot.push({
          value: i,
          obj: {}
        })
      })
      this.tempFetchPromot.map(item => {
        item.obj.data = []
        this.tableAllData.forEach((i, index) => {
          if (index === 0) this.formatDateTime(i)
          if (i.promoID === item.value) {
            if (i.dataID === this.dataType) {
              item.obj.name = i.promoType
              item.obj.data.push(i)
            }
          }
        })
      })
      this.chartOption = this._setchartOptionData()
    },
    formatDateTime (item) {
      const dateType = Object.keys(item).findIndex(i => {
        return /^_/.test(i)
      })
      // 非年度数据,为1时，说明时非年度数据，为0时年度数据
      this.isNormalData = dateType >= 0 ? 1 : 0
    },
    initChart () {
      this.$nextTick(() => {
        this.trendChart = echarts.init(this.$refs.chart)
      })
      this.createChart()
    },
    async createChart () {
      await this.fetchData()
      this.trendChart.setOption({}, true)
      this.trendChart.setOption(this.chartOption)
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
