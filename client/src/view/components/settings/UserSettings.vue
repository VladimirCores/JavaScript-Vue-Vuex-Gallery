<template>
  <div class="server-data" @click.prevent.self="onClose">
    <form>
      <a class="close" @click="onClose"/>

      <div>UserID:</div><input type="text" v-model="userID"><br>
      <div>Token:</div><input type="text" v-model="accessToken"><br>
      <!--<div>UserID:</div><input type="text" :value="settings.userID" @change="onUserIDChanged"><br>-->
      <!--<div>Token:</div><input type="text" :value="settings.accessToken" @change="onTokenChanged"><br>-->

      <button type="button" @click="onAccept" :disabled="!isDataChanged || isProcessing">Accept</button>
    </form>
  </div>
</template>

<script>
import {
  USER_STORE_NAME
} from '@/consts/StoreNames'

import UserSettingsAction from '@/consts/actions/user/UserSettingsAction'
import UserSettingsError from '@/consts/errors/UserSettingsError'
import UserSettingsMutation from '@/consts/mutations/user/UserSettingsMutation'
import UserSettingsGetters from '@/consts/getters/user/UserSettingsGetter'

import { createNamespacedHelpers } from 'vuex'

// const mapUserState = createNamespacedHelpers(USER_STORE_NAME).mapState
const mapUserActions = createNamespacedHelpers(USER_STORE_NAME).mapActions
const mapUserGetters = createNamespacedHelpers(USER_STORE_NAME).mapGetters

const EVENT_CLOSE = 'close'

let _isProcessing = false

export default {
  name: 'UserSettings',
  methods: {
    ...mapUserActions({
      actionChangeUserSettings: UserSettingsAction.CHANGED
    }),
    // onUserIDChanged (event) { this.userID = event.target.value },
    // onTokenChanged (event) { this.accessToken = event.target.value },
    onClose () { this.$emit(EVENT_CLOSE) },
    onAccept () {
      _isProcessing = true
      this.actionChangeUserSettings({...this.$data})
        .then((result) => {
          console.log('> UserSettings -> actionChangeUserSettings : result = ' + result)
          switch (result) {
            case UserSettingsError.UPDATE_FAILED:
              break
            case UserSettingsError.UPDATE_UNEXPECTED:
              break
          }
          _isProcessing = false
        })
    },
    UpdateStoreValues () {
      this.userID = this.getUserID
      this.accessToken = this.getAccessToken
    }
  },
  computed: {
    ...mapUserGetters({
      getUserID: UserSettingsGetters.GET_USER_ID,
      getAccessToken: UserSettingsGetters.GET_ACCESS_TOKEN
    }),
    // ...mapUserState(['settings']),
    isProcessing: function () { return _isProcessing },
    isDataChanged: function () {
      return this.userID !== this.getUserID ||
        this.accessToken !== this.getAccessToken
      // return this.settings.userID !== this.userID ||
      //   this.settings.accessToken !== this.accessToken
    }
  },
  created () {
    // this.UpdateStoreValues(this.settings)
    this.UpdateStoreValues()
    this.$store.subscribe((mutation) => {
      if (mutation.type.indexOf(UserSettingsMutation.SETUP_SETTINGS) > -1) {
        console.log('> UserSettings -> subscribe: catch update', mutation)
        // this.UpdateStoreValues(mutation.payload)
        this.UpdateStoreValues()
      }
    })
  },
  data: function () {
    return {
      userID: '',
      accessToken: ''
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
