<template>
  <div class="gallery-view" v-if="ready">
    <GalleryViewItem
      v-for="item in items"
      :imageUrl="item.imageUrl"
      :key="item.uri"
      :index="item.index"
      :width="item.width"
      :height="item.height"
      :onSelected="OnGalleryItemSelected"
      :isSelected="isItemSelected(item)"
    />
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
import GalleryViewItem from '@/view/components/gallery/GalleryViewItem'
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
    GalleryViewItem
  },
  props: ['selectedItem'],
  methods: {
    OnGalleryItemSelected (index) { this.$emit(EVENT_SELECT, index) },
    isItemSelected (item) {
      return this.selectedItem && this.selectedItem.index === item.index
    }
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
