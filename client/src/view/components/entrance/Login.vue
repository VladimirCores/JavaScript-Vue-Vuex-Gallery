<template lang="html">
  <div class="login" v-if="!isUserLoggedIn">
    <form>
      <div>Email:</div>
      <input type="text" v-model="name"><br>
      <div>Password:</div>
      <input type="text" v-model="password" @keyup.enter="onLogin"><br>
      <button type="button" @click="onLogin" :disabled="!validated">Login</button>
    </form>
  </div>
</template>

<script>

import PageNames from '@/consts/PageNames'
import UserError from '@/consts/errors/UserError'
import AuthDTO from '@/model/dtos/AuthDTO'
import UserAction from '@/consts/actions/UserAction'

import ApplicationAction from '@/consts/actions/ApplicationAction'
import ApplicationGetter from '@/consts/getters/ApplicationGetter'

import { mapActions, mapGetters } from 'vuex'
import {
  ConstructMessageToast,
  ConstructErrorToast
} from '@/view/components/_common/Toast'

let showMessage
let showError

export default {
  name: 'Login',
  methods: {
    ...mapActions({ login: ApplicationAction.SETUP_USER }),
    onLogin () {
      this.login(new AuthDTO(this.$data, UserAction.LOGIN))
        .then(result => {
          console.log('isUserLoggedIn', this.isUserLoggedIn)
          switch (result) {
            case UserError.LOG_IN_FAILED:
              showError('LOGIN FAILED')
              break
            case UserError.LOG_IN_BAD_CREDITS:
              showError('LOGIN BAD CREDITS')
              break
            case UserError.LOG_IN_UNEXPECTED:
              showError('LOGIN UNEXPECTED')
              break
            default:
              showMessage('LOGGED IN SUCCESSFUL')
              this.$router.push({ name: PageNames.INDEX })
          }
        })
    }
  },
  computed: {
    ...mapGetters({
      'isUserLoggedIn': ApplicationGetter.IS_USER_LOGGED
    }),
    validated: function () {
      return this.password.length > 0 &&
        (this.name.length > 0 && this.name.indexOf('@') > 1)
    }
  },
  created () {
    showMessage = ConstructMessageToast(this.$toasted)
    showError = ConstructErrorToast(this.$toasted)
    console.log('isUserLoggedIn', this.isUserLoggedIn)
  },
  data: function () {
    return {
      name: '',
      password: ''
    }
  }
}
</script>

<style scoped lang="scss">

  .login
  {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position:fixed;
    height: 100%;
    width: 100%;
    top: 0;
    z-index: -1;

    form {
      position: relative;
      text-align: center;
      align-self: center;
      align-content: center;
      margin: auto;
      padding: 0.5rem 1rem;
      width: 100%;
      max-width: 360px;
      background: #fcfcfc;
      border: 1px solid #f1f1f1;
      border-radius: 5px;
      box-sizing: border-box;

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
        box-sizing: border-box;
        min-width: 89px;
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
