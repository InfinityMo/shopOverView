<template>
  <div>
    <!-- <vxe-table border
               show-overflow
               row-key
               show-header-overflow
               highlight-hover-row
               highlight-current-row
               :auto-resize="true"
               :merge-cells="mergeCells"
               :footer-method="tableSummaries"
               keep-source
               show-footer
               @cell-dblclick="cellDbClick"
               :edit-config="{trigger: 'dblclick', mode: 'cell', showStatus: true,showIcon:false}"
               ref="xTable"
               :max-height="calcHeight()">
      <vxe-table-column v-for="col in columns"
                        :key="col.fieldName"
                        :field="col.fieldName"
                        :title="col.title"
                        :fixed="col.fixed"
                        :align="col.align"
                        :edit-render="{ autofocus: '.vxe-input--inner' }"
                        :width="col.width">
        <template v-slot:edit="{ row }">
          <el-input v-if="col.edit"
                    placeholder="请输入"
                    v-focus
                    maxlength='13'
                    @input="tableCellInput($event,row)"
                    @blur="tableCellBlur(row)"
                    v-model="tableCellEditVal">
          </el-input>
          <div v-else
               class="ell">
            <el-tooltip class="item"
                        effect="dark"
                        :content="row[col.fieldName]"
                        placement="top">
              {{row[col.fieldName]}}
            </el-tooltip>
          </div>
        </template>
      </vxe-table-column>
    </vxe-table> -->
    <vxe-table border
               show-overflow
               row-key
               show-header-overflow
               highlight-hover-row
               highlight-current-row
               :auto-resize="true"
               :merge-cells="mergeCells"
               :footer-method="tableSummaries"
               keep-source
               :show-footer="this.tableData.length>0"
               ref="xTable"
               :max-height="calcHeight()">
      <vxe-table-column v-for="col in columns"
                        :key="col.fieldName"
                        :field="col.fieldName"
                        :title="col.title"
                        :fixed="col.fixed"
                        :align="col.align"
                        :width="col.width">
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
import { formatRowspanAndColspan } from './data'
import compontentTable from '@/mixins/compontentTable'
export default {
  mixins: [compontentTable],
  props: {
    form: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      columns: [],
      tableData: [],
      mergeCells: [],
      tableCellOrginVal: '',
      tableCellEditVal: '',
      cellInputWatch: '',
      currentEditCellKey: ''
    }
  },
  computed: {
    // calcHeight () {
    //   let height = 0
    //   const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    //   height = clientHeight - 197
    //   return height
    // }
  },
  watch: {
    tableCellEditVal (val, oldval) {
      this.cellInputWatch = val
    },
    form: {
      handler (val, oldval) {
        this.getColumns().then(res => {
          if (res) {
            this.getTableData()
          }
        })
      },
      deep: true
    }
  },
  created () {
    this.getColumns().then(res => {
      if (res) {
        this.getTableData()
      }
    })
    // console.log(this.form)
    // this.setColumn()
    // this.setTableData()
  },
  mounted () {
    // 当前窗口变化
    // window.onresize = () => {
    //   this.calcHeight()
    //   this.$nextTick(() => {
    //     this.$refs.xTable.recalculate()
    //     this.$emit('tableRender', true)
    //   })
    // }
  },
  methods: {
    calcHeight () {
      let height = 0
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      height = clientHeight - 197
      return height
    },
    getColumns () {
      this.columns = []
      return new Promise((resolve, reject) => {
        this.$store.commit('SETSPINNING', true)
        const submitform = {
          ...this.form,
          brandList: this.form.brandList ? this.form.brandList.join(',') : '',
          channelList: this.form.channelList ? this.form.channelList.join(',') : '',
          itemList: this.form.itemList ? this.form.itemList.join(',') : '',
          start: this.form.dateTime[0],
          end: this.form.dateTime[1]
        }
        delete submitform.dateTime
        this.$request.post('/channelColumn', submitform, true).then(res => {
          if (res) {
            const resData = res.data || []
            this.setColumn(resData)
            this.$store.commit('SETSPINNING', false)
            resolve(true)
          }
        })
      })
    },
    setColumn (column) {
      const leftKey = ['brand', 'link']
      column.forEach(item => {
        this.columns.push({
          fieldName: item.key,
          title: item.value,
          edit: item.edit,
          fixed: this._setFixed(item.key, column.length),
          align: leftKey.includes(item.key) ? 'left' : 'right',
          width: this._setWidth(item.key, column.length)
        })
      })
    },
    getTableData () {
      this.tableData = []
      this.$store.commit('SETSPINNING', true)
      const submitform = {
        ...this.form,
        brandList: this.form.brandList ? this.form.brandList.join(',') : '',
        channelList: this.form.channelList ? this.form.channelList.join(',') : '',
        itemList: this.form.itemList ? this.form.itemList.join(',') : '',
        start: this.form.dateTime[0],
        end: this.form.dateTime[1]
      }
      delete submitform.dateTime
      this.$request.post('/channelList', submitform, true).then(res => {
        const resultData = res.data || []
        this.setTableData(resultData)
        //  通知父组件表格dom已渲染完成
        // this.$nextTick(() => {
        //   this.$emit('tableRender', true)
        // })
      })
    },
    setTableData (resultData) {
      resultData.forEach(item => {
        this.tableData.push(item)
      })
      const formatRow = formatRowspanAndColspan(this.tableData, 'brandId')
      this.formatMerge(formatRow, 0, 1)
      this.$nextTick(() => {
        this.$refs.xTable.reloadData(this.tableData)
        this.$emit('tableRender', true)
      })
      //
    },
    // 合并当前第1列，合并1列
    formatMerge (formatRow, col = 0, colspan = 1) {
      const rowArr = []
      formatRow.forEach(item => {
        if (item.num) {
          rowArr.push(item.num)
        }
      })
      rowArr.reduce((prev, cur) => {
        this.mergeCells.push(
          { row: prev, col: col, rowspan: cur, colspan: colspan }
        )
        return cur + prev
      }, 0)
    },
    tableSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map(item => Number(item[column.property].replace(/,/g, '')))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return Number(Number(prev) + Number(curr)).toFixed(2)
            } else {
              return Number(prev).toFixed(2)
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })
      return [sums]
    },
    cellDbClick (row) {
      if (row.column.property === 'link' || row.column.property === 'brand') {
        this.$refs.xTable.clearActived()
        return false
      }
      row.data[row.$rowIndex].cellEdit = 1
      const cellVal = row.data[row.$rowIndex][row.column.property].replace(/,/g, '')
      if (Number(cellVal)) {
        this.tableCellEditVal = Number(cellVal)
        this.tableCellOrginVal = Number(cellVal)
      } else {
        this.tableCellEditVal = ''
        this.tableCellOrginVal = ''
      }
      this.currentEditCellKey = row.column.property
    },
    cellDblClick () {
      this.$refs.xTable.clearActived()
    },
    tableCellBlur (row) {
      this.$refs.xTable.clearActived()
    },
    tableCellInput (val, row) {
      // const reg = /^\d+(\.\d{0,2})?$/
      this.tableCellEditVal = this.tableCellEditVal.replace(/[^\d|.]/g, '')
      const cellSplit = this.tableCellEditVal.split('.')
      if (cellSplit.length > 2) {
        this.tableCellEditVal = String(this.tableCellEditVal).replace('.', '')
        return
      }
      if (cellSplit.length === 2) {
        if (cellSplit[1].length > 2) {
          if (this.cellInputWatch > this.tableCellEditVal) {
            this.tableCellEditVal = String(this.tableCellEditVal).replace('.', '')
          } else {
            this.tableCellEditVal = this.tableCellEditVal.toString().substr(0, this.tableCellEditVal.toString().length - 1)
          }
        }
      }
    }
  },
  directives: {
    focus: {
      inserted (el, binding, vnode) {
        el.querySelector('input').focus()
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
