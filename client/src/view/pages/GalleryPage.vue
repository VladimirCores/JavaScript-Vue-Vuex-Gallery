<template>
  <div id="gallery-page">

    <div class="icon_settings" @click="openUserSettingsForm"/>
    <transition name="component-fade" mode="out-in">
      <component v-if="userSettings" v-bind:is="userSettingsForm"
        :user_id="userSettings.userID"
        :access_token="userSettings.accessToken"
        @close="closeUserSettingsForm">
      </component>
    </transition>

    <GalleryNavigation
      :locked="loading"
      @navigate="navigateHandler"/>
    <GalleryView v-if="!loading" keep-alive/>
    <Spinner v-else></Spinner>
  </div>
</template>

<script>

import {
  GALLERY_STORE_NAME,
  USER_STORE_NAME,
  USER_SETTINGS_STORE_NAME
} from '@/consts/StoreNames'

import GalleryStore from '@/model/stores/GalleryStore'
import GalleryAction from '@/consts/actions/GalleryAction'

import Spinner from '@/view/components/_common/loading/Spinner.vue'
import GalleryView from '@/view/components/gallery/GalleryView'
import GalleryNavigation from '@/view/components/gallery/GalleryNavigation'

import { createNamespacedHelpers } from 'vuex'

const COMPONENT_USER_SETTINGS = 'component-server-data-form'

const galleryMapActions = createNamespacedHelpers(GALLERY_STORE_NAME).mapActions
const userMapGetters = createNamespacedHelpers(USER_STORE_NAME).mapGetters

export default {
  name: 'GalleryPage',
  components: {
    Spinner,
    GalleryView,
    GalleryNavigation,
    [COMPONENT_USER_SETTINGS]: ''
  },
  methods: {
    navigateHandler (direction) {
      this.loading = true
      this.navigateTo(direction).then(() => {
        this.loading = false
      })
    },
    ...userMapGetters({
      userSettings: USER_SETTINGS_STORE_NAME
    }),
    ...galleryMapActions({
      navigateTo: GalleryAction.NAVIGATE,
      getGalleryView: GalleryAction.GET_GALLERY_VIEW
    }),
    closeUserSettingsForm () { this.userSettingsForm = '' },
    openUserSettingsForm () { this.userSettingsForm = () => import('@/view/components/index/UserSettings') }
  },
  beforeCreate () {
    this.$store.registerModule(GALLERY_STORE_NAME, GalleryStore)
  },
  beforeDestroy () {
    this.$store.unregisterModule(GALLERY_STORE_NAME)
  },
  created () {
    console.log('userSettings', this.userSettings)
    this.getGalleryView()
      .then(success => {
        this.loading = !success
      })
  },
  data () {
    return {
      loading: true,
      userSettingsForm: ''
    }
  }
}
</script>

<style scoped lang="scss">

  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .icon_settings {
    position: absolute;
    right: 0;
    margin-right: 1rem;
    width: 25px;
    height: 25px;
    background-image: url("/static/assets/icons/icon_settings.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    &:active {
      background-size: 95%;
    }
  }

</style>
