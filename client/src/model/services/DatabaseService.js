let _db

export const AvailableDatabases = {
  COUCH_DB: 'CouchDatabase',
  FIREBASE_DB: 'FirebaseDatabase'
}

class DatabaseService {
  init (type) {
    return import(`@/model/services/database/${type}`).then(module => {
      _db = module.default
      _db.init()
      return _db
    })
  }
  // API
  get (key) { return _db.get(key) }
  getUser (user) { return _db.getUser(user) }
  getUserData (key) { return _db.getUserData(key) }
  setUserData (key, data) { return _db.setUserData(key, data) }
  updateUser (email, data) { return _db.updateUser(email, data) }
  signUp (email, password, ...rest) { return _db.signUp(email, password, rest) }
  logIn (email, password) { return _db.logIn(email, password) }
  logOut () { return _db.logOut() }
  // DEPLOYMENT CONFIGURATION
  production () { _db.production() }
  debug () { _db.debug() }
  // AUTHORIZATION
  configureForUser (userDoc) {
    console.log('===========================================================================')
    return _db.configureForUser(userDoc)
  }
  getApplicationInstance () { return _db.getApplicationInstance() }
  getUserInstance () { return _db.getUserInstance() }
  isAuthorized () {
    return _db.isAuthorized()
  }
  // LISTENERS
  addUserEventListener (eventName, interestId, callback) {
    _db.addUserEventListener(eventName, interestId, callback)
  }
  removeUserEventListener (eventName, interestId, listenerID) {
    _db.removeUserEventListener(eventName, interestId, listenerID)
  }
}

const DB = new DatabaseService()
export default DB
