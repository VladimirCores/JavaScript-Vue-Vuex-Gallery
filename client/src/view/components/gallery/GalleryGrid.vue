<template>
  <div class="gallery-view" v-if="ready">
    <GalleryGridItem
      v-for="item in items"
        :imageUrl="item.imageUrl"
        :key="item.uri"
        :index="item.index"
        :width="item.width"
        :height="item.height"
        :onSelected="OnGalleryGridItemSelected"
        :isSelected="isItemSelected(item)"
    />
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
import GalleryGridItem from '@/view/components/gallery/GalleryGridItem'
import { GALLERY_STORE_NAME } from '@/consts/StoreNames'
import {
  IS_GALLERY_READY,
  GET_GALLERY_VIEW_ITEMS
} from '@/consts/getters/GalleryGetter'

const { mapGetters } = createNamespacedHelpers(GALLERY_STORE_NAME)

const EVENT_SELECT = 'select'

export default
{
  name: 'GalleryView',
  components: {
    GalleryGridItem
  },
  props: ['selectedItem'],
  methods: {
    OnGalleryGridItemSelected (index) { this.$emit(EVENT_SELECT, index) },
    isItemSelected (item) { return this.selectedItem && this.selectedItem.index === item.index }
  },
  computed: {
    ...mapGetters({
      ready: IS_GALLERY_READY,
      items: GET_GALLERY_VIEW_ITEMS
    })
  }
}
</script>

<style>

</style>
