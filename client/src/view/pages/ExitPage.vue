<template>
  <div class="exit-page">
    <h3>Exit page</h3>
    <h2>Thanks for being with us!</h2>
    <h1>{{ counter }}</h1>
    <router-link :to="{name: navigateToPageName}">
      return to main
    </router-link>
  </div>
</template>

<script>
import PageNames from '@/consts/PageNames'

let counterID

export default {
  name: 'exit-page',
  computed: {
    counter () {
      if (this.counterValue < 0) {
        clearInterval(counterID)
        // this.$router.push({ name: this.navigateToPageName })
      } else return this.counterValue
    }
  },
  mounted () { counterID = setInterval(() => { this.counterValue-- }, 1000) },
  data: function () {
    return {
      counterValue: 10,
      navigateToPageName: PageNames.INDEX
    }
  }
}
</script>

<style scoped>
.exit-page {

}
</style>
