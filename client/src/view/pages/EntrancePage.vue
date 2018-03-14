<template lang="html">
  <div class="entrance-page">
    <transition name="component-fade" mode="out-in">
      <component v-bind:is="entranceComponent"/>
    </transition>
    <button class="entrance-type-button" @click="changeComponent" :disabled="loading">{{ nextComponent.toUpperCase() }}</button>
  </div>
</template>

<script>
const SIGNUP = 'Signup'
const LOGIN = 'Login'

export default {
  computed: {
    nextComponent () { return this.currentComponent === SIGNUP ? LOGIN : SIGNUP }
  },
  methods: {
    changeComponent () { this.nextComponent === SIGNUP ? this.showSignup() : this.showLogin() },
    showSignup () { this.loadComponent(SIGNUP) },
    showLogin () { this.loadComponent(LOGIN) },
    loadComponent (name) {
      let that = this
      this.loading = true
      that.entranceComponent = () => import(`@/view/components/entrance/${name}`)
        .then((module) => {
          that.currentComponent = name
          that.loading = false
          return module
        })
    }
  },
  mounted () {
    this.showLogin()
  },
  data () {
    return {
      loading: true,
      entranceComponent: '',
      currentComponent: SIGNUP
    }
  }
}
</script>

<style lang="scss">
.entrance-page {
  .entrance-type-button {
    width: 100%;
    height: 34px;
    font-size: 1rem;
    background: lightskyblue;
    border: none;
    border-bottom: 1px solid deepskyblue;
  }
}
</style>
