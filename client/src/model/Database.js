import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
PouchDB.plugin(PouchAuth)

/* eslint no-new-symbol: 2 */
/* eslint-env es6 */
let _remoteDB = null

class Database {
  init (path) {
    console.log('> Database -> Init: ' + path)
    _remoteDB = new PouchDB(`http://localhost:5984/${path}`, {skip_setup: true})
    new PouchDB(`local_${path}`)
      .sync(_remoteDB, {live: true, retry: true})
      // .on('error', console.log.bind(console))
    return this
  }
  getInstance () { return _remoteDB }
  production () { PouchDB.debug.disable() }
  debug () { PouchDB.debug.enable('*') }
}

const DB = new Database()
export default DB
