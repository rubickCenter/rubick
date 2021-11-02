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
