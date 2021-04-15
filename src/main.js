import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/theme/index.css'
import '@/common/styles/reset.less'

import '@/common/styles/el-reset.less'
// import '@/common/styles/vxe-reset.less'
import '@/common/styles/adapt.less'
import '@/common/styles/icon-set.less'
// import '@/common/utils/permission'

import axios from './common/network/request'
import '@/common/commonData/gobalComponents'
import debounce from '@/common/utils/debounce'

import '@/common/styles/common.less'
// 挂载请求
Vue.prototype.$request = axios
// 挂载防抖函数
Vue.prototype.$debounce = debounce
Vue.use(ElementUI)

// Vue.use(VXETable)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
