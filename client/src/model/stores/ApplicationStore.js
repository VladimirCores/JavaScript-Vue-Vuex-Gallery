import Vue from 'vue'
import Vuex from 'vuex'

// import ServerVO from '@/model/vos/ServerVO'
import ApplicationVO from '@/model/vos/ApplicationVO'
import ApplicationAction from '@/consts/actions/ApplicationAction'
// import Database from '@/model/Database'
// Database.init('application')// .debug()
// const db = Database.getInstance()
// db.get('server')

Vue.use(Vuex)

export default new Vuex.Store({
  state: new ApplicationVO(),
  strict: true,
  actions: {
    [ApplicationAction.ACCEPT_SERVER_DATA] (store, key, token, user) {
      console.log(key, token, user)
    }
  }
})
