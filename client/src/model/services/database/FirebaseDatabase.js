import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import UserVO from '@/model/vos/UserVO'

let _applicationDB
let _userDB
let _userDBWrapper = { }

const ERROR_CODES = {
  AUTH_WEAK_PASSWORD: 'auth/weak-password',
  AUTH_INVALID_EMAIL: 'auth/invalid-email'
}

class FirebaseDatabase {
  init () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBgED1g3sSTAv93SU_YcAqtGdB1emY2YBc',
      authDomain: 'vimeo-likes-gallery-firebase.firebaseapp.com',
      databaseURL: 'https://vimeo-likes-gallery-firebase.firebaseio.com',
      projectId: 'vimeo-likes-gallery-firebase'
    })
    _applicationDB = firebase.firestore()
  }
  // API
  get (key) {
    return _applicationDB.collection('application').doc(key).get().then(function (doc) {
      if (doc.exists) {
        return doc.data()
      } else {
        // doc.data() will be undefined in this case
        return null
      }
    })
  }
  setUserData (key, data) {
    return new Promise((resolve) => {
      console.log('> FirebaseDatabase -> setUserData:', key, data)
      _userDB.child(key).set(data).then(resolve)
    })
  }
  getUserData (key) {
    return new Promise((resolve, reject) => {
      let user = firebase.auth().currentUser
      let ref = _userDB.child(key)
      console.log('> FirebaseDatabase -> getUserData user.uid:', user.uid)
      console.log('> FirebaseDatabase -> getUserData key:', key)
      ref.once('value').then((value) => {
        console.log('> FirebaseDatabase -> getUserData value: ', value.val())
        if (value.val() != null) resolve(value.val())
        else {
          let error = new Error()
          error.status = 404
          reject(error)
        }
      })
    })
  }
  updateUser (email, data) {
    let user = firebase.auth().currentUser
    return firebase.database().ref('users/' + user.uid).set(data)
  }
  getUser (email) {
    return new Promise((resolve) => {
      console.log('> FirebaseDatabase -> firebase.UserInfo : ' + firebase.UserInfo)
      let user = firebase.auth().currentUser
      let userVO = new UserVO()
      if (user != null) {
        let profile = user.providerData[0]
        // user.providerData.forEach(function (profile) {
        // console.log('Sign-in provider: ' + profile.providerId)
        // console.log('  Provider-specific UID: ' + profile.uid)
        // console.log('  Name: ' + profile.displayName)
        // console.log('  Email: ' + profile.email)
        // console.log('  Photo URL: ' + profile.photoURL)
        userVO._id = profile.uid
        userVO.email = profile.email
        userVO.name = profile.displayName
        // })
      }
      resolve(userVO)
    })
  }
  logIn (email, password) {
    let response = {ok: true}
    if (!this.isAuthorized()) {
      return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
          return response
        })
      })
    } else {
      return new Promise(function (resolve, reject) {
        resolve(response)
      })
    }
  }
  signUp (email, password, ...rest) {
    console.log('> FirebaseDatabase -> createUserWithEmailAndPassword: ', email, password)
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user)
        return {ok: true, id: user.id}
      })
      .catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code
        let errorMessage = error.message
        if (errorCode === ERROR_CODES.AUTH_WEAK_PASSWORD) {
        } else {
          console.log(error)
        }
        return {ok: false, id: errorMessage}
      })
  }
  configureForUser (userDoc) {
    return new Promise((resolve, reject) => {
      let user = firebase.auth().currentUser
      let that = this
      _userDB = firebase.database().ref('users/' + user.uid)
      _userDBWrapper.put = function (data) {
        return new Promise((resolve, reject) => {
          console.log('> FirebaseDatabase -> _userDBWrapper > put: ', data)
          return that.setUserData(data._id, data).then(() => {
            data.ok = true
            resolve(data)
          })
        })
      }
      _userDBWrapper.get = function (key) {
        let value = firebase.database().ref('users/' + user.uid).child(key)
        console.log('> FirebaseDatabase -> _userDBWrapper > value: ', value)
        return that.getUserData(key)
      }
      resolve()
    })
  }
  // INSTANCES
  getUserInstance () { return _userDBWrapper }
  // DEPLOYMENT CONFIGURATION
  production () { }
  debug () { }
  isAuthorized () {
    return new Promise(function (resolve, reject) {
      firebase.auth().onAuthStateChanged((user) => {
        console.log('> FirebaseDatabase -> isAuthorized : ' + user)
        resolve(user ? user.uid : null)
      })
    })
  }
  addUserEventListener (eventName, interestId, callback) {
    let currentUser = firebase.auth().currentUser
    console.log('> FirebaseDatabase -> addUserEventListener: currentUser', currentUser)
    if (currentUser != null) {
      firebase.database().ref('/users/' + currentUser.uid).child(interestId).on('value', function (snapshot) {
        console.log('> FirebaseDatabase -> update: snapshot', snapshot.val())
        callback(snapshot.val())
      })
    } else {
      console.error('> FirebaseDatabase -> addUserEventListener: User does not exist')
    }
  }
  removeUserEventListener (eventName, interestId, listenerID) {
  }
}

const DB = new FirebaseDatabase()
export default DB
