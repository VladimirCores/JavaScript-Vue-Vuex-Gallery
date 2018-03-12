<template>
    <div @click="onSelected(index)"
      v-bind:class="{
        'gallery-view-item': true,
        'selected':isSelected
      }"
    >
      <img :src="imageUrl"/>
    </div>
</template>

<script>
export default
{
  name: 'GalleryViewItem',
  props: [
    'index',
    'imageUrl',
    'onSelected',
    'isSelected'
  ],
  beforeUpdate () {
    console.log(this.imageUrl)
  }
}
</script>

<style scoped lang='scss'>
.selected {
  img {
    outline: 3px solid deepskyblue;
    outline-offset: -4px;
  }
}
.gallery-view-item {
  margin: 0.25em;
  display: inline-block;
}
</style>
