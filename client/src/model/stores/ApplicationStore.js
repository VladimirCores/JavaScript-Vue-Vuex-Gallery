import Vue from 'vue'
import Vuex from 'vuex'

import UserVO from '@/model/vos/UserVO'
import ServerVO from '@/model/vos/ServerVO'
import ApplicationVO from '@/model/vos/ApplicationVO'

import UserStore from '@/model/stores/UserStore'

import ApplicationAction from '@/consts/actions/ApplicationAction'
import ApplicationGetter from '@/consts/getters/ApplicationGetter'

import {
  APPLICATION_IS_READY,
  SERVER_DATA_UPDATE,
  SERVER_DATA_SETUP,
  USER_DATA_SETUP
} from '@/consts/mutations/ApplicationMutation'

import Database from '@/model/Database'

Vue.use(Vuex)

export default new Vuex.Store({
  state: new ApplicationVO(),
  strict: true,
  namespaced: true,
  modules: {
    user: UserStore
  },
  actions: {
    [ApplicationAction.CHANGE_SERVER_DATA] (store, payload) {
      return Database.getInstance()
        .put(Object.assign({...store.state.server}, payload))
        .then(doc => doc.ok && !store.commit(SERVER_DATA_UPDATE, Object.assign(payload, {_rev: doc.rev})))
        .catch(error => !error)
    },
    [ApplicationAction.INITIALIZED] (store, payload) {
      setTimeout(() => store.commit(APPLICATION_IS_READY, true), 0)
    }
  },
  getter: {
    [ApplicationGetter.GET_SERVER]: (state) => state.server
  },
  mutations: {
    [APPLICATION_IS_READY]: (state, payload) => { state.isReady = payload },
    [SERVER_DATA_UPDATE]: (state, payload) => { state.server = Object.assign(state.server, payload) },
    [SERVER_DATA_SETUP]: (state, payload) => { state.server = Object.assign(new ServerVO(), payload) },
    [USER_DATA_SETUP]: (state, payload) => { state.user = Object.assign(new UserVO(), payload) }
  }
})
