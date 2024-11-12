import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/language',
      name: 'Language',
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
    },
    {
      path: '/setting/signature',
      name: 'setting/signature',
      component: () => import('../views/setting.vue'),
    },
    {
      path: '/setting/nickname',
      name: 'setting/nickname',
      component: () => import('../views/setting.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserView.vue'),
    },
  ],
})

export default router
