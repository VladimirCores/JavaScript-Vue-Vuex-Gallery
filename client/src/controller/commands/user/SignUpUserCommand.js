import Database from '@/model/Database'

import LoginUserCommand from '@/controller/commands/user/LoginUserCommand'
import UserError from '@/consts/errors/UserError'

/**
  return
    SUCCESS:
    - Object { email, firstName, lastName, _id }
    FAILURE:
    - Int UserError.SIGN_UP_RESPONSE
    - Int UserError.SIGN_UP_FAILED
*/
class SignUpUserCommand {
  execute (name, password, firstName, lastName) {
    let db = Database.getApplicationInstance()
    let metadata = {
      email: name,
      firstName: firstName,
      lastName: lastName
    }
    return db
      .signUp(name, password, { metadata })
      .then((response) => {
        // {ok: true, id: "org.couchdb.user:myname@gmail.com", rev: "5-2604e0329e2a2f5bd7c10677d0448d25"}
        console.log('> SignUpUserCommand > signUp: response =', response)
        if (response.ok) {
          return LoginUserCommand.execute(name, password).then((result) => {
            return result
          })
        } else return UserError.SIGN_UP_RESPONSE
      })
      .catch((error) => {
        console.log('> SignUpUserCommand > signUp: error =', error)
        return UserError.SIGN_UP_FAILED
      })
  }
}

const SINGLETON = new SignUpUserCommand()

export default SINGLETON
