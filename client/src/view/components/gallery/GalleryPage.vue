<template>
  <div class="gallery-page" v-if="page">
      <GalleryPageItem v-for="item in page.items" :url="item.link" :key="item.uri"/>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import GalleryPageItem from '@/view/components/gallery/GalleryPageItem'

export default
{
  name: 'GalleryPage',
  components: {
    GalleryPageItem
  },
  computed: {
    ...mapState([
      'page'
    ])
  },
  beforeUpdate () {
    console.log('beforeUpdate', this.page)
  }
}
</script>

<style>

</style>
