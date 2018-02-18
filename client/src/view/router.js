import Vue from 'vue'
import VueRouter from 'vue-router'

import PageNames from '@/consts/PageNames'
import IndexPage from '@/view/pages/IndexPage'

import Database from '@/model/Database'

Vue.use(VueRouter)

const isAuthorized = function (next, redirect, reverse = false) {
  Database.isAuthorized()
    .then(user => {
      console.log('> Router -> isAuthorized =', user)
      if (reverse ? user == null : user != null) next()
      else Router.replace({ name: redirect })
    })
}

const Router = new VueRouter({
  routes: [
    {
      path: '/',
      name: PageNames.INDEX,
      component: IndexPage
    },
    {
      path: '/gallery',
      name: PageNames.GALLERY,
      component: () => import('@/view/pages/GalleryPage'),
      beforeEnter (to, from, next) {
        isAuthorized(next, PageNames.ENTRANCE)
      },
      beforeRouteLeave (to, from, next) {
        next()
      }
    },
    {
      path: '/entrance',
      name: PageNames.ENTRANCE,
      component: () => import('@/view/pages/EntrancePage'),
      beforeEnter (to, from, next) {
        isAuthorized(next, PageNames.INDEX, true)
      },
      beforeRouteLeave (to, from, next) {
        next()
      }
    }
  ],
  mode: 'history'
})

export default Router
