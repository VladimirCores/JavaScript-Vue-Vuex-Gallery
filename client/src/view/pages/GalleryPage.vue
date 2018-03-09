<template>
  <div id="gallery-page">

    <div class="icon_settings" @click="openUserSettingsForm"/>
    <transition name="component-fade" mode="out-in">
      <component v-bind:is="userSettingsForm"
        @onClose="OnCloseUserSettings"
        @onUserChanged="OnUserChanged"
      >
      </component>
    </transition>

    <GalleryNavigation v-if="isGalleryReady" keep-alive
      :locked="loading"
      @navigate="navigateHandler"
    />

    <GalleryView v-if="!loading" keep-alive/>
    <Spinner v-else></Spinner>
  </div>
</template>

<script>

import {
  GALLERY_STORE_NAME
} from '@/consts/StoreNames'

import ApplicationAction from '@/consts/actions/ApplicationAction'
import GalleryGetter from '@/consts/getters/GalleryGetter'

import ModuleDTO from '@/model/dtos/ModuleDTO'

import GalleryStore from '@/model/stores/GalleryStore'
import GalleryAction from '@/consts/actions/GalleryAction'

import Spinner from '@/view/components/_common/loading/Spinner.vue'
import GalleryView from '@/view/components/gallery/GalleryView'
import GalleryNavigation from '@/view/components/gallery/GalleryNavigation'

import { createNamespacedHelpers } from 'vuex'

const COMPONENT_USER_SETTINGS = 'component-server-data-form'

const galleryMapGetters = createNamespacedHelpers(GALLERY_STORE_NAME).mapGetters
const galleryMapActions = createNamespacedHelpers(GALLERY_STORE_NAME).mapActions

export default {
  name: 'GalleryPage',
  components: {
    Spinner,
    GalleryView,
    GalleryNavigation,
    [COMPONENT_USER_SETTINGS]: ''
  },
  computed: {
    ...galleryMapGetters({ isGalleryReady: GalleryGetter.IS_GALLERY_READY })
  },
  methods: {
    navigateHandler (direction) {
      this.loading = true
      this.actionNavigateTo(direction).then(() => {
        this.loading = false
      })
    },
    ...galleryMapActions({
      actionNavigateTo: GalleryAction.NAVIGATE,
      actionSetupGalleryView: GalleryAction.SETUP_GALLERY_VIEW
    }),
    OnUserChanged () { this.setup() },
    OnCloseUserSettings () { this.userSettingsForm = '' },
    openUserSettingsForm () { this.userSettingsForm = () => import('@/view/components/index/UserSettings') },
    setup () {
      this.actionSetupGalleryView().then(status => {
        switch (status) {
        }
        this.loading = !status
      })
    }
  },
  beforeCreate () {
    this.$store.dispatch(ApplicationAction.REGISTER_MODULE, new ModuleDTO(GALLERY_STORE_NAME, GalleryStore))
  },
  beforeDestroy () {
    this.$store.unregisterModule(GALLERY_STORE_NAME)
  },
  created () { this.setup() },
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
