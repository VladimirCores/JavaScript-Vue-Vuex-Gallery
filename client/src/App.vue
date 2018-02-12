<template>
  <transition name="fade" mode="out-in">
    <div id="app" v-if="isReady" key="app">
      <header>
        <span>Gallery PWA</span>
        <span v-if="$route.path!=='/'"><router-link to="/" exact>Home</router-link></span>
        <span v-if="$route.path==='/' && isUserRegistered"><router-link to="/gallery">Gallery</router-link></span>
        <span v-if="$route.path==='/' && !isUserRegistered"><router-link to="/entrance">Signup</router-link></span>
      </header>
      <main>
        <router-view></router-view>
      </main>
    </div>
    <preloader v-else key="preloader"/>
  </transition>
</template>

<script>

import Preloader from '@/view/components/_common/loading/Preloader'
import ApplicationStore from '@/model/stores/ApplicationStore'

import { mapState, mapGetters } from 'vuex'
import { USER_STORE_NAME } from '@/consts/StoreNames'
import { IS_USER_REGISTERED } from '@/consts/getters/UserGetter'

export default {
  name: 'App',
  store: ApplicationStore,
  components: {
    'preloader': Preloader
  },
  computed: {
    ...mapState(['isReady']),
    ...mapGetters(USER_STORE_NAME, {
      'isUserRegistered': IS_USER_REGISTERED
    })
  },
  created () {
    console.log('> App -> created: USER =', this.$store.state.user.getter)
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
    margin-top: 1rem;
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
