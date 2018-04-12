import GalleryVO from '@/model/vos/gallery/GalleryVO'

import GalleryAction from '@/consts/actions/GalleryAction'
import GalleryGetter from '@/consts/getters/GalleryGetter'
import GalleryMutation from '@/consts/mutations/GalleryMutation'

import GetDataGalleryCommand from '@/controller/commands/gallery/GetGalleryDataCommand'
import NavigateGalleryCommand from '@/controller/commands/gallery/NavigateGalleryCommand'

import {
  GALLERY_STORE_NAME, USER_SETTINGS_STORE_NAME
} from '@/consts/StoreNames'

import DatabaseService from '@/model/services/DatabaseService'
import DatabaseEvent from '@/consts/database/DatabaseEvents'

let _PRIVATE_GET_USER_SETTINGS = 'private_getter_get_user_settings'
let _PRIVATE_GET_SERVER = 'private_getter_get_server'

let changeListenerID = 0

export default {
  name: GALLERY_STORE_NAME,
  state: new GalleryVO(),
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  onRegister (store) {
    console.log('> GalleryStore -> onRegister')
    changeListenerID = DatabaseService.addUserEventListener(DatabaseEvent.CHANGE, USER_SETTINGS_STORE_NAME, (doc) => {
      console.log('> GalleryStore -> DatabaseEvent.CHANGE:', doc)
      store.dispatch(GalleryAction.SETUP_GALLERY_VIEW)
    })
  },
  onRemove (store) {
    console.log('> GalleryStore -> onRemove')
    DatabaseService.removeUserEventListener(DatabaseEvent.CHANGE, USER_SETTINGS_STORE_NAME, changeListenerID)
  },
  actions: {
    [GalleryAction.SETUP_GALLERY_VIEW] (store) {
      let galleryVO = new GalleryVO(1, 5)
      let serverVO = store.getters[_PRIVATE_GET_SERVER]
      let userSettingsVO = store.getters[_PRIVATE_GET_USER_SETTINGS]
      console.log('> GalleryStore > GalleryAction.SETUP_GALLERY_VIEW > userSettings:', userSettingsVO)
      console.log('> GalleryStore > GalleryAction.SETUP_GALLERY_VIEW > galleryVO', galleryVO)
      return GetDataGalleryCommand.execute(serverVO, userSettingsVO, galleryVO)
        .then(result => {
          console.log('> GalleryStore > GetGalleryDataCommand > result:', result)
          let registered = store.getters[GalleryGetter.IS_GALLERY_REGISTERED]
          if (registered) {
            store.commit(GalleryMutation.SETUP_GALLERY, galleryVO)
            store.commit(GalleryMutation.UPDATE_GALLERY_VIEW, result)
            store.dispatch(GalleryAction.SELECT_ITEM, 0)
          }
          return true
        }, (error) => {
          console.log('> GalleryStore > GetGalleryDataCommand > error:', error)
          return error
        })
    },
    [GalleryAction.SELECT_ITEM] (store, payload) {
      let galleryItems = store.getters[GalleryGetter.GET_GALLERY_VIEW_ITEMS]
      if (galleryItems) {
        store.commit(GalleryMutation.SET_SELECTED_ITEM, galleryItems[payload])
      }
    },
    [GalleryAction.NAVIGATE] (store, increment) {
      console.log('> GalleryStore > GalleryAction.NAVIGATE > increment: ' + increment)
      let galleryVO = Object.assign({}, store.state)
      let serverVO = store.getters[_PRIVATE_GET_SERVER]
      let userSettingsVO = store.getters[_PRIVATE_GET_USER_SETTINGS]
      store.commit(GalleryMutation.SET_SELECTED_ITEM, null)
      return NavigateGalleryCommand.execute(serverVO, userSettingsVO, galleryVO, increment)
        .then(result => {
          console.log('> GalleryStore > NavigateGalleryCommand > result:', result)
          let success = result != null
          if (success) {
            store.commit(GalleryMutation.UPDATE_GALLERY_VIEW, result)
            store.commit(GalleryMutation.UPDATE_GALLERY_VIEW_INDEX, increment)
            store.dispatch(GalleryAction.SELECT_ITEM, 0)
          }
          return result
        }, (error) => {
          console.error('> GalleryStore > NavigateGalleryCommand > error:', error)
          return error
        })
    }
  },
  getters: {
    [GalleryGetter.IS_GALLERY_REGISTERED]: (state, getters, rootState) => { return rootState.hasOwnProperty(GALLERY_STORE_NAME) },
    [GalleryGetter.IS_GALLERY_READY]: state => {
      let result = !!state && state.index > 0
      console.log('GalleryGetter.IS_GALLERY_READY = ' + result)
      return result
    },
    [GalleryGetter.GET_GALLERY_VIEW_ITEMS]: state => { return (state && state.view != null) ? state.view.items : null },
    [GalleryGetter.GET_GALLERY_VIEW_INDEX]: state => { return !!state && state.index ? state.index : 0 },
    [GalleryGetter.IS_NAVIGATE_POSSIBLE_PREV]: state => { return !!state && state.view && state.index > 1 },
    [GalleryGetter.IS_NAVIGATE_POSSIBLE_NEXT]: state => { return !!state && state.view && state.index < state.view.limit },
    [_PRIVATE_GET_USER_SETTINGS]: (state, getters, root) => { return root.user ? root.user.settings : null },
    [_PRIVATE_GET_SERVER]: (state, getters, root) => { return root.server }
  },
  mutations: {
    [GalleryMutation.SETUP_GALLERY]: (state, payload) => { Object.assign(state, payload) },
    [GalleryMutation.SET_SELECTED_ITEM]: (state, payload) => { state.selectedItem = payload },
    [GalleryMutation.UPDATE_GALLERY_VIEW]: (state, payload) => { state.view = payload },
    [GalleryMutation.UPDATE_GALLERY_VIEW_INDEX]: (state, payload) => { state.index += payload }
  }
}
