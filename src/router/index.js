import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/shop',
    name: 'Shop',
    meta: { title: '店铺信息', isShowHead: true },
    component: () => import('@/views/shop/index.vue')
  },
  // {
  //   path: '/brand',
  //   name: 'brand',
  //   meta: { title: '品牌分析', keepAlive: true, isShowHead: true },
  //   component: () => import('@/views/Brand/index.vue')
  // },
  // {
  //   path: '/commodity',
  //   name: 'commodity',
  //   meta: { title: '商品分析', keepAlive: true, isShowHead: true },
  //   component: () => import('@/views/commodity/index.vue')
  // },
  // {
  //   path: '/promot',
  //   name: 'Promot',
  //   meta: { title: '', keepAlive: true },
  //   component: () => import('@/views/index/index.vue')
  // },
  // {
  //   path: '/trendPromot',
  //   name: 'TrendPromot',
  //   meta: { title: '' },
  //   component: () => import('@/views/chart/trendPromot.vue')
  // },
  // {
  //   path: '/trendDataType',
  //   name: 'TrendDataType',
  //   meta: { title: '' },
  //   component: () => import('@/views/chart/trendDataType.vue')
  // },
  {
    path: '/401',
    name: 'forbidden',
    component: () => import('@/views/401/index.vue')
  },
  {
    path: '*',
    name: 'None',
    component: () => import('@/views/404/index.vue')
  }
]

const router = new VueRouter({
  routes
})
// 捕获路由异常
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
