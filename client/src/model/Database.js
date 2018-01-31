import PouchDB from 'pouchdb'

/* eslint no-new-symbol: 2 */
/* eslint-env es6 */
const _instance = {}
console.log(typeof _instance)

class Database {
  constructor () {
    this[_instance] = null
  }
  init (path) {
    console.log('> Database -> Init: ' + path)
    this[_instance] = new PouchDB(path)
    return this
  }
  getInstance () { return this[_instance] }
  production () {
    PouchDB.debug.disable()
  }
  debug () {
    PouchDB.debug.enable('*')
  }
}

const DB = new Database()
export default DB
