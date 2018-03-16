<template>
  <div class="gallery-navigation">
    <button v-if="isPrevPossible"
      @click="onNavigateBack"
      :disabled="locked">
        Prev
      </button>
    <span>{{index}}</span>
    <button v-if="isNextPossible"
      @click="onNavigateNext"
      :disabled="locked">
        Next
      </button>
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'

import { GALLERY_STORE_NAME } from '@/consts/StoreNames'

import {
  IS_NAVIGATE_POSSIBLE_PREV,
  IS_NAVIGATE_POSSIBLE_NEXT
} from '@/consts/getters/GalleryGetter'

const {
  mapState,
  mapGetters
} = createNamespacedHelpers(GALLERY_STORE_NAME)

const EVENT_NAVIGATE = 'navigate'

export default
{
  name: 'GalleryNavigation',
  props: {
    locked: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(['index']),
    ...mapGetters({
      isPrevPossible: IS_NAVIGATE_POSSIBLE_PREV,
      isNextPossible: IS_NAVIGATE_POSSIBLE_NEXT
    })
  },
  methods: {
    onNavigateBack () { this.$emit(EVENT_NAVIGATE, -1) },
    onNavigateNext () { this.$emit(EVENT_NAVIGATE, 1) }
  }
}
</script>

<style lang="scss">
.gallery-navigation{
  button {
    padding: 0.5rem 1rem;
    margin: 0.75rem 0.5rem 0.5rem 0.5rem;
    border: 1px solid black;
    border-radius: 5%;
    background: none;
    outline : none;
    user-select: none;
    &:active {
      border-color: #ccc;
      color: grey;
      background-color:#f1f1f1;
    }
    text: {
      transform: uppercase;
      decoration: none;
      shadow: 0 .063em rgba(0,0,0,.3);
    }
  }
}
</style>
