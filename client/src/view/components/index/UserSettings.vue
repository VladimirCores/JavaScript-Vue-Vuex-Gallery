<template>
  <div class="server-data" @click.prevent.self="onClose">
    <form>
      <a class="close" @click="onClose"/>

      <div>UserID:</div><input type="text" v-model="userID"><br>
      <div>Token:</div><input type="text" v-model="accessToken"><br>

      <button type="button" @click="onAccept" :disabled="!validated || !changed">Accept</button>
    </form>
  </div>
</template>

<script>
import {
  USER_STORE_NAME
} from '@/consts/StoreNames'

import UserSettingsAction from '@/consts/actions/UserSettingsAction'
import UserSettingsError from '@/consts/errors/UserSettingsError'
import UserSettingsGetter from '@/consts/getters/user/UserSettingsGetter'

import { createNamespacedHelpers } from 'vuex'

const userMapGetters = createNamespacedHelpers(USER_STORE_NAME).mapGetters
const mapUserSettingsActions = createNamespacedHelpers(USER_STORE_NAME).mapActions

const EVENT_CLOSE = 'onClose'
const EVENT_USER_CHANGED = 'onUserChanged'
// const EVENT_TOKEN_CHANGED = 'onTokenChanged'

export default {
  name: 'UserSettings',
  methods: {
    ...mapUserSettingsActions({
      changeUserSettingsData: UserSettingsAction.CHANGED
    }),
    onClose () {
      this.$emit(EVENT_CLOSE)
    },
    onAccept () {
      this.validated = false
      this.changeUserSettingsData({...this.$data})
        .then((result) => {
          console.log('> UserSettings -> changeUserSettingsData : result = ' + result)
          switch (result) {
            case UserSettingsError.UPDATE_FAILED: break
            case UserSettingsError.UPDATE_UNEXPECTED: break
          }
          this.validated = true
          if (result === true) this.$emit(EVENT_USER_CHANGED)
        })
    }
  },
  computed: {
    ...userMapGetters({
      user_id: UserSettingsGetter.GET_USER_ID,
      access_token: UserSettingsGetter.GET_TOKEN
    }),
    changed: function () {
      return this.user_id !== this.userID ||
        this.access_token !== this.accessToken
    }
  },
  created () {
    this.userID = this.user_id
    this.accessToken = this.access_token
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
