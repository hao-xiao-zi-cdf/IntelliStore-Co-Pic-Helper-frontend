<template>
  <div class="image-cropper">
    <a-modal
      class="image-cropper-modal"
      v-model:visible="visible"
      title="编辑图片"
      :footer="false"
      @cancel="closeModal"
      :width="680"
      centered
      :bodyStyle="{ height: 'calc(100vh - 120px)', overflowY: 'auto' }"
      :style="{ top: 0, maxHeight: '100vh' }"
    >
      <div class="cropper-wrapper">
        <vue-cropper
          ref="cropperRef"
          :img="imageUrl"
          :autoCrop="true"
          :fixedBox="true"
          :centerBox="false"
          :canMoveBox="true"
          :canMove="true"
          :canScale="true"
          :info="true"
          outputType="png"
          :fixed="aspectRatio !== 'free'"
          :fixedNumber="currentAspectRatio"
          :enlarge="false"
          :autoCropWidth="200"
          :autoCropHeight="200"
          :full="false"
          :limitMinSize="[10, 10]"
          mode="cover"
          @cropMoving="onCropMoving"
          @cropStart="onCropStart" />
      </div>

      <div class="controls-section">
        <div class="section-title">
          <span class="title-text">裁剪比例</span>
          <div class="title-divider"></div>
        </div>
        <div class="aspect-ratio-selector">
          <a-radio-group v-model:value="aspectRatio" button-style="solid" size="large">
            <a-radio-button value="free" class="ratio-btn">自由</a-radio-button>
            <a-radio-button value="1:1" class="ratio-btn">1:1</a-radio-button>
            <a-radio-button value="4:3" class="ratio-btn">4:3</a-radio-button>
            <a-radio-button value="16:9" class="ratio-btn">16:9</a-radio-button>
            <a-radio-button value="3:4" class="ratio-btn">3:4</a-radio-button>
            <a-radio-button value="9:16" class="ratio-btn">9:16</a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <div class="controls-section">
        <div class="section-title">
          <span class="title-text">图片操作</span>
          <div class="title-divider"></div>
        </div>
        <div class="action-buttons">
          <div class="button-group">
            <a-button
              @click="rotateLeft"
              class="action-btn rotate-btn"
              size="large">
              <template #icon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.91c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/>
                </svg>
              </template>
              向左旋转
            </a-button>

            <a-button
              @click="rotateRight"
              class="action-btn rotate-btn"
              size="large">
              <template #icon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>
                </svg>
              </template>
              向右旋转
            </a-button>
          </div>

          <div class="button-group">
            <a-button
              @click="changeScale(1)"
              class="action-btn scale-btn"
              size="large">
              <template #icon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
                </svg>
              </template>
              放大
            </a-button>

            <a-button
              @click="changeScale(-1)"
              class="action-btn scale-btn"
              size="large">
              <template #icon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  <path d="M7 9h5v1H7z"/>
                </svg>
              </template>
              缩小
            </a-button>

            <a-button
              @click="resetImagePosition"
              class="action-btn reset-btn"
              size="large">
              <template #icon>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </template>
              重置
            </a-button>
          </div>
        </div>
      </div>

      <div class="footer-actions">
        <a-button
          @click="closeModal"
          size="large"
          class="cancel-btn">
          取消
        </a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="handleConfirm"
          size="large"
          class="confirm-btn">
          <template #icon v-if="!loading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </template>
          确认裁剪
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

interface Props {
  imageUrl?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['confirm'])
const cropperRef = ref<any>(null)
const loading = ref(false)

// 获取图片实际显示区域的边界
const getImageBounds = () => {
  if (!cropperRef.value) return null

  const container = cropperRef.value.$el
  const img = container.querySelector('img')
  if (!img) return null

  const containerRect = container.getBoundingClientRect()
  const imgRect = img.getBoundingClientRect()

  return {
    left: imgRect.left - containerRect.left,
    top: imgRect.top - containerRect.top,
    right: imgRect.right - containerRect.left,
    bottom: imgRect.bottom - containerRect.top,
    width: imgRect.width,
    height: imgRect.height
  }
}

// 限制裁剪框在图片范围内
const constrainCropBox = (cropData: any) => {
  const imageBounds = getImageBounds()
  if (!imageBounds) return cropData

  const { left, top, right, bottom } = imageBounds
  const { x, y, width, height } = cropData

  // 计算限制后的位置
  const constrainedX = Math.max(left, Math.min(x, right - width))
  const constrainedY = Math.max(top, Math.min(y, bottom - height))

  // 计算限制后的尺寸
  const maxWidth = right - constrainedX
  const maxHeight = bottom - constrainedY
  const constrainedWidth = Math.min(width, maxWidth)
  const constrainedHeight = Math.min(height, maxHeight)

  return {
    x: constrainedX,
    y: constrainedY,
    width: constrainedWidth,
    height: constrainedHeight
  }
}

// 裁剪框移动时的处理
const onCropMoving = (data: any) => {
  nextTick(() => {
    const constrainedData = constrainCropBox(data)
    if (cropperRef.value &&
      (constrainedData.x !== data.x ||
        constrainedData.y !== data.y ||
        constrainedData.width !== data.width ||
        constrainedData.height !== data.height)) {
      cropperRef.value.setCrop(constrainedData)
    }
  })
}

// 裁剪框开始操作时的处理
const onCropStart = () => {
  // 可以在这里添加额外的逻辑
}

const rotateLeft = () => {
  if (cropperRef.value) {
    cropperRef.value.rotateLeft()
    nextTick(() => {
      initializeCropBox()
    })
  }
}

const rotateRight = () => {
  if (cropperRef.value) {
    cropperRef.value.rotateRight()
    nextTick(() => {
      initializeCropBox()
    })
  }
}

const changeScale = (num: number) => {
  if (cropperRef.value) {
    cropperRef.value.changeScale(num)
    nextTick(() => {
      // 缩放后检查裁剪框是否还在图片范围内
      const cropData = cropperRef.value.getData()
      if (cropData) {
        const constrainedData = constrainCropBox(cropData)
        cropperRef.value.setCrop(constrainedData)
      }
    })
  }
}

const resetImagePosition = () => {
  if (cropperRef.value) {
    cropperRef.value.reload()
    nextTick(() => {
      initializeCropBox()
    })
  }
}

// 初始化裁剪框，确保在图片范围内
const initializeCropBox = () => {
  if (cropperRef.value) {
    cropperRef.value.clearCrop()
    cropperRef.value.startCrop()

    // 等待裁剪框创建后再检查位置
    nextTick(() => {
      const cropData = cropperRef.value.getData()
      if (cropData) {
        const constrainedData = constrainCropBox(cropData)
        cropperRef.value.setCrop(constrainedData)
      }
    })
  }
}

const handleConfirm = () => {
  loading.value = true
  if (cropperRef.value) {
    cropperRef.value.getCropBlob((blob: Blob) => {
      emit('confirm', blob)
      loading.value = false
      closeModal()
    }, 'image/png')
  } else {
    loading.value = false
  }
}

const aspectRatio = ref('free')

const currentAspectRatio = computed(() => {
  if (aspectRatio.value === 'free') {
    return [0, 0]
  }
  const [width, height] = aspectRatio.value.split(':').map(Number)
  return [width, height]
})

watch(aspectRatio, () => {
  nextTick(() => {
    initializeCropBox()
  })
})

const visible = ref(false)

const openModal = () => {
  visible.value = true
  aspectRatio.value = 'free'
  nextTick(() => {
    if (cropperRef.value && props.imageUrl) {
      cropperRef.value.reload()
      nextTick(() => {
        // 延迟初始化，确保图片加载完成
        setTimeout(() => {
          initializeCropBox()
        }, 100)
      })
    }
  })
}

const closeModal = () => {
  visible.value = false
}

defineExpose({
  openModal,
})
</script>

<style scoped>
.image-cropper {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 模态框样式 */
.image-cropper-modal {
  border-radius: 12px;
  overflow: hidden;
}

.image-cropper-modal :deep(.ant-modal-content) {
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  /* 关键修改：让内容区域占据可用高度并允许垂直滚动 */
  height: 100vh; /* 设置为视口高度 */
  display: flex;
  flex-direction: column;
}

.image-cropper-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
  padding: 20px 24px;
}

.image-cropper-modal :deep(.ant-modal-title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.image-cropper-modal :deep(.ant-modal-close) {
  color: white;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.image-cropper-modal :deep(.ant-modal-close:hover) {
  opacity: 1;
  transform: scale(1.1);
}

.image-cropper-modal :deep(.ant-modal-body) {
  padding: 24px;
  background: #fafafa;
  /* 关键修改：让body部分填充剩余空间并自身可滚动 */
  flex-grow: 1;
  overflow-y: auto;
}

/* 裁剪器容器 */
.cropper-wrapper {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.cropper-wrapper .vue-cropper {
  height: 420px;
  border-radius: 8px;
  overflow: hidden;
}

/* 控制区域样式 */
.controls-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.title-text {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-right: 12px;
  white-space: nowrap;
}

.title-divider {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, #e5e7eb, transparent);
}

/* 宽高比选择器 */
.aspect-ratio-selector {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.aspect-ratio-selector :deep(.ant-radio-group) {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.aspect-ratio-selector :deep(.ant-radio-button-wrapper) {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 60px;
  text-align: center;
}

.aspect-ratio-selector :deep(.ant-radio-button-wrapper:hover) {
  border-color: #667eea;
  transform: translateY(-1px);
}

.aspect-ratio-selector :deep(.ant-radio-button-wrapper-checked) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

/* 操作按钮区域 */
.action-buttons {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.button-group:last-child {
  margin-bottom: 0;
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 110px;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1);
}

.rotate-btn {
  border-color: #10b981;
  color: #10b981;
}

.rotate-btn:hover {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.scale-btn {
  border-color: #3b82f6;
  color: #3b82f6;
}

.scale-btn:hover {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.reset-btn {
  border-color: #f59e0b;
  color: #f59e0b;
}

.reset-btn:hover {
  background-color: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

/* 底部操作区域 */
.footer-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  border-radius: 8px;
  font-weight: 500;
  min-width: 100px;
  border-color: #6b7280;
  color: #6b7280;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #374151;
  color: #374151;
  transform: translateY(-1px);
}

.confirm-btn {
  border-radius: 8px;
  font-weight: 600;
  min-width: 140px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.confirm-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(102, 126, 234, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-cropper-modal {
    margin: 0;
    max-width: 100vw;
    height: 100vh; /* 在小屏幕上确保弹窗高度为视口高度 */
  }

  .image-cropper-modal :deep(.ant-modal-content) {
    height: 100vh; /* 在小屏幕上确保内容高度为视口高度 */
    border-radius: 0;
  }

  .cropper-wrapper .vue-cropper {
    height: 300px;
  }

  .button-group {
    flex-wrap: wrap;
    gap: 8px;
  }

  .action-btn {
    min-width: 90px;
    font-size: 12px;
  }

  .footer-actions {
    flex-direction: column;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .image-cropper-modal :deep(.ant-modal-body) {
    background: #1f2937;
  }

  .cropper-wrapper,
  .aspect-ratio-selector,
  .action-buttons {
    background: #374151;
  }

  .title-text {
    color: #e5e7eb;
  }

  .title-divider {
    background: linear-gradient(to right, #4b5563, transparent);
  }
}
</style>
