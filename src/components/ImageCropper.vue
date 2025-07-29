<template>
  <div class="image-cropper">
    <a-modal
      class="image-cropper-modal"
      v-model:visible="visible"
      title="图片编辑器"
      :footer="false"
      @cancel="closeModal"
      width="1200px"
      :bodyStyle="{ padding: '24px', minHeight: '600px' }"
      :style="{ top: '20px' }"
      :maskClosable="false"
      destroyOnClose
    >
      <div class="cropper-container">
        <!-- 左侧裁剪区域 -->
        <div class="cropper-left">
          <div class="cropper-wrapper">
            <vue-cropper
              ref="cropperRef"
              :img="imageUrl"
              :autoCrop="true"
              :fixedBox="fixedBox"
              :centerBox="true"
              :canMoveBox="true"
              :info="true"
              :fixed="fixed"
              :fixedNumber="fixedNumber"
              outputType="png"
              class="vue-cropper-instance"
            />
          </div>
        </div>

        <!-- 右侧操作区域 -->
        <div class="cropper-right">
          <div class="control-panel">
            <!-- 协同编辑状态 -->
            <div class="edit-status-section" v-if="isTeamSpace">
              <div class="section-title">
                <span class="title-icon">👥</span>
                协同编辑
              </div>
              <div class="edit-status">
                <div v-if="editingUser" class="editing-user">
                  <a-avatar :src="editingUser.userAvatar" size="small" />
                  <span class="user-name">{{ editingUser.userName }}</span>
                  <a-tag color="processing">编辑中</a-tag>
                </div>
                <div v-else class="no-editing">
                  <a-tag color="default">无人编辑</a-tag>
                </div>
              </div>
              <div class="edit-actions">
                <a-button
                  v-if="canEnterEdit"
                  type="primary"
                  size="small"
                  @click="enterEdit"
                  :loading="editActionLoading"
                >
                  <template #icon><EditOutlined /></template>
                  开始编辑
                </a-button>
                <a-button
                  v-if="canExitEdit"
                  danger
                  size="small"
                  @click="exitEdit"
                  :loading="editActionLoading"
                >
                  <template #icon><StopOutlined /></template>
                  退出编辑
                </a-button>
              </div>
            </div>

            <!-- 裁剪比例选择 -->
            <div class="aspect-ratio-section">
              <div class="section-title">
                <span class="title-icon">📐</span>
                裁剪比例
              </div>
              <div class="ratio-buttons">
                <a-button
                  v-for="ratio in aspectRatios"
                  :key="ratio.label"
                  :type="currentRatio === ratio.value ? 'primary' : 'default'"
                  size="small"
                  @click="setAspectRatio(ratio.value, ratio.fixedNumber)"
                  :disabled="!canEdit"
                  class="ratio-btn"
                >
                  {{ ratio.label }}
                </a-button>
              </div>
            </div>

            <!-- 图片操作 -->
            <div class="image-operations-section">
              <div class="section-title">
                <span class="title-icon">🔧</span>
                图片操作
              </div>

              <!-- 旋转操作 -->
              <div class="operation-group">
                <div class="group-label">旋转</div>
                <div class="operation-buttons">
                  <a-button
                    @click="rotateLeft"
                    :disabled="!canEdit"
                    size="small"
                    class="operation-btn"
                  >
                    <template #icon><RotateLeftOutlined /></template>
                    左转
                  </a-button>
                  <a-button
                    @click="rotateRight"
                    :disabled="!canEdit"
                    size="small"
                    class="operation-btn"
                  >
                    <template #icon><RotateRightOutlined /></template>
                    右转
                  </a-button>
                </div>
              </div>

              <!-- 缩放操作 -->
              <div class="operation-group">
                <div class="group-label">缩放</div>
                <div class="operation-buttons">
                  <a-button
                    @click="changeScale(1)"
                    :disabled="!canEdit"
                    size="small"
                    class="operation-btn"
                  >
                    <template #icon><ZoomInOutlined /></template>
                    放大
                  </a-button>
                  <a-button
                    @click="changeScale(-1)"
                    :disabled="!canEdit"
                    size="small"
                    class="operation-btn"
                  >
                    <template #icon><ZoomOutOutlined /></template>
                    缩小
                  </a-button>
                </div>
              </div>

              <!-- 重置操作 -->
              <div class="operation-group">
                <div class="group-label">重置</div>
                <div class="operation-buttons">
                  <a-button
                    @click="resetCropper"
                    :disabled="!canEdit"
                    size="small"
                    class="operation-btn reset-btn"
                  >
                    <template #icon><ReloadOutlined /></template>
                    重置
                  </a-button>
                </div>
              </div>
            </div>

            <!-- 确认操作 -->
            <div class="confirm-section">
              <a-button
                type="primary"
                size="large"
                :loading="loading"
                :disabled="!canEdit"
                @click="handleConfirm"
                class="confirm-btn"
                block
              >
                <template #icon><CheckOutlined /></template>
                确认裁剪
              </a-button>
            </div>

            <!-- 编辑权限提示 -->
            <div v-if="isTeamSpace && !canEdit" class="edit-tip">
              <a-alert
                message="编辑提示"
                description="当前有其他用户正在编辑，请等待或稍后再试"
                type="info"
                show-icon
                :closable="false"
              />
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import {
  EditOutlined,
  StopOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
  CheckOutlined
} from '@ant-design/icons-vue'
import { uploadPictureUsingPost, uploadPictureUsingPost1 } from '@/api/tupianxiangguanjiekou.ts'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { PICTURE_EDIT_ACTION_ENUM, PICTURE_EDIT_MESSAGE_TYPE_ENUM } from '@/constants/picture.ts'
import PictureEditWebSocket from '@/utils/PictureEditWebSocket.ts'
import { SPACE_TYPE_ENUM } from '@/constants/spaceUser.ts'

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: number
  space?: API.SpaceVO
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

// 裁剪比例配置
const aspectRatios = [
  { label: '自由', value: 'free', fixedNumber: [1, 1] },
  { label: '1:1', value: '1:1', fixedNumber: [1, 1] },
  { label: '4:3', value: '4:3', fixedNumber: [4, 3] },
  { label: '3:4', value: '3:4', fixedNumber: [3, 4] },
  { label: '16:9', value: '16:9', fixedNumber: [16, 9] },
  { label: '9:16', value: '9:16', fixedNumber: [9, 16] },
  { label: '3:2', value: '3:2', fixedNumber: [3, 2] },
  { label: '2:3', value: '2:3', fixedNumber: [2, 3] }
]

// 当前选中的比例
const currentRatio = ref('free')
const fixed = ref(false)
const fixedBox = ref(false)
const fixedNumber = ref([1, 1])

// 设置裁剪比例
const setAspectRatio = (ratio: string, ratioNumbers: number[]) => {
  currentRatio.value = ratio
  if (ratio === 'free') {
    fixed.value = false
    fixedBox.value = false
  } else {
    fixed.value = true
    fixedBox.value = false
    fixedNumber.value = ratioNumbers
  }

  // 如果是团队空间，同步比例变更
  if (isTeamSpace.value && canEdit.value) {
    editAction(PICTURE_EDIT_ACTION_ENUM.SET_ASPECT_RATIO, { ratio, ratioNumbers })
  }
}

// 重置裁剪器
const resetCropper = () => {
  cropperRef.value.refresh()
  editAction(PICTURE_EDIT_ACTION_ENUM.RESET)
}

// 是否为团队空间
const isTeamSpace = computed(() => {
  console.log('空间类型', props.space?.spaceType)
  return props.space?.spaceType === SPACE_TYPE_ENUM.TEAM;
})

// 可以编辑
const canEdit = computed(() => {
  // 不是团队空间，则默认可编辑
  if (!isTeamSpace.value) {
    return true
  }
  return editingUser.value?.id === loginUser.id
})

// 编辑器组件的引用
const cropperRef = ref()

// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT)
}

// 向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight()
  editAction(PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT)
}

// 缩放
const changeScale = (num: number) => {
  cropperRef.value.changeScale(num)
  if (num > 0) {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_IN)
  } else {
    editAction(PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT)
  }
}

// 是否可见
const visible = ref(false)

// 打开弹窗
const openModal = () => {
  visible.value = true
}

// 关闭弹窗
const closeModal = () => {
  visible.value = false
  // 断开连接
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
  // 重置状态
  currentRatio.value = 'free'
  fixed.value = false
  fixedBox.value = false
}

// 确认裁剪
const handleConfirm = () => {
  cropperRef.value.getCropBlob((blob: Blob) => {
    const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName, { type: blob.type })
    // 上传图片
    handleUpload({ file })
  })
}

// 暴露函数给父组件
defineExpose({
  openModal,
})

const loading = ref<boolean>(false)
const editActionLoading = ref<boolean>(false)

/**
 * 上传
 * @param file
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const params: API.PictureUploadDTO = props.picture ? { id: props.picture.id } : {}
    params.spaceId = props.spaceId
    const res = await uploadPictureUsingPost1(params, {}, file)
    if (res.data.code === 200 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
      closeModal();
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}

// --------- 实时编辑 ---------
const loginUserStore = useLoginUserStore()
let loginUser = loginUserStore.loginUser
// 正在编辑的用户
const editingUser = ref<API.UserVO>()
// 没有用户正在编辑中，可进入编辑
const canEnterEdit = computed(() => {
  return !editingUser.value && isTeamSpace.value
})
// 正在编辑的用户是本人，可退出编辑
const canExitEdit = computed(() => {
  return editingUser.value?.id === loginUser.id
})

let websocket: PictureEditWebSocket | null

// 初始化 WebSocket 连接，绑定事件
const initWebsocket = () => {
  const pictureId = props.picture?.id
  if (!pictureId || !visible.value) {
    return
  }
  // 防止之前的连接未释放
  if (websocket) {
    websocket.disconnect()
  }
  // 创建 WebSocket 实例
  websocket = new PictureEditWebSocket(pictureId)
  // 建立 WebSocket 连接
  websocket.connect()

  // 监听通知消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.INFO, (msg) => {
    console.log('收到通知消息：', msg)
    message.info(msg.message)
  })

  // 监听错误消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ERROR, (msg) => {
    console.log('收到错误消息：', msg)
    message.error(msg.message)
  })

  // 监听进入编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT, (msg) => {
    console.log('收到进入编辑状态消息：', msg)
    message.info(msg.message)
    editingUser.value = msg.user
  })

  // 监听编辑操作消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION, (msg) => {
    console.log('收到编辑操作消息：', msg)
    message.info(msg.message)

    // 同步执行其他用户的操作
    switch (msg.editAction) {
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_LEFT:
        cropperRef.value.rotateLeft()
        break
      case PICTURE_EDIT_ACTION_ENUM.ROTATE_RIGHT:
        cropperRef.value.rotateRight()
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_IN:
        cropperRef.value.changeScale(1)
        break
      case PICTURE_EDIT_ACTION_ENUM.ZOOM_OUT:
        cropperRef.value.changeScale(-1)
        break
      case PICTURE_EDIT_ACTION_ENUM.RESET:
        cropperRef.value.refresh()
        break
      case PICTURE_EDIT_ACTION_ENUM.SET_ASPECT_RATIO:
        // 同步比例设置
        if (msg.data && msg.data.ratio && msg.data.ratioNumbers) {
          const { ratio, ratioNumbers } = msg.data
          currentRatio.value = ratio
          if (ratio === 'free') {
            fixed.value = false
            fixedBox.value = false
          } else {
            fixed.value = true
            fixedBox.value = false
            fixedNumber.value = ratioNumbers
          }
        }
        break
    }
  })

  // 监听退出编辑状态消息
  websocket.on(PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT, (msg) => {
    console.log('收到退出编辑状态消息：', msg)
    message.info(msg.message)
    editingUser.value = undefined
  })
}

watchEffect(() => {
  // 团队空间才初始化
  if (isTeamSpace.value) {
    initWebsocket()
  }
})

onUnmounted(() => {
  // 断开连接
  if (websocket) {
    websocket.disconnect()
  }
  editingUser.value = undefined
})

// 进入编辑状态
const enterEdit = async () => {
  if (websocket) {
    editActionLoading.value = true
    try {
      // 发送进入编辑状态的消息
      websocket.sendMessage({
        type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.ENTER_EDIT,
      })
    } finally {
      editActionLoading.value = false
    }
  }
}

// 退出编辑状态
const exitEdit = async () => {
  if (websocket) {
    editActionLoading.value = true
    try {
      // 发送退出编辑状态的消息
      websocket.sendMessage({
        type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EXIT_EDIT,
      })
    } finally {
      editActionLoading.value = false
    }
  }
}

// 编辑图片操作
const editAction = (action: string, data?: any) => {
  if (websocket && canEdit.value) {
    // 发送编辑操作的请求
    websocket.sendMessage({
      type: PICTURE_EDIT_MESSAGE_TYPE_ENUM.EDIT_ACTION,
      editAction: action,
      data: data
    })
  }
}
</script>

<style scoped>
.image-cropper {
  text-align: center;
}

.image-cropper-modal :deep(.ant-modal-body) {
  padding: 20px;
}

.cropper-container {
  display: flex;
  gap: 24px;
  height: 550px;
  min-height: 550px;
}

/* 左侧裁剪区域 */
.cropper-left {
  flex: 1;
  min-width: 0;
}

.cropper-wrapper {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  position: relative;
}

.cropper-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.1) 50%, transparent 51%);
  pointer-events: none;
  z-index: 1;
}

.vue-cropper-instance {
  width: 100%;
  height: 100% !important;
  background: white;
}

/* 右侧操作区域 */
.cropper-right {
  width: 320px;
  flex-shrink: 0;
}

.control-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow-y: auto;
  max-height: 550px;
}

/* 区域标题样式 */
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
  font-size: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #1890ff;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 30px;
  height: 2px;
  background: #1890ff;
  border-radius: 1px;
}

.title-icon {
  font-size: 18px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* 协同编辑区域 */
.edit-status-section {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: -6px;
}

.edit-status {
  margin-bottom: 16px;
}

.editing-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
  border: 1px solid #91d5ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
}

.user-name {
  flex: 1;
  font-size: 14px;
  color: #0050b3;
  font-weight: 500;
}

.no-editing {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  text-align: center;
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.edit-actions .ant-btn {
  height: 36px;
  border-radius: 6px;
  font-weight: 500;
}

/* 比例选择区域 */
.aspect-ratio-section {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: -6px;
}

.ratio-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.ratio-btn {
  font-size: 13px;
  height: 32px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.ratio-btn.ant-btn-primary {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.3);
}

/* 图片操作区域 */
.image-operations-section {
  flex: 1;
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: -6px;
}

.operation-group {
  margin-bottom: 20px;
}

.operation-group:last-child {
  margin-bottom: 0;
}

.group-label {
  font-size: 13px;
  color: #595959;
  margin-bottom: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.operation-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.operation-btn {
  flex: 1;
  min-width: 90px;
  font-size: 13px;
  height: 36px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.operation-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.reset-btn {
  color: #ff4d4f;
  border-color: #ff4d4f;
  background: linear-gradient(135deg, #fff2f0 0%, #ffeded 100%);
}

.reset-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
  color: white;
  border-color: #cf1322;
}

/* 确认区域 */
.confirm-section {
  margin-top: auto;
  background: white;
  padding: 20px 16px 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}

.confirm-btn {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;
}

.confirm-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
  transform: translateY(-2px);
}

.confirm-btn:disabled {
  background: #f5f5f5;
  color: #bfbfbf;
  box-shadow: none;
  transform: none;
}

/* 编辑提示 */
.edit-tip {
  margin-top: 16px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.edit-tip :deep(.ant-alert) {
  border-radius: 6px;
  font-size: 13px;
  background: linear-gradient(135deg, #fff7e6 0%, #fef2e6 100%);
  border-color: #ffd591;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .image-cropper-modal {
    width: 95% !important;
    max-width: 1000px;
  }

  .cropper-right {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .image-cropper-modal {
    width: 100% !important;
    margin: 0;
    top: 0 !important;
    padding-bottom: 0;
  }

  .cropper-container {
    flex-direction: column;
    height: auto;
    min-height: auto;
    gap: 16px;
  }

  .cropper-left {
    height: 350px;
  }

  .cropper-right {
    width: 100%;
  }

  .control-panel {
    max-height: none;
    height: auto;
  }

  .ratio-buttons {
    grid-template-columns: repeat(3, 1fr);
  }

  .operation-buttons {
    flex-direction: column;
  }

  .operation-btn {
    min-width: auto;
  }
}

/* 禁用状态样式优化 */
.operation-btn:disabled,
.ratio-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f5f5f5;
  color: #bfbfbf;
  border-color: #d9d9d9;
  transform: none !important;
  box-shadow: none !important;
}

/* 动画效果 */
.operation-btn,
.ratio-btn,
.confirm-btn,
.edit-actions .ant-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.operation-btn:not(:disabled):active {
  transform: translateY(0) scale(0.98);
}

.ratio-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ratio-btn:not(:disabled):active {
  transform: translateY(0) scale(0.98);
}

/* 加载状态优化 */
.ant-btn-loading {
  pointer-events: none;
}

.ant-btn-loading .ant-btn-loading-icon {
  margin-right: 8px;
}

/* 滚动条样式 */
.control-panel::-webkit-scrollbar {
  width: 6px;
}

.control-panel::-webkit-scrollbar-track {
  background: transparent;
}

.control-panel::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.control-panel::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>
