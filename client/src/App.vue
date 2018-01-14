<template>
  <div id="app">
    <header>
      <span>Gallery PWA</span>
    </header>
    <main>
      <Gallery v-if="ready" keep-alive/>
      <Spinner v-else></Spinner>
    </main>
  </div>
</template>

<script>
import Gallery from '@/view/components/Gallery.vue'
import Spinner from '@/view/components/common/loading/Spinner.vue'

import GalleryStore from '@/model/stores/GalleryStore'
import GalleryAction from '@/consts/actions/GalleryAction'

export default {
  name: 'App',
  components: {
    Gallery,
    Spinner
  },
  store: GalleryStore, // <-------------- STORE MAPPING
  created () {
    GalleryStore.dispatch(GalleryAction.GET_GALLERY_PAGE).then(success => { this.ready = success })
  },
  data () {
    return {
      ready: false
    }
  }
}
</script>

<style scoped>
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
    display: block;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
  }
</style>
