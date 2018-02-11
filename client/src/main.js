// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/view/router'

import Database from '@/model/Database'
import ApplicationMutations from '@/consts/mutations/ApplicationMutation'
import ApplicationActions from '@/consts/actions/ApplicationAction'

Vue.config.productionTip = false
Database.init('application').production()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  beforeCreate: function () {
    let db = Database.getInstance()
    return Promise.all([
      db.getSession((err, response) => {
        console.log('> Main -> beforeCreate: session =', response)
        if (err) {
          // network error
        } else if (!response.userCtx.name) {
          // nobody's logged in
        } else {
          // response.userCtx.name is the current user
          return db.getUser(response.userCtx.name)
            .then((doc) => {
              console.log('> Main -> beforeCreate: user =', doc)
              App.store.commit(ApplicationMutations.USER_DATA_SETUP, doc)
            })
        }
      }),
      db.get('server', (error, doc) => {
        console.log('> Main -> beforeCreate: server =', doc)
        if (error) doc = {}
        App.store.commit(ApplicationMutations.SERVER_DATA_SETUP, doc)
      })
    ]).then(function (values) {
      console.log('> Main -> Application Initialized', values)
      App.store.dispatch(ApplicationActions.INITIALIZED)
    }).catch((error) => {
      console.log(error)
    })
  }
})
