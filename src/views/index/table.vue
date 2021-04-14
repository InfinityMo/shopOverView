<template>
  <div>
    <el-form :model="editTable"
             ref="editTable">
      <!-- 结尾处有总计 -->
      <el-table :data="tableData"
                class="custom-table"
                :span-method="rowMerge"
                border
                :key="tableRandomKey"
                :max-height="calcHeight"
                @cell-dblclick="cellDbClick">
        <el-table-column v-for="cloumn in columns"
                         :fixed="cloumn.isFixed"
                         :width="cloumn.width"
                         :resizable="false"
                         :align="cloumn.align"
                         :key="cloumn.key"
                         :prop="cloumn.key"
                         :label="cloumn.value">
          <!-- 插槽-自定义表头 -->
          <!-- <template v-slot:header>
            <div class="reset-header"
                 :class="{'flex-item-center flex-between':userPowerArr.includes(4)&&cloumn.edit}">
              <span class="flex-item-center"
                    v-if="userPowerArr.includes(4)&&cloumn.edit&&tableData.length>0">
                <i class="edit-success-icon"
                   @click="submitData(index)"
                   v-if="cloumn.isEdit"></i>
                <i class="edit-icon"
                   @click="toEdit(index)"
                   v-else></i>
              </span>
              <span @click="viewMonthData(cloumn.key,cloumn.value)"
                    v-if="isViewMonth&&cloumn.edit&&tableData.length>0"
                    class="view-month"
                    :class="{'fontBold':cloumn.bold}">{{cloumn.value}}</span>
              <span v-else
                    :class="{'fontBold':cloumn.bold}">{{cloumn.value}}</span>
              <i @click="pkDataType"
                 v-if="cloumn.key==='dataType'&&tableData.length>0"
                 class="data-pk-icon"></i>
            </div>
          </template> -->
          <!-- 插槽-自定义表格 -->
          <template slot-scope="scope">
            <div v-if="cloumn.key===currentEditCellKey&&cloumn.edit&&scope.row.cellEdit"
                 class="has-input">
              <!-- <el-input placeholder="请输入"
                        v-focus
                        maxlength=13
                        @keydown.native="tableCellKeyDown($event)"
                        @input="tableCellInput($event,scope.row)"
                        @blur="tableCellBlur(scope.row)"
                        v-model="tableCellEditVal">
              </el-input> -->
              <el-input placeholder="请输入"
                        v-focus
                        maxlength=13
                        @input="tableCellInput($event,scope.row)"
                        @blur="tableCellBlur(scope.row)"
                        v-model="tableCellEditVal">
              </el-input>
              <!-- <div @dblclick="tableCellEdit(scope.row)">{{scope.row[cloumn.key]}}</div> -->
              <!-- <el-form-item :prop="cloumn.key+scope.$index+'.updateData'"
                            class="table-input"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' },
                            { pattern: /^\d+(\.\d{0,2})?$/, message: '请输入正确的数字', trigger: 'blur' },
                            {max: 13 , message: '最大长度13位', trigger: 'blur' }]">
                <div class="input-wrap">
                  <el-input placeholder="请输入"
                            :class="{'input-indent':scope.row.dataID === 3}"
                            v-model="editTable[cloumn.key+scope.$index].updateData"></el-input>
                  <span v-if="scope.row.dataID === 3">%</span>
                </div>
              </el-form-item> -->
            </div>
            <div v-else
                 class="normal-cell">
              <div>{{scope.row[cloumn.key]}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="flex-end pagination-wrap">
      <el-pagination background
                     v-if="tableTotal>0"
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :key="paginationKey"
                     @current-change="currentChange"
                     :current-page="currentPage"
                     :total="tableTotal">
      </el-pagination>
    </div>
    <el-dialog custom-class="journal-dialog edit-pwd"
               title="数据选择"
               width="432px"
               top="40px"
               :modal="true"
               v-if="pkDataShow"
               :close-on-click-modal="false"
               @close="pkDataDialogClose"
               :visible.sync="pkDataShow">
      <el-form label-width="81px"
               :model="pkDataFrom"
               :rules="pkDataFromRules"
               ref="pkDataFrom">
        <el-form-item label="数据类型："
                      prop="dataType">
          <el-select placeholder="请选择数据类型"
                     popper-class="dialog-select"
                     v-model="pkDataFrom.dataType"
                     @change="dataTypeChange">
            <el-option v-for="item in pkDataTypeArr"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推广工具："
                      prop="promot">
          <el-select placeholder="请选择推广工具"
                     popper-class="dialog-select"
                     v-model="pkDataFrom.promot"
                     multiple
                     collapse-tags
                     :multiple-limit=5
                     :disabled="!Boolean(String(pkDataFrom.dataType)) ">
            <el-option v-for="item in pkPromotArr"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer user-edit">
        <el-button @click="pkDataDialogClose">取 消</el-button>
        <el-button type="primary"
                   @click="pkDataHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { createUUID } from '@/common/utils/funcStore'
import { mapMutations, mapGetters } from 'vuex'
import { columns, table } from './data'
export default {
  props: {
    form: {
      type: Object,
      default: () => { }
    },
    monthDialogBoolean: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      columns: columns,
      tableData: table,
      columnKeyArr: [], // 当前column的所有集合
      editTable: {},
      promotIdArr: [],
      filterLength: 0,
      isViewMonth: false,
      tableKey: 1,
      isShowTable: false,
      tableTotal: 0,
      currentPage: 1,
      pageSize: 2,
      allPromotId: [],
      tableRandomKey: 1,
      paginationKey: 1,
      currentEditIndex: null,
      pkDataShow: false,

      pkDataTypeArr: [],
      pkPromotArr: [],
      // 通道
      tableCellOrginVal: '',
      tableCellEditVal: '',
      cellInputWatch: '',
      currentEditCellKey: '',
      keyDownFlag: false
    }
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
        // 判断表格数据为月份
        // this.isViewMonth = !!(val.timeType === 5 || val.timeType === 6 || val.timeType === 7)
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'getCacheData'
    ]),
    calcHeight () {
      let height = 0
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      height = clientHeight - 165
      return height
    }
  },
  created () {

  },
  methods: {
    ...mapMutations({ SAVECACHEDATA: 'SAVECACHEDATA', SAVEPKCHECKDATA: 'SAVEPKCHECKDATA' }),
    getColumns () {
      this.columns = []
      this.columnKeyArr = []
      return new Promise((resolve, reject) => {
        this.$store.commit('SETSPINNING', true)
        this.$request.post('/getColumn', this.form, true).then(res => {
          if (res) {
            const resData = res.data || []
            resData.forEach(i => {
              i.isEdit = false
              if (i.edit) {
                this.columnKeyArr.push(i.key)
              }
              if (i.key === 'promoType' || i.key === 'dataType') {
                i.isFixed = true
                i.align = 'left'
                if (i.key === 'promoType') {
                  i.width = '173'
                }
                if (i.key === 'dataType') {
                  i.width = '196'
                }
              } else {
                if (i.key === 'yearCompare' || i.key === 'monthCompare') {
                  i.width = '128'
                } else {
                  const clientHeight = document.documentElement.clientWidth || document.body.clientWidth
                  if (clientHeight < 1920) {
                    if (resData.length > 8) {
                      i.width = '153'
                    } else {
                      if (this.monthDialogBoolean) {
                        i.width = '153'
                      }
                    }
                  } else {
                    if (resData.length > 11) {
                      i.width = '153'
                    } else {
                      if (this.monthDialogBoolean) {
                        i.width = '153'
                      }
                    }
                  }
                }
                i.align = 'right'
                i.isFixed = false
              }
              this.columns.push(i)
            })
            this.$store.commit('SETSPINNING', false)
            resolve(true)
          }
        })
      })
    },
    getTableData (isTurnPage = false) {
      this.tableAllData = []
      this.tableData = []
      this.promotIdArr = []
      if (!isTurnPage) {
        this.currentPage = 1
      }
      this.$store.commit('SETSPINNING', true)
      this.$request.post('/getList', this.form, true).then(res => {
        this.tableAllData = res.data || []
        const newArr = this.formatRowspanAndColspan(this.tableAllData, 'promoID')
        this.allPromotId = []
        if (newArr.length > 0) {
          newArr.map(i => {
            if (i.num > 0) {
              this.allPromotId.push(i)
            }
          })
        }
        this.tableTotal = this.allPromotId.length || 0
        this.scliceTableData()
        this.tableData.map(i => {
          this.promotIdArr.push(i.promoID)
        })
        // 刷新table dom
        //  通知父组件表格dom已渲染完成
        this.$nextTick(() => {
          this.$emit('tableRender', true)
        })
      })
    },
    toEdit (index) {
      this.currentEditIndex = index
      // 每次编辑一行
      const columnsLen = this.columns.length
      for (let k = 0; k < columnsLen; k++) {
        if (this.columns[k].edit) {
          this.columns[k].isEdit = false
        }
      }
      const target = this.columns[index]
      target.isEdit = true
      if (this.columnKeyArr.length > 0) {
        const columnKey = target.key
        const cacheArr = []
        this.editTable = {}
        const len = this.tableData.length
        for (let i = 0; i < len; i++) {
          const item = this.tableData[i]
          if (item.cellEdit) {
            if (item.promoID === 1 && item.dataID === 3) {
              // 缓存当前列可编辑的数据
              cacheArr.push({
                dataID: item.dataID,
                cacheKey: columnKey + i,
                updateData: isNaN(String(Number(item[columnKey].replace(/%/g, '')))) ? '0' : String(Number(item[columnKey].replace(/%/g, '')))
              })
              this.$set(this.editTable, columnKey + i, {
                updateDate: columnKey,
                promoID: item.promoID,
                dataID: item.dataID,
                dataType: item.dataType,
                updateData: isNaN(String(Number(item[columnKey].replace(/%/g, '')))) ? '0' : String(Number(item[columnKey].replace(/%/g, '')))
              })
            } else {
              // 缓存当前列可编辑的数据
              cacheArr.push({
                dataID: item.dataID,
                cacheKey: columnKey + i,
                updateData: isNaN(String(parseInt(item[columnKey].replace(/,/g, '')))) ? '0' : String(parseInt(item[columnKey].replace(/,/g, '')))
              })
              this.$set(this.editTable, columnKey + i, {
                updateDate: columnKey,
                promoID: item.promoID,
                dataID: item.dataID,
                dataType: item.dataType,
                updateData: isNaN(String(parseInt(item[columnKey].replace(/,/g, '')))) ? '0' : String(parseInt(item[columnKey].replace(/,/g, '')))
              })
            }
          }
        }
        this.SAVECACHEDATA(cacheArr)
      }
    },
    submitData (editIndexKey, isTurnPage = false) {
      return new Promise((resolve) => {
        this.$refs.editTable.validate((valid) => {
          if (valid) {
            const copyEdittable = JSON.parse(JSON.stringify(this.editTable))
            // 如果缓存的当前列为空，则当前整列为不可编辑。
            if (this.getCacheData.length > 0) {
              Object.keys(this.editTable).forEach(eachKey => {
                const target = this.getCacheData.filter(i => i.cacheKey === eachKey)
                if (target.length > 0) {
                  if (this.editTable[eachKey].updateData === target[0].updateData) {
                    delete copyEdittable[eachKey]
                  }
                }
              })
            }
            if (Object.keys(copyEdittable).length > 0) {
              const submitArr = []
              Object.keys(copyEdittable).map(key => {
                if (copyEdittable[key].dataID === 3) {
                  copyEdittable[key].updateData /= 100
                }
                submitArr.push(copyEdittable[key])
              })
              this.$request.post('/edit', {
                shop: this.form.shop,
                dataJson: JSON.stringify(submitArr)
              }).then(res => {
                if (res.errorCode === 1) {
                  if (res.data) {
                    resolve(false)
                    this.$message.warning(res.data)
                  } else {
                    resolve(true)
                    this.editTable = {}
                    this.SAVECACHEDATA([])
                    this.$message.success('保存成功，汇总数据显示可能会有延迟')
                    if (!isTurnPage) {
                      this.getColumns()
                      this.getTableData()
                    }
                  }
                }
              })
            } else {
              // 不保存取消编辑
              const target = this.columns[editIndexKey]
              target.isEdit = false
              resolve(true)
            }
          } else {
            this.$message.warning('当前有未填写的数据，请检查后提交')
            resolve(false)
            return false
          }
        })
      })
    },
    viewMonthData (columnKey, columnValue) {
      this.$emit('monthDialog', columnKey, columnValue)
    },
    // tableRowClassName ({ row, rowIndex }) {
    //   const newArr = this.formatRowspanAndColspan(this.tableData, 'promoID')
    //   const indexArr = []
    //   newArr.map(i => {
    //     if (i.num > 0) {
    //       indexArr.push(i.num)
    //     }
    //   })
    // },
    // 合并行

    formatRowspanAndColspan (tableData, tableKey) {
      const newArr = []
      // 分类检出tempList中的数据push到newArr中
      for (let i = 0; i < tableData.length;) {
        let count = 0
        for (let j = i; j < tableData.length; j++) {
          if (tableKey === 'promoID') {
            if (tableData[i].promoID === tableData[j].promoID) {
              count++
            }
          }
        }
        if (tableKey === 'promoID') {
          newArr.push({
            data: tableData[i].promoID,
            num: count
          })
        }
        i += count
      }
      // 格式化newArr中的数据
      for (let k = 0; k < newArr.length; k++) {
        if (newArr[k].num > 1 || newArr[k].num === 0) {
          for (let w = k; w < newArr[k].num + k - 1; w++) {
            newArr.splice(w + 1, 0, {
              data: newArr[k].data,
              num: 0
            })
          }
        }
      }
      return newArr
    },
    rowMerge ({ row, column, rowIndex, columnIndex }) {
      // 合并第一列
      const newArr = this.formatRowspanAndColspan(this.tableData, 'promoID')
      if (columnIndex === 0) {
        const num = newArr[rowIndex].num
        if (num > 1) {
          return {
            rowspan: num,
            colspan: 1
          }
        } else if (num < 1) {
          return {
            rowspan: 1,
            colspan: num
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    },
    judgeEditCache () {
      return new Promise((resolve, reject) => {
        const copyEdittable = JSON.parse(JSON.stringify(this.editTable))
        // 如果缓存的当前列为空，则当前整列为不可编辑。
        if (this.getCacheData.length > 0) {
          Object.keys(this.editTable).forEach(eachKey => {
            const target = this.getCacheData.filter(i => i.cacheKey === eachKey)
            if (target.length > 0) {
              if (this.editTable[eachKey].updateData === target[0].updateData) {
                delete copyEdittable[eachKey]
              }
            }
          })
        }
        const submitArr = []
        if (Object.keys(copyEdittable).length > 0) {
          Object.keys(copyEdittable).map(key => {
            if (copyEdittable[key].dataID === 3) {
              copyEdittable[key].updateData /= 100
            }
            submitArr.push(copyEdittable[key])
          })
        }
        resolve(submitArr.length > 0)
      })
    },
    currentChange (pageNum) {
      this.pageNumChange(pageNum)
    },
    scliceTableData () {
      if (this.currentPage === 1) {
        this.tableAllData.slice(0, this.allPromotId.slice(0, this.pageSize).reduce((prev, cur) => prev + cur.num, 0)).forEach(i => {
          this.tableData.push(i)
        })
      } else {
        const sliceStatr = this.allPromotId.slice(0, (this.currentPage - 1) * this.pageSize).reduce((prev, cur) => prev + cur.num, 0)
        const sliceEnd = this.allPromotId.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize).reduce((prev, cur) => prev + cur.num, 0)
        this.tableAllData.slice(sliceStatr, sliceStatr + sliceEnd).forEach(i => {
          this.tableData.push(i)
        })
      }
    },
    async turnPage (pageNum) {
      this.$store.commit('SETSPINNING', true)
      this.tableRandomKey = createUUID()
      const columnsLen = this.columns.length
      for (let k = 0; k < columnsLen; k++) {
        if (this.columns[k].edit) {
          this.columns[k].isEdit = false
        }
      }
      this.editTable = {}
      this.SAVECACHEDATA([])
      this.currentPage = pageNum
      this.tableData = []
      await this.scliceTableData()
      this.$nextTick(() => {
        this.$store.commit('SETSPINNING', false)
      })
    },
    pageNumChange (pageNum) {
      this.judgeEditCache().then(res => {
        if (res) {
          this.$emit('confirmCoverDialog', true)
          this.$confirm('当前有未保存的数据，请确认是否保存', '提示', {
            closeOnClickModal: false,
            distinguishCancelAndClose: true,
            confirmButtonText: '保存',
            cancelButtonText: '放弃修改'
          }
          ).then(() => {
            this.$emit('confirmCoverDialog', false)
            // 保存数据
            this.submitData(this.currentEditIndex, true).then(res => {
              if (res) {
                this.currentPage = pageNum
                this.getColumns()
                this.getTableData(true)
              } else {
                this.paginationKey = createUUID()
              }
            })

            //
          }).catch(() => {
            this.$emit('confirmCoverDialog', false)
            this.currentPage = pageNum
            this.turnPage(pageNum)
          })
        } else {
          this.turnPage(pageNum)
        }
      })
    },

    // 比对同数据类型的不同推广工具
    pkDataType () {
      this.pkDataShow = true
      this.pkDataTypeArr = []
      this.tableAllData.forEach(item => {
        if (!this.pkDataTypeArr.find(i => i.value === item.dataID)) {
          this.pkDataTypeArr.push({
            value: item.dataID,
            label: item.dataType
          })
        }
      })
    },
    dataTypeChange (value) {
      this.pkDataFrom.promot = []
      this.pkPromotArr = []
      this.tableAllData.forEach(item => {
        if (item.dataID === this.pkDataFrom.dataType) {
          if (!this.pkPromotArr.find(i => i.value === item.promoID)) {
            this.pkPromotArr.push({
              value: item.promoID,
              label: item.promoType
            })
          }
        }
      })
    },

    pkDataDialogClose () {
      this.pkDataShow = false
      this.pkDataTypeArr = []
      this.pkPromotArr = []
      this.$refs.pkDataFrom.resetFields()
    },
    cellDbClick (row, column, cell, event) {
      this.tableData.forEach(item => {
        item.cellEdit = 0
      })
      row.cellEdit = 1
      const cellVal = row[column.property].replace(/,/g, '')
      if (Number(cellVal)) {
        this.tableCellEditVal = Number(cellVal)
        this.tableCellOrginVal = Number(cellVal)
      } else {
        this.tableCellEditVal = ''
        this.tableCellOrginVal = ''
      }

      this.currentEditCellKey = column.property
    },
    // 通道
    tableCellEdit (cloumn, row) {
      if (!cloumn.edit) return false
      // debugger
      // row.cellEdit = true
      // this.$forceUpdate()
    },
    tableCellBlur (row) {
      row.cellEdit = 0
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
    },
    tableSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property].replace(/,/g, '')))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
    // tableCellInput (val, row) {
    //   const reg = /^\d+(\.\d{0,2})?$/
    //   const cellSplit = this.tableCellEditVal.split('.')
    //   if (cellSplit.length > 2) {
    //     this.tableCellEditVal = String(this.tableCellEditVal).replace('.', '')
    //     return
    //   }
    //   if (cellSplit.length === 2) {
    //     if (cellSplit[1].length > 2) {
    //       if (this.cellInputWatch > this.tableCellEditVal) {
    //         this.tableCellEditVal = String(this.tableCellEditVal).replace('.', '')
    //       } else {
    //         this.tableCellEditVal = this.tableCellEditVal.toString().substr(0, this.tableCellEditVal.toString().length - 1)
    //       }
    //     }
    //   }
    //   // debugger
    //   if (!this.keyDownFlag) {
    //     this.tableCellEditVal = this.cellInputWatch
    //     if (cellSplit.length > 2) {
    //       this.tableCellEditVal = String(this.tableCellEditVal).replace('.', '')
    //     }
    //   } else {
    //     if (!reg.test(this.tableCellEditVal)) {
    //       // debugger
    //       if (this.tableCellEditVal) {
    //         this.tableCellEditVal = Number(this.tableCellEditVal.toString().substr(0, this.tableCellEditVal.toString().length - 1))
    //       }
    //     }
    //     //  else {
    //     //   if (/^0/.test(this.tableCellEditVal)) {
    //     //     this.tableCellEditVal = this.tableCellEditVal.toString().substr(1, this.tableCellEditVal.toString().length)
    //     //   }
    //     // }
    //   }
    // },
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
@import "./table";
</style>
