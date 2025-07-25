import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import AddPicturePage from '@/pages/AddPicturePage.vue'
import PictureManage from '@/pages/admin/PictureManage.vue'
import PictureDetailPage from '@/pages/PictureDetailPage.vue'
import AddPictureBatchPage from '@/pages/admin/AddPictureBatchPage.vue'
import UserInfoPage from '@/pages/user/UserInfoPage.vue'
import SpaceManagePage from '@/pages/admin/SpaceManagePage.vue'
import AddSpacePage from '@/pages/AddSpacePage.vue'
import MySpacePage from '@/pages/MySpacePage.vue'
import SpaceDetailPage from '@/pages/SpaceDetailPage.vue'
import SearchPicturePage from '@/pages/SearchPicturePage.vue'
import SpaceAnalyzePage from '@/pages/SpaceAnalyzePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/user/login',
      name: 'login',
      component: UserLoginPage,
    },
    {
      path: '/user/register',
      name: 'register',
      component: UserRegisterPage,
    },
    {
      path: '/admin/userManage',
      name: 'userManage',
      component: UserManagePage,
    },
    {
      path: '/picture/add',
      name: 'pictureAdd',
      component: AddPicturePage,
    },
    {
      path: '/admin/pictureManage',
      name: 'pictureManage',
      component: PictureManage,
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailPage,
      props: true,
    },
    {
      path: '/picture/batchFetch',
      name: '批量创建图片',
      component: AddPictureBatchPage,
    },
    {
      path: '/user/info',
      name: '个人中心',
      component: UserInfoPage,
    },
    {
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManagePage,
    },
    {
      path: '/space/add',
      name: '创建空间',
      component: AddSpacePage,
    },
    {
      path: '/space/my',
      name: '我的空间',
      component: MySpacePage,
    },
    {
      path: '/space/:id',
      name: '空间详情',
      component: SpaceDetailPage,
      props: true,
    },
    {
      path: '/picture/search',
      name: '图片搜索',
      component: SearchPicturePage,
    },
    {
      path: '/space/analyze',
      name: '空间分析',
      component: SpaceAnalyzePage,
    }

  ],
})

export default router
