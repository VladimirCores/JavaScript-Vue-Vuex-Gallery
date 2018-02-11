<template lang="html">
  <div class="signup">
    <form>
      <div>First Name:</div>
      <input type="text" v-model="firstName"><br>
      <div>Last Name:</div>
      <input type="text" v-model="lastName"><br>
      <div>Email:</div>
      <input type="text" v-model="email"><br>
      <div>Password:</div>
      <input type="text" v-model="password"><br>
      <div>Confirm Password:</div>
      <input type="text" v-model="confirm"><br>
      <button type="button" @click="onRegister" :disabled="!validated">Register</button>
    </form>
  </div>
</template>

<script>

import UserAction from '@/consts/actions/UserAction'

import { createNamespacedHelpers } from 'vuex'
import { USER_STORE_NAME } from '@/consts/StoreNames'

const { mapActions } = createNamespacedHelpers(USER_STORE_NAME)

export default {
  name: 'Signup',
  methods: {
    ...mapActions({
      signupUser: UserAction.SIGN_UP
    }),
    onRegister () {
      this.signupUser({...this.$data})
    }
  },
  computed: {
    validated: function () { return this.firstName.length > 0 }
  },
  data: function () {
    return {
      firstName: 'name',
      lastName: 'surname',
      email: 'myname@gmail.com',
      password: '123',
      confirm: '123'
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
