<template>
  <div class="gallery-player">
    <VideoPlayer class="video-player" v-if="selectedItem"
     ref="player"
     :video-id="videoURL"
     :player-width="playerWidth"
     :player-height="playerHeight"
     @ready="onReady"
     @loaded="onLoaded"
    ></VideoPlayer>
    <div class="cover" v-bind:style="{ height: height + 'px' }"/>
    <AssetSpinner v-if="loading"></AssetSpinner>
  </div>
</template>

<script>
import { vueVimeoPlayer } from 'vue-vimeo-player'
import AssetSpinner from '@/view/components/_common/loading/AssetSpinner'

const EVENT_LOADED = 'loaded'
const EVENT_READY = 'ready'

export default {
  name: 'GalleryPlayer',
  components: {
    AssetSpinner,
    VideoPlayer: vueVimeoPlayer
  },
  props: {
    selectedItem: {
      type: Object
    },
    loading: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  data () {
    return {
      options: {
        title: true,
        autoplay: false,
        background: true,
        transparent: false,
        color: 0x330000
      },
      playerReady: false,
      playerWidth: 0,
      playerHeight: 0
    }
  },
  computed: {
    videoURL () { return this.selectedItem.uri.split('/')[2] },
    height () {
      let result = ((window.innerWidth * 1080 / 1980)).toFixed(0)
      let heightLimit = window.innerHeight * 0.5
      if (heightLimit < 360) heightLimit = 360
      if (result > heightLimit) result = heightLimit
      return result
    },
    width: () => window.innerWidth
  },
  created () {
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  methods: {
    handleWindowResize () {
      this.playerWidth = this.width
      this.playerHeight = this.height
    },
    onLoaded () {
      console.log('ON LOADED')
      this.$emit(EVENT_LOADED)
    },
    onReady () {
      console.log('PLAYER READY')
      this.playerReady = true
      this.$emit(EVENT_READY)
    },
    play () { this.$refs.player.play() },
    stop () { this.$refs.player.stop() }
  }
}
</script>

<style scoped lang="scss">
.gallery-player {
  width: 100%;
  position: relative;

  .video-player {
    left: 50%;
    position:absolute;
    transform: translateX(-50%);
    box-sizing: border-box;
    margin-top: 10px;
  }
  .cover {
    width: 100%;
    background: #f1f1f1;
    position: relative;
    z-index: -1;
    padding: 10px 0 10px 0;
  }
}
</style>
