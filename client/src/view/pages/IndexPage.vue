<template>
  <div class="index-page">

  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'IndexPage',
  computed: {
    ...mapState([
      'server'
    ])
  },
  methods: {
  },
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  form {
    text-align: center;
    margin: 0 auto;
    padding: 0 1rem;
    max-width: 300px;
    background: #fcfcfc;
    border: 1px solid #f1f1f1;
    div {
      font-size: 0.88rem;
      color: #666;
      text-align: left;
      margin-top: 1rem;
      padding-left: 0.21rem;
    }
    input {
      width: 100%;
      height: 1.618rem;
      font-size: 1rem;
      text-indent: 0.34rem;
      border-radius: 0.25rem;
      border: 1px solid #dddddd;
      outline: none;
    }

    button {
      margin: 1rem 0 0.75rem 0;
      border-radius: 5px;
      height: 1.618rem;
      font-weight: bold;
    }
  }
</style>
