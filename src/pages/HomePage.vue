<template>
  <div id="homePage">
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

    <PictureList
      :dataList="dataList"
      :loading="loading"
      :onReload="fetchData"
      showOp
    />
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `共 ${total} 条`"
      @change="onPageChange" />

    <a-float-button
      v-if="showBackTop"
      @click="scrollToTop"
      type="primary"
      :style="{ right: '24px', top: '50%', transform: 'translateY(-50%)' }"
    >
      <template #icon>
        <up-outlined />
      </template>
    </a-float-button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, onUnmounted } from 'vue'
import { getPictureVoListByCacheUsingPost, listPictureTagCategoryUsingGet } from '@/api/tupianxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import PictureList from '@/components/PictureList.vue'
import { UpOutlined } from '@ant-design/icons-vue'; // 导入图标

const dataList = ref<any>([])
const total = ref(0)
const loading = ref(true)
const showBackTop = ref(false) // 控制回到顶部按钮的显示

const searchParams = reactive<API.PictureQueryDTO>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const onPageChange = (page, pageSize) => {
  searchParams.current = page
  searchParams.pageSize = pageSize
  fetchData()
}

onMounted(() => {
  fetchData()
  getTagCategoryOptions()
  window.addEventListener('scroll', handleScroll); // 监听滚动事件
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll); // 移除滚动事件监听
})

const handleScroll = () => {
  // 当页面滚动超过一定距离时显示按钮
  showBackTop.value = window.scrollY > 200;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 平滑滚动
  });
};

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

const handleDelete = (picture) => {
  // 重新刷新数据
  fetchData()
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
</style>
