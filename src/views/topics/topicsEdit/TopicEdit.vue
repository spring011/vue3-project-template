<template>
  <el-form
    ref="ruleFormRef"
    :model="data"
    label-width="120px"
    style="padding: 50px 0 46px"
    class="formDate">
    <el-form-item v-if="route.query.type === 'edit'" label="话题id:" prop="topicId">
      <el-input v-model="topicId" disabled style="max-width: 400px" />
    </el-form-item>
    <el-form-item label="话题名称:" prop="topicName">
      <el-input
        v-model="topicName"
        maxlength="16"
        show-word-limit
        placeholder="请输入话题名称"
        style="max-width: 400px" />
    </el-form-item>
    <el-form-item label="话题图片:" prop="topicImg">
      <el-upload
        v-model="topicImg"
        class="upload-cls"
        :class="{ 'hide-upload-btn': uploadStatus }"
        :action="`/upload/imageUpload`"
        list-type="picture-card"
        accept="image/jpeg,image/png,image/jpg"
        :limit="1"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccessNew"
        :on-remove="handleRemoveNew"
        :file-list="fileList">
        <el-icon><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <!-- :http-request="(file:any)=> {imgHttpRequest(file, 1)}" -->
    <el-form-item>
      <div>提示：格式支持jpg、png，大小不超过5M</div>
    </el-form-item>
    <el-form-item label="话题简介:" prop="topicDesc">
      <el-input
        v-model="topicDesc"
        maxlength="120"
        style="max-width: 400px"
        :rows="6"
        type="textarea"
        show-word-limit
        placeholder="请输入120字以内的话题简介" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted } from 'vue';
import { UploadProps, UploadUserFile, ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

interface list {
  topicId: string;
  topicName: string;
  topicImg: string;
  topicDesc: string;
  uploadStatus: boolean;
  fileList: UploadUserFile[];
}

const router = useRouter();
const route = useRoute();

let data = reactive<list>({
  topicId: '',
  topicName: '',
  topicImg: '',
  topicDesc: '',
  uploadStatus: false,
  fileList: [],
});
const { topicId, topicName, topicImg, topicDesc, uploadStatus, fileList } = toRefs(data);

onMounted(() => {
  if (route.query.type === 'edit' && localStorage.getItem('topic')) {
    const topicData = JSON.parse(localStorage.getItem('topic') || '');
    data.topicId = topicData.id;
    data.topicName = topicData.topicName;
    data.topicImg = topicData.coverImg;
    data.topicDesc = topicData.content;
    data.fileList.push({
      name: 'topicImg',
      url: topicData.coverImg,
    });
    data.uploadStatus = true;
  } else {
    data.topicId = '';
    data.topicName = '';
    data.topicImg = '';
    data.topicDesc = '';
  }
});
const submit = () => {
  if (!data.topicDesc || data.topicName === '' || data.topicImg === '') {
    ElMessage.error('所有内容必传！');
  } else {
    console.log('上传');
  }
};
const cancel = () => {
  router.push({ path: '/topicList' });
};
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/jpg'
  ) {
    ElMessage.error('上传文件类型为: jpg, png');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('文件大小不能超过 5MB!');
    return false;
  }
  return true;
};
// 文件上传成功
const handleAvatarSuccessNew: UploadProps['onSuccess'] = (response, uploadFile) => {
  data.topicImg = response.data;
  data.uploadStatus = true;
};
// 文件列表移除文件时的钩子
const handleRemoveNew: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  data.topicImg = '';
  data.uploadStatus = false;
};
</script>

<style lang="scss" scoped>
.templateSpan {
  margin-right: 20px;
  font-size: 16px;
}
.templateStyle {
  width: 300px;
}
.dialogImg {
  height: 400px;
  width: 400px;
}
.formDate {
  background-color: #fff;
  :deep(.el-input.is-disabled .el-input__inner) {
    color: #606266;
  }
  :deep(.el-date-range-picker__editors-wrap) {
    display: none;
  }
  .upload-cls {
    &.hide-upload-btn {
      :deep(.el-upload--picture-card) {
        display: none;
      }
    }
    :deep(.el-upload-list--picture-card .el-upload-list__item-actions span + span) {
      margin-left: 0;
    }
  }
}
.formDate :deep(.el-upload-list__item-preview) {
  display: none !important;
}
</style>
<style>
.el-date-range-picker__editors-wrap .el-date-range-picker__time-picker-wrap:nth-child(1) {
  display: none;
}
</style>
