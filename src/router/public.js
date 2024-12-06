import { createRouter, createWebHistory } from 'vue-router'
import { createRouterGuards } from './router-guards'

import context from '@/context.js'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      label: '登陆',
      key: 'login',
    },
  },
  {
    path: '/thirdLogin',
    name: 'thirdLogin',
    component: () => import('@/views/login/thirdLogin.vue'),
    meta: {
      label: '第三方登陆',
      key: 'thirdLogin',
    },
  }
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: "NotFound",
  //   component: () => import('@/views/common/404.vue'),
  // }
]

const router = createRouter({
  history: createWebHistory(context.path + '/'),
  routes: routes,
  scrollBehavior: () => ({
    top: 0,
  }),
})

createRouterGuards(router)
export default router
