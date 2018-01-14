<template>
  <div class="gallery">
    <GalleryNavigation/>
    <GalleryPage/>
  </div>
</template>
<script>

import { mapState } from 'vuex'
import GalleryPage from '@/view/components/gallery/GalleryPage'
import GalleryNavigation from '@/view/components/gallery/GalleryNavigation'

export default {
  name: 'Gallery',
  components: {
    GalleryPage,
    GalleryNavigation
  },
  computed: {
    ...mapState([
    ])},
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
