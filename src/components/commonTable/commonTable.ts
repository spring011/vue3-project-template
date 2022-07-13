import { onMounted, reactive, useSlots } from 'vue';
import { ColumnType, TableProps } from './commonTableType';
import { defaultPageConfig } from './config';
import mitt from 'mitt';
import { ElMessage } from 'element-plus';
import { ResList } from '@/libs/http';

const cachedPreviousParams = {};

const GET_TABLE_IFNO = 'GET_TABLE_IFNO';
const TABLE_RESET = 'TABLE_RESET';
const RUN = 'RUN';

const emitter = mitt<{
  [GET_TABLE_IFNO]: ResList;
  [TABLE_RESET]: undefined;
  [RUN]: typeof cachedPreviousParams;
}>();

export const useTableConfig = () => {
  // 是否展示操作区域，不必是响应式的。
  const { operation } = useSlots();
  return {
    showOperation: !!operation,
  };
};

export const useTable = (props: TableProps<ColumnType>) => {
  const { request, listKey } = props;
  const mainState = reactive<{ loading: boolean; list: unknown[] }>({
    loading: false,
    list: [],
  });
  const reset = () => {
    mainState.list = [];
    emitter.emit(TABLE_RESET);
  };
  // 发起请求
  const run = async (params: unknown) => {
    mainState.loading = true;
    const data = await request(params);
    mainState.loading = false;
    if (data.code === 0) {
      mainState.list = data.data[listKey] || [];
      emitter.emit(GET_TABLE_IFNO, data);
    } else {
      reset();
      ElMessage({ message: data.msg || '服务异常，请联系管理员' });
    }
  };
  onMounted(() => {
    console.log(request, '......');
    run({});
  });
  return { run, mainState };
};

export const usePageInfo = (props: TableProps<ColumnType>) => {
  const { pagination } = props;
  const getMergedPageConfig = () => ({ ...defaultPageConfig, ...(pagination || {}) });
  const pageState = reactive(getMergedPageConfig());
  emitter.on(GET_TABLE_IFNO, (data) => {
    const { pageNum, pageSize, total } = data.data.pageInfo;
    pageState.pageNum = pageNum;
    pageState.pageSize = pageSize;
    pageState.total = total;
  });
  emitter.on(TABLE_RESET, () => {
    Object.assign(pageState, getMergedPageConfig());
  });
  const handleSizeChange = (pageSize: number) => {
    pageState.pageSize = pageSize;
    // 切换分页大小，将分页序号重置
    pageState.pageNum = 1;
    // 之后重新调用接口
    emitter.emit(RUN, cachedPreviousParams);
  };
  const handleNumChange = (pageNum: number) => {
    pageState.pageNum = pageNum;
    emitter.emit(RUN, cachedPreviousParams);
  };

  return { handleSizeChange, handleNumChange, pageState };
};
