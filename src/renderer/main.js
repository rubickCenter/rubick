import Vue from 'vue'
import axios from 'axios'
import Antd from 'ant-design-vue'

import App from './App'
import router from './router'
import store from './store'

import './assets/ant-reset.less'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Antd)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

store.dispatch('search/init')
