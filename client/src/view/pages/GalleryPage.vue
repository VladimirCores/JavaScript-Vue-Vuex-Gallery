<template>
  <div id="gallery-page">
    <Gallery v-if="ready" keep-alive/>
    <Spinner v-else></Spinner>
  </div>
</template>

<script>

import { GALLERY_STORE_NAME } from '@/consts/StoreNames'

import GalleryStore from '@/model/stores/GalleryStore'
import GalleryAction from '@/consts/actions/GalleryAction'

import Spinner from '@/view/components/_common/loading/Spinner.vue'
import Gallery from '@/view/components/Gallery.vue'

import { createNamespacedHelpers } from 'vuex'

const { mapActions } = createNamespacedHelpers(GALLERY_STORE_NAME)

export default {
  name: 'GalleryPage',
  components: {
    Gallery,
    Spinner
  },
  methods: {
    ...mapActions({
      getGalleryView: GalleryAction.GET_GALLERY_VIEW
    })
  },
  beforeCreate () {
    this.$store.registerModule(GALLERY_STORE_NAME, GalleryStore)
  },
  beforeDestroy () {
    this.$store.unregisterModule(GALLERY_STORE_NAME)
  },
  created () {
    this.getGalleryView().then(success => { this.ready = success })
  },
  data () {
    return {
      ready: false
    }
  }
}
</script>

<style scoped>

</style>
