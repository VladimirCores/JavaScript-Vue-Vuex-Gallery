import UserVO from '@/model/vos/UserVO'
import UserAction from '@/consts/actions/UserAction'

import UserMutation from '@/consts/mutations/UserMutation'
import SignUpUserCommand from '@/controller/commands/user/SignUpUserCommand'

import router from '@/view/router'

export default {
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
      ).then((user) => {
        console.log('> UserStore -> UserAction.SIGN_UP : result =', user)
        store.commit(UserMutation.SIGN_UP_USER, user)
        router.go('/')
      })
    }
  },
  getter: {
    isRegistered (state) {
      return state.uid !== null
    }
  },
  mutations: {
    [UserMutation.SIGN_UP_USER]: (state, payload) => { Object.assign(state, payload) }
  }
}
