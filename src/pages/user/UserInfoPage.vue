<template>
  <div class="user-profile-page">
    <a-row :gutter="[24, 24]" justify="center">
      <a-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">
        <a-card class="profile-card" title="个人信息">
          <template #extra>
            <a-button type="link" @click="toggleEditMode">
              <template #icon>
                <EditOutlined v-if="!editMode" />
                <CloseOutlined v-else />
              </template>
              {{ editMode ? '取消编辑' : '编辑资料' }}
            </a-button>
          </template>

          <div class="profile-header">
            <a-avatar :size="80" :src="currentUser.userAvatar || 'default-avatar.png'" class="profile-avatar" />
            <div class="username-display">{{ currentUser.userName || '未命名用户' }}</div>
            <div class="account-display">{{ currentUser.userAccount || '无账号' }}</div>
          </div>

          <a-divider />

          <a-form
            :model="editForm"
            :rules="rules"
            ref="formRef"
            layout="vertical"
            class="profile-form"
          >
            <a-form-item label="昵称" name="userName">
              <a-input v-if="editMode" v-model:value="editForm.userName" placeholder="请输入昵称" />
              <span v-else class="info-display">{{ currentUser.userName || '未设置' }}</span>
            </a-form-item>

            <a-form-item label="个人简介" name="userProfile">
              <a-textarea v-if="editMode" v-model:value="editForm.userProfile" :rows="3" placeholder="请输入个人简介" />
              <span v-else class="info-display info-profile">{{ currentUser.userProfile || '这个人很懒，什么都没有留下' }}</span>
            </a-form-item>

            <a-form-item label="角色" v-if="currentUser.userRole">
              <a-tag color="blue" class="role-tag">{{ formatUserRole(currentUser.userRole) }}</a-tag>
            </a-form-item>

            <a-form-item label="注册时间" v-if="currentUser.createTime">
              <span class="info-display">{{ formatDate(currentUser.createTime) }}</span>
            </a-form-item>

            <a-form-item v-if="editMode">
              <a-button type="primary" @click="saveProfile" :loading="loading" block class="save-button">
                保存修改
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { EditOutlined, CloseOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import { getUserVoUsingGet, userEditUsingPost } from '@/api/yonghumokuaixiangguanjiekou.ts'; // 引入API接口
import { useRoute } from 'vue-router'; // 用于获取路由参数，例如用户ID
import dayjs from 'dayjs'; // 替换 moment 为 dayjs

// 定义用户信息的类型，与API.ts中的UserVO保持一致
interface UserVO {
  createTime?: string;
  id?: number;
  userAccount?: string;
  userAvatar?: string;
  userName?: string;
  userProfile?: string;
  userRole?: string;
}

const route = useRoute();
const currentUser = ref<UserVO>({});
const editMode = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();

// 编辑表单的数据模型
const editForm = reactive({
  userName: '',
  userProfile: '',
});

// 表单校验规则
const rules = {
  userName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  userProfile: [{ max: 200, message: '简介不能超过200字', trigger: 'blur' }],
};

/**
 * 获取用户详情
 */
const fetchUserProfile = async () => {
  const userId = 1941752389065261058; // 假设用户ID从路由参数获取
  if (!userId) {
    message.error('缺少用户ID');
    return;
  }
  try {
    const res = await getUserVoUsingGet({ id: userId.toString() }); // 调用查询接口
    if (res.data.code === 200 && res.data.data) { // 假设接口返回结构是 { code: 200, data: UserVO }
      currentUser.value = res.data.data;
      // 初始化编辑表单
      editForm.userName = res.data.data.userName || '';
      editForm.userProfile = res.data.data.userProfile || '';
    } else {
      message.error('获取用户信息失败: ' + res.data.message);
    }
  } catch (error: any) {
    message.error('获取用户信息异常: ' + error.message);
  }
};

onMounted(() => {
  fetchUserProfile();
})

/**
 * 切换编辑模式
 */
const toggleEditMode = () => {
  editMode.value = !editMode.value;
  // 如果从编辑模式切换回非编辑模式，重置表单并同步当前用户数据
  if (!editMode.value) {
    editForm.userName = currentUser.value.userName || '';
    editForm.userProfile = currentUser.value.userProfile || '';
    formRef.value?.resetFields(); // 重置表单校验状态
  }
};

/**
 * 保存用户资料
 */
const saveProfile = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;
    const res = await userEditUsingPost({
      id: currentUser.value.id?.toString(), // 传递用户ID，转为字符串类型
      userName: editForm.userName,
      userProfile: editForm.userProfile,
    }); // 调用编辑接口
    if (res.data.code === 200) { // 假设接口返回结构是 { code: 200 }
      message.success('用户信息更新成功！');
      editMode.value = false;
      // 更新当前用户信息显示
      currentUser.value.userName = editForm.userName;
      currentUser.value.userProfile = editForm.userProfile;
    } else {
      message.error('更新失败: ' + res.data.message);
    }
  } catch (error: any) {
    if (error.errorFields) { // Ant Design Vue表单校验失败会抛出errorFields
      message.error('请检查表单填写是否正确');
    } else {
      message.error('更新异常: ' + error.message);
    }
  } finally {
    loading.value = false;
  }
};

/**
 * 格式化用户角色
 */
const formatUserRole = (role: string) => {
  switch (role) {
    case 'admin':
      return '管理员';
    case 'user':
      return '普通用户';
    default:
      return '未知';
  }
};

/**
 * 格式化日期
 * 使用 Day.js
 */
const formatDate = (dateString?: string) => {
  return dateString ? dayjs(dateString).format('YYYY年MM月DD日 HH:mm') : '-';
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.user-profile-page {
  padding: 40px 24px;
  background-color: #f0f2f5; /* 整体页面背景色 */
  min-height: calc(100vh - 64px); /* 减去顶部导航栏高度，确保沾满屏幕 */
  display: flex;
  justify-content: center; /* 使内容居中 */
  align-items: flex-start; /* 内容顶部对齐 */
}

.profile-card {
  width: 100%;
  max-width: 600px; /* 限制卡片最大宽度，避免过宽 */
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); /* 更柔和的阴影 */
  padding: 24px; /* 增加内边距 */
}

/* 卡片标题样式 */
.profile-card :deep(.ant-card-head) {
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 16px;
  margin-bottom: 24px;
  font-size: 22px;
  font-weight: 700;
  color: #333;
}

/* 标题右侧额外操作按钮 */
.profile-card :deep(.ant-card-extra) {
  padding-bottom: 0; /* 移除Ant Design Vue默认内边距 */
}
.profile-card :deep(.ant-btn-link) {
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1890ff;
}
.profile-card :deep(.ant-btn-link:hover) {
  color: #40a9ff;
}


.profile-header {
  text-align: center;
  margin-bottom: 24px;
}

.profile-avatar {
  margin-bottom: 15px;
  border: 4px solid #1890ff; /* 头像边框 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}
.profile-avatar:hover {
  transform: scale(1.05);
}

.username-display {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
}

.account-display {
  font-size: 15px;
  color: #7f8c8d;
}

.ant-divider {
  margin: 30px 0; /* 分割线上下间距 */
  border-color: #f0f0f0; /* 分割线颜色 */
}

.profile-form :deep(.ant-form-item) {
  margin-bottom: 20px; /* 表单项间距 */
}

.profile-form :deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #555;
  font-size: 14px;
  margin-bottom: 8px; /* 标签与输入框间距 */
}

.info-display {
  display: block; /* 确保span独占一行，与输入框保持一致布局 */
  padding: 8px 11px; /* 模拟输入框的内边距 */
  border: 1px solid transparent; /* 保持一致的边框空间 */
  border-radius: 6px;
  background-color: #f9f9f9; /* 非编辑状态下的背景色 */
  color: #333;
  font-size: 15px;
  line-height: 1.5;
  min-height: 40px; /* 确保最小高度与输入框一致 */
  box-sizing: border-box;
}

.info-profile {
  background-color: #fdfdfd;
  min-height: 80px; /* 简介的最小高度 */
  white-space: pre-wrap; /* 保留文本中的换行符 */
}

.role-tag {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 600;
}

.save-button {
  margin-top: 20px;
  height: 45px;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
}
.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(24, 144, 255, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .user-profile-page {
    padding: 20px 16px;
  }
  .profile-card {
    padding: 16px;
  }
  .profile-card :deep(.ant-card-head) {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .username-display {
    font-size: 20px;
  }
  .account-display {
    font-size: 14px;
  }
  .ant-divider {
    margin: 20px 0;
  }
  .profile-form :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
  .save-button {
    height: 40px;
    font-size: 15px;
  }
}
</style>
