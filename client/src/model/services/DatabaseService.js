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
  put (key) { return _db.get(key) }
  get (key) { return _db.get(key) }
  getUser (user) { return _db.getUser(user) }
  updateUser (email, data) { return _db.updateUser(email, data) }
  signUp (email, password, ...rest) { return _db.signUp(email, password, rest) }
  logIn (email, password) { return _db.logIn(email, password) }
  logOut () { return _db.logOut() }
  // DEPLOYMENT CONFIGURATION
  production () { _db.production() }
  debug () { _db.debug() }
  // AUTHORIZATION
  configureForUser (username, password) {
    console.log('===========================================================================')
    console.log('> DatabaseService -> configureForUser: username = ' + username)
    console.log('> DatabaseService -> configureForUser: password = ' + password)
    return _db.configureForUser(username, password)
  }
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
