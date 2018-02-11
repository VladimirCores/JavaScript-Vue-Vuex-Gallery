import Database from '@/model/Database'

import LoginUserCommand from '@/controller/commands/user/LoginUserCommand'
import UserError from '@/consts/errors/UserError'

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
        console.log('> \t SignUpUserCommand > signUp: response =', response)
        if (response.ok) {
          return LoginUserCommand
            .execute(email, password)
            .then((result) => {
              return Object.assign(metadata, { uid: response.id })
            })
        } else return UserError.SIGN_UP_RESPONSE
      })
      .catch((error) => {
        console.log('> \t SignUpUserCommand > signUp: error =', error)
        return UserError.SIGN_UP_FAILED
      })
  }
}

const SINGLETON = new SignUpUserCommand()

export default SINGLETON
