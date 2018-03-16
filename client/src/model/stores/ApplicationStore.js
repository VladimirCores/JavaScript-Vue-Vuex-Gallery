import Vue from 'vue'
import Vuex from 'vuex'

import ServerVO from '@/model/vos/ServerVO'
import ApplicationVO from '@/model/vos/ApplicationVO'

import {
  USER_STORE_NAME
} from '@/consts/StoreNames'

import ApplicationError from '@/consts/errors/ApplicationError'
import ApplicationAction from '@/consts/actions/ApplicationAction'
import ApplicationGetter from '@/consts/getters/ApplicationGetter'

import LoadImageUtilsCommand from '@/controller/commands/utils/LoadImageUtilsCommand'

import AuthDTO from '@/model/dtos/AuthDTO'
import ModuleDTO from '@/model/dtos/ModuleDTO'
import LoadImageDTO from '@/model/dtos/LoadImageDTO'

import {
  SET_APPLICATION_IS_READY,
  SET_BACKGROUND_IMAGE,
  SERVER_DATA_UPDATE,
  SERVER_DATA_SETUP,
  SET_USER_LOGGED
} from '@/consts/mutations/ApplicationMutation'

import UserAction from '@/consts/actions/UserAction'

Vue.use(Vuex)

const registeredModules = []

export default new Vuex.Store({
  state: new ApplicationVO(),
  strict: true,
  namespaced: true,
  actions: {
    [ApplicationAction.SETUP_SERVER] (store, payload) { store.commit(SERVER_DATA_SETUP, payload) },
    [ApplicationAction.SETUP_USER] (store, payload) {
      console.log('> ApplicationStore -> ApplicationAction.SETUP_USER payload =', payload)
      return import('@/model/stores/UserStore').then(module => {
        let moduleDTO = new ModuleDTO(module.default)
        store.dispatch(ApplicationAction.REGISTER_MODULE, moduleDTO)
        if (payload && payload instanceof AuthDTO) {
          return store.dispatch(USER_STORE_NAME + '/' + payload.action, payload.data).then((result) => {
            if (Number.isInteger(result)) store.dispatch(ApplicationAction.DEREGISTER_MODULE, moduleDTO.module)
            else store.commit(SET_USER_LOGGED, true)
            return result
          })
        } else {
          return ApplicationError.SETUP_USER_FAILED
        }
      })
    },
    [ApplicationAction.DEREGISTER_MODULE] (store, payload) {
      this.unregisterModule(payload.name)
      payload.onRemove && payload.onRemove()
    },
    [ApplicationAction.REGISTER_MODULE] (store, payload) {
      console.log('> ApplicationStore -> ApplicationAction.REGISTER_MODULE payload =', payload)
      if (payload && payload instanceof ModuleDTO) {
        let module = payload.module
        registeredModules.push(module)
        this.registerModule(module.name, module)
        module.onRegister && module.onRegister()
      }
    },
    [ApplicationAction.LOAD_IMAGE] (store, payload) {
      if (payload && payload instanceof LoadImageDTO) {
        return LoadImageUtilsCommand.execute(payload.url, payload.onprogress)
      }
    },
    [ApplicationAction.INITIALIZED] (store) { store.commit(SET_APPLICATION_IS_READY, true) },
    [ApplicationAction.EXIT] (store, payload) {
      console.log('> ApplicationStore -> ApplicationAction.EXIT payload =', payload)
      this.dispatch(USER_STORE_NAME + '/' + UserAction.LOGOUT).then((result) => {
        store.commit(SET_USER_LOGGED, false)
        while (registeredModules.length) {
          let module = registeredModules.shift()
          console.log('> ApplicationStore -> ApplicationAction.EXIT unregisterModule =', module.name)
          store.dispatch(ApplicationAction.DEREGISTER_MODULE, module)
        }
      })
    }
  },
  getters: {
    [ApplicationGetter.IS_USER_LOGGED] (state) {
      console.log('> ApplicationStore -> ApplicationGetter.IS_USER_LOGGED: ' + (state.user && state.user.name))
      return state.user && state.user.name
    }
  },
  mutations: {
    [SET_USER_LOGGED]: (state, payload) => { state.logged = payload },
    [SET_BACKGROUND_IMAGE]: (state, payload) => { state.backgroundImage = payload },
    [SET_APPLICATION_IS_READY]: (state, payload) => { state.isReady = payload },
    [SERVER_DATA_UPDATE]: (state, payload) => { Object.assign(state.server, payload) },
    [SERVER_DATA_SETUP]: (state, payload) => { state.server = Object.assign(new ServerVO(), payload) }
  }
})
