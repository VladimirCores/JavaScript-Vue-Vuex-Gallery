import UserVO from '@/model/vos/UserVO'
import UserAction from '@/consts/actions/UserAction'
import UserMutation from '@/consts/mutations/UserMutation'
import UserGetter from '@/consts/getters/UserGetter'

import UserSettingsStore from '@/model/stores/user/UserSettingsStore'
import UserSettingsAction from '@/consts/actions/user/UserSettingsAction'

import SignUpUserCommand from '@/controller/commands/user/SignUpUserCommand'
import LoginUserCommand from '@/controller/commands/user/LoginUserCommand'
import LogoutUserCommand from '@/controller/commands/user/LogoutUserCommand'
import ConfigUserCommand from '@/controller/commands/user/ConfigUserCommand'

import {
  USER_STORE_NAME,
  USER_SETTINGS_STORE_NAME
} from '@/consts/StoreNames'

const UserStore = {
  name: USER_STORE_NAME,
  state: {},
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  modules: {
    [USER_SETTINGS_STORE_NAME]: UserSettingsStore
  },
  onRegister (store) {
    console.log('> UserStore -> onRegister')
    UserSettingsStore.onRegister(store)
  },
  onRemove (store) {
    console.log('> UserStore -> onRemove')
    UserSettingsStore.onRemove(store)
  },
  actions: {
    [UserAction.SIGNUP]: (store, payload) => {
      console.log('> UserStore -> UserAction.SIGN_UP : payload =', !!payload)
      return SignUpUserCommand.execute(
        payload.email,
        payload.password,
        payload.firstName,
        payload.lastName
      ).then((result) => {
        console.log('> UserStore -> UserAction.SIGN_UP : result =', !!result)
        if (Number.isInteger(result)) return result
        else return store.dispatch(UserAction.LOGIN, result)
      })
    },
    [UserAction.LOGIN]: (store, payload) => {
      console.log('> UserStore -> UserAction.LOGIN : payload', payload)
      return LoginUserCommand.execute(payload.name, payload.password).then((result) => {
        console.log('> UserStore -> UserAction.LOGIN : result =', result)
        if (Number.isInteger(result)) return result
        else return store.dispatch(UserAction.CONFIG, result)
      })
    },
    [UserAction.LOGOUT]: (store) => {
      console.log('> UserStore -> UserAction.LOGOUT')
      return LogoutUserCommand.execute(store.state).then((result) => {
        console.log('> UserStore -> UserAction.LOGOUT : result = ', result)
        store.commit(UserMutation.LOG_OUT_USER)
        return result
      })
    },
    [UserAction.CONFIG]: (store, payload) => {
      console.log('> UserStore -> UserAction.CONFIG : payload =', payload)
      return ConfigUserCommand.execute(payload).then((result) => {
        console.log('> UserStore -> UserAction.CONFIG : result =', !result)
        store.commit(UserMutation.LOG_IN_USER, payload)
        store.dispatch(UserSettingsAction.CONFIG, payload)
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
    [UserMutation.LOG_OUT_USER]: (state) => { for (let key in state) delete state[key] },
    [UserMutation.LOG_IN_USER]: (state, payload) => {
      console.log('> UserStore -> UserMutation.LOG_IN_USER')
      Object.assign(state, Object.assign(new UserVO(), payload))
    }
  }
}

export default UserStore
