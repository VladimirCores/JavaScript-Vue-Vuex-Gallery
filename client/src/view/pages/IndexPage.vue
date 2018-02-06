<template>
  <div class="index">
    <div class="icon_settings" @click="openServerDataForm"/>
    <transition name="component-fade" mode="out-in">
      <component v-if="server" v-bind:is="serverDataForm"
        :user_id="server.userID"
        :access_token="server.accessToken"
        @close="closeServerDataForm">
      </component>
    </transition>
  </div>
</template>

<script>

import { mapState } from 'vuex'

const COMPONENT_SERVER_DATA_FORM = 'component-server-data-form'

export default {
  name: 'IndexPage',
  components: {
    [COMPONENT_SERVER_DATA_FORM]: () => import('@/view/components/index/ServerDataForm')
  },
  computed: {
    ...mapState([
      'server'
    ])
  },
  methods: {
    closeServerDataForm () { this.serverDataForm = '' },
    openServerDataForm () { this.serverDataForm = COMPONENT_SERVER_DATA_FORM }
  },
  data () {
    return {
      serverDataForm: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
