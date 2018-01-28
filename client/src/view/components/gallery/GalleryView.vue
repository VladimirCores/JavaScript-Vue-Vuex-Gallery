<template>
  <div class="gallery-view" v-if="available">
    <GalleryViewItem v-for="item in items" :url="item.link" :key="item.uri"/>
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
import GalleryViewItem from '@/view/components/gallery/GalleryViewItem'
import { GALLERY_STORE_NAME } from '@/consts/StoreNames'

const { mapState } = createNamespacedHelpers(GALLERY_STORE_NAME)

export default
{
  name: 'GalleryView',
  components: {
    GalleryViewItem
  },
  computed: {
    ...mapState({
      available: state => (state.view != null),
      items: state => state.view.items
    })
  }
}
</script>

<style>

</style>
