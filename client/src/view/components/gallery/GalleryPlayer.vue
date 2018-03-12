<template>
  <div class="gallery-video-player">
    <VideoPlayer class="video-player" v-if="selectedItem"
     ref="player"
     :video-id="videoURL"
     :player-height="height"
     @ready="onReady"
    ></VideoPlayer>
    <div class="cover" v-bind:style="{ height: height + 'px' }"/>
  </div>
</template>

<script>
import { vueVimeoPlayer } from 'vue-vimeo-player'

export default {
  name: 'gallery-player',
  components: {
    VideoPlayer: vueVimeoPlayer
  },
  props: {
    selectedItem: {
      type: Object
    }
  },
  data () {
    return {
      height: ((window.innerWidth * 1080 / 1980) * 0.8).toFixed(0),
      options: {},
      playerReady: false
    }
  },
  computed: {
    videoURL () { return this.selectedItem.uri.split('/')[2] }
  },
  methods: {
    onReady () { this.playerReady = true },
    play () { this.$refs.player.play() },
    stop () { this.$refs.player.stop() }
  }
}
</script>

<style scoped lang="scss">
.gallery-video-player {
  width: 100%;
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
