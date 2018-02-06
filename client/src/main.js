// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/view/router'

import Database from '@/model/Database'
import ApplicationMutations from '@/consts/mutations/ApplicationMutation'

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
        if (err) {
          // network error
        } else if (!response.userCtx.name) {
          // nobody's logged in
        } else {
          // response.userCtx.name is the current user
        }
      }),
      db.get('server', (error, doc) => {
        console.log('> Main -> beforeCreate: server =', doc)
        if (error) doc = {}
        App.store.commit(ApplicationMutations.SERVER_DATA_SETUP, doc)
      })
    ]).then(function (values) {
      console.log(values)
    }).catch((error) => {
      console.log(error)
    })
  }
})
