<template>
  <div id="pictureManage">
    <a-flex justify="space-between">
      <a-space>
        <a-button type="primary" href="/picture/add" target="_blank">+ 创建图片</a-button>
        <a-button type="primary" href="/picture/batchFetch" target="_blank" ghost
          >+ 批量创建图片</a-button
        >
      </a-space>
    </a-flex>
    <!-- 表单-->
    <a-form style="margin-top: 12px" layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="关键词" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="从名称和简介搜索"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="类型" name="category">
        <a-input v-model:value="searchParams.category" placeholder="请输入类型" allow-clear />
      </a-form-item>
      <a-form-item label="标签" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          mode="tags"
          placeholder="请输入标签"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="审核状态" name="reviewStatus">
        <a-select
          v-model:value="searchParams.reviewStatus"
          :options="PIC_REVIEW_STATUS_OPTIONS"
          placeholder="请输入审核状态"
          style="min-width: 180px"
          allow-clear
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <!-- 表格-->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
      style="margin-top: 8px"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" :width="120" />
        </template>
        <!-- ID 显示优化 -->
        <template v-if="column.dataIndex === 'id'">
          <div class="id-display">
            <a-tooltip :title="`完整ID: ${record.id}`">
              <span class="id-text">{{ record.id.toString().slice(-6) }}</span>
            </a-tooltip>
            <a-button
              type="text"
              size="small"
              @click="copyToClipboard(record.id.toString())"
              class="copy-btn"
            >
              <template #icon>📋</template>
            </a-button>
          </div>
        </template>
        <!-- 用户ID 显示优化 -->
        <template v-if="column.dataIndex === 'userId'">
          <div class="user-id-display">
            <a-tooltip :title="`完整用户ID: ${record.userId}`">
              <a-tag color="blue" class="user-id-tag">
                {{ record.userId ? record.userId.toString().slice(-4) : 'N/A' }}
              </a-tag>
              <a-button
                type="text"
                size="small"
                @click="copyToClipboard(record.userId.toString())"
                class="copy-btn"
              >
                <template #icon>📋</template>
              </a-button>
            </a-tooltip>
          </div>
        </template>
        <!-- 标签 -->
        <template v-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">{{ tag }}</a-tag>
          </a-space>
        </template>
        <!-- 图片信息优化 -->
        <template v-if="column.dataIndex === 'picInfo'">
          <div class="pic-info-container">
            <a-popover placement="topLeft" trigger="hover">
              <template #content>
                <div class="pic-info-detail">
                  <div class="info-row">
                    <span class="info-label">格式：</span>
                    <span class="info-value">{{ record.picFormat }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">尺寸：</span>
                    <span class="info-value">{{ record.picWidth }} × {{ record.picHeight }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">宽高比：</span>
                    <span class="info-value">{{ record.picScale }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">大小：</span>
                    <span class="info-value">{{ (record.picSize / 1024).toFixed(2) }}KB</span>
                  </div>
                </div>
              </template>
              <div class="pic-info-summary">
                <div class="format-badge">{{ record.picFormat }}</div>
                <div class="size-text">{{ record.picWidth }}×{{ record.picHeight }}</div>
                <div class="file-size">{{ (record.picSize / 1024).toFixed(2) }}KB</div>
              </div>
            </a-popover>
          </div>
        </template>
        <!-- 审核信息优化 -->
        <template v-if="column.dataIndex === 'reviewMessage'">
          <div class="review-info-container">
            <a-popover placement="topLeft" trigger="hover" overlayClassName="review-popover">
              <template #content>
                <div class="review-info-detail">
                  <div class="info-row">
                    <span class="info-label">审核状态：</span>
                    <a-tag :color="getReviewStatusColor(record.reviewStatus)">
                      {{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}
                    </a-tag>
                  </div>
                  <div class="info-row">
                    <span class="info-label">审核信息：</span>
                    <span class="info-value">{{ record.reviewMessage || '暂无' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">审核人：</span>
                    <span class="info-value">{{ record.reviewerId || '系统' }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">审核时间：</span>
                    <span class="info-value">
                      {{
                        record.reviewTime
                          ? dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss')
                          : '暂无'
                      }}
                    </span>
                  </div>
                </div>
              </template>
              <div class="review-info-summary">
                <a-tag :color="getReviewStatusColor(record.reviewStatus)" class="status-tag">
                  {{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}
                </a-tag>
                <div class="review-time" v-if="record.reviewTime">
                  {{ dayjs(record.reviewTime).format('MM-DD HH:mm') }}
                </div>
              </div>
            </a-popover>
          </div>
        </template>

        <!-- 时间显示优化 -->
        <template v-else-if="column.dataIndex === 'createTime'">
          <div class="time-display">
            <a-tooltip :title="dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')">
              <div class="time-compact">
                <div class="date-part">{{ dayjs(record.createTime).format('MM-DD') }}</div>
                <div class="time-part">{{ dayjs(record.createTime).format('HH:mm') }}</div>
              </div>
            </a-tooltip>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          <div class="time-display">
            <a-tooltip :title="dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss')">
              <div class="time-compact">
                <div class="date-part">{{ dayjs(record.editTime).format('MM-DD') }}</div>
                <div class="time-part">{{ dayjs(record.editTime).format('HH:mm') }}</div>
              </div>
            </a-tooltip>
          </div>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS"
              type="link"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              通过
            </a-button>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="link"
              danger
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              拒绝
            </a-button>
            <a-button type="link" :href="`/add_picture?id=${record.id}`" target="_blank"
              >编辑
            </a-button>
            <a-button type="link" danger @click="doDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { getPictureListUsingPost, pictureDeleteUsingDelete, pictureReviewUsingPost, } from '@/api/tupianxiangguanjiekou.ts'
import { PIC_REVIEW_STATUS_ENUM, PIC_REVIEW_STATUS_MAP, PIC_REVIEW_STATUS_OPTIONS, } from '@/constants/picture.ts'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '图片',
    dataIndex: 'url',
    width: 140,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'category',
    width: 80,
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 120,
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
    width: 140,
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
    width: 140,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100,
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
  },
]

// 数据
const dataList = ref<API.Picture[]>([])
const total = ref(0)

// 搜索条件
const searchParams = reactive<API.PictureQueryDTO>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
  }
})

// 获取数据
const fetchData = async () => {
  const res = await getPictureListUsingPost({
    ...searchParams,
    nullSpaceId: true,
  })
  message.success('获取数据成功')
  if (res.data.code === 200 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 页面加载时请求一次
onMounted(() => {
  fetchData()
})

// 获取数据
const doSearch = () => {
  // 重置搜索条件
  searchParams.current = 1
  fetchData()
}

// 表格变化处理
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

// 删除数据
const doDelete = async (id: number) => {
  if (!id) {
    return
  }
  const res = await pictureDeleteUsingDelete({ id: id })
  if (res.data.code === 200) {
    message.success('删除成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}

const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员操作通过' : '管理员操作拒绝'
  const res = await pictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 200) {
    message.success('审核操作成功')
    // 重新获取列表
    fetchData()
  } else {
    message.error('审核操作失败，' + res.data.message)
  }
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    message.success('已复制到剪贴板')
  } catch (err) {
    message.error('复制失败')
  }
}

// 获取审核状态颜色
const getReviewStatusColor = (status: number) => {
  switch (status) {
    case PIC_REVIEW_STATUS_ENUM.PASS:
      return 'green'
    case PIC_REVIEW_STATUS_ENUM.REJECT:
      return 'red'
    default:
      return 'orange'
  }
}
</script>

<style scoped>
/* ID显示样式 */
.id-display {
  display: flex;
  align-items: center;
  gap: 4px;
}

.id-text {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.copy-btn {
  padding: 0 4px !important;
  height: 20px !important;
  font-size: 10px;
  opacity: 0.6;
}

.copy-btn:hover {
  opacity: 1;
}

/* 用户ID显示样式 */
.user-id-display {
  display: flex;
  justify-content: center;
}

.user-id-tag {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 11px;
  margin: 0;
}

/* 时间显示样式 */
.time-display {
  display: flex;
  justify-content: center;
}

.time-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  line-height: 1.2;
}

.date-part {
  color: #333;
  font-weight: 500;
}

.time-part {
  color: #666;
  font-size: 11px;
}

/* 图片信息样式 */
.pic-info-container {
  display: flex;
  justify-content: center;
}

.pic-info-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

.pic-info-summary:hover {
  background: #f0f0f0;
  border-color: #d9d9d9;
}

.format-badge {
  background: #1890ff;
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: 500;
}

.size-text {
  font-size: 11px;
  color: #666;
  line-height: 1;
}

.file-size {
  font-size: 10px;
  color: #999;
  line-height: 1;
}

.pic-info-detail {
  padding: 8px 0;
  min-width: 200px;
}

/* 审核信息样式 */
.review-info-container {
  display: flex;
  justify-content: center;
}

.review-info-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: 6px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

.review-info-summary:hover {
  background: #f0f0f0;
}

.status-tag {
  margin: 0;
  font-size: 11px;
}

.review-time {
  font-size: 10px;
  color: #999;
  line-height: 1;
}

.review-info-detail {
  padding: 8px 0;
  min-width: 250px;
}

/* 信息行通用样式 */
.info-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  line-height: 1.4;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 500;
  color: #333;
  min-width: 70px;
  flex-shrink: 0;
}

.info-value {
  color: #666;
  word-break: break-all;
  flex: 1;
}

/* Popover样式优化 */
:deep(.review-popover .ant-popover-inner-content) {
  padding: 12px;
}

/* 表格整体优化 */
:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 500;
}

:deep(.ant-table-tbody > tr > td) {
  padding: 12px 8px;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background: #f8f9fa;
}
</style>
