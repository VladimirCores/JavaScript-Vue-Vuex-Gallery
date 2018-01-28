<template>
    <img class="gallery-view-item" :src="url"/>
</template>

<script>
export default
{
  name: 'GalleryViewItem',
  props: [
    'url'
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
