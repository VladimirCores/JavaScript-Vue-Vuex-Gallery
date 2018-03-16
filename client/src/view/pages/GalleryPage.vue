<template>
  <div id="gallery-page">

    <transition name="component-fade" mode="out-in">
      <component v-bind:is="userSettingsForm"
        @close="OnCloseUserSettings"
        @userChange="OnUserChanged"
      >
      </component>
    </transition>

    <GalleryPlayer
      :selectedItem="selectedItem"
      :loading="videoLoading"
      @loaded="OnVideoLoaded"
      @ready="OnVideoPlayerReady"
    />

    <GalleryNavigation v-if="isGalleryReady" keep-alive
      :locked="loading"
      @navigate="OnNavigateChanged"
    />

    <GalleryView v-if="!loading" keep-alive
       @select="OnGalleryItemSelected"
       :selectedItem="selectedItem"
    />
    <Spinner v-else></Spinner>
    <div class="icon_settings" @click="openUserSettingsForm"/>
  </div>
</template>

<script>

import {
  GALLERY_STORE_NAME
} from '@/consts/StoreNames'

import ApplicationAction from '@/consts/actions/ApplicationAction'
import GalleryGetter from '@/consts/getters/GalleryGetter'
import GalleryError from '@/consts/errors/GalleryError'

import ModuleDTO from '@/model/dtos/ModuleDTO'

import GalleryStore from '@/model/stores/GalleryStore'
import GalleryAction from '@/consts/actions/GalleryAction'

import Spinner from '@/view/components/_common/loading/Spinner.vue'
import GalleryView from '@/view/components/gallery/GalleryView'
import GalleryPlayer from '@/view/components/gallery/GalleryPlayer'
import GalleryNavigation from '@/view/components/gallery/GalleryNavigation'

import { createNamespacedHelpers } from 'vuex'

import {
  ConstructErrorToast
} from '@/view/components/_common/Toast'

const GALLERY_STORE_UTILS = createNamespacedHelpers(GALLERY_STORE_NAME)

const galleryMapState = GALLERY_STORE_UTILS.mapState
const galleryMapGetters = GALLERY_STORE_UTILS.mapGetters
const galleryMapActions = GALLERY_STORE_UTILS.mapActions

let ShowErrorToast

export default {
  name: 'GalleryPage',
  components: {
    Spinner,
    GalleryView,
    GalleryPlayer,
    GalleryNavigation
  },
  computed: {
    ...galleryMapState(['selectedItem']),
    ...galleryMapGetters({ isGalleryReady: GalleryGetter.IS_GALLERY_READY })
  },
  methods: {
    OnVideoPlayerReady () {
      this.videoLoading = true
    },
    OnVideoLoaded () {
      this.videoLoading = false
    },
    OnGalleryItemSelected (index) {
      this.videoLoading = true
      this.actionSelectItem(index)
    },
    OnNavigateChanged (direction) {
      this.loading = true
      this.actionNavigateTo(direction).then((status) => {
        switch (status) {
        }
        this.loading = false
      })
    },
    ...galleryMapActions({
      actionSelectItem: GalleryAction.SELECT_ITEM,
      actionNavigateTo: GalleryAction.NAVIGATE,
      actionSetupGalleryView: GalleryAction.SETUP_GALLERY_VIEW
    }),
    OnUserChanged () { this.setup() },
    OnCloseUserSettings () { this.userSettingsForm = '' },
    openUserSettingsForm () { this.userSettingsForm = () => import('@/view/components/index/UserSettings') },
    setup () {
      this.actionSetupGalleryView().then(status => {
        switch (status) {
          case GalleryError.WRONG_SERVER_DATA:
            ShowErrorToast('WRONG SERVER DATA')
            break
          case GalleryError.WRONG_USER_SETTINGS_DATA:
            ShowErrorToast('WRONG USER SERVER DATA')
            break
          case GalleryError.REQUESTING_AXIOS_DATA_PROBLEM:
            ShowErrorToast('SERVER REQUEST FAILED')
            break
        }
        this.loading = !status
      })
    }
  },
  beforeCreate () {
    ShowErrorToast = ConstructErrorToast(this.$toasted)
    this.$store.dispatch(ApplicationAction.REGISTER_MODULE, new ModuleDTO(GalleryStore))
  },
  beforeDestroy () {
    this.$store.dispatch(ApplicationAction.DEREGISTER_MODULE, GalleryStore)
  },
  created () { this.setup() },
  data () {
    return {
      loading: true,
      videoLoading: false,
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
    right: 1rem;
    bottom: 1rem;
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
