import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

let _db

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
    _db = firebase.firestore()
  }
  // API
  get (key) {
    return _db.collection('application').doc(key).get().then(function (doc) {
      if (doc.exists) {
        return doc.data()
      } else {
        // doc.data() will be undefined in this case
        return null
      }
    })
  }
  putUser (email, data) {
    let user = firebase.auth().currentUser
    return firebase.database().ref('users/' + user.uid).set(data)
  }
  getUser (user) {
    return new Promise(function (resolve, reject) {
      resolve(firebase.auth().currentUser)
    })
  }
  logIn (email, password) {
    let response = {ok: true}
    if (!this.isAuthorized()) {
      return firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        return response
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
  // INSTANCES
  getUserInstance () { }
  // DEPLOYMENT CONFIGURATION
  production () { }
  debug () { }
  isAuthorized () {
    return new Promise(function (resolve, reject) {
      resolve(firebase.UserInfo)
    })
  }
  addUserEventListener (eventName, interestId, callback) {
    let currentUser = firebase.auth().currentUser
    console.log('> FirebaseDatabase -> addUserEventListener: currentUser', currentUser)
    if (currentUser != null) {
      // _db.ref('/users/' + currentUser.uid).on('value', function (snapshot) {
      // })
    } else {
      console.error('> FirebaseDatabase -> addUserEventListener: User does not exist')
    }
  }
  removeUserEventListener (eventName, interestId, listenerID) {
  }
}

const DB = new FirebaseDatabase()
export default DB
