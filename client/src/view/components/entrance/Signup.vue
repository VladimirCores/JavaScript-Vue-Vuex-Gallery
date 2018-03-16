<template lang="html">
  <div class="signup" v-if="!isUserLoggedIn">
    <form>
      <div>First Name:</div>
      <input type="text" v-model="firstName"><br>
      <div>Last Name:</div>
      <input type="text" v-model="lastName"><br>
      <div>Email:</div>
      <input type="text" v-model="email"><br>
      <div>Password:</div>
      <input type="text" v-model="password"><br>
      <button type="button" @click="onSignup" :disabled="!validated">Signup</button>
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
  name: 'Signup',
  methods: {
    ...mapActions({ signup: ApplicationAction.SETUP_USER }),
    onSignup () {
      this.signup(new AuthDTO(this.$data, UserAction.SIGNUP))
        .then(result => {
          switch (result) {
            case UserError.SIGN_UP_FAILED:
              showError('NETWORK ERROR')
              break
            case UserError.SIGN_UP_RESPONSE:
              showError('RESPONSE ERROR')
              break
            case UserError.SIGN_UP_USER_ALREADY_EXIST:
              showError('USER ALREADY EXIST')
              break
            default:
              showMessage('SIGNUP SUCCESSFUL')
              this.$router.push({ name: PageNames.INDEX })
              break
          }
        })
    }
  },
  computed: {
    ...mapGetters({
      'isUserLoggedIn': ApplicationGetter.IS_USER_LOGGED
    }),
    validated: function () {
      return this.firstName.length > 0 &&
        this.lastName.length > 0 &&
        this.password.length > 0 &&
        (this.email.length > 0 && this.email.indexOf('@') > 1)
    }
  },
  created () {
    showMessage = ConstructMessageToast(this.$toasted)
    showError = ConstructErrorToast(this.$toasted)
  },
  data: function () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .signup
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
