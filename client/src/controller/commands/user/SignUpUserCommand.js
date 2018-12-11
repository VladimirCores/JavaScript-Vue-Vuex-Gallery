import DatabaseService from '@/model/services/DatabaseService'
import UserError from '@/consts/errors/UserError'

/**
  return
    SUCCESS:
    - Boolean { name: name, password: password }
    FAILURE:
    - Int UserError.SIGN_UP_RESPONSE
    - Int UserError.SIGN_UP_FAILED
*/
class SignUpUserCommand {
  execute (name, password, firstName, lastName) {
    let db = DatabaseService.getApplicationInstance()
    let metadata = {
      email: name,
      firstName: firstName,
      lastName: lastName,
      logged: false
    }
    return db
      .signUp(name, password, { metadata })
      .then((response) => {
        // {ok: true, id: "org.couchdb.user:myname@gmail.com", rev: "5-2604e0329e2a2f5bd7c10677d0448d25"}
        console.log('> SignUpUserCommand > signUp: response =', response)
        if (response.ok) {
          return { name: name, password: password }
        } else return UserError.SIGN_UP_RESPONSE
      })
      .catch((error) => {
        console.log('> SignUpUserCommand > signUp: error =', error)
        if (error.error === 'conflict') {
          return UserError.SIGN_UP_USER_ALREADY_EXIST
        }
        return UserError.SIGN_UP_FAILED
      })
  }
}

const SINGLETON = new SignUpUserCommand()

export default SINGLETON
