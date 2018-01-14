<template>
    <img class="gallery-page-item" :src="url"/>
</template>

<script>
export default
{
  name: 'GalleryPageItem',
  props: [
    'url'
  ],
  beforeUpdate () {
    console.log(this.url)
  }
}
</script>

<style>
.gallery-page-item {
  margin: 0.25em;
}
</style>
