export const searchForm = {
  level: '3', // 通道等级
  channelList: [], // 通道
  dateTime: [], // 日期
  brandList: [], // 品牌
  itemList: [], // 单品
  dataType: '1', // 数据类型
  linkList: '' // 商品
}

// 通道等级
export const passageWayOption = [{
  value: '1',
  label: '一级'
}, {
  value: '2',
  label: '二级'
}, {
  value: '3',
  label: '三级'
}, {
  value: '4',
  label: '四级'
}
]

export const dataTypeOption = [
  {
    value: '1',
    label: 'IPVUV&加购uv'
  }, {
    value: '2',
    label: '成交用户数'
  }, {
    value: '3',
    label: '成交件数'
  }, {
    value: '4',
    label: '成交金额'
  }
]
