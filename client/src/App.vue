<template>
  <div id="app">
    <header>
      <span>Gallery PWA</span>
      <span v-if="$route.path!=='/'"><router-link to="/" exact>Home</router-link></span>
      <span v-if="$route.path==='/'"><router-link to="/gallery">Gallery</router-link></span>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>

import ApplicationStore from '@/model/stores/ApplicationStore'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {

  },
  store: ApplicationStore, // <-------------- STORE MAPPING
  computed: {
    ...mapState(['server'])
  },
  created () {
  }
}
</script>

<style>
  body {
    margin: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
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
