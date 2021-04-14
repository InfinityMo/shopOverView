/*
function：全局路由拦截
author：Infinity
time：2020-8-17
*/
import router from '@/router/index'
import store from '@/store/index'

router.beforeEach((to, from, next) => {
  const whiteList = ['/401', '/403', '/404']

  if (to.path === '/') {
    // 进入首页时将loading取消
    store.commit('SETSPINNING', false)
    next()
    return
  }
  if (whiteList.includes(to.path)) {
    next()
    return
  }
  const userData = JSON.parse(sessionStorage.getItem('userData')) || {}

  // userData && Object.keys(userData).length > 0 ? : to.path = '/'
  if (Object.keys(userData).length > 0) {
    next()
  } else {
    next('/')
  }
})
