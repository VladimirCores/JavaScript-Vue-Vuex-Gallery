import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
import DatabaseEvents from '@/consts/database/DatabaseEvents'

PouchDB.plugin(PouchAuth)

const DB_NAME_APP = 'application'
const DB_NAME_USER = 'userdb'
const DB_URL = 'http://localhost:5984/'
// const DB_URL = 'http://35.196.32.66/couchdb/'
// const DB_URL = 'https://8812fb94-a144-44eb-a34e-3f0c15952786-bluemix.cloudant.com/'
// const DB_URL = 'https://8080-dot-3754753-dot-devshell.appspot.com/db/'

/* eslint no-new-symbol: 2 */
/* eslint-env es6 */
let _applicationDB = null
let _applicationLocalDB = null
let _userDB = null
let _callbacks = {
  [DatabaseEvents.CHANGE]: new Map([[DB_NAME_USER, new Map()], [DB_NAME_APP]], new Map()),
  [DatabaseEvents.COMPLETE]: new Map()
}

function OnDatabaseEvent (dbName, event, response) {
  if (response && response.ok) {
    let docs = response.docs
    let interestsMap = _callbacks[DatabaseEvents.CHANGE].get(dbName)
    docs.forEach(doc => {
      let interestID = doc._id
      if (interestsMap.has(interestID)) {
        let callbacks = interestsMap.get(interestID)
        callbacks.forEach(callback => callback(doc))
      }
    })
  }
}

function _convertToHex (str) {
  let hex = ''
  let len = str.length
  for (let i = 0; i < len; i++) {
    hex += '' + str.charCodeAt(i).toString(16)
  }
  return hex
}

PouchDB.on('created', function (dbName) {
  console.log('> DatabaseService -> DB_CREATED: dbName = ' + dbName)
  if (_userDB && _userDB.name === dbName) {
  }
})

class CouchDatabase {
  init () {
    console.log('> DatabaseService -> Init: ' + DB_NAME_APP)
    _applicationDB = new PouchDB(`${DB_URL}${DB_NAME_APP}`, {
      skip_setup: true
    })
    _applicationLocalDB = new PouchDB(DB_NAME_APP)
    _applicationLocalDB.sync(_applicationDB, {live: true, retry: true})
    _applicationLocalDB.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
      .on(DatabaseEvents.CHANGE, (event) => {
        // handle change
        console.log('> DatabaseService -> applicationDB - change:', event)
        OnDatabaseEvent(DB_NAME_APP, DatabaseEvents.CHANGE, event.change)
      })
      .on('paused', (err) => {
        // replication paused (e.g. replication up to date, user went offline)
        console.log('> DatabaseService -> applicationDB - paused:', err)
      })
      .on('active', () => {
        // replicate resumed (e.g. new changes replicating, user went back online)
        console.log('> DatabaseService -> applicationDB - active')
      })
      .on('denied', (err) => {
        // a document failed to replicate (e.g. due to permissions)
        console.log('> DatabaseService -> applicationDB - denied:', err)
      })
      .on('complete', function (info) {
        // handle complete
        console.log('> DatabaseService -> applicationDB - complete:', info)
      })
      .on('error', (err) => {
        // handle error
        console.log('> DatabaseService -> applicationDB - error:', err)
      })
    return this
  }
  // API
  get (key) { return _applicationDB.get(key) }
  getUser (user) { return _applicationDB.getUser(user) }
  // INSTANCES
  getApplicationInstance () { return _applicationDB }
  getUserInstance () { return _userDB }
  // DEPLOYMENT CONFIGURATION
  production () { PouchDB.debug.disable() }
  debug () { PouchDB.debug.enable('*') }
  // AUTHORIZATION
  configureForUser (username, password) {
    console.log('===========================================================================')
    console.log('> DatabaseService -> configureForUser: username = ' + username)
    console.log('> DatabaseService -> configureForUser: password = ' + password)
    let promise = new Promise((resolve) => {
      _userDB = new PouchDB(DB_NAME_USER)
      _userDB.sync(new PouchDB(`${DB_URL}/${DB_NAME_USER}-${_convertToHex(username).toLowerCase()}`, {
        auth: {
          username: username,
          password: password
        },
        skip_setup: true
      }), {
        live: true,
        retry: true
      })
        .on(DatabaseEvents.CHANGE, (event) => {
          // handle change
          console.log('> DatabaseService -> userDB - change:', event)
          OnDatabaseEvent(DB_NAME_USER, DatabaseEvents.CHANGE, event.change)
          // let change = event.change
          // if (change.ok) {
          //   let docs = change.docs
          //   let interestsMap = _callbacks[EVENT_DB_CHANGE].get(DB_NAME_USER)
          //   docs.forEach(doc => {
          //     let interestID = doc._id
          //     if (interestsMap.has(interestID)) {
          //       let callbacks = interestsMap.get(interestID)
          //       callbacks.forEach(callback => callback(doc))
          //     }
          //   })
          // }
        })
        .on('paused', (err) => {
          // replication paused (e.g. replication up to date, user went offline)
          console.log('> DatabaseService -> userDB - paused:', err)
        })
        .on('active', () => {
          // replicate resumed (e.g. new changes replicating, user went back online)
          console.log('> DatabaseService -> userDB - active')
        })
        .on('denied', (err) => {
          // a document failed to replicate (e.g. due to permissions)
          console.log('> DatabaseService -> userDB - denied:', err)
        })
        .on('complete', function (info) {
          // handle complete
          console.log('> DatabaseService -> userDB - complete:', info)
        })
        .on('error', (err) => {
          // handle error
          console.log('> DatabaseService -> userDB - complete:', err)
        })
      _userDB.info().then(resolve)
    })
    console.log('> DatabaseService -> USER_DB: _userDB.name = ' + _userDB.name)
    console.log('===========================================================================')
    return promise
  }
  isAuthorized () {
    return _applicationDB.getSession()
      .then((response) => {
        console.log('> DatabaseService -> getSession:', response)
        return response ? response.userCtx.name : null // response.userCtx.name is the current user
      })
  }
  addUserEventListener (eventName, interestId, callback) {
    let event = _callbacks[eventName]
    if (event) {
      let userInterestsMap = event.get(DB_NAME_USER)
      if (!userInterestsMap.has(interestId)) userInterestsMap.set(interestId, new Map())
      let callbacksMap = userInterestsMap.get(interestId)
      let listenerID = Date.now()
      callbacksMap.set(listenerID, callback)
      console.log('> DatabaseService -> addUserEventListener: eventName | interestId =', eventName, interestId, callbacksMap.keys())
      return listenerID
    }
  }
  removeUserEventListener (eventName, interestId, listenerID) {
    let event = _callbacks[eventName]
    if (event) {
      let userInterestsMap = event.get(DB_NAME_USER)
      if (userInterestsMap.has(interestId)) {
        let callbacksMap = userInterestsMap.get(interestId)
        if (!callbacksMap) return
        callbacksMap.delete(listenerID)
        console.log('> DatabaseService -> removeUserEventListener: eventName | interestId =', eventName, interestId, callbacksMap.keys())
      }
    }
  }
}

const DB = new CouchDatabase()
export default DB
