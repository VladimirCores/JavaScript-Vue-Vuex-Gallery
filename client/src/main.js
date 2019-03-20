// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueToasted from 'vue-toasted'

import App from '@/App'
import router from '@/view/router'

import DatabaseService from '@/model/services/DatabaseService'
import ApplicationAction from '@/consts/actions/ApplicationAction'

Vue.use(VueToasted)
Vue.config.productionTip = false
DatabaseService.init().production()

const store = App.store

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  beforeCreate: () => store.dispatch(ApplicationAction.SETUP_APPLICATION)
})
