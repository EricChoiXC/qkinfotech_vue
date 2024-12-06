import { createRouter, createWebHistory } from 'vue-router'
import { renderIcon } from '@/utils/index'
import { Home, ExtensionPuzzle, Paw } from '@vicons/ionicons5'
import { EmptyRouterView } from '@/components/EmptyRouterView'

const WorkbenchLayout = () => import('@/layout/opdesk/index.vue')

const moduleRoutes = import.meta.glob('../apps/**/module.js', { eager: true })

console.log(moduleRoutes)


// 生成路由表示例
const routes = [

  {
    path: '/apps',
    component: WorkbenchLayout,
    children: [
      {
        path: 'group1',
        label: '行政管理',
        component: EmptyRouterView,
        children: [
          {
            path: 'app1',
            label: '用车管理',
            component: EmptyRouterView,
            children: [
              {
                path: 'fnc1',
                label: '用车申请',
                name: 'group1-app1-fnc1',
                component: () => import('@/apps/group1/app1/fnc1/fnc1.vue'),
                meta: {},
              },
              {
                path: 'fnc2',
                label: '用车查询',
                name: 'group1-app1-fnc2',
                component: () => import('@/apps/group1/app1/fnc2/fnc2.vue'),
                meta: {},
              },

            ]
          },

          {
            path: 'app2',
            label: '会议管理',
            component: EmptyRouterView,
            children: [
              {
                path: 'fnc1',
                label: '预定会议',
                name: 'group1-app2-fnc1',
                component: () => import('@/apps/group1/app2/fnc1/fnc1.vue'),
                meta: {},
              },
              {
                path: 'fnc2',
                label: '会议查询',
                name: 'group1-app2-fnc2',
                component: () => import('@/apps/group1/app2/fnc2/fnc2.vue'),
                meta: {},
              },
            ]
          },
        ]
      },

      {
        path: 'group2',
        label: '项目管理',
        component: EmptyRouterView,
        children: [
          {
            path: 'app1',
            label: '开拓阶段',
            component: EmptyRouterView,
            children: [
              {
                path: 'fnc1',
                label: '项目申请',
                name: 'group2-app1-fnc1',
                component: () => import('@/apps/group2/app1/fnc1/fnc1.vue'),
                meta: {},
              },
              {
                path: 'fnc2',
                label: '项目审批',
                name: 'group2-app1-fnc2',
                component: () => import('@/apps/group2/app1/fnc2/fnc2.vue'),
                meta: {},
              },
            ]
          },

          {
            path: 'app2',
            label: '实施阶段',
            component: EmptyRouterView,
            children: [
              {
                path: 'fnc1',
                label: '项目查询',
                name: 'group2-app2-fnc1',
                component: () => import('@/apps/group2/app1/fnc1/fnc1.vue'),
                meta: {},
              },

            ]
          },


        ]
      },

      {
        path: 'group3',
        label: '用户管理',
        component: EmptyRouterView,
        children: [
          {
            path: 'app1',
            label: '专家管理',
            component: EmptyRouterView,
            children: [
              {
                path: 'fnc1',
                label: '专家查询',
                name: 'group2-app1-fnc1',
                component: () => import('@/apps/group2/app1/fnc1/fnc1.vue'),
                meta: {},
              },
              {
                path: 'fnc2',
                label: '专家注册',
                name: 'group2-app1-fnc2',
                component: () => import('@/apps/group2/app1/fnc2/fnc2.vue'),
                meta: {},
              },
            ]
          },

          {
            path: 'app2',
            label: '供应商',
            component: EmptyRouterView,
            children: [
              {
                path: 'fnc1',
                label: '供应商查询',
                name: 'group3-app2-fnc1',
                component: () => import('@/apps/group2/app1/fnc1/fnc1.vue'),
                meta: {},
              },
              {
                path: 'fnc2',
                label: '供应商注册',
                name: 'group3-app2-fnc2',
                component: () => import('@/apps/group2/app1/fnc2/fnc2.vue'),
                meta: {},
              },
              {
                path: 'fnc3',
                label: '统计报表',
                name: 'group3-app2-fnc3',
                component: () => import('@/apps/group2/app1/fnc2/fnc2.vue'),
                meta: {},
                children: [
                  {
                    path: '1',
                    label: '应标次数',
                  },

                  {
                    path: '2',
                    label: '中标比例',
                  },


                  {
                    path: '3',
                    label: '应标金额',
                  },


                ]
              },
            ]
          }

        ]
      },

    ]
  },

  {
    path: '/',
    redirect: '/apps/group1/app1/fnc1',
  },

]

window['$routerList'] = routes


const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
