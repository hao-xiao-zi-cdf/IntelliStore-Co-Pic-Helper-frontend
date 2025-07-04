<template>
  <div id="globalHeader">
    <a-row :wrap="false">
      <a-col flex="200px">
        <router-link to="/" class="web-tar">
          <img src="../assets/logo.jpg" class="logo" alt="logo"/>
          <div class="title">智图协作助手</div>
        </router-link>
      </a-col>
      <a-col flex="auto">
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="doMenuClick"/>
      </a-col>
      <a-col flex="100px">
        <a-button type="primary" href="/user/login">登录</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import { useRouter } from 'vue-router'
const items = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(MailOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/about',
    icon: () => h(AppstoreOutlined),
    label: '关于',
    title: '关于',
  },
  {
    key: '',
    label: h('a', { href: 'https://baidu.com', target: '_blank' }, '百度'),
    title: '百度',
  },
]);
const router = useRouter();
//路由跳转事件
const doMenuClick = ({ key }) => {
  router.push({
    path: key
  })
}
//当前要高亮的菜单项
const current = ref<string[]>([]);
//监听路由变化，更新高亮菜单项
router.afterEach((to, from, next) => {
  current.value = [to.path];
})
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
  font-size:  20px;
  color: black;
  margin-left: 16px;
}
</style>

