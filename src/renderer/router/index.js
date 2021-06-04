import Vue from 'vue'
import Router from 'vue-router'
import Market from '../pages/search/subpages/market';
import Dev from '../pages/search/subpages/dev';
import Installed from '../pages/search/subpages/plugin';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'search',
      component: require('@/pages/search/index.vue').default,
      children: [
        {
          path: 'market',
          component: Market
        },
        {
          path: 'dev',
          component: Dev
        },
        {
          path: 'plugin',
          component: Installed
        },
      ]
    },
    {
      path: '/plugin',
      name: 'plugin',
      component: require('@/pages/plugins/index.vue').default
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
