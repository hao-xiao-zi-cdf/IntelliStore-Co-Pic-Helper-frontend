<template>
  <div id="homePage">
    <!-- 搜索框 -->
    <div class="search-bar">
      <div class="search-wrapper">
        <a-input-search
          placeholder="从海量图片中搜索"
          v-model:value="searchParams.searchText"
          enter-button="搜索"
          size="large"
          @search="doSearch"
        />
      </div>
    </div>

    <!-- 分类 + 标签 -->
    <div class="category-tag-wrapper">
      <a-tabs v-model:activeKey="selectedCategory" @change="doSearch" class="animated-tabs">
        <a-tab-pane key="all" tab="全部" />
        <a-tab-pane
          v-for="category in categoryList"
          :key="category"
          :tab="category"
        />
      </a-tabs>

      <div class="tag-bar">
        <span class="tag-label">标签：</span>
        <a-space :size="[0, 8]" wrap>
          <a-checkable-tag
            v-for="(tag, index) in tagList"
            :key="tag"
            v-model:checked="selectedTagList[index]"
            @change="doSearch"
            class="animated-tag"
          >
            {{ tag }}
          </a-checkable-tag>
        </a-space>
      </div>
    </div>

    <!-- 图片列表 -->
    <a-list
      class="picture-list"
      :grid="{ gutter: 8, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :pagination="pagination"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item class="picture-card-wrapper">
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
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { getPictureVoListByCacheUsingPost, listPictureTagCategoryUsingGet } from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const dataList = ref<any>([])
const total = ref(0)
const loading = ref(true)

const searchParams = reactive<API.PictureQueryDTO>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    onChange: (page, pageSize) => {
      searchParams.current = page
      searchParams.pageSize = pageSize
      fetchData()
    },
  }
})

onMounted(() => {
  fetchData()
  getTagCategoryOptions()
})

const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

const router = useRouter()
const doClickPicture = (picture) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}

const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<string[]>([])

const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 200 && res.data.data) {
    categoryList.value = res.data.data.categoryList ?? []
    tagList.value = res.data.data.tagList ?? []
  } else {
    message.error('加载分类标签失败，' + res.data.message)
  }
}

const fetchData = async () => {
  loading.value = true
  const params = {
    ...searchParams,
    tags: [],
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })
  const res = await getPictureVoListByCacheUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}
</script>

<style scoped>
#homePage {
  background: linear-gradient(to right, #f0f2f5, #e6f7ff);
  min-height: 100vh;
  padding: 24px;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.search-wrapper {
  width: 100%;
  max-width: 600px;
  padding: 16px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  animation: fadeInDown 0.5s ease;
}

.search-wrapper :deep(.ant-input-search) {
  border-radius: 10px;
}

.search-wrapper :deep(.ant-input-search-button) {
  border-radius: 0 10px 10px 0;
  transition: all 0.3s ease;
}

.search-wrapper :deep(.ant-input-search-button:hover) {
  background: #40a9ff !important;
  color: white;
}

.category-tag-wrapper {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.6s ease-in-out;
}

.animated-tabs {
  margin-bottom: 16px;
}

.tag-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-in;
}

.tag-label {
  margin-right: 8px;
  font-weight: bold;
  color: #555;
}

.animated-tag {
  transition: all 0.3s;
  padding: 4px 12px;
  border-radius: 20px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
}

.animated-tag:hover {
  transform: scale(1.05);
  color: #1890ff;
  background-color: #e6f7ff;
}

.picture-list {
  animation: fadeInUp 1s ease-in;
}

.picture-card-wrapper {
  padding: 4px !important; /* 缩小列表项之间的间距 */
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
