<template>
  <header>
    <span>Gallery PWA</span>
    <span v-if="$route.path!=='/'"><router-link to="/" exact>Home</router-link></span>
    <span v-if="$route.path==='/' && logged"><router-link to="/gallery">Gallery</router-link></span>
    <span v-if="$route.path==='/' && !logged"><router-link to="/entrance">Enter</router-link></span>
    <span v-if="logged"><a href="#" @click="onExit">Exit</a></span>
  </header>
</template>

<script>
import ApplicationGetter from '@/consts/getters/ApplicationGetter'
import ApplicationAction from '@/consts/actions/ApplicationAction'
import PageNames from '@/consts/PageNames'

import {
  mapState,
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'Header',
  computed: {
    ...mapState(['logged']),
    ...mapGetters({
      isUserLogged: ApplicationGetter.IS_USER_LOGGED
    })
  },
  methods: {
    ...mapActions({ exitAction: ApplicationAction.EXIT }),
    onExit () { this.exitAction().then(() => this.$router.push({ name: PageNames.EXIT })) }
  },
  created () {
  }
}
</script>

<style lang="scss">
  header {
    margin: 0;
    height: 48px;
    padding: 0 16px 0 24px;
    color: #ffffff;
    background-color: #35495E;
    border-top: 1px solid #3d6089;
    border-bottom: 3px solid #17212f;
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
