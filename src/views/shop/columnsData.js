export const columnsAllShopsData = (h, $this) => [{
  dataKey: 'shopName',
  title: '店铺名称',
  fixed: 'left',
  align: 'left',
  width: 300
}, {
  dataKey: 'payAmt',
  title: '支付金额 （占比）',
  align: 'right',
  width: 225,
  columnRender: () => {
    return (
      <div><span>支付金额</span><span class="column-title-rate">（占比）</span></div>
    )
  },
  render: (h, scoped, row) => {
    return (
      <div>
        <span>{scoped.row.payAmt}</span>
        <span class="column-rate">{(scoped.row.payAmtRatio * 100).toFixed(2)}%</span>
      </div>
    )
  }
}, {
  dataKey: 'payItemQty',
  title: '支付件数 （占比）',
  align: 'right',
  width: 200,
  columnRender: () => {
    return (
      <div><span>支付件数</span><span class="column-title-rate">（占比）</span></div>
    )
  },
  render: (h, scoped, row) => {
    return (
      <div>
        <span>{scoped.row.payItemQty}</span>
        <span class="column-rate">{(scoped.row.payItemQtyRatio * 100).toFixed(2)}%</span>
      </div>
    )
  }
}, {
  dataKey: 'payBuyerCnt',
  title: '支付买家数',
  align: 'right',
  width: 133
}, {
  dataKey: 'payPct',
  title: '客单价',
  align: 'right',
  width: 133
}, {
  dataKey: 'payRate',
  title: '支付转化率',
  align: 'right',
  width: 133
}, {
  dataKey: 'uv',
  title: '访客数',
  align: 'right',
  width: 133
}, {
  dataKey: 'itemUv',
  title: '商品访客数',
  align: 'right',
  width: 133
}, {
  dataKey: 'itemFavBuyerCnt',
  title: '商品收藏人数',
  align: 'right',
  width: 133
}, {
  dataKey: 'addCartBuyerCnt',
  title: '加购人数',
  align: 'right',
  width: 133
}, {
  dataKey: 'addCartItemQty',
  title: '加购件数',
  align: 'right',
  width: 133
}, {
  dataKey: 'p4pExpendAmt',
  title: '直通车消耗',
  align: 'right',
  width: 133
}, {
  dataKey: 'zzExpendAmt',
  title: '钻展位消耗',
  align: 'right',
  width: 133
}, {
  dataKey: 'tkExpendAmt',
  title: '淘宝客佣金',
  align: 'right',
  width: 133
}, {
  dataKey: 'applyRefundAmt',
  title: '申请退款金额',
  align: 'right',
  width: 145
}, {
  dataKey: 'successRefundAmt',
  title: '成功退款金额',
  align: 'right',
  width: 145
}
]
export const columnsSingleShopsData = (h, $this) => [{
  dataKey: 'date',
  title: '日期',
  fixed: 'left',
  align: 'left',
  width: 133
}, {
  dataKey: 'payAmt',
  title: '支付金额 （占比）',
  align: 'right',
  width: 225,
  columnRender: () => {
    return (
      <div><span>支付金额</span><span class="column-title-rate">（占比）</span></div>
    )
  },
  render: (h, scoped, row) => {
    return (
      <div>
        <span>{scoped.row.payAmt}</span>
        <span class="column-rate">{(scoped.row.payAmtRatio * 100).toFixed(2)}%</span>
      </div>
    )
  }
}, {
  dataKey: 'payItemQty',
  title: '支付件数 （占比）',
  align: 'right',
  width: 200,
  columnRender: () => {
    return (
      <div><span>支付件数</span><span class="column-title-rate">（占比）</span></div>
    )
  },
  render: (h, scoped, row) => {
    return (
      <div>
        <span>{scoped.row.payItemQty}</span>
        <span class="column-rate">{(scoped.row.payItemQtyRatio * 100).toFixed(2)}%</span>
      </div>
    )
  }
}, {
  dataKey: 'payBuyerCnt',
  title: '支付买家数',
  align: 'right',
  width: 133
}, {
  dataKey: 'payPct',
  title: '客单价',
  align: 'right',
  width: 133
}, {
  dataKey: 'payRate',
  title: '支付转化率',
  align: 'right',
  width: 133
}, {
  dataKey: 'uv',
  title: '访客数',
  align: 'right',
  width: 133
}, {
  dataKey: 'itemUv',
  title: '商品访客数',
  align: 'right',
  width: 133
}, {
  dataKey: 'itemFavBuyerCnt',
  title: '商品收藏人数',
  align: 'right',
  width: 133
}, {
  dataKey: 'addCartBuyerCnt',
  title: '加购人数',
  align: 'right',
  width: 133
}, {
  dataKey: 'addCartItemQty',
  title: '加购件数',
  align: 'right',
  width: 133
}, {
  dataKey: 'p4pExpendAmt',
  title: '直通车消耗',
  align: 'right',
  width: 133
}, {
  dataKey: 'zzExpendAmt',
  title: '钻展位消耗',
  align: 'right',
  width: 133
}, {
  dataKey: 'tkExpendAmt',
  title: '淘宝客佣金',
  align: 'right',
  width: 133
}, {
  dataKey: 'applyRefundAmt',
  title: '申请退款金额',
  align: 'right',
  width: 145
}, {
  dataKey: 'successRefundAmt',
  title: '成功退款金额',
  align: 'right',
  width: 145
}
]
