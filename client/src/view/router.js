import Vue from 'vue'
import Router from 'vue-router'

import IndexPage from '@/view/pages/IndexPage'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    },
    {
      path: '/gallery',
      name: 'GalleryPage',
      component: () => import('@/view/pages/GalleryPage'),
      beforeEnter (to, from, next) {
        next()
      },
      beforeRouteLeave (to, from, next) {
        next()
      }
    }
  ],
  mode: 'history'
})

export default router
