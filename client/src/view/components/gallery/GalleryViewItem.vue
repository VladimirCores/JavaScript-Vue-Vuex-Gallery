<template>
    <img class="gallery-view-item" :src="imageUrl"/>
</template>

<script>
export default
{
  name: 'GalleryViewItem',
  props: [
    'imageUrl'
  ],
  beforeUpdate () {
    console.log(this.url)
  }
}
</script>

<style>
.gallery-view-item {
  margin: 0.25em;
}
</style>
