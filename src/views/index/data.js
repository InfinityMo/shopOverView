export const timeTypeArr = [
  {
    value: 0,
    label: '精确日期'
  },
  {
    value: 1,
    label: '最近七天'
  },
  {
    value: 2,
    label: '上周'
  },
  {
    value: 3,
    label: '月度'
  },
  {
    value: 4,
    label: '最近三十天'
  },
  {
    value: 5,
    label: '最近一年'
  },
  {
    value: 6,
    label: '去年'
  },
  {
    value: 7,
    label: '月度范围'
  }
]

export const extendOptions = [
  {
    value: '1',
    label: '淘宝（定向计划）',
    children: [
      {
        value: '1-2',
        label: '店铺总点击（生意参谋）'
      }, {
        value: '1-3',
        label: '付款笔数'
      }, {
        value: '1-4',
        label: 'UV价值'
      }
    ]
  }, {
    value: '5',
    label: '汇总',
    children: [
      {
        value: '5-6',
        label: '店铺总点击（生意参谋）'
      }, {
        value: '5-7',
        label: '付款笔数'
      }, {
        value: '5-8',
        label: 'UV价值'
      }
    ]
  }, {
    value: '9',
    label: '品销宝',
    children: [
      {
        value: '9-10',
        label: '店铺总点击（生意参谋）'
      }, {
        value: '9-11',
        label: '付款笔数'
      }, {
        value: '9-12',
        label: 'UV价值'
      }
    ]
  }
]
export const columns = [
  { key: 'brand', value: '品牌', edit: 0 },
  { key: 'product', value: '产品名称', edit: 0 },
  { key: '_20210201', value: '2021-02-01', edit: 1 },
  { key: '_20210202', value: '2021-02-02', edit: 1 },
  { key: '_20210203', value: '2021-02-03', edit: 1 },
  { key: '_20210204', value: '2021-02-04', edit: 1 },
  { key: '_20210205', value: '2021-02-05', edit: 1 },
  { key: '_20210206', value: '2021-02-06', edit: 1 },
  { key: '_20210207', value: '2021-02-07', edit: 1 },
  { key: '_20210208', value: '2021-02-08', edit: 1 },
  { key: 'sum', value: '总计', edit: 1 }
]
export const table = [{
  dataID: 1,
  cellEdit: 0,
  brand: 'cetaphil/丝塔芙',
  product: '丝塔芙保湿霜550g',
  _20210201: '11,833,525.04',
  _20210202: '123,456,456',
  _20210203: '346,789,436',
  _20210204: '23,567',
  _20210205: '456,789',
  _20210206: '176,789',
  _20210207: '856,789',
  _20210208: '356,789',
  sum: '1,234,325,678'
}, {
  dataID: 2,
  cellEdit: 0,
  brand: 'cetaphil/丝塔芙2',
  product: '2丝塔芙保湿霜550g',
  _20210201: '211,833,525.04',
  _20210202: '2,123,456,456',
  _20210203: '2,346,789,436',
  _20210204: '223,567',
  _20210205: '2,456,789',
  _20210206: '2,176,789',
  _20210207: '2,856,789',
  _20210208: '2,356,789',
  sum: '21,234,325,678'
}]
