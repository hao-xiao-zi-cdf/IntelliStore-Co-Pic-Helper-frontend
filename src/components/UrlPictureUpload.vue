<template>
  <div class="url-picture-upload">
    <a-input-group compact style="margin-bottom: 16px">
      <a-input v-model:value="fileUrl" style="width: calc(100% - 120px)" placeholder="请输入图片 URL" />
      <a-button type="primary" :loading="loading" @click="handleUpload" style="width: 120px">提交</a-button>
    </a-input-group>
    <img v-if="picture?.url" :src="picture?.url" alt="avatar" />
  </div>
</template>

<script setup lang="ts">

import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { uploadPictureUsingPost } from '@/api/tupianxiangguanjiekou.ts'

const loading = ref<boolean>(false)
const fileUrl = ref<string>()
interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}
const props = defineProps<Props>()

/**
 * 上传
 */
const handleUpload = async () => {
  loading.value = true
  try {
    const params: API.PictureUploadDTO = { fileUrl: fileUrl.value , spaceId: props.spaceId}
    if (props.picture) {
      params.id = props.picture.id
    }
    const res = await uploadPictureUsingPost(params)
    if (res.data.code === 200 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  } catch (error) {
    message.error('图片上传失败')
  } finally {
    loading.value = false
  }
}


</script>

<style scoped>

</style>
