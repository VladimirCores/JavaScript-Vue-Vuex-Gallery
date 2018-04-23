import UserSettingsVO from '@/model/vos/user/UserSettingsVO'
import UserSettingsAction from '@/consts/actions/user/UserSettingsAction'

import UserSettingsMutation from '@/consts/mutations/user/UserSettingsMutation'
import UserSettingsGetter from '@/consts/getters/user/UserSettingsGetter'

import SetSettingsUserCommand from '@/controller/commands/user/settings/SetUserSettingsCommand'
import GetSettingsUserCommand from '@/controller/commands/user/settings/GetUserSettingsCommand'

import {
  USER_SETTINGS_STORE_NAME
} from '@/consts/StoreNames'

import DatabaseService from '@/model/services/DatabaseService'
import DatabaseEvent from '@/consts/database/DatabaseEvents'

let changeListenerID = 0

const UserSettingsStore = {
  name: USER_SETTINGS_STORE_NAME,
  state: new UserSettingsVO(),
  strict: process.env.NODE_ENV !== 'production',
  namespaced: false,
  onRegister (store) {
    console.log('> UserSettingsStore -> onRegister')
    changeListenerID = DatabaseService.addUserEventListener(DatabaseEvent.CHANGE, USER_SETTINGS_STORE_NAME, (doc) => {
      console.log('> UserSettingsStore -> DatabaseEvent.CHANGE:', doc, store)
      store.commit(UserSettingsMutation.SETUP_SETTINGS, doc)
    })
  },
  onRemove (store) {
    console.log('> UserSettingsStore -> onRemove')
    DatabaseService.removeUserEventListener(DatabaseEvent.CHANGE, USER_SETTINGS_STORE_NAME, changeListenerID)
  },
  actions: {
    [UserSettingsAction.CONFIG]: (store, payload) => {
      console.log('> UserSettingsStore -> UserSettingsAction.CONFIG : payload =', payload)
      GetSettingsUserCommand.execute(store.state).then((result) => {
        console.log('> UserSettingsStore -> UserSettingsAction.CONFIG : result =', payload)
        store.commit(UserSettingsMutation.SETUP_SETTINGS, result)
      })
    },
    [UserSettingsAction.CHANGED]: (store, payload) => {
      console.log('> UserSettingsStore -> UserSettingsAction.CHANGED : payload =', payload)
      return SetSettingsUserCommand.execute(payload).then((result) => {
        console.log('> UserSettingsStore -> UserSettingsAction.CHANGED : result =', result)
        if (Number.isInteger(result)) return result // Error occurs
        else {
          let userChanged = store.state.userID !== result.userID
          return userChanged
        }
      })
    }
  },
  getters: {
    [UserSettingsGetter.GET_USER_ID] (state) { return state ? state.userID : null },
    [UserSettingsGetter.GET_ACCESS_TOKEN] (state) { return state ? state.accessToken : null }
  },
  mutations: {
    [UserSettingsMutation.SETUP_SETTINGS]: (state, payload) => {
      console.log('> UserSettingsStore -> UserSettingsMutation.SETUP_SETTINGS : state =', state)
      console.log('> UserSettingsStore -> UserSettingsMutation.SETUP_SETTINGS : payload =', payload)
      Object.assign(state, payload)
    }
  }
}

export default UserSettingsStore
