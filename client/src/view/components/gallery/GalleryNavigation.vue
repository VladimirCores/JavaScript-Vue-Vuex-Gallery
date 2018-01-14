<template>
  <div class="gallery-navigation">
    <button v-if="isPrevPossible" @click="navigate(-1)">Prev</button>
    <span>{{index}}</span>
    <button v-if="isNextPossible" @click="navigate(1)">Next</button>
  </div>
</template>

<script>

import {
  mapState,
  mapGetters,
  mapActions
} from 'vuex'

import GalleryAction from '@/consts/actions/GalleryAction'
import {
  IS_NAVIGATE_POSSIBLE_PREV,
  IS_NAVIGATE_POSSIBLE_NEXT
} from '@/consts/getters/GalleryGetter'

export default
{
  name: 'GalleryNavigation',
  computed: {
    ...mapState([
      'index',
    ]),
    ...mapGetters({
        isPrevPossible: IS_NAVIGATE_POSSIBLE_PREV,
        isNextPossible: IS_NAVIGATE_POSSIBLE_NEXT
    })
  },
  methods: {
    ...mapActions({
        navigate: GalleryAction.NAVIGATE
    })
  },
}
</script>

<style lang="scss">
.gallery-navigation{
  margin: 1rem;
  button {
    padding: 0.5rem 1rem;
    margin: 0.5rem;
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
