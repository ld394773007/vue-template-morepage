// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {removeCookie} from '@/common/js/utils/index'
import fastClick from 'fastclick'
import VueQriously from 'vue-qriously'
import dprImg from '@/components/dprImg'
import 'vant/lib/vant-css/index.css'
import './assets/scss/index.scss'

require('es6-promise').polyfill()

const axios = require('axios')

Vue.prototype.$axios = axios
Vue.prototype.$axios.defaults.baseURL = 'https://www.yingyushu.com/fr_u'
// Vue.prototype.$axios.defaults.baseURL = 'http://uc.yys.com'

Vue.prototype.$shopApi = axios.create({
  baseURL: 'https://www.yingyushu.com/fr_shop',
  validateStatus: (status) => {
    if (status === 401 || status === 403 || status === 404) {
      removeCookie('student')
      router.push('/payLogin')
    } else if (status === 200) {
      return true
    }
  }
})

Vue.use(VueQriously)
Vue.use(dprImg)

fastClick.attach(document.body)

// 与原生应用通讯对象初始化
if (window['_dsbridge&&_dsbridge']) {
  window['_dsbridge&&_dsbridge'].init()
}

Vue.config.productionTip = false

Vue.prototype.$shopApi.interceptors.response.use((req) => {
  if (req.data.status === 302) {
    window.sessionStorage.setItem('redirectUrl', window.location.href)
    window.location = req.data.data.url
  }
  return req
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
