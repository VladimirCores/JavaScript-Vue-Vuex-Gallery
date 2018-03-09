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

import AuthDTO from '@/model/dtos/AuthDTO'
import ModuleDTO from '@/model/dtos/ModuleDTO'

import {
  APPLICATION_IS_READY,
  SERVER_DATA_UPDATE,
  SERVER_DATA_SETUP
} from '@/consts/mutations/ApplicationMutation'

import Database from '@/model/Database'
import UserAction from '@/consts/actions/UserAction'

Vue.use(Vuex)

export default new Vuex.Store({
  state: new ApplicationVO(),
  strict: true,
  namespaced: true,
  actions: {
    [ApplicationAction.CHANGE_SERVER_DATA] (store, payload) {
      return Database.getApplicationInstance()
        .put(Object.assign({...store.state.server}, payload))
        .then(doc => doc.ok && !store.commit(SERVER_DATA_UPDATE, Object.assign(payload, {_rev: doc.rev})))
        .catch(error => !error)
    },
    [ApplicationAction.SETUP_SERVER] (store, payload) {
      store.commit(SERVER_DATA_SETUP, payload)
    },
    [ApplicationAction.SETUP_USER] (store, payload) {
      console.log('> ApplicationStore -> ApplicationAction.SETUP_USER payload =', payload)
      return import('@/model/stores/UserStore').then(module => {
        store.dispatch(ApplicationAction.REGISTER_MODULE, new ModuleDTO(USER_STORE_NAME, module.default))
        if (payload && payload instanceof AuthDTO) {
          return this.dispatch(USER_STORE_NAME + '/' + payload.action, payload.data)
        } else {
          return ApplicationError.SETUP_USER_FAILED
        }
      })
    },
    [ApplicationAction.REGISTER_MODULE] (store, payload) {
      console.log('> ApplicationStore -> ApplicationAction.REGISTER_MODULE payload =', payload)
      if (payload && payload instanceof ModuleDTO) {
        this.registerModule(payload.name, payload.module)
      }
    },
    [ApplicationAction.INITIALIZED] (store, payload) { store.commit(APPLICATION_IS_READY, true) },
    [ApplicationAction.EXIT] (store, payload) {
      console.log('> ApplicationStore -> ApplicationAction.EXIT payload =', payload)
      this.dispatch(USER_STORE_NAME + '/' + UserAction.LOGOUT).then((result) => {
        console.log('> ApplicationStore -> ApplicationAction.EXIT unregisterModule =', result)
        this.unregisterModule(USER_STORE_NAME)
      })
    }
  },
  getters: {
    [ApplicationGetter.USER_LOGGED_IN] (state) { return !!state.user }
  },
  mutations: {
    [APPLICATION_IS_READY]: (state, payload) => { state.isReady = payload },
    [SERVER_DATA_UPDATE]: (state, payload) => { Object.assign(state.server, payload) },
    [SERVER_DATA_SETUP]: (state, payload) => { state.server = Object.assign(new ServerVO(), payload) }
  }
})
