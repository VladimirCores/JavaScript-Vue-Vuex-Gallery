<template>
  <div class="gallery-view" v-if="view">
    <GalleryPageItem v-for="item in view.items" :url="item.link" :key="item.uri"/>
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
import GalleryPageItem from '@/view/components/gallery/GalleryViewItem'
import { GALLERY_STORE_NAME } from '@/consts/StoreNames'

const { mapState } = createNamespacedHelpers(GALLERY_STORE_NAME)

export default
{
  name: 'GalleryView',
  components: {
    GalleryPageItem
  },
  computed: {
    ...mapState([
      'view'
    ])
  },
  beforeUpdate () {
    console.log('beforeUpdate', this.page)
  }
}
</script>

<style>

</style>
