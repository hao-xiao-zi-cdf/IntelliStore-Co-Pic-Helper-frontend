<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/" class="web-tar">
          <img src="../assets/logo.jpg" class="logo" alt="logo" />
          <div class="title">智图协作助手</div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
<!--      用户信息展示栏-->
      <a-col flex="100px">
        <div v-if="loginUserStore.loginUser && loginUserStore.loginUser.id !== undefined" class="user-info">
          <a-dropdown>
            <!-- 默认插槽：触发 Dropdown 的元素 -->
            <a-avatar :src="loginUserStore.loginUser.userAvatar" />
            <!-- overlay 插槽：下拉菜单内容 -->
            <template #overlay>
              <a-menu>
                <a-menu-item @click="doLogout">
                  <LogoutOutlined/>
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div v-else>
          <a-button type="primary" href="/user/login">登录</a-button>
        </div>
      </a-col>

    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
import { MailOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'

import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLogoutUsingPost } from '@/api/yonghumokuaixiangguanjiekou.ts'

const loginUserStore = useLoginUserStore()
loginUserStore.fetchLoginUser()
const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(MailOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    icon: () => h(AppstoreOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '',
    label: h('a', { href: 'https://baidu.com', target: '_blank' }, '百度'),
    title: '百度',
  },
])

const router = useRouter()
//路由跳转事件
const doMenuClick = ({ key }) => {
  router.push({
    path: key,
  })
}
//当前要高亮的菜单项
const current = ref<string[]>([])
//监听路由变化，更新高亮菜单项
router.afterEach((to, from, next) => {
  current.value = [to.path]
})

const doLogout = async () => {
  const res = await userLogoutUsingPost();
  if(res.data.code == 200 && res.data.data){
    await loginUserStore.setLoginUser({
      userName: "未登录",
    });
    message.success("退出成功")
    router.push({
      path: '/user/login',
      replace: true
    });
  }else{
    message.error("退出失败")
  }
}
</script>
<style scoped>
#globalHeader .web-tar {
  display: flex;
  align-items: center;
}

.logo {
  height: 45px;
}

.title {
  font-size: 20px;
  color: black;
  margin-left: 16px;
}

</style>
