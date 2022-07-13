<template>
  <div class="topic-wrap">
    <el-form label-width="70px" class="activity-query-form">
      <el-row :gutter="32">
        <el-col :span="8">
          <el-form-item label="话题ID">
            <el-input v-model="topicId" placeholder="请输入话题ID" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="话题名称">
            <el-input v-model="topicName" placeholder="请输入话题名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建人">
            <el-input v-model="topicPerson" placeholder="请输入创建人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="topicTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="话题状态">
            <el-select v-model="topicState" placeholder="请选择话题状态">
              <el-option label="全部" value="" />
              <el-option label="已上线" value="1" />
              <el-option label="已下线" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="searchList">查询</el-button>
            <el-button @click="resetList">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="add-btn">
      <el-button type="primary" @click="topicAdd">创建新话题</el-button>
    </div>
    <div v-loading="loading" class="activity-list">
      <el-table :data="tableData" :border="true" style="width: 100%">
        <el-table-column prop="id" label="话题ID" width="90" />
        <el-table-column prop="topicName" label="话题名称" min-width="140" />
        <el-table-column prop="content" label="话题简介" min-width="180" />
        <el-table-column prop="hotValue" label="热度值" min-width="90" />
        <el-table-column prop="activityStatus" label="话题状态" min-width="95">
          <template #default="slotProps">
            {{ slotProps.row.isVisible === 1 ? '已上线' : '已下线' }}
          </template>
        </el-table-column>
        <el-table-column prop="userNickName" label="创建人" min-width="120" />
      </el-table>
      <div class="pagination-block">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :background="true"
          layout="prev, pager, next, jumper"
          :total="total"
          style="float: right"
          @current-change="changePage" />
      </div>
    </div>
  </div>

  <!-- 上下线dialog -->
  <el-dialog v-model="dialogStatus" title="操作提示" width="30%">
    <span>{{ dialogContent }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogStatus = false">取消</el-button>
        <el-button type="primary" @click="setTopicStatus">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, toRefs, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
interface list {
  topicName: string;
  topicId: string;
  topicPerson: string;
  topicState: string;
  topicTime: unknown[];
  tableData: unknown[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  topId: string;
  topicStatus: number;
  index: number;
  dialogStatus: boolean;
  dialogContent: string;
}

let data = reactive<list>({
  topicName: '',
  topicId: '',
  topicPerson: '',
  topicState: '',
  topicTime: [],
  tableData: [],
  loading: false,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  topicStatus: 1,
  topId: '',
  dialogStatus: false,
  index: 0,
  dialogContent: '',
});
const getList: () => void = () => {
  data.total = 100;
  data.tableData = [{
    id: 123,
    topicName: '话题名称',
    content: '话题简介',
    hotValue: 5,
    activityStatus: 1,
    userNickName: '李明'
  }];
};
const searchList: Function = () => {
  if (!data.topicTime) {
    data.topicTime = [];
  }
  getList();
};
const resetList: () => void = () => {
  data.topicName = '';
  data.topicId = '';
  data.topicPerson = '';
  data.topicState = '';
  data.topicTime = [];
  getList();
};
const topicAdd: (obj: any) => void = (obj) => {
  router.push({ path: '/topicEdit' });
};
const topicEdit: (obj: any) => void = (obj) => {
  localStorage.setItem('topic', JSON.stringify(obj));
  router.push({ path: '/topicEdit', query: { type: 'edit' } });
};
const setTopic: (obj: any) => void = (obj) => {
  let btn = obj.row.isVisible;
  data.topId = obj.row.id;
  data.index = obj.$index;
  if (btn === 1) {
    data.dialogContent = '您确认要下线该话题吗？';
    data.topicStatus = 0;
  } else {
    data.dialogContent = '您确认要上线该话题吗？';
    data.topicStatus = 1;
  }
  data.dialogStatus = true;
};
const setTopicStatus: () => void = () => {
  data.dialogStatus = false;
};
const changePage: () => void = () => {
  getList();
};
const {
  topicName,
  topicId,
  topicPerson,
  topicState,
  topicTime,
  tableData,
  loading,
  currentPage,
  pageSize,
  total,
  dialogStatus,
  dialogContent,
} = toRefs(data);
onMounted(() => {
  getList();
});
</script>
<style scoped>
.activity-title {
  padding-left: 20px;
}
.activity-query-form,
.activity-list,
.pagination-block {
  background-color: #fff;
  padding: 30px 20px 10px 20px;
}
.pagination-block {
  overflow: hidden;
}
.activity-query-form :deep(.el-form-item) {
  margin-bottom: 22px;
}
.activity-title {
  font-size: 20px;
  font-weight: bold;
}
.add-btn {
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #fff;
}
.activity-list :deep(.el-table__header-wrapper tr th) {
  background-color: rgb(238, 241, 246) !important;
}
</style>
