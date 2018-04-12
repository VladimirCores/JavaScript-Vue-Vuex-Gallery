import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

let _db

class FirebaseDatabase {
  init () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBgED1g3sSTAv93SU_YcAqtGdB1emY2YBc',
      authDomain: 'vimeo-likes-gallery-firebase.firebaseapp.com',
      projectId: 'vimeo-likes-gallery-firebase'
    })
    _db = firebase.firestore()
  }
  // API
  get (key) {
    return this.getApplicationInstance().doc(key).get().then(function (doc) {
      if (doc.exists) {
        return doc.data()
      } else {
        // doc.data() will be undefined in this case
        return null
      }
    })
  }
  getUser (user) {
    return new Promise(function (resolve, reject) {
      resolve(firebase.User)
    })
  }
  // INSTANCES
  getApplicationInstance () { return _db.collection('application') }
  getUserInstance () { return _db }
  // DEPLOYMENT CONFIGURATION
  production () { }
  debug () { }
  isAuthorized () {
    return new Promise(function (resolve, reject) {
      resolve(firebase.User)
    })
  }
}

const DB = new FirebaseDatabase()
export default DB
