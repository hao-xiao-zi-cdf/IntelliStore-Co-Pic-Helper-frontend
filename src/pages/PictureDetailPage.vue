<template>
  <div class="pictureDetailPage">
    <a-row :gutter="[24, 24]">
      <a-col :sm="24" :md="8" :xl="6">
        <a-card title="图片信息" class="info-card">
          <div class="info-header">
            <a-avatar class="avatar" :size="48" :src="picture.user?.userAvatar" />
            <span class="username">{{ picture.user?.userName || '匿名用户' }}</span>
          </div>

          <div class="info-columns">
            <div class="info-column">
              <div class="info-item">
                <span class="info-item-label">名称</span>
                <div class="info-item-value">{{ picture.name ?? '未命名' }}</div>
              </div>
              <div class="info-item">
                <span class="info-item-label">尺寸</span>
                <div class="info-item-value">{{ picture.picWidth ?? '-' }} x {{ picture.picHeight ?? '-' }}</div>
              </div>
              <div class="info-item">
                <span class="info-item-label">大小</span>
                <div class="info-item-value">{{ formatSize(picture.picSize) }}</div>
              </div>
            </div>
            <div class="info-column">
              <div class="info-item">
                <span class="info-item-label">格式</span>
                <div class="info-item-value">{{ picture.picFormat ?? '-' }}</div>
              </div>
              <div class="info-item">
                <span class="info-item-label">宽高比</span>
                <div class="info-item-value">{{ picture.picScale ?? '-' }}</div>
              </div>
              <div class="info-item">
                <span class="info-item-label">分类</span>
                <div class="info-item-value">{{ picture.category ?? '默认' }}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <span class="info-item-label">简介</span>
            <div class="info-intro">{{ picture.introduction ?? '无' }}</div>
          </div>

          <div class="section">
            <span class="info-item-label">标签</span>
            <div class="info-tags">
              <a-tag v-for="tag in picture.tags" :key="tag">{{ tag }}</a-tag>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览" class="preview-card">
          <a-image
            :src="picture.url"
            class="preview-image"
            :preview="true"
          />
        </a-card>
      </a-col>
    </a-row>

    <div class="action-buttons">
      <a-space :size="20" wrap>
        <a-button v-if="canEdit" type="default" @click="doEdit" size="large" class="action-button edit-button">
          <template #icon><EditOutlined /></template>
          编辑
        </a-button>
        <a-button v-if="canEdit" danger @click="doDelete" size="large" class="action-button delete-button">
          <template #icon><DeleteOutlined /></template>
          删除
        </a-button>
        <a-button type="primary" @click="doDownload" size="large" class="action-button download-button">
          <template #icon><DownloadOutlined /></template>
          免费下载
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { getPictureVoByIdUsingGet, pictureDeleteUsingDelete } from '@/api/tupianxiangguanjiekou.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import router from '@/router'
import { downloadImage, formatSize } from '@/utils'
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons-vue' // 导入图标

const props = defineProps<{
  id: string | number
  spaceId: string | number
}>()

const picture = ref<API.PictureVO>({})

const fetchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({ id: props.id, spaceId: props.spaceId })
    if (res.data.code === 200 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取图片详情失败：' + e.message)
  }
}
onMounted(() => {
  fetchPictureDetail()
})

const loginUserStore = useLoginUserStore()
const canEdit = computed(() => {
  const loginUser = loginUserStore.loginUser
  const user = picture.value.user || {}
  return loginUser.id === user.id || loginUser.userRole === 'admin'
})

const doEdit = () => {
  router.push({
    path: `/picture/add/`,
    query: {
      id: picture.value.id,
      spaceId: picture.value.spaceId,
    },
  })
}
const doDelete = async () => {
  const id = picture.value.id
  if (!id) return
  const res = await pictureDeleteUsingDelete({ id })
  if (res.data.code === 200) {
    message.success('删除成功')
    router.push({ path: '/', replace: true })
  } else {
    message.error('删除失败')
  }
}
const doDownload = () => {
  downloadImage(picture.value.url)
}
</script>

---

<style scoped>
.pictureDetailPage {
  padding: 40px 24px;
  background-color: #f5f7fa; /* 更浅的背景色 */
  min-height: 100vh;
  box-sizing: border-box;
}

/* Card Styles */
.preview-card,
.info-card {
  border: none;
  border-radius: 14px; /* 稍微增大圆角 */
  background-color: #ffffff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); /* 更深邃的阴影 */
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  padding: 28px; /* 增加内边距 */
}

/* Image Preview */
.preview-image {
  width: 100%;
  max-height: 700px; /* 增加最大高度 */
  object-fit: contain;
  background: #fcfcfc; /* 接近白色的背景 */
  border-radius: 10px; /* 图像圆角 */
  padding: 20px;
  box-sizing: border-box;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.04); /* 内部阴影，增加层次感 */
}

/* Info Card Specifics */
.info-card {
  display: flex;
  flex-direction: column;
  gap: 28px; /* 增加整体间距 */
  font-size: 14px;
  color: #333;
}

.info-card :deep(.ant-card-head) {
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
  margin-bottom: 16px;
  font-size: 20px; /* 标题字号增大 */
  font-weight: 700; /* 标题加粗 */
  color: #2c3e50;
}

.info-header {
  display: flex;
  flex-direction: column; /* 头像和名称垂直排列 */
  align-items: center; /* 水平居中 */
  gap: 10px; /* 头像与名称间距 */
  padding-bottom: 20px;
  border-bottom: 1px solid #f2f2f2;
}

.info-header .avatar {
  border: 3px solid #1890ff; /* 强调头像 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.info-header .avatar:hover {
  transform: scale(1.08);
}

.info-header .username {
  color: #1890ff; /* 用户名颜色 */
  font-weight: 600;
  font-size: 17px; /* 用户名字号 */
}

/* 核心优化：两列信息布局 */
.info-columns {
  display: flex;
  gap: 30px; /* 两列之间的间距增大 */
}

.info-column {
  flex: 1; /* 让两列等宽 */
  display: flex;
  flex-direction: column;
  gap: 20px; /* 列内各项的垂直间距增大 */
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item-label {
  font-weight: 500;
  color: #7f8c8d; /* 标签颜色更柔和 */
  margin-bottom: 8px; /* 调整间距 */
  display: block;
  font-size: 14px; /* 标签字号增大 */
  letter-spacing: 0.8px; /* 增加字母间距 */
  text-transform: uppercase; /* 标签文字大写 */
}

.info-item-value {
  color: #444;
  font-size: 16px; /* 值字号增大 */
  font-weight: 600; /* 值加粗 */
  word-break: break-all; /* 防止长文本溢出 */
}

/* 分类信息不再单独在两列信息下方，而是作为第六个信息项 */
.section:has(.info-intro),
.section:has(.info-tags) {
  margin-top: 25px; /* 增加节之间的间距，仅限简介和标签区域 */
}


.info-intro {
  background: #fdfefe; /* 简介背景色 */
  padding: 16px;
  border-radius: 10px;
  line-height: 1.8; /* 增加行高 */
  color: #555;
  font-size: 15px; /* 简介字号增大 */
  border: 1px solid #e8e8e8; /* 边框颜色更浅 */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.03); /* 内部阴影 */
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* 标签间距增大 */
}

.info-tags .ant-tag {
  background-color: #e8f7ff; /* 更浅的蓝色背景 */
  color: #2196f3; /* 标签文字颜色 */
  border: 1px solid #bbdefb; /* 标签边框 */
  font-size: 14px; /* 标签字号增大 */
  border-radius: 20px; /* 更圆的标签 */
  padding: 6px 14px; /* 增加内边距 */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.info-tags .ant-tag:hover {
  background-color: #dbeeff;
  transform: translateY(-2px) scale(1.02); /* 悬停效果更明显 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

/* Action Buttons */
.action-buttons {
  margin-top: 60px; /* 增加与上方内容的距离 */
  text-align: center;
}

.action-buttons :deep(.ant-btn) {
  min-width: 150px; /* 增加按钮最小宽度 */
  height: 48px; /* 增加按钮高度 */
  font-size: 17px;
  border-radius: 10px; /* 按钮圆角 */
  font-weight: 500;
  letter-spacing: 0.8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); /* 按钮阴影 */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.action-buttons :deep(.ant-btn:hover) {
  transform: translateY(-3px); /* 悬停效果更明显 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.action-button.edit-button {
  border-color: #a0d911;
  color: #a0d911;
}
.action-button.edit-button:hover {
  background-color: #a0d911;
  color: #fff;
}

.action-button.delete-button {
  border-color: #ff4d4f;
  color: #ff4d4f;
}
.action-button.delete-button:hover {
  background-color: #ff4d4f;
  color: #fff;
}

.action-button.download-button {
  background-color: #1890ff;
  border-color: #1890ff;
}
.action-button.download-button:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .pictureDetailPage {
    padding: 20px 16px;
  }

  .preview-card,
  .info-card {
    padding: 20px;
  }

  .info-header {
    flex-direction: column;
    align-items: center; /* 保持居中 */
    gap: 8px;
  }

  /* 移动端两列变单列 */
  .info-columns {
    flex-direction: column;
    gap: 0; /* 移除列之间的间距 */
  }

  .info-column {
    gap: 15px; /* 移动端列内间距 */
  }

  .info-item-label {
    font-size: 13px;
  }
  .info-item-value {
    font-size: 15px;
  }

  .info-tags .ant-tag {
    font-size: 13px;
    padding: 4px 10px;
  }

  .action-buttons :deep(.ant-btn) {
    min-width: 100px;
    height: 40px;
    font-size: 15px;
    margin-right: 12px !important;
    gap: 6px;
  }
}
</style>
