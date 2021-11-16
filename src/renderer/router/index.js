import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'main',
      component: require('@/pages/main/index.vue').default
    },
    {
      path: '/market',
      name: 'market',
      component: require('@/pages/market/index.vue').default
    },
    {
      path: '/installed',
      name: 'installed',
      component: require('@/pages/installed/index.vue').default
    },
    {
      path: '/settings',
      name: 'settings',
      component: require('@/pages/settings/index.vue').default
    },
    {
      path: '/dev',
      name: 'dev',
      component: require('@/pages/dev/index.vue').default
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
