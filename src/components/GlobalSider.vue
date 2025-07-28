<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.id"
      class="sider"
      width="200"
      breakpoint="lg"
      collapsed-width="80"
      collapsible
      v-model:collapsed="collapsed"
      @collapse="onCollapse"
      :trigger="null"
    >
      <div class="logo-container" @click="toggleCollapsed">
        <router-link to="#" class="sider-web-title">
          <MenuUnfoldOutlined/>
        </router-link>
      </div>

      <a-menu
        mode="inline"
        v-model:selectedKeys="current"
        :items="menuItems"
        @click="doMenuClick"
        class="sider-menu"
      />
    </a-layout-sider>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, PictureOutlined, MenuUnfoldOutlined, TeamOutlined } from '@ant-design/icons-vue' // 确保引入 HomeOutlined
import { useRouter, useRoute } from 'vue-router' // 引入 useRoute
import { computed, h, ref, watch, watchEffect } from 'vue' // 引入 watch
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { type MenuProps, message } from 'ant-design-vue'
import { SPACE_TYPE_ENUM } from '@/constants/spaceUser.ts'
import { listMyTeamSpaceUsingPost } from '@/api/spaceUserController.ts' // 引入 MenuProps

const loginUserStore = useLoginUserStore()
const router = useRouter()
const route = useRoute() // 获取当前路由信息

// --- 新增：侧边栏收缩状态和逻辑 ---
const collapsed = ref<boolean>(false) // 侧边栏的收缩状态
const onCollapse = (isCollapsed: boolean, type: string) => {
  // console.log(isCollapsed, type); // 可以用于调试
  collapsed.value = isCollapsed
}
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}
// --- 结束新增 ---

// 菜单列表 (根据你提供的GlobalSider.vue文件内容进行填充)
const originMenuItems = [
  {
    key: '/',
    label: '公共图库',
    icon: () => h(PictureOutlined),
  },
  {
    key: '/space/my',
    label: '我的空间',
    icon: () => h(UserOutlined),
  },
  {
    key: '/space/add?type=' + SPACE_TYPE_ENUM.TEAM,
    label: '创建团队',
    icon: () => h(TeamOutlined),
  },
]

// 当前选中菜单
const current = ref<string[]>([])
// 监听路由变化，更新当前选中菜单
router.afterEach((to, from, failure) => {
  current.value = [to.path]
})

const teamSpaceList = ref<API.SpaceUserVO[]>([])
// 删除 filterAndSetMenuItems 函数和对 menuItems.value 的赋值操作
// 修改 menuItems computed 如下：

const menuItems = computed(() => {
  // 过滤原始菜单项（根据权限等）
  const filteredOriginMenuItems = originMenuItems.filter((menu: any) => {
    // 示例：可以在这里添加权限判断逻辑
    return true
  })

  // 没有团队空间，只展示固定菜单
  if (teamSpaceList.value.length < 1) {
    return filteredOriginMenuItems
  }

  // 展示团队空间分组
  const teamSpaceSubMenus = teamSpaceList.value.map((spaceUser) => {
    const space = spaceUser.space
    return {
      key: '/space/' + spaceUser.spaceId,
      label: space?.spaceName,
    }
  })

  const teamSpaceMenuGroup = {
    type: 'group',
    label: '我的团队',
    key: 'teamSpace',
    children: teamSpaceSubMenus,
  }

  return [...filteredOriginMenuItems, teamSpaceMenuGroup]
})

// 加载团队空间列表
const fetchTeamSpaceList = async () => {
  const res = await listMyTeamSpaceUsingPost()
  if (res.data.code === 200 && res.data.data) {
    teamSpaceList.value = res.data.data
  } else {
    message.error('加载我的团队空间失败，' + res.data.message)
  }
}

/**
 * 监听变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  // 登录才加载
  if (loginUserStore.loginUser.id) {
    fetchTeamSpaceList()
  }
})

// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  // 检查 key 是否包含查询参数
  if (key.includes('?')) {
    // 分离路径和查询字符串
    const [path, queryString] = key.split('?')

    // 解析查询参数
    const query: Record<string, string> = {}
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=')
      if (key && value !== undefined) {
        query[key] = value
      }
    })

    // 使用解析后的路径和查询参数进行跳转
    router.push({
      path,
      query
    })
  } else {
    // 没有查询参数的情况，直接跳转
    router.push({
      path: key
    })
  }
}

</script>

<style scoped>
#globalSider {
  height: 100%;
}

.sider {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08); /* 侧边栏阴影 */
  z-index: 5; /* 确保在内容之上，但在头部之下 */
  background: #001529; /* Ant Design 侧边栏默认背景色 */
  transition: all 0.2s; /* 添加过渡效果使收缩更平滑 */
}

/* Logo 和标题区域样式 */
.logo-container {
  height: 64px; /* 与头部高度保持一致 */
  display: flex;
  align-items: center;
  justify-content: center; /* 水平居中 */
  background: #a7a6e1; /* Ant Design 侧边栏默认背景色 */
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer; /* 添加手型光标表示可点击 */
  white-space: nowrap; /* 防止内部元素换行 */
  overflow: hidden; /* 隐藏超出部分 */
  transition: all 0.2s; /* 确保容器宽度变化平滑 */
}

.sider-web-title {
  display: flex;
  align-items: center;
  color: #ffffff;
  text-decoration: none;
  /* width: 100%; 不再需要，由flex容器控制 */
  justify-content: center; /* 确保 logo 和文本在容器内居中 */
}

.sider-logo {
  height: 32px; /* logo大小 */
  margin-right: 8px;
  transition: margin 0.2s; /* 添加过渡效果 */
}

/* 侧边栏收缩时 logo 样式调整 */
.sider.ant-layout-sider-collapsed .sider-logo {
  margin-right: 0; /* 收缩时移除右边距，让 logo 居中 */
}

.sider-title-text {
  opacity: 1; /* 初始完全可见 */
  width: auto; /* 初始宽度自适应 */
  overflow: hidden;
  text-overflow: ellipsis;
  transition:
    opacity 0.2s,
    width 0.2s; /* 添加过渡效果 */
}

/* 侧边栏收缩时标题文字隐藏 */
.sider.ant-layout-sider-collapsed .sider-title-text {
  opacity: 0; /* 隐藏文字 */
  width: 0; /* 宽度变为0，不占空间 */
}

.sider-menu {
  height: calc(100% - 64px); /* 菜单高度减去logo高度 */
  overflow-y: auto; /* 允许菜单内容滚动 */
}
</style>
