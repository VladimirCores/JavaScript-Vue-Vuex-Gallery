<template>
  <div class="index">
    <div class="icon_settings" @click="onSettingsOpen"/>
    <ServerDataForm v-if="settingsVisible && server"
      :user_id="server.userID"
      :access_token="server.accessToken"
      @close="onSettingsClose"
      />
  </div>
</template>

<script>

import { mapState } from 'vuex'
import ServerDataForm from '@/view/components/index/ServerDataForm'

export default {
  name: 'IndexPage',
  components: {
    ServerDataForm
  },
  computed: {
    ...mapState([
      'server'
    ])
  },
  methods: {
    onSettingsClose () {
      this.settingsVisible = false
    },
    onSettingsOpen () {
      this.settingsVisible = true
    }
  },
  data () {
    return {
      settingsVisible: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
