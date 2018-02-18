import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
PouchDB.plugin(PouchAuth)

/* eslint no-new-symbol: 2 */
/* eslint-env es6 */
let _applicationDB = null
let _userDB = null

const DB_URL = 'http://localhost:5984/'

function _convertToHex (str) {
  var hex = ''
  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16)
  }
  return hex
}

class Database {
  init (path) {
    console.log('> Database -> Init: ' + path)
    _applicationDB = new PouchDB(`${DB_URL}${path}`, {skip_setup: true})
    new PouchDB(`local_${path}`)
      .sync(_applicationDB, {live: true, retry: true})
      .on('error', console.log.bind(console))
    return this
  }

  getApplicationInstance () { return _applicationDB }
  getUserInstance () { return _userDB }
  production () { PouchDB.debug.disable() }
  debug () { PouchDB.debug.enable('*') }
  configureForUser (username, password) {
    console.log('> Database -> configureForUser: username = ' + username)
    console.log('> Database -> configureForUser: password = ' + password)
    _userDB = new PouchDB(`${DB_URL}/userdb-${_convertToHex(username)}`, {
      auth: {
        username: username,
        password: password
      },
      skip_setup: true
    })
  }
  isAuthorized () {
    return _applicationDB.getSession()
      .then((response) => {
        console.log('> Database -> getSession:', response)
        return response ? response.userCtx.name : null // response.userCtx.name is the current user
      })
  }
}

const DB = new Database()
export default DB
