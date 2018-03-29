import Database from '@/model/services/DatabaseService'

import UserError from '@/consts/errors/UserError'

/**
  return
    SUCCESS:
    - Boolean true
    FAILURE:
    - Int UserError.LOG_OUT_FAILED
*/
class LogoutUserCommand {
  execute (userVO) {
    let appDB = Database.getApplicationInstance()
    return appDB.putUser(userVO.name, { metadata: { logged: false } }).then((status) => {
      console.log('> LogoutUserCommand > putUser metadata: status =', status)
      return appDB.logOut().then((response) => { // response {"ok":true}
        console.log('> LogoutUserCommand > logOut: response =', response)
        return response.ok || UserError.LOG_OUT_UNEXPECTED
      }).catch(() => UserError.LOG_OUT_FAILED) // network error
    })
  }
}

const SINGLETON = new LogoutUserCommand()

export default SINGLETON
