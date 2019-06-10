<template>
  <div class="index-page" ref="background" :style="{ 'width': width + 'px', 'height': height + 'px'}">
    <AssetSpinner v-if="loading"/>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
import ApplicationAction from '@/consts/actions/ApplicationAction'
import LoadImageDTO from '@/model/dtos/LoadImageDTO'
import AssetSpinner from '@/view/components/_common/loading/AssetSpinner'

export default {
  name: 'IndexPage',
  components: {
    AssetSpinner
  },
  mounted () {
    this.loadImage(new LoadImageDTO(this.height, this.height, (progress) => {
      console.log('> HomePage -> background image loading progress: ' + progress)
    })).then((imageURL) => {
      if (imageURL) {
        let back = this.$refs.background
        back && (back.style.backgroundImage = `url(${imageURL})`)
      }
      this.loading = false
    })
    window.addEventListener('resize', this.handleWindowResize)
  },
  methods: {
    ...mapActions({ loadImage: ApplicationAction.LOAD_IMAGE }),
    handleWindowResize () {
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
  },
  data () {
    return {
      loading: true,
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.index-page {
  background-size:     cover;
  background-repeat:   no-repeat;
  background-position: center center;
}
</style>
