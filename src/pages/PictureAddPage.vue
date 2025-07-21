<script setup lang="ts">
import { ref } from 'vue'
const picture = ref<API.PictureVO>()
const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
}

</script>

<template>
  <div id="pictureAddPage">
    <PictureUpload :picture="picture" :onSuccess="onSuccess" />

  </div>
</template>

<style scoped>
#pictureAddPage {

}
</style>
