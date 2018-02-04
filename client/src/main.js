// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/view/router'

import Database from '@/model/Database'
import ServerDataMutations from '@/consts/mutations/ServerDataMutation'

Vue.config.productionTip = false
Database.init('application').production()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  beforeCreate: function () {
    return Database.getInstance().get('server',
      function (error, doc) {
        console.log('> Main -> beforeCreate:', doc)
        if (error) doc = {}
        App.store.commit(ServerDataMutations.SERVER_DATA_SETUP, doc)
      })
  }
})
