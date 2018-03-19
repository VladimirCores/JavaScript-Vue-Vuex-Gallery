import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
PouchDB.plugin(PouchAuth)

const DB_URL = 'http://localhost:5984/'
const DB_USER = 'userdb'

const EVENT_DB_CHANGE = 'change'
const EVENT_DB_COMPLETE = 'complete'

/* eslint no-new-symbol: 2 */
/* eslint-env es6 */
let _applicationDB = null
let _applicationLocalDB = null
let _userDB = null
let _callbacks = {
  [EVENT_DB_CHANGE]: new Map([[DB_USER, new Map()]]),
  [EVENT_DB_COMPLETE]: new Map()
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
  console.log('> Database -> DB_CREATED: dbName = ' + dbName)
  if (_userDB && _userDB.name === dbName) {
  }
})

class Database {
  init (path) {
    console.log('> Database -> Init: ' + path)
    _applicationDB = new PouchDB(`${DB_URL}${path}`, {skip_setup: true})
    _applicationLocalDB = new PouchDB(path)
    _applicationLocalDB.sync(_applicationDB, {live: true, retry: true})
    _applicationLocalDB
      .on(EVENT_DB_CHANGE, (event) => {
        // handle change
        console.log('> Database -> applicationDB - change:', event)
      })
      .on('paused', (err) => {
        // replication paused (e.g. replication up to date, user went offline)
        console.log('> Database -> applicationDB - paused:', err)
      })
      .on('active', () => {
        // replicate resumed (e.g. new changes replicating, user went back online)
        console.log('> Database -> applicationDB - active')
      })
      .on('denied', (err) => {
        // a document failed to replicate (e.g. due to permissions)
        console.log('> Database -> applicationDB - denied:', err)
      })
      .on('complete', function (info) {
        // handle complete
        console.log('> Database -> applicationDB - complete:', info)
      })
      .on('error', (err) => {
        // handle error
        console.log('> Database -> applicationDB - error:', err)
      })
    return this
  }

  getApplicationInstance () { return _applicationDB }
  getUserInstance () { return _userDB }
  production () { PouchDB.debug.disable() }
  debug () { PouchDB.debug.enable('*') }
  configureForUser (username, password) {
    console.log('===========================================================================')
    console.log('> Database -> configureForUser: username = ' + username)
    console.log('> Database -> configureForUser: password = ' + password)
    let promise = new Promise((resolve) => {
      _userDB = new PouchDB(DB_USER)
      _userDB.sync(new PouchDB(`${DB_URL}/${DB_USER}-${_convertToHex(username).toLowerCase()}`, {
        auth: {
          username: username,
          password: password
        },
        skip_setup: true
      }), {
        live: true,
        retry: true
      })
        .on(EVENT_DB_CHANGE, (event) => {
          // handle change
          console.log('> Database -> userDB - change:', event)
          let change = event.change
          if (change.ok) {
            let docs = change.docs
            let interestsMap = _callbacks[EVENT_DB_CHANGE].get(DB_USER)
            docs.forEach(doc => {
              let interestID = doc._id
              if (interestsMap.has(interestID)) {
                let callbacks = interestsMap.get(interestID)
                callbacks.forEach(callback => callback(doc))
              }
            })
          }
        })
        .on('paused', (err) => {
          // replication paused (e.g. replication up to date, user went offline)
          console.log('> Database -> userDB - paused:', err)
        })
        .on('active', () => {
          // replicate resumed (e.g. new changes replicating, user went back online)
          console.log('> Database -> userDB - active')
        })
        .on('denied', (err) => {
          // a document failed to replicate (e.g. due to permissions)
          console.log('> Database -> userDB - denied:', err)
        })
        .on('complete', function (info) {
          // handle complete
          console.log('> Database -> userDB - complete:', info)
        })
        .on('error', (err) => {
          // handle error
          console.log('> Database -> userDB - complete:', err)
        })
      _userDB.info().then(resolve)
    })
    console.log('> Database -> USER_DB: _userDB.name = ' + _userDB.name)
    console.log('===========================================================================')
    return promise
  }
  isAuthorized () {
    return _applicationDB.getSession()
      .then((response) => {
        console.log('> Database -> getSession:', response)
        return response ? response.userCtx.name : null // response.userCtx.name is the current user
      })
  }
  addUserEventListener (eventName, interestId, callback) {
    let event = _callbacks[eventName]
    if (event) {
      let userInterestsMap = event.get(DB_USER)
      if (!userInterestsMap.has(interestId)) userInterestsMap.set(interestId, [])
      let callbacks = userInterestsMap.get(interestId)
      callbacks.push(callback)
    }
  }
}

const DB = new Database()
export default DB

export const Event = {
  CHANGE: EVENT_DB_CHANGE
}
