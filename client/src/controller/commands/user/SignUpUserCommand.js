import Database from '@/model/Database'

import LoginUserCommand from '@/controller/commands/user/LoginUserCommand'
import UserError from '@/consts/errors/UserError'

/**
  return
    SUSSES:
    - Object { email, firstName, lastName, _id }
    FAILURE:
    - Int UserError.SIGN_UP_RESPONSE
    - Int UserError.SIGN_UP_FAILED
*/
class SignUpUserCommand {
  execute (email, password, firstName, lastName) {
    let db = Database.getInstance()
    let metadata = {
      email: email,
      firstName: firstName,
      lastName: lastName
    }
    return db
      .signUp(email, password, { metadata })
      .then((response) => {
        // {ok: true, id: "org.couchdb.user:myname@gmail.com", rev: "5-2604e0329e2a2f5bd7c10677d0448d25"}
        console.log('> SignUpUserCommand > signUp: response =', response)
        if (response.ok) {
          return LoginUserCommand
            .execute(email, password)
            .then((result) => {
              return Object.assign(metadata, { _id: response.id })
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
