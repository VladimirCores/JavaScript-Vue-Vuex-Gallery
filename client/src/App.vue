<template>
  <transition name="fade" mode="out-in">
    <div id="app" v-if="isReady" key="app">
      <header>
        <span>Gallery PWA</span>
        <span v-if="$route.path!=='/'"><router-link to="/" exact>Home</router-link></span>
        <span v-if="$route.path==='/' && userLoggedIn"><router-link to="/gallery">Gallery</router-link></span>
        <span v-if="$route.path==='/' && !userLoggedIn"><router-link to="/entrance">Enter</router-link></span>
        <span v-if="userLoggedIn"><a href="#" @click="onExit">Exit</a></span>
      </header>
      <main>
        <router-view></router-view>
      </main>
    </div>
    <pre-loader v-else key="pre-loader"/>
  </transition>
</template>

<script>

import PreLoader from '@/view/components/_common/loading/PreLoader'
import ApplicationStore from '@/model/stores/ApplicationStore'
import ApplicationGetter from '@/consts/getters/ApplicationGetter'
import ApplicationAction from '@/consts/actions/ApplicationAction'
import PageNames from '@/consts/PageNames'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  store: ApplicationStore,
  components: {
    'pre-loader': PreLoader
  },
  computed: {
    ...mapState(['isReady']),
    ...mapGetters({
      userLoggedIn: ApplicationGetter.USER_LOGGED_IN
    })
  },
  methods: {
    ...mapActions({ exitAction: ApplicationAction.EXIT }),
    onExit () { this.exitAction().then(() => this.$router.push({ name: PageNames.EXIT })) }
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

  header {
    margin: 0;
    height: 56px;
    padding: 0 16px 0 24px;
    background-color: #35495E;
    color: #ffffff;
  }

  header span {
    display: inline-block;
    color: white;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
    margin-right: 1em;
  }

  header span a {
    color: white;
    text-decoration: none;
  }

</style>
