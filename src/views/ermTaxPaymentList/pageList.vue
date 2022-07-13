<template>
  <div class="activity-wrap">
    <el-form :model="searchObj" label-width="70px" class="activity-query-form">
      <el-row :gutter="32">
        <el-col :span="8">
          <el-form-item label="订单编号">
            <el-input v-model="searchObj.orderNumber" placeholder="请输入订单编号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户ID">
            <el-input v-model="searchObj.userId" placeholder="请输入用户ID" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="交税状态">
            <el-select v-model="searchObj.acceptStatus" placeholder="请选择交税状态">
              <el-option label="全部" value="0" />
              <el-option label="成功" value="1" />
              <el-option label="其他待处理" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="action-btn">
      <el-button @click="resetForm">重置</el-button>
      <el-button type="primary" @click="handlerSearch">查询</el-button>
    </div>
    <div v-loading="loading" class="activity-list">
      <el-table :data="tableData" :border="true" style="width: 100%">
        <el-table-column prop="userId" align="center" label="用户ID" min-width="120" />
        <el-table-column prop="userName" align="center" label="用户姓名" min-width="90" />
        <el-table-column prop="mobile" align="center" label="手机号" min-width="110" />
        <el-table-column prop="idCard" align="center" label="身份证号" min-width="140" />
        <el-table-column prop="orderNumber" align="center" label="订单编号" min-width="190" />
        <el-table-column prop="amountActual" align="center" label="实发金额" min-width="100" />
        <el-table-column prop="createTime" align="center" label="放款时间" min-width="160" />
        <el-table-column fixed="right" align="center" label="操作" width="90">
          <template #default="slotProps">
            <el-button
              v-if="slotProps.row.acceptStatus == '2' && !slotProps.row.hidePush"
              type="text"
              size="small"
              >重新推送</el-button
            >
            <span v-if="slotProps.row.acceptStatus == '1'" class="no-action">--</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-block">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :background="true"
          layout="prev, pager, next, jumper"
          :total="total"
          style="float: right"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';

let searchObj = reactive({
  userId: '',
  orderNumber: '',
  acceptStatus: '0',
});

// 列表数据
let tableData = ref<unknown>([]);
// 数据加载loading
let loading = ref(false);
// 分页
let currentPage = ref(1);
let pageSize = ref(10);
let total = ref(0);
// 请求列表数据
const searchList = async (type = 'isNotSearch') => {
  const searchParams = {
    userId: searchObj.userId,
    orderNumber: searchObj.orderNumber,
    acceptStatus: searchObj.acceptStatus,
    pageSize: pageSize.value,
    pageNo: type === 'isNotSearch' ? currentPage.value : 1,
  };

  // 点击查询的时候当前页码置为1
  if (type === 'search') {
    currentPage.value = 1;
  }
  tableData.value = [{
    userId: 123,
    userName: '李明',
    mobile: 162565323,
    idCard: 3476746476364,
    orderNumber: 263725,
    amountActual: 100,
    createTime: '2022-7-13'
  }];
  total.value = 100;
};

searchList();

// 搜索
const handlerSearch = () => {
  searchList('search');
};
// 重置
const resetForm = async () => {
  const keys = Object.keys(searchObj);
  let obj: { [name: string]: unknown } = {};
  keys.forEach((item) => {
    let val: unknown = '';
    switch (item) {
      case 'userId':
      case 'orderNumber':
        val = '';
        break;
      case 'acceptStatus':
        val = '0';
        break;
    }
    obj[item] = val;
  });
  Object.assign(searchObj, obj);
  searchList('search');
};
// 翻页
const handleCurrentChange = () => {
  console.log('handleCurrentChange...');
  console.log(currentPage.value);
  searchList();
};
</script>
<style lang="scss" scoped>
.no-action {
  color: #c3c3c3;
}
.remark-img {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 6px;
  right: -24px;
  cursor: pointer;
}
.pagination-block {
  background-color: #fff;
  padding: 30px 20px 10px 20px;
}
.activity-query-form {
  background-color: #fff;
  padding: 30px 20px 2px 20px;
}
.activity-list {
  background-color: #fff;
  padding: 24px 20px 2px 20px;
}
.pagination-block {
  overflow: hidden;
}
.activity-wrap {
  position: relative;
}
.action-btn {
  height: 32px;
  padding-right: 20px;
  .el-button {
    float: right;
    margin-left: 12px;
  }
}
.activity-query-form :deep(.el-form-item) {
  margin-bottom: 22px;
  .el-select {
    width: 100%;
  }
}
.activity-list :deep(.el-table__header-wrapper tr th) {
  background-color: rgb(238, 241, 246) !important;
}
</style>
