import UserSettingsVO from '@/model/vos/user/UserSettingsVO'
import UserAction from '@/consts/actions/UserAction'

import UserSettingsMutation from '@/consts/mutations/user/UserSettingsMutation'

import GetSettingsUserCommand from '@/controller/commands/user/GetSettingsUserCommand'

const UserSettingsStore = {
  state: new UserSettingsVO(),
  strict: true,
  namespaced: false,
  actions: {
    [UserAction.CONFIG]: (store, payload) => {
      console.log('> UserSettingsStore -> UserAction.LOGIN : payload =', payload)
      GetSettingsUserCommand.execute(store.state).then((result) => {
        store.commit(UserSettingsMutation.SETUP_SETTINGS, result)
      })
    }
  },
  getters: {
  },
  mutations: {
    [UserSettingsMutation.SETUP_SETTINGS]: (state, payload) => {
      console.log('> UserSettingsStore -> UserSettingsMutation.SETUP_SETTINGS : result =', payload)
    }
  }
}

export default UserSettingsStore
