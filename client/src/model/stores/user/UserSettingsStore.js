import UserSettingsVO from '@/model/vos/user/UserSettingsVO'
import UserSettingsAction from '@/consts/actions/user/UserSettingsAction'

import UserSettingsMutation from '@/consts/mutations/user/UserSettingsMutation'
import UserSettingsGetter from '@/consts/getters/user/UserSettingsGetter'

import SetSettingsUserCommand from '@/controller/commands/user/settings/SetUserSettingsCommand'
import GetSettingsUserCommand from '@/controller/commands/user/settings/GetUserSettingsCommand'

const UserSettingsStore = {
  state: new UserSettingsVO(),
  strict: true,
  namespaced: false,
  actions: {
    [UserSettingsAction.CONFIG]: (store, payload) => {
      console.log('> UserSettingsStore -> UserSettingsAction.LOGIN : payload =', payload)
      GetSettingsUserCommand.execute(store.state).then((result) => {
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
          store.commit(UserSettingsMutation.SETUP_SETTINGS, result)
          return userChanged
        }
      })
    }
  },
  getters: {
    [UserSettingsGetter.GET_USER_ID] (state) { return state ? state.userID : null },
    [UserSettingsGetter.GET_TOKEN] (state) { return state.accessToken }
  },
  mutations: {
    [UserSettingsMutation.SETUP_SETTINGS]: (state, payload) => {
      console.log('> UserSettingsStore -> UserSettingsMutation.SETUP_SETTINGS : payload =', payload)
      Object.assign(state, payload)
    }
  }
}

export default UserSettingsStore
