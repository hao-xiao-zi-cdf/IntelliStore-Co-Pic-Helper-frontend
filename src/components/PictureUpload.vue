<template>
  <div class="picture-upload">
    <a-upload
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="handleUpload"
      :before-upload="beforeUpload"
    >
      <img v-if="props.picture?.url" :src="props.picture?.url" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">点击或拖拽上传图片</div>
      </div>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { uploadPictureUsingPost1 } from '@/api/tupianxiangguanjiekou.ts'
interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>()

const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('不支持上传该格式的图片，推荐 jpg 或 png')
  }
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('不能上传超过 10M 的图片')
  }
  return isJpgOrPng && isLt10M
}

const loading = ref<boolean>(false)

/**
 * 上传
 * @param file
 */
const handleUpload = async ({ file }: any) => {
  loading.value = true
  try {
    const requestBody: API.uploadPictureUsingPOST1Params = {
      spaceId: props.spaceId, // 无论更新还是新增，都传递 spaceId
    };

    if (props.picture?.id) {
      requestBody.id = props.picture.id;
    }

    // 第一个参数 params (URL query params) 在这种情况下是空的 {}
    // 第二个参数 requestBody 包含 id 和 spaceId，这些会被添加到 FormData
    // 第三个参数 file 是要上传的图片文件，会被以 'multipartFile' 的键添加到 FormData
    const res = await uploadPictureUsingPost1({}, requestBody, file)
    if (res.data.code === 200 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    console.error('图片上传失败:', error);
    message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}
//一进页面从父组件读取spaceId
onMounted(
  () => {
    console.log(props.picture)
  }
)
</script>

<style scoped>
.picture-upload :deep(.ant-upload) {
  width: 100% !important;
  height: 100% !important;
  min-height: 152px;
  min-width: 152px;
}

.picture-upload img {
  max-width: 100%;
  max-height: 480px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
