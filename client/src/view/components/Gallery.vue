<template>
  <div class="gallery">
    <GalleryNavigation/>
    <GalleryView/>
  </div>
</template>

<script>

import { mapState } from 'vuex'

import { GALLERY_STORE_NAME } from '@/consts/StoreNames'
import GalleryView from '@/view/components/gallery/GalleryView'
import GalleryNavigation from '@/view/components/gallery/GalleryNavigation'

export default {
  name: 'Gallery',
  components: {
    GalleryView,
    GalleryNavigation
  },
  computed: {
    ...mapState([
      GALLERY_STORE_NAME
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
