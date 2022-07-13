<template>
  <div class="ct-wrap">
    <div class="table-wrap">
      <el-table v-loading="mainState.loading" :data="mainState.list" style="width: 100%">
        <el-table-column v-if="showSelection" type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column v-if="showIndex" type="index" label="序号" align="center" width="60">
        </el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          align="center">
          <template #default="{ row }">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-if="item.html" v-html="row[item.prop]"></span
            ><span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="showOperation" fixed="right" width="140" label="操作" align="center">
          <template #default="{ row }">
            <slot name="operation" :row="row"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrap">
      <el-pagination
        v-model:currentPage="pageState.pageNum"
        v-model:page-size="pageState.pageSize"
        :page-sizes="pageState.pageSizes"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageState.total"
        @size-change="handleSizeChange"
        @current-change="handleNumChange">
      </el-pagination>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue';
import { useTable, usePageInfo, useTableConfig } from './commonTable';
import { ColumnType, TableProps } from './commonTableType';
const props = defineProps({
  showIndex: { type: Boolean, default: false },
  showSelection: { type: Boolean, default: false },
  request: { type: Function, required: true },
  columns: { type: Array as PropType<ColumnType[]>, default: () => [] },
  listKey: { type: String, default: 'list' },
});
// 两个Props 其实是一致的。但withDefaults不支持导入
const { mainState } = useTable(props as any as TableProps);
const { handleSizeChange, handleNumChange, pageState } = usePageInfo(props as any as TableProps);
const { showOperation } = useTableConfig();
</script>
