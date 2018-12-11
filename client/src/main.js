// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueToasted from 'vue-toasted'

import App from '@/App'
import router from '@/view/router'

import DatabaseService from '@/model/services/DatabaseService'
import AuthDTO from '@/model/dtos/AuthDTO'
import ApplicationAction from '@/consts/actions/ApplicationAction'
import UserAction from '@/consts/actions/UserAction'

Vue.use(VueToasted)
Vue.config.productionTip = false
DatabaseService.init().production()

const store = App.store

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  beforeCreate: function () {
    let db = DatabaseService.getApplicationInstance()
    return Promise.all([
      DatabaseService.isAuthorized().then((user) => {
        console.log('> Main -> beforeCreate: session =', user)
        if (user) {
          return db.getUser(user).then((userDoc) => {
            console.log('> Main -> beforeCreate: user =', userDoc)
            let authDTO = new AuthDTO(userDoc, UserAction.CONFIG)
            return store.dispatch(ApplicationAction.SETUP_USER, authDTO)
          })
        }
      }),
      db.get('server').then((doc) => {
        console.log('> Main -> beforeCreate: server =', doc)
        store.dispatch(ApplicationAction.SETUP_SERVER, doc)
      })
    ]).then(function (values) {
      console.log('> Main -> Application Initialized', values)
      store.dispatch(ApplicationAction.INITIALIZED)
    }).catch((error) => {
      console.log(error)
    })
  }
})
