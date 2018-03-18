<template>
  <div class="server-data" @click.prevent.self="onClose">
    <form>
      <a class="close" @click="onClose"/>

      <div>UserID:</div><input type="text" v-model="userID"><br>
      <div>Token:</div><input type="text" v-model="accessToken"><br>

      <button type="button" @click="onAccept" :disabled="!validated && !changed">Accept</button>
    </form>
  </div>
</template>

<script>
import {
  USER_STORE_NAME
} from '@/consts/StoreNames'

import UserSettingsAction from '@/consts/actions/user/UserSettingsAction'
import UserSettingsMutation from '@/consts/mutations/user/UserSettingsMutation'
import UserSettingsError from '@/consts/errors/UserSettingsError'

import { createNamespacedHelpers } from 'vuex'

const mapUserState = createNamespacedHelpers(USER_STORE_NAME).mapState
const mapUserActions = createNamespacedHelpers(USER_STORE_NAME).mapActions

const EVENT_CLOSE = 'close'

export default {
  name: 'UserSettings',
  methods: {
    ...mapUserActions({
      actionChangeUserSettings: UserSettingsAction.CHANGED
    }),
    onClose () { this.$emit(EVENT_CLOSE) },
    onAccept () {
      this.validated = false
      this.actionChangeUserSettings({...this.$data})
        .then((result) => {
          console.log('> UserSettings -> actionChangeUserSettings : result = ' + result)
          switch (result) {
            case UserSettingsError.UPDATE_FAILED:
              break
            case UserSettingsError.UPDATE_UNEXPECTED:
              break
          }
          this.validated = true
        })
    },
    UpdateStoreValues (data) {
      if (data.userID !== this.userID) this.userID = data.userID
      if (data.accessToken !== this.accessToken) this.accessToken = data.accessToken
    }
  },
  computed: {
    ...mapUserState(['settings']),
    changed: function () {
      return this.settings.userID !== this.userID ||
        this.settings.accessToken !== this.accessToken
    }
  },
  watch: {
    settings: function (val) {
      console.log('> UserSettings -> watcher:', val)
    }
  },
  created () {
    this.UpdateStoreValues(this.settings)
    this.$store.subscribe((mutation, state) => {
      if (mutation.type.indexOf(UserSettingsMutation.SETUP_SETTINGS) > -1) {
        console.log('> UserSettings -> subscribe: catch update', mutation)
        this.UpdateStoreValues(mutation.payload)
      }
    })
  },
  data: function () {
    return {
      userID: '',
      accessToken: '',
      validated: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .server-data
  {
    z-index: 1000;
    background-color: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position:fixed;
    height: 100%;
    width: 100%;
    top: 0;

    form {
      position: relative;
      text-align: center;
      align-self: center;
      align-content: center;
      margin: auto;
      padding: 0.5rem 1rem;
      min-width: 360px;
      max-width: 360px;
      background: #fcfcfc;
      border: 1px solid #f1f1f1;
      border-radius: 5px;

      div {
        font-size: 0.88rem;
        color: #666;
        text-align: left;
        margin-top: 1rem;
        padding-left: 0.21rem;
        user-select: none;
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
        margin: 1rem 0 0.5rem 0;
        width: 34%;
        border-radius: 5px;
        height: 1.618rem;
        font-weight: bold;
        user-select: none;
      }

      .close {
        position: absolute;
        right: 8px;
        top: 8px;
        width: 15px;
        height: 15px;
        opacity: 0.2;
        &:hover {
          opacity: 1;
        }
      }
      .close:before, .close:after {
        position: absolute;
        content: ' ';
        height: 15px;
        width: 2px;
        background-color: #555;
      }
      .close:before {
        transform: rotate(45deg);
      }
      .close:after {
        transform: rotate(-45deg);
      }
    }
  }
</style>
