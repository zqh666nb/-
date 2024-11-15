import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LogView from '../views/LogV.vue' //导入LogView 页面

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/log', // 新增登录路由
      name: 'login',
      component: LogView, // 登录页面
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    {
      path: '/language',
      name: 'language',
      component: () => import('../views/language.vue'),
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('../views/record.vue'),
    },
    {
      path: '/record1',
      name: 'record1',
      component: () => import('../views/record1.vue'),
    },
    {
      path: '/record2',
      name: 'record2',
      component: () => import('../views/record2.vue'),
    },
    {
      path: '/record3',
      name: 'record3',
      component: () => import('../views/record3.vue'),
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('../views/setting.vue'),
      children: [
        {
          path: 'signature',
          name: 'setting-signature',
          component: () => import('../views/setting.vue'),
        },
        {
          path: 'nickname',
          name: 'setting-nickname',
          component: () => import('../views/setting.vue'),
        },
      ],
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserView.vue'),
    },
  ],
})

export default router
