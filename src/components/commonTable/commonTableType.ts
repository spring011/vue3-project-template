import { ListKeyEnum, ResList } from '@/libs/http';

export type DefaultPagination = {
  pageSize: number;
  pageNum: number;
  pageSizes: number[];
};

export type ColumnType = {
  label: string;
  prop: string;
  width?: number;
  html?: boolean;
};

export interface TableProps<T = ColumnType> {
  pagination: Partial<DefaultPagination>;
  listKey: ListKeyEnum;
  // 是否显示索引
  showIndex?: boolean;
  // 是否显示checkbox
  showSelection?: boolean;
  // 列信息
  columns: T[];
  // 获取数据的函数
  request: (params: unknown) => Promise<ResList>;
}
