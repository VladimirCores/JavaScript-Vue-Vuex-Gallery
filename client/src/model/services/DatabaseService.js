let _db
let _isDBReady = false

export const AvailableDatabases = {
  COUCH_DB: 'CouchDatabase',
  FIREBASE_DB: 'FirebaseDatabase'
}

class DatabaseService {
  init (type) {
    return import(`@/model/services/database/${type}`).then(module => {
      _db = module.default
      _db.init()
      _isDBReady = true
      return _db
    })
  }
  // API
  get (key) { return _db.get(key) }
  getUser (user) { return _db.getUser(user) }
  // INSTANCES
  getApplicationInstance () { return _db.getApplicationInstance() }
  getUserInstance () { return _db.getUserInstance() }
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
    console.log('_isDBReady:', _isDBReady, this.getApplicationInstance())
    return _db.isAuthorized()
  }
  // LISTENERS
  addUserEventListener (eventName, interestId, callback) {
    this.getUserInstance().addUserEventListener(eventName, interestId, callback)
  }
  removeUserEventListener (eventName, interestId, listenerID) {
    this.getUserInstance().removeUserEventListener(eventName, interestId, listenerID)
  }
}

const DB = new DatabaseService()
export default DB
