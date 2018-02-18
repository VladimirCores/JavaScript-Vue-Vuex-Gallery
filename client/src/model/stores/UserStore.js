import UserVO from '@/model/vos/UserVO'
import UserAction from '@/consts/actions/UserAction'
import UserMutation from '@/consts/mutations/UserMutation'
import UserGetter from '@/consts/getters/UserGetter'
import UserSettingsStore from '@/model/stores/user/UserSettingsStore'

import SignUpUserCommand from '@/controller/commands/user/SignUpUserCommand'
import LoginUserCommand from '@/controller/commands/user/LoginUserCommand'
import ConfigUserCommand from '@/controller/commands/user/ConfigUserCommand'

import {
  USER_STORE_NAME,
  USER_SETTINGS_STORE_NAME
} from '@/consts/StoreNames'

const UserStore = {
  name: USER_STORE_NAME,
  state: {},
  strict: true,
  namespaced: true,
  modules: {
    [USER_SETTINGS_STORE_NAME]: UserSettingsStore
  },
  actions: {
    [UserAction.SIGNUP]: (store, payload) => {
      console.log('> UserStore -> UserAction.SIGN_UP : payload =', payload)
      SignUpUserCommand.execute(
        payload.email,
        payload.password,
        payload.firstName,
        payload.lastName
      ).then((result) => {
        console.log('> UserStore -> UserAction.SIGN_UP : result =', result)
        if (Number.isInteger(result)) return result
        else return store.dispatch(UserAction.CONFIG, result)
      })
    },
    [UserAction.CONFIG]: (store, payload) => {
      console.log('> UserStore -> UserAction.CONFIG : payload =', payload)
      return ConfigUserCommand.execute(payload).then((result) => {
        store.commit(UserMutation.LOG_IN_USER, payload)
      })
    },
    [UserAction.LOGIN]: (store, payload) => {
      console.log('> UserStore -> UserAction.LOGIN : payload =', payload)
      return LoginUserCommand.execute(payload.name, payload.password).then((result) => {
        return store.dispatch(UserAction.CONFIG, result)
      })
    }
  },
  getters: {
    [UserGetter.IS_USER_REGISTERED] (state) {
      console.log('> UserStore -> IS_USER_REGISTERED', state._id)
      return state && state._id && state._id !== ''
    }
  },
  mutations: {
    [UserMutation.SIGN_UP_USER]: (state, payload) => { Object.assign(state, payload) },
    [UserMutation.LOG_IN_USER]: (state, payload) => {
      let user = new UserVO()
      console.log('> UserStore -> UserMutation.LOG_IN_USER')
      for (var key in user) state[key] = payload[key]
    }
  }
}

export default UserStore
