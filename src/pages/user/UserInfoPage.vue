<template>
  <div class="user-profile-page">
    <a-row justify="center" class="full-width-row">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="22">
        <a-card class="profile-card" :bordered="false">
          <template #title>
            <div class="card-title">个人中心</div>
          </template>

          <div class="profile-content">
            <div class="profile-sidebar">
              <a-upload
                name="avatar"
                :show-upload-list="false"
                :customRequest="handleAvatarUpload"
              >
                <a-avatar :size="150" :src="currentUser.userAvatar || 'default-avatar.png'" class="editable-avatar">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
              </a-upload>
              <div class="upload-hint">点击更换头像</div>

              <div class="user-main-details">
                <div class="user-name">{{ currentUser.userName || '未命名用户' }}</div>
                <div class="user-account-role">
                  <span class="user-account-text">账号：{{ currentUser.userAccount || '无账号' }}</span>
                  <a-tag v-if="currentUser.userRole" color="blue" class="user-role-tag">
                    {{ formatUserRole(currentUser.userRole) }}
                  </a-tag>
                </div>
              </div>

              <a-button type="primary" size="large" @click="toggleEditMode" class="edit-profile-button">
                <template #icon>
                  <EditOutlined v-if="!editMode" />
                  <CloseOutlined v-else />
                </template>
                <span class="edit-button-text">{{ editMode ? '取消编辑' : '编辑个人资料' }}</span>
              </a-button>
            </div>

            <div class="profile-main">
              <a-form
                :model="editForm"
                :rules="rules"
                ref="formRef"
                layout="vertical"
                class="info-form"
              >
                <a-row :gutter="32" class="info-section">
                  <a-col :span="24">
                    <h3 class="section-title">基本信息</h3>
                  </a-col>
                  <a-col :xs="24" :md="12">
                    <a-form-item label="昵称" name="userName">
                      <a-input v-if="editMode" v-model:value="editForm.userName" placeholder="请输入昵称" />
                      <span v-else class="info-display"><UserOutlined class="info-icon" /> {{ currentUser.userName || '未设置' }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :md="12">
                    <a-form-item label="手机号" name="phone">
                      <a-input v-if="editMode" v-model:value="editForm.phone" placeholder="请输入手机号" />
                      <span v-else class="info-display"><MobileOutlined class="info-icon" /> {{ currentUser.phone || '未设置' }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :md="12">
                    <a-form-item label="电子邮箱" name="email">
                      <a-input v-if="editMode" v-model:value="editForm.email" placeholder="请输入电子邮箱" />
                      <span v-else class="info-display"><MailOutlined class="info-icon" /> {{ currentUser.email || '未设置' }}</span>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :md="12">
                    <a-form-item label="注册时间" name="createTime">
                      <span class="info-display"><ClockCircleOutlined class="info-icon" /> {{ formatDate(currentUser.createTime) }}</span>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="32" class="info-section">
                  <a-col :span="24">
                    <h3 class="section-title">个人简介</h3>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item label="" name="userProfile">
                      <a-textarea v-if="editMode" v-model:value="editForm.userProfile" :rows="5" placeholder="介绍一下你自己吧！" />
                      <span v-else class="info-display info-profile">
                        <ProfileOutlined class="info-icon" /> {{ currentUser.userProfile || '这个人很懒，什么都没有留下' }}
                      </span>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-collapse v-if="editMode" bordered={false} class="password-collapse">
                  <a-collapse-panel key="1" header="修改密码">
                    <p class="password-hint">修改密码前请确保输入原密码，新密码需包含字母、数字，长度至少8位。</p>
                    <a-row :gutter="24">
                      <a-col :xs="24" :md="8">
                        <a-form-item label="原密码" name="oldPassword" :rules="[{ required: true, message: '请输入原密码' }]">
                          <a-input-password v-model:value="editForm.oldPassword" placeholder="请输入原密码" />
                        </a-form-item>
                      </a-col>
                      <a-col :xs="24" :md="8">
                        <a-form-item label="新密码" name="newPassword" :rules="[{ required: true, message: '请输入新密码' }, { min: 8, message: '密码至少8位' }, { pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: '密码必须包含字母和数字' }]">
                          <a-input-password v-model:value="editForm.newPassword" placeholder="请输入新密码" />
                        </a-form-item>
                      </a-col>
                      <a-col :xs="24" :md="8">
                        <a-form-item label="确认新密码" name="confirmPassword" :rules="[{ required: true, message: '请确认新密码' }, { validator: validateConfirmPassword, trigger: 'blur' }]">
                          <a-input-password v-model:value="editForm.confirmPassword" placeholder="请再次输入新密码" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-collapse-panel>
                </a-collapse>

                <a-form-item v-if="editMode" class="save-button-container">
                  <a-button type="primary" size="large" @click="saveProfile" :loading="loading" class="save-button">
                    保存修改
                  </a-button>
                </a-form-item>
              </a-form>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch } from 'vue'; // 引入 watch
import { message } from 'ant-design-vue';
import {
  EditOutlined,
  CloseOutlined,
  UserOutlined,
  MobileOutlined,
  MailOutlined,
  ClockCircleOutlined,
  ProfileOutlined,
} from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import { getUserVoUsingGet, userEditUsingPost } from '@/api/yonghumokuaixiangguanjiekou.ts';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { uploadPictureUsingPost1 } from '@/api/tupianxiangguanjiekou.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

interface UserVO {
  createTime?: string;
  id?: number;
  userAccount?: string;
  userAvatar?: string;
  userName?: string;
  userProfile?: string;
  userRole?: string;
  phone?: string;
  email?: string;
}

const route = useRoute();
const currentUser = ref<UserVO>({});
const editMode = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();

const editForm = reactive({
  userName: '',
  userProfile: '',
  phone: '',
  email: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// 使用 watch 监听 currentUser 的变化，当数据加载完成后，填充 editForm
watch(currentUser, (newVal) => {
  if (newVal) {
    Object.assign(editForm, {
      userName: newVal.userName || '',
      userProfile: newVal.userProfile || '',
      phone: newVal.phone || '',
      email: newVal.email || '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }
}, { immediate: true }); // immediate: true 确保在组件挂载时立即执行一次

const rules = {
  userName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: '请输入正确的电子邮箱格式', trigger: 'blur' },
  ],
  userProfile: [{ max: 200, message: '简介不能超过200字', trigger: 'blur' }],
  newPassword: [
    { min: 8, message: '新密码长度不能少于8位', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: '密码必须包含字母和数字', trigger: 'blur' },
  ],
};

const validateConfirmPassword = async (_rule: any, value: string) => {
  if (editForm.newPassword && value !== editForm.newPassword) {
    return Promise.reject('两次输入的密码不一致！');
  } else {
    return Promise.resolve();
  }
};

const fetchUserProfile = async () => {
  const userId = route.query?.id;
  if (!userId) {
    message.error('缺少用户ID');
    return;
  }
  try {
    const res = await getUserVoUsingGet({ id: userId.toString() });
    if (res.data.code === 200 && res.data.data) {
      currentUser.value = res.data.data;
      // 这里的填充逻辑因为有了 watch 就不需要了，但保留在 watch 里更稳妥
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

const toggleEditMode = () => {
  editMode.value = !editMode.value;
    // 如果从编辑模式切换回非编辑模式，重置表单并同步当前用户数据（确保取消编辑时数据回滚）
    // 调用接口查询当前用户数据
    const res = getUserVoUsingGet({ id: currentUser.value.id?.toString() })
    if (res.data.code === 200 && res.data.data) {
      currentUser.value = res.data.data;
    }
    formRef.value?.resetFields(); // 重置表单校验状态
};

const handleAvatarUpload = async (options: any) => {
  const { file } = options;
  // 调用图片上传接口，先将头像上传
  const res = await uploadPictureUsingPost1({spaceId: 1298723918729884}, {}, file);
  if (res.data.code !== 200) {
    message.error('图片上传失败');
    return;
  }
  // 获取返回结果中的图片url路径
  const avatarUrl = res.data.data.url;

  // 调用用户信息编辑接口，将用户信息更新
  const res1 = await userEditUsingPost({
    id: currentUser.value.id?.toString(),
    userAvatar: avatarUrl,
  })
  if (res1.data.code === 200) {
    message.success('用户信息更新成功！');
    editMode.value = false;
    await fetchUserProfile(); // 重新获取用户数据以更新页面显示
  } else {
    message.error('更新失败: ' + res1.data.message);
  }

  // 获取loginUserStore并修改userAvatar属性值
  const loginUserStore = useLoginUserStore();
  loginUserStore.loginUser.userAvatar = avatarUrl;
};

const saveProfile = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const updateData: any = {
      id: currentUser.value.id?.toString(),
      userName: editForm.userName,
      userProfile: editForm.userProfile,
      phone: editForm.phone,
      email: editForm.email,
    };

    if (editForm.newPassword) {
      if (!editForm.oldPassword) {
        message.error('修改密码需要输入原密码');
        loading.value = false;
        return;
      }
      Object.assign(updateData, {
        userPassword: editForm.oldPassword,
        newPassword: editForm.newPassword,
      });
    }

    const res = await userEditUsingPost(updateData);
    if (res.data.code === 200) {
      message.success('用户信息更新成功！');
      editMode.value = false;
      await fetchUserProfile(); // 重新获取用户数据以更新页面显示
    } else {
      message.error('更新失败: ' + res.data.message);
    }
  } catch (error: any) {
    if (error.errorFields) {
      message.error('请检查表单填写是否正确');
    } else {
      message.error('更新异常: ' + error.message);
    }
  } finally {
    loading.value = false;
  }
};

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

const formatDate = (dateString?: string) => {
  return dateString ? dayjs(dateString).format('YYYY年MM月DD日 HH:mm') : '未设置';
};
</script>

<style scoped>
/* 页面整体布局 */
.user-profile-page {
  padding: 40px 20px;
  background: linear-gradient(to right, #e0f2f7, #f0f4f7);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 顶部对齐 */
}

.full-width-row {
  width: 100%;
}

.profile-card {
  background: #fff;
  border-radius: 16px;
  padding: 60px; /* 进一步增加卡片内部填充，向四周拓展更宽 */
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 1600px; /* **关键：最大宽度增加到1600px，利用更宽的屏幕** */
  width: 100%;
}

.card-title {
  font-size: 36px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 50px; /* 增加标题下方间距 */
  letter-spacing: 1px;
}

/* 核心内容分栏布局 */
.profile-content {
  display: flex;
  flex-direction: column; /* 默认垂直堆叠 */
  gap: 60px; /* 左右分栏间的间距进一步增大 */
}

@media (min-width: 992px) { /* 大屏幕上切换为横向布局 */
  .profile-content {
    flex-direction: row;
  }
}

/* 左侧边栏 */
.profile-sidebar {
  flex: 0 0 320px; /* **固定左侧宽度，使其更宽** */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px; /* 增加内边距 */
  background: #f7f9fc;
  border-radius: 12px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 40px;
  align-self: flex-start;
}

/* 响应式调整侧边栏宽度 */
@media (max-width: 991px) {
  .profile-sidebar {
    flex: 1;
    position: relative;
    top: auto;
  }
}

/* 头像悬停动画效果 */
.editable-avatar {
  border: 6px solid #40a9ff;
  cursor: pointer;
  /* 初始状态 */
  transform: scale(1) rotate(0deg);
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease; /* 更平滑的动画曲线 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15); /* 更明显的阴影 */
}

.editable-avatar:hover {
  /* 悬停状态：放大并轻微旋转 */
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.upload-hint {
  font-size: 15px;
  color: #888;
  margin-top: 15px;
}

.user-main-details {
  margin-top: 25px;
  width: 100%;
}

.user-name {
  font-size: 32px;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 8px;
  word-break: break-all;
}

.user-account-role {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.user-account-text {
  font-size: 16px;
  color: #666;
}

.user-role-tag {
  margin-top: 0;
  font-size: 14px;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

/* 编辑按钮 */
.edit-profile-button {
  min-width: 180px;
  height: 55px;
  border-radius: 12px;
  font-size: 18px;
  margin-top: 30px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
}

.edit-profile-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(24, 144, 255, 0.35);
}

.edit-button-text {
  margin-left: 8px;
}

/* 右侧主内容区域 */
.profile-main {
  flex: 1; /* 占据剩余所有宽度 */
  padding-left: 60px; /* **增加与左侧边栏的间隔** */
}

@media (max-width: 991px) {
  .profile-main {
    padding-left: 0;
    padding-top: 30px;
  }
}

.info-form {
  padding-right: 10px;
}

.info-section {
  background: #fff;
  border-radius: 12px;
  padding: 30px 40px;
  margin-bottom: 35px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f2f5;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.info-display {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #f8fafd;
  border-radius: 10px;
  font-size: 18px;
  color: #444;
  word-break: break-word;
  min-height: 55px;
}

.info-icon {
  font-size: 22px;
  color: #666;
  margin-right: 15px;
}

.info-profile {
  min-height: 180px;
  line-height: 1.8;
}

/* 修改密码部分 */
.password-collapse {
  margin-top: 50px;
  background: #fbfdff;
  border: 1px solid #e0e6ea;
  border-radius: 12px;
  overflow: hidden;
}

.password-collapse :deep(.ant-collapse-header) {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  padding: 20px 30px;
  background: #f7f9fc;
}

.password-hint {
  font-size: 15px;
  color: #888;
  margin-bottom: 20px;
  line-height: 1.6;
}

.save-button-container {
  text-align: center;
  margin-top: 60px;
}

.save-button {
  width: 60%;
  max-width: 450px;
  height: 65px;
  font-size: 24px;
  border-radius: 12px;
  font-weight: bold;
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.save-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(24, 144, 255, 0.45);
}

/* Ant Design 输入框样式覆盖 */
.info-form :deep(.ant-input),
.info-form :deep(.ant-input-password),
.info-form :deep(.ant-textarea) {
  border-radius: 10px;
  padding: 16px 22px;
  font-size: 18px;
}

/* 响应式调整 */
@media (max-width: 767px) {
  .profile-card {
    padding: 25px;
  }
  .card-title {
    font-size: 28px;
    margin-bottom: 25px;
  }
  .profile-sidebar {
    padding: 15px;
    flex: 1;
  }
  .editable-avatar {
    size: 120px !important;
  }
  .user-name {
    font-size: 26px;
  }
  .user-account-role {
    flex-direction: column;
    gap: 5px;
  }
  .user-account-text, .user-role-tag {
    font-size: 15px;
  }
  .edit-profile-button {
    min-width: 140px;
    height: 48px;
    font-size: 16px;
  }
  .profile-main {
    padding-left: 0;
    padding-top: 25px;
  }
  .info-section {
    padding: 20px 25px;
    margin-bottom: 20px;
  }
  .section-title {
    font-size: 20px;
    margin-bottom: 15px;
  }
  .info-display {
    padding: 12px 15px;
    font-size: 16px;
  }
  .info-icon {
    font-size: 18px;
    margin-right: 10px;
  }
  .info-profile {
    min-height: 100px;
  }
  .password-collapse :deep(.ant-collapse-header) {
    font-size: 18px;
    padding: 15px 20px;
  }
  .save-button {
    width: 80%;
    height: 50px;
    font-size: 18px;
  }
}
</style>
