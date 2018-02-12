import UserVO from '@/model/vos/UserVO'
import UserAction from '@/consts/actions/UserAction'

import UserMutation from '@/consts/mutations/UserMutation'
import UserGetter from '@/consts/getters/UserGetter'
import SignUpUserCommand from '@/controller/commands/user/SignUpUserCommand'

const UserStore = {
  state: new UserVO(),
  strict: true,
  namespaced: true,
  actions: {
    [UserAction.SIGN_UP]: (store, payload) => {
      console.log('> UserStore -> UserAction.SIGN_UP : payload =', payload)
      SignUpUserCommand.execute(
        payload.email,
        payload.password,
        payload.firstName,
        payload.lastName
      ).then((result) => {
        console.log('> UserStore -> UserAction.SIGN_UP : result =', result)
        if (Number.isInteger(result)) return result
        else {
          store.commit(UserMutation.SIGN_UP_USER, result)
          return true
        }
      })
    }
  },
  getters: {
    [UserGetter.IS_USER_REGISTERED] (state) {
      console.log('> UserStore -> IS_USER_REGISTERED', state)
      return state && state._id !== ''
    }
  },
  mutations: {
    [UserMutation.SIGN_UP_USER]: (state, payload) => { Object.assign(state, payload) },
    [UserMutation.LOG_IN_USER]: (state, payload) => { for (var key in state) state[key] = payload[key] }
  }
}

export default UserStore
