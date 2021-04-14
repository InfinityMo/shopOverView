<template>
  <div>
    <el-table :data="dealData"
              :row-key="randomKey"
              :max-height="calcHeight()"
              class="standard-table">
      <el-table-column v-for="column in columns"
                       :key="column.dataKey"
                       :label="column.title"
                       :align="column.align||''"
                       :fixed="column.fixed"
                       :width="column.width">
        <template v-slot:header
                  v-if="column.columnRender">
          <operate :render="column.columnRender"
                   :column="column">
          </operate>
        </template>
        <template slot-scope="scope">
          <operate v-if="column.render"
                   :render="column.render"
                   :row="scope.row"
                   :column="column">
          </operate>
          <template v-else>
            <!-- <el-tooltip class="item"
                        effect="dark"
                        placement="top">
              <span class="tool-tip"
                    slot="content"
                    v-if="column.isShowHtml"
                    v-html="scope.row[column.dataKey]"></span>
              <span class="tool-tip"
                    slot="content"
                    v-else>{{scope.row[column.dataKey]}}</span>
              <span class="ell"
                    v-if="column.align"
                    :class="['text-'+column.align]">{{ scope.row[column.dataKey] }}</span>
              <span class="ell"
                    v-else>
                <span v-if="column.isShowHtml"
                      v-html="scope.row[column.dataKey]"></span>
                <span v-else>{{ scope.row[column.dataKey] }}</span>
              </span>
            </el-tooltip> -->
            <span class="ell"
                  v-if="column.align"
                  :class="['text-'+column.align]">{{ scope.row[column.dataKey] }}</span>
            <span class="ell"
                  v-else>
              <span v-if="column.isShowHtml"
                    v-html="scope.row[column.dataKey]"></span>
              <span v-else>{{ scope.row[column.dataKey] }}</span>
            </span>

          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination"
                   v-if="!hidePagination"
                   background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pageChange.pageNum"
                   :page-sizes="[5, 10, 20, 50, 100]"
                   :page-size="pageChange.pageSize"
                   :layout="paginationLayout.join(',')"
                   :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { createUUID } from '@/common/utils/funcStore'
import operate from './operate'
export default {
  components: { operate },
  props: {
    // 表格列
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    // 表格数据源
    dataSource: {
      type: Array,
      required: true,
      default: () => []
    },
    // 表格分页
    pagination: {
      type: Object || Boolean,
      default: () => { }
    },
    // 控制分页显示的组件布局
    paginationLayout: {
      type: Array,
      default: () => ['total', 'prev', 'pager', 'next', 'sizes', 'jumper']
    },
    // 是否隐藏分页
    hidePagination: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const paginationPageSize = this.pagination ? this.pagination.pageSize : 10
    return {
      pageChange: {
        pageNum: 1,
        pageSize: paginationPageSize
      }
    }
  },
  computed: {

    dealData () {
      const isIndex = this.columns.some((item, index) => {
        return item.dataKey === '_index'
      })
      if (isIndex) {
        this.dataSource.forEach((item, index) => {
          this.dataSource[index]._index = (this.pageChange.pageNum - 1) * this.pageChange.pageSize + index + 1
        })
      }
      return this.dataSource
    },
    total () {
      return this.pagination.total || 0
    }
  },
  mounted () { },
  methods: {
    calcHeight () {
      let height = 0
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      height = clientHeight - 230
      return height
    },
    randomKey () {
      return createUUID()
    },
    handleSizeChange (pageSize) {
      this.pageChange.pageSize = pageSize
      // 页数大小发生变化时，手动将当前页设置为1
      this.pageChange.pageNum = 1
      this.$emit('tableChange', this.pageChange)
    },
    handleCurrentChange (pageNum) {
      this.pageChange.pageNum = pageNum
      this.$emit('tableChange', this.pageChange)
    }
  }
}
</script>
<style lang="less" scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-weight: normal;
  padding: 20px 5px;
}
</style>
