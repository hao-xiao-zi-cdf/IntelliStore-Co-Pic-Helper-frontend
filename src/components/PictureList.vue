<template>
  <div class="picture-list">
    <a-list
      class="picture-list"
      :grid="{ gutter: 0, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item class="picture-card-wrapper">
          <div class="picture-item-container">
            <a-card
              hoverable
              class="picture-card"
              @click="doClickPicture(picture)"
              :bodyStyle="{ padding: '12px' }"
            >
              <template #cover>
                <div class="image-container">
                  <img
                    class="image"
                    :alt="picture.name"
                    :src="picture.thumbnailUrl ?? picture.url"
                    loading="lazy"
                  />
                </div>
              </template>
              <a-card-meta :title="picture.name">
                <template #description>
                  <a-flex>
                    <a-tag color="green" v-if="picture.tags.length === 0">默认</a-tag>
                    <a-tag v-else v-for="tag in picture.tags" :key="tag" color="blue">
                      {{ tag }}
                    </a-tag>
                  </a-flex>
                </template>
              </a-card-meta>
            </a-card>

            <div class="action-buttons-container">
              <a-button
                type="primary"
                size="small"
                @click.stop="doSearchPicture(picture)"
                class="action-btn"
              >
                <template #icon>
                  <SearchOutlined/>
                </template>
                搜索
              </a-button>
              <a-button
                type="primary"
                size="small"
                @click.stop="doShare(picture)"
                class="action-btn"
              >
                <template #icon>
                  <ShareAltOutlined/>
                  <ShareModal ref="shareModalRef" :link="shareLink" />
                </template>
                分享
              </a-button>
              <a-button
                v-if="checkIfCreator(picture) || canEdit"
                type="primary"
                size="small"
                @click.stop="doEditPicture(picture)"
                class="action-btn"
              >
                <template #icon>
                  <EditOutlined />
                </template>
                编辑
              </a-button>
              <a-button
                v-if="checkIfCreator(picture) || canDelete"
                danger
                size="small"
                @click.stop="doDeletePicture(picture)"
                class="action-btn"
              >
                <template #icon>
                  <DeleteOutlined />
                </template>
                删除
              </a-button>
            </div>
          </div>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { EditOutlined, DeleteOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons-vue'
import { pictureDeleteUsingDelete } from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { computed, reactive, ref } from 'vue'
import ShareModal from '@/components/ShareModal.vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
  canEdit?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})

// 定义事件
const emit = defineEmits<{
  edit: [picture: API.PictureVO]
  delete: [picture: API.PictureVO]
}>()

// 跳转至图片详情
const router = useRouter()
const doClickPicture = (picture) => {
  router.push({
    path: `/picture/${picture.id}/${picture.spaceId}`,
  })
}

// 搜索图片
const doSearchPicture = (picture) => {
  window.open(`/picture/search?pictureId=${picture.id}&spaceId=${picture.spaceId}`)
}

// 编辑图片
const doEditPicture = (picture) => {
  router.push({
    path: `/picture/add/`,
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

// 删除图片
const doDeletePicture = async (picture) => {
  const id = picture.id
  if (!id)
    return
  const res = await pictureDeleteUsingDelete( {id: id, spaceId: picture.spaceId} )
  if (res.data.code === 200) {
    message.success('删除成功')
    // 删除成功，刷新列表
    emit('reload')
  } else {
    message.error('删除失败')
  }
}

// 分享弹窗引用
const shareModalRef = ref()
// 分享链接
const shareLink = ref<string>()

// 分享
const doShare = (picture: API.PictureVO) => {
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}

// 获取登录用户状态管理
const loginUserStore = useLoginUserStore();

const checkIfCreator = (picture: API.PictureVO) => {
  const currentUser = loginUserStore.loginUser;

  // 如果用户未登录，则不展示按钮
  if (!currentUser || currentUser.id === undefined) {
    return false;
  }

  // 如果当前用户是管理员，则始终展示按钮
  if (currentUser.userRole === "admin") { // 假设用户角色字段为 userRole，管理员角色值为 "admin"
    return true;
  }

  // 否则，只有当图片的创建者ID与当前用户ID匹配时才展示按钮
  return picture?.userId !== undefined && currentUser.id === picture.userId;
};
</script>

<style scoped>
.picture-list {
  animation: fadeInUp 1s ease-in;
}

.picture-card-wrapper {
  padding: 4px !important; /* 缩小列表项之间的间距 */
}

.picture-item-container {
  position: relative;
  margin-bottom: 40px; /* 预留空间给操作按钮 */
}

.picture-card {
  border-radius: 12px;
  margin-bottom: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.picture-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.image-container {
  overflow: hidden;
}

.image {
  height: 180px;
  width: 100%;
  object-fit: cover;
  transition: transform 0.4s ease, box-shadow 0.3s ease;
  border-radius: 4px;
}

.picture-card:hover .image {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(24, 144, 255, 0.4);
}

/* 操作按钮容器样式 */
.action-buttons-container {
  position: absolute;
  bottom: -32px; /* Adjust as needed */
  left: 0;
  width: 100%; /* Make the container span the full width of the card */
  display: flex;
  gap: 8px; /* Gap between buttons */
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 10;
  padding: 0 12px; /* Add horizontal padding to align with card content */
  box-sizing: border-box; /* Include padding in the width */
}

.picture-item-container:hover .action-buttons-container {
  opacity: 1;
  visibility: visible;
  bottom: -36px; /* Adjust as needed for hover effect */
}

.action-btn {
  flex: 1; /* Make buttons fill the container width */
  border-radius: 6px;
  font-size: 12px;
  height: 28px;
  /* padding: 0 12px;  Remove individual button padding, let flex handle it */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
