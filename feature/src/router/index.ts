import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/result',
    name: 'result',
    component: () => import('../views/market/components/result.vue'),
  },
  {
    path: '/devPlugin',
    name: 'devPlugin',
    component: () => import('../views/market/components/devlopment.vue'),
  },
  {
    path: '/image',
    name: 'image',
    component: () => import('../views/market/components/image.vue'),
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('../views/market/components/tools.vue'),
  },
  {
    path: '/worker',
    name: 'worker',
    component: () => import('../views/market/components/worker.vue'),
  },
  {
    path: '/system',
    name: 'system',
    component: () => import('../views/market/components/system.vue'),
  },
  {
    path: '/finder',
    name: 'finder',
    component: () => import('../views/market/components/finder.vue'),
  },
  {
    path: '/installed',
    name: 'installed',
    component: () => import('../views/installed/index.vue'),
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/account/index.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/settings/user.vue'),
  },
  {
    path: '/dev',
    name: 'dev',
    component: () => import('../views/dev/index.vue'),
  },
  {
    path: '/:catchAll(.*)',
    name: 'finder',
    component: () => import('../views/market/components/finder.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
