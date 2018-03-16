<template>
  <transition name="fade" mode="out-in">
    <div id="app" v-if="isReady" key="app">
      <Header/>
      <main>
        <router-view></router-view>
      </main>
    </div>
    <PreLoader v-else key="pre-loader"/>
  </transition>
</template>

<script>

import PreLoader from '@/view/components/_common/loading/PreLoader'
import Header from '@/view/components/Header'

import ApplicationStore from '@/model/stores/ApplicationStore'

import { mapState } from 'vuex'

export default {
  name: 'App',
  store: ApplicationStore,
  components: {
    Header,
    PreLoader
  },
  computed: {
    ...mapState(['isReady'])
  },
  methods: {
  },
  created () {
    console.log('> App -> created: USER =', this.$store.state)
  }
}
</script>

<style lang="scss">

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s ease;
  }
  .fade-enter, .fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  body {
    margin: 0;
    background-color: #f9f9f9;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .preparing {

  }

  main {
    text-align: center;
  }

</style>
