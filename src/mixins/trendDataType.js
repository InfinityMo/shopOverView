import { setTousandNum } from '@/common/utils/funcStore'
const path = 'M551,236.1h-9.5c-2.6,0-4.8,2.1-4.8,4.7v22.6c0,2.6,2.1,4.7,4.8,4.7h9.5c2.6,0,4.8-2.1,4.8-4.7v-22.6C555.7,238.2,553.6,236.1,551,236.1z'
const path2 = 'M543.7,248.1c-0.7,0-1,0.4-1,1.1v5.7c0,0.8,0.3,1.1,1,1.1s1-0.4,1-1.1v-5.7C544.7,248.5,544.4,248.1,543.7,248.1z'
const path3 = 'M548.7,248.1c-0.7,0-1,0.4-1,1.1v5.7c0,0.8,0.3,1.1,1,1.1s1-0.4,1-1.1v-5.7C549.7,248.5,549.4,248.1,548.7,248.1z'
const colorDisk = ['#2D99FF', '#2CD8C5', '#FF6C40', '#FFE700', '#826AF9', '#78D3F8', '#C356CC', '#008685', '#F08BB4', '#65789B']
export default {
  data () {
    return {
      option: {},
      legend: [],
      xAxisData: [],
      serisesData: [],
      isPrecent: 0
    }
  },
  computed: {
    gobalReg () {
      return this.isNormalData ? /^_/ : /^st_/
    },
    datatitle () {
      return this.xAxisData.length > 0 ? `${this.xAxisData[0]}~${this.xAxisData[this.xAxisData.length - 1]}` : ''
    }
  },
  methods: {
    _setchartOptionData () {
      this.xAxisData = []
      this.tempFetchPromot.map((i, index) => {
        if (index === 0) {
          Object.keys(i.obj.data[0]).sort().forEach(k => {
            if (this.gobalReg.test(k)) {
              if (this.isNormalData) {
                if (k.length > 7) {
                  this.xAxisData.push(`${k.substr(1, 4)}-${k.substr(5, 2)}-${k.substr(7)}`)
                } else {
                  this.xAxisData.push(`${k.substr(1, 4)}-${k.substr(5, 2)}`)
                }
              } else {
                this.xAxisData.push(`${k.substr(3, 4)}-${k.substr(7, 2)}`)
              }
            }
          })
        }
        this.listData(i.obj.data)
        this.legend.push(i.obj.name)
      })
      this.setSeries()
      return this._enclosureOPtion()
    },
    listData (list) {
      list.forEach((item, index) => {
        this.isPrecent = item.centesimal
        item.timeDateData = []
        Object.keys(item).forEach(i => {
          if (this.gobalReg.test(i)) {
            if (item[i] === '-') {
              item.timeDateData.push(0)
            } else {
              if (item[i].indexOf('%') >= 0) {
                item.timeDateData.push(Number(item[i].replace(/%/g, '')))
              } else {
                item.timeDateData.push(Number(item[i].replace(/,/g, '')))
              }
            }
          }
        })
      })
    },
    setSeries () {
      const data = []
      this.serisesData = []
      this.tempFetchPromot.forEach(i => {
        data.push(i.obj.data[0])
      })
      data.map((i, index) => {
        this.serisesData.push({
          name: i.promoType,
          type: 'bar',
          barWidth: '13%',
          itemStyle: {
            normal: {
              color: colorDisk[index]
            }
          },
          data: i.timeDateData
        })
      })
    },
    _enclosureOPtion () {
      const that = this
      const chartOption = {
        title: {
          text: `${this.titlePromot}数据对比图`,
          textStyle: {
            color: '#333',
            fontWeight: 'normal',
            fontSize: 18
          }
        },
        tooltip: {
          trigger: 'item',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'none'
          },
          formatter (params) {
            if (that.isPrecent) {
              return `${params.seriesName}<br/>${params.marker}${params.name}：${params.data}%`
            } else {
              return `${params.seriesName}<br/>${params.marker}${params.name}：${setTousandNum(params.data)}`
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '10%',
          containLabel: true
        },
        legend: {
          data: this.legend,
          top: '0',
          right: '10',
          textStyle: {
            color: '#333',
            fontSize: 14
          }
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          axisLine: {
            show: true, // 隐藏X轴轴线
            lineStyle: {
              color: '#333',
              width: 1
            }
          },
          axisTick: {
            show: true // 隐藏X轴刻度
          },
          axisLabel: {
            show: true,
            interval: 0,
            rotate: this.xAxisData.length > 15 ? 45 : 0,
            textStyle: {
              color: '#333', // X轴文字颜色
              fontSize: 12
            }
          }
        },
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333',
              width: 1
            }
          },
          axisLabel: {
            show: true,
            formatter: this.isPrecent ? '{value} %' : '{value}',
            textStyle: {
              color: '#333',
              fontSize: 12
            }
          }
        }],
        dataZoom: [{
          type: 'slider',
          show: true,
          height: 16,
          xAxisIndex: [0],
          bottom: '6',
          left: 90,
          right: 90,
          start: 0,
          end: 100,
          handleIcon: `path://${path}${path2}${path3}`,
          handleSize: '150%',
          handleStyle: {
            borderWidth: 1,
            borderColor: '#90979C',
            color: '#fff'
          },
          textStyle: {
            fontSize: 12,
            color: '#333'
          },
          borderColor: '#90979c'
        }],
        series: this.serisesData
      }
      return chartOption
    }
  }
}
