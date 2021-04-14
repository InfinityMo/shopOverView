import { setTousandNum } from '@/common/utils/funcStore'
const gobalReg = {
  reg: ''
}
const colorDisk = ['#2D99FF', '#2CD8C5', '#FF6C40', '#FFE700', '#826AF9', '#78D3F8', '#C356CC', '#008685', '#F08BB4', '#65789B']
const chartObj = {
  legend: [],
  timeArr: [],
  seriesData: []
}
export const dealTrendData = (promotData, dataType, nData) => {
  gobalReg.reg = Number(nData) ? /^_/ : /^st_/
  chartObj.legend = []
  chartObj.timeArr = []
  chartObj.seriesData = []
  const selectData = []
  dataType.forEach(i => {
    promotData.map(k => {
      if (k.dataID === i) {
        chartObj.legend.push(k.dataType)
        selectData.push(k)
      }
    })
  })
  selectData.map((item, index) => {
    listData(item)
    if (index === 0) {
      // 将数据的第0个作为当前x轴的坐标系
      Object.keys(item).sort().map(k => {
        if (gobalReg.reg.test(k)) {
          if (Number(nData)) {
            if (k.length > 7) {
              chartObj.timeArr.push(`${k.substr(1, 4)}-${k.substr(5, 2)}-${k.substr(7)}`)
            } else {
              chartObj.timeArr.push(`${k.substr(1, 4)}-${k.substr(5, 2)}`)
            }
          } else {
            chartObj.timeArr.push(`${k.substr(3, 4)}-${k.substr(7, 2)}`)
          }
        }
      })
    }
  })
  // console.log(chartObj.timeArr)
  // 构建series
  createSeries(selectData)
  // -1为无右侧百分比坐标系，不等于1为有百分比坐标系
  const isPrecent = chartObj.seriesData.findIndex(item => item.yAxisIndex === 1)
  return { isPrecent: isPrecent, timeArr: chartObj.timeArr }
  // setChartOption(legend, timeArr, seriesData)
}
const createSeries = (selectData) => {
  selectData.map((item, index) => {
    chartObj.seriesData.push({
      name: item.dataType,
      type: 'line',
      yAxisIndex: item.yIndex, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
      showAllSymbol: true, // 显示所有图形。
      symbolSize: 8, // 标记的大小
      itemStyle: {
        // 折线拐点标志的样式
        color: colorDisk[index],
        borderColor: colorDisk[index],
        width: 2
      },
      lineStyle: {
        color: colorDisk[index],
        width: 2
      },
      data: item.timeDateData
    })
  })
}
const listData = (item) => {
  item.timeDateData = []
  Object.keys(item).forEach(i => {
    if (gobalReg.reg.test(i)) {
      if (item[i] === '-') {
        item.timeDateData.push(0)
      } else {
        if (item[i].indexOf('%') >= 0) {
          item.yIndex = 1
          item.timeDateData.push(Number(item[i].replace(/%/g, '')))
        } else {
          item.yIndex = 0
          item.timeDateData.push(Number(item[i].replace(/,/g, '')))
        }
      }
    }
  })
}

export const setChartOption = (isPrecent) => {
  const trendPromot = {
    grid: {
      top: '10%',
      left: '80',
      bottom: '60',
      right: '80'
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'none'
      },
      formatter (params) {
        if (params.seriesIndex === isPrecent) {
          return `${params.seriesName}<br/>${params.marker}${params.name}：${params.data}%`
        } else {
          return `${params.seriesName}<br/>${params.marker}${params.name}：${setTousandNum(params.data)}`
        }
      }
    },
    legend: {
      data: chartObj.legend,
      top: '0',
      right: '10',
      itemHeight: 20,
      itemWidth: 32,
      // borderWidth: 5,
      textStyle: {
        color: '#333',
        fontSize: 14
      }
    },
    xAxis: {
      boundaryGap: false,
      data: chartObj.timeArr,
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
        rotate: chartObj.timeArr.length > 15 ? 45 : 0,
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
        textStyle: {
          color: '#333',
          fontSize: 12
        }
      }
    },
    {
      type: 'value',
      name: 'yPrecent',
      nameTextStyle: {
        color: '#fff',
        fontSize: 1
      },
      position: 'right',
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: isPrecent !== -1
      },
      axisLabel: {
        show: true,
        formatter: '{value} %', // 右侧Y轴文字显示
        textStyle: {
          color: '#333',
          fontSize: 12
        }
      }
    }
    ],
    series: chartObj.seriesData
  }
  return trendPromot
}
