<template>
  <div id="addPicturePage">
    <div class="form-container">
      <h2 class="page-title">
        {{ route.query?.id ? '修改图片' : '创建图片' }}
      </h2>
      <a-typography-paragraph v-if="spaceId" type="secondary">
        保存至空间：<a :href="`/space/${spaceId}`" target="_blank">{{ spaceId }}</a>
      </a-typography-paragraph>
      <!-- 上传方式切换 -->
      <a-tabs v-model:activeKey="uploadType" class="upload-tabs">
        <a-tab-pane v-if="showFileUpload" key="file" tab="📁 文件上传">
          <PictureUpload :spaceId="spaceId" :picture="picture" :onSuccess="handleFileSuccess" />
        </a-tab-pane>
        <a-tab-pane v-if="route.query?.id == undefined && showUrlUpload" key="url" tab="🌐 URL 上传">
          <UrlPictureUpload :spaceId="spaceId" :picture="picture" :onSuccess="handleUrlSuccess" />
        </a-tab-pane>
      </a-tabs>
      <!--      居中展示,宽度不太太长-->
      <a-button :icon="h(EditOutlined)" @click="doEditPicture" size="large"
                style="width: 50%; margin: 0 auto; display: block; background-color: whitesmoke" >编辑图片</a-button>
      <!-- 表单区 -->
      <a-form
        v-if="!showFileUpload || !showUrlUpload || picture?.id"
        layout="vertical"
        :model="pictureForm"
        @finish="handleSubmit"
        class="picture-form"
      >
        <a-form-item label="名称" name="name">
          <a-input v-model:value="pictureForm.name" placeholder="请输入名称" />
        </a-form-item>

        <a-form-item label="简介" name="introduction">
          <a-textarea
            v-model:value="pictureForm.introduction"
            placeholder="请输入简介"
            :rows="2"
            autoSize
            allowClear
          />
        </a-form-item>

        <a-form-item label="分类" name="category">
          <a-auto-complete
            v-model:value="pictureForm.category"
            placeholder="请输入分类"
            allowClear
          />
        </a-form-item>

        <a-form-item label="标签" name="tags">
          <a-select
            v-model:value="pictureForm.tags"
            mode="tags"
            placeholder="请输入标签"
            allowClear
          />
        </a-form-item>

        <div v-if="picture" class="edit-bar">
          <ImageCropper
            ref="imageCropperRef"
            :imageUrl="picture?.url"
            :picture="picture"
            :spaceId="spaceId"
            :space="space"
            :onSuccess="onCropSuccess"
          />
        </div>
        <ImageOutPainting
          ref="imageOutPaintingRef"
          :picture="picture"
          :spaceId="spaceId"
          :onSuccess="onImageOutPaintingSuccess"
        />
        <a-form-item>
          <a-button type="primary" html-type="submit" block size="large">
            {{ route.query?.id ? '保存修改' : '创建图片' }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import PictureUpload from '@/components/PictureUpload.vue'
import UrlPictureUpload from '@/components/UrlPictureUpload.vue'
import { computed, h, onMounted, reactive, ref, watchEffect } from 'vue'
import { editPictureUsingPost, getPictureVoByIdUsingGet, uploadPictureUsingPost } from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import ImageCropper from '@/components/ImageCropper.vue'
import { EditOutlined,FullscreenOutlined } from '@ant-design/icons-vue'
import ImageOutPainting from '@/components/ImageOutPainting.vue'
import { getSpaceByIdUsingGet } from '@/api/kongjianxiangguanjiekou.ts'

const route = useRoute()
const router = useRouter()

const picture = ref<API.PictureVO>()
const pictureForm = reactive<API.PictrueUpdateDTO>({})

interface Props {
  imageUrl?: string
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}


// 当前上传方式
const uploadType = ref()
// tab 控制
const showFileUpload = ref(true)
const showUrlUpload = ref(true)
// 空间 id
const spaceId = computed(() => {
  return route.query?.spaceId
})
const loading = ref<boolean>(false)

// // 确认裁剪
// const handleConfirm = () => {
//   cropperRef.value.getCropBlob((blob: Blob) => {
//     const fileName = (props.picture?.name || 'image') + '.png'
//     const file = new File([blob], fileName, { type: blob.type })
//     // 上传图片
//     handleUpload({ file })
//   })
// }

/**
 * 上传
 * @param file
 */
// const handleUpload = async ({ file }: any) => {
//   loading.value = true
//   try {
//     const params: API.PictureUploadRequest = props.picture ? { id: props.picture.id } : {}
//     params.spaceId = props.spaceId
//     const res = await uploadPictureUsingPost(params, {}, file)
//     if (res.data.code === 200 && res.data.data) {
//       message.success('图片上传成功')
//       // 将上传成功的图片信息传递给父组件
//       props.onSuccess?.(res.data.data)
//       closeModal();
//     } else {
//       message.error('图片上传失败，' + res.data.message)
//     }
//   } catch (error) {
//     message.error('图片上传失败')
//   } finally {
//     loading.value = false
//   }
// }

// 图片编辑弹窗引用
const imageCropperRef = ref()

// 编辑图片
const doEditPicture = () => {
  if (imageCropperRef.value) {
    imageCropperRef.value.openModal()
  }
}

const onImageOutPaintingSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

// 编辑成功事件
const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

function handleFileSuccess(newPicture: API.PictureVO) {
  picture.value = newPicture
  pictureForm.name = newPicture.name
  showUrlUpload.value = false
}
function handleUrlSuccess(newPicture: API.PictureVO) {
  picture.value = newPicture
  pictureForm.name = newPicture.name
  showFileUpload.value = false
}

const handleSubmit = async (values: any) => {
  const pictureId = picture.value?.id
  if (!pictureId) return
  const res = await editPictureUsingPost({ id: pictureId, spaceId: spaceId.value, ...values })
  if (res.data.code === 200 && res.data.data) {
    message.success('创建成功')
    router.push({ path: `/picture/${pictureId}` })
  } else {
    message.error('创建失败，' + res.data.message)
  }
}

const getOldPicture = async () => {
  const id = route.query?.id
  const spaceId = route.query?.spaceId
  if (id) {
    const res = await getPictureVoByIdUsingGet({ id, spaceId })
    if (res.data.code === 200 && res.data.data) {
      const data = res.data.data
      picture.value = data
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}

const space = ref<API.SpaceVO>()

// 获取空间信息
const fetchSpace = async () => {
  // 获取数据
  if (spaceId.value) {
    const res = await getSpaceByIdUsingGet({
      id: spaceId.value,
    })
    if (res.data.code === 200 && res.data.data) {
      space.value = res.data.data
    }
  }
}

watchEffect(() => {
  fetchSpace()
})

onMounted(() => {
  getOldPicture()
})
</script>

<style scoped>
#addPicturePage {
  display: flex;
  justify-content: center;
  padding: 40px 16px;
  background: #f5f7fa;
  min-height: 100vh;
}

.form-container {
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 720px;
}

.page-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 32px;
  color: #333;
}

.upload-tabs {
  margin-bottom: 32px;
}

.picture-form :deep(.ant-form-item) {
  margin-bottom: 20px;
}

.picture-form :deep(.ant-input),
.picture-form :deep(.ant-select-selector),
.picture-form :deep(.ant-input-affix-wrapper) {
  border-radius: 6px;
  padding: 6px 11px;
  font-size: 15px;
}

.picture-form :deep(.ant-btn) {
  border-radius: 6px;
  font-size: 16px;
}
#addPicturePage .edit-bar {
  text-align: center;
  margin: 16px 0;
}

</style>
