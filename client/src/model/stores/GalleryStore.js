import Vue from 'vue'
import Vuex from 'vuex'

import GalleryVO from '@/vos/GalleryVO'

import GalleryAction from '@/consts/actions/GalleryAction'
import GalleryGetter from '@/consts/getters/GalleryGetter'

import GetGalleryPageCommand from '@/controller/commands/GetGalleryPageCommand'
import NavigateGalleryPageCommand from '@/controller/commands/NavigateGalleryPageCommand'

Vue.use(Vuex)

export default new Vuex.Store({
  state: GalleryVO.default(),
  actions: {
    [GalleryAction.GET_GALLERY_PAGE] (store) {
      let galleryVO = store.state
      console.log('> GalleryStore > GalleryAction.GET_GALLERY_PAGE > getGalleryData')
      return new GetGalleryPageCommand()
        .execute(galleryVO.index, galleryVO.quantity)
        .then(result => {
          console.log('> GalleryStore > GetGalleryDataCommand > result:', result)
          galleryVO.page = result
          return true
        }, (error) => {
          console.log('> GalleryStore > GetGalleryDataCommand > error:', error)
          return false
        })
    },
    [GalleryAction.NAVIGATE] (store, increment) {
      console.log(increment)
      console.log('> GalleryStore > GalleryAction.NAVIGATE > increment: ' + increment)
      let galleryVO = store.state
      new NavigateGalleryPageCommand()
        .execute(galleryVO.index, galleryVO.quantity, galleryVO.page.limit, increment)
        .then(result => {
          console.log('> GalleryStore > NavigateGalleryPageCommand > result:', result)
          if (result) {
            galleryVO.page = result
            galleryVO.index += increment
          }
          return result != null
        }, (error) => {
          console.log('> GalleryStore > NavigateGalleryPageCommand > error:', error)
          return false
        })
    }
  },
  getters: {
    [GalleryGetter.IS_NAVIGATE_POSSIBLE_PREV]: state => { return state.index > 1 },
    [GalleryGetter.IS_NAVIGATE_POSSIBLE_NEXT]: state => { return state.index < state.page.limit }
  },
  mutations: {
  }
})
