// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueToasted from 'vue-toasted'

import App from '@/App'

import DatabaseService, { AvailableDatabases } from '@/model/services/DatabaseService'
// import AuthDTO from '@/model/dtos/AuthDTO'
import ApplicationAction from '@/consts/actions/ApplicationAction'
// import UserAction from '@/consts/actions/UserAction'

Vue.use(VueToasted)
Vue.config.productionTip = false
DatabaseService.init(AvailableDatabases.FIREBASE_DB).then(db => {
  db.production()
  import('@/view/router').then(router => {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router: router.default,
      render: h => h(App),
      beforeCreate: function () {
        return Promise.all([
          DatabaseService.isAuthorized().then((user) => {
            console.log('> Main -> beforeCreate: isAuthorized = user:', user)
            if (user) {
              return DatabaseService.getUser(user).then((userDoc) => {
                console.log('> Main -> beforeCreate: user =', userDoc)
                // let authDTO = new AuthDTO(userDoc, UserAction.CONFIG)
                // return App.store.dispatch(ApplicationAction.SETUP_USER, authDTO)
              })
            }
          }),
          DatabaseService.get('server').then((doc) => {
            console.log('> Main -> beforeCreate: server =', doc)
            App.store.dispatch(ApplicationAction.SETUP_SERVER, doc)
          })
        ]).then(function (values) {
          console.log('> Main -> Application Initialized', values)
          App.store.dispatch(ApplicationAction.INITIALIZED)
        }).catch((error) => {
          console.log(error)
        })
      }
    })
  })
})
