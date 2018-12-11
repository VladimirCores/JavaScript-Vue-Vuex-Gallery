import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
import PouchDebug from 'pouchdb-debug'

PouchDB.plugin(PouchAuth)
PouchDB.plugin(PouchDebug)

const DB_NAME_APP = 'application'
const DB_NAME_USER = 'userdb'
const DB_URL = 'http://localhost:5984/'

const EVENT_DB_CHANGE = 'change'
const EVENT_DB_COMPLETE = 'complete'

/* eslint no-new-symbol: 2 */
/* eslint-env es6 */
let _applicationDB = null
let _applicationLocalDB = null
let _userDB = null
let _callbacks = {
  [EVENT_DB_CHANGE]: new Map([[DB_NAME_USER, new Map()], [DB_NAME_APP]], new Map()),
  [EVENT_DB_COMPLETE]: new Map()
}

function OnDatabaseEvent (dbName, event, response) {
  if (response && response.ok) {
    let docs = response.docs
    let interestsMap = _callbacks[EVENT_DB_CHANGE].get(dbName)
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

class DatabaseService {
  init () {
    console.log('> DatabaseService -> Init: DB name = ' + DB_NAME_APP)
    _applicationDB = new PouchDB(`${DB_URL}${DB_NAME_APP}`, {skip_setup: true})
    console.log('> DatabaseService -> Init: _applicationDB.adapter = ' + _applicationDB.adapter)
    _applicationLocalDB = new PouchDB(DB_NAME_APP)
    console.log('> DatabaseService -> Init: _applicationLocalDB.adapter = ' + _applicationLocalDB.adapter)
    _applicationLocalDB.sync(_applicationDB, {live: true, retry: true})
    _applicationLocalDB.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
      .on(EVENT_DB_CHANGE, (event) => {
        // handle change
        console.log('> DatabaseService -> applicationDB - change:', event)
        OnDatabaseEvent(DB_NAME_APP, EVENT_DB_CHANGE, event.change)
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
        // auth: {
        //   username: username,
        //   password: password
        // },
        skip_setup: true
      }), {
        live: true,
        retry: true
      })
        .on(EVENT_DB_CHANGE, (event) => {
          // handle change
          console.log('> DatabaseService -> userDB - change:', event)
          OnDatabaseEvent(DB_NAME_USER, EVENT_DB_CHANGE, event.change)
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
    console.log('===============================================================')
    return promise
  }
  isAuthorized () {
    return _applicationDB.getSession()
      .then((response) => {
        console.log('> DatabaseService -> isAuthorized -> getSession:', response)
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

const DB = new DatabaseService()
export default DB

export const Event = {
  CHANGE: EVENT_DB_CHANGE
}
