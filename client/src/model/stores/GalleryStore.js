import GalleryVO from '@/model/vos/gallery/GalleryVO'

import GalleryAction from '@/consts/actions/GalleryAction'
import GalleryGetter from '@/consts/getters/GalleryGetter'
import GalleryMutation from '@/consts/mutations/GalleryMutation'

import GetDataGalleryCommand from '@/controller/commands/gallery/GetDataGalleryCommand'
import NavigateGalleryCommand from '@/controller/commands/gallery/NavigateGalleryCommand'

export default {
  state: new GalleryVO(1, 5),
  strict: true,
  namespaced: true,
  actions: {
    [GalleryAction.GET_GALLERY_VIEW] (store) {
      let galleryVO = store.state
      // console.log('> GalleryStore > GalleryAction.GET_GALLERY_VIEW > getGalleryData', galleryVO)
      return GetDataGalleryCommand.execute(galleryVO.index, galleryVO.quantity)
        .then(result => {
          console.log('> GalleryStore > GetGalleryDataCommand > result:', result)
          store.commit(GalleryMutation.UPDATE_GALLERY_VIEW, result)
          return true
        }, (error) => {
          console.error('> GalleryStore > GetGalleryDataCommand > error:', error)
          return false
        })
    },
    [GalleryAction.NAVIGATE] (store, increment) {
      // console.log('> GalleryStore > GalleryAction.NAVIGATE > increment: ' + increment)
      let galleryVO = store.state
      return NavigateGalleryCommand.execute(galleryVO.index, galleryVO.quantity, galleryVO.view.limit, increment)
        .then(result => {
          // console.log('> GalleryStore > NavigateGalleryCommand > result:', result)
          let success = result != null
          if (success) {
            store.commit(GalleryMutation.UPDATE_GALLERY_VIEW, result)
            store.commit(GalleryMutation.UPDATE_GALLERY_VIEW_INDEX, increment)
          }
          return success
        }, (error) => {
          console.error('> GalleryStore > NavigateGalleryCommand > error:', error)
          return false
        })
    }
  },
  getters: {
    [GalleryGetter.IS_NAVIGATE_POSSIBLE_PREV]: state => { return state.view && state.index > 1 },
    [GalleryGetter.IS_NAVIGATE_POSSIBLE_NEXT]: state => { return state.view && state.index < state.view.limit }
  },
  mutations: {
    [GalleryMutation.UPDATE_GALLERY_VIEW]: (state, payload) => { state.view = payload },
    [GalleryMutation.UPDATE_GALLERY_VIEW_INDEX]: (state, payload) => { state.index += payload }
  }
}
