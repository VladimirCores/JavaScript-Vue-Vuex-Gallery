import DatabaseService from '@/model/services/DatabaseService'
import UserError from '@/consts/errors/UserError'

class LoginUserCommand {
  execute (name, password) {
    console.log('===========================================================================')
    console.log('> LoginUserCommand > name | password:', name + ' | ' + password)
    let db = DatabaseService.getApplicationInstance()
    return db
      .logIn(name, password)
      .then((response) => {
        // {"ok":true,"name":"david","roles":[]}
        console.log('> LoginUserCommand > logIn: response =', response)
        if (response.ok) {
          return db.getUser(name).then((response) => {
            console.log('> LoginUserCommand > getUser: response =', response)
            response.logged = true
            return db.putUser(name, { metadata: { logged: true } })
              .then((status) => {
                console.log('> LoginUserCommand > putUser: status =', status)
                return response
              })
              .catch((error) => {
                console.log('> LoginUserCommand > putUser error =', error)
                return response
              })
          })
        } else return UserError.LOG_IN_FAILED
      })
      .catch((error) => {
        console.log('> LoginUserCommand > logIn: error =', error)
        if (error.name === 'unauthorized' || error.name === 'forbidden') {
          return UserError.LOG_IN_BAD_CREDITS // name or password incorrect
        } else {
          return UserError.LOG_IN_UNEXPECTED // cosmic rays, a meteor, etc.
        }
      })
  }
}

const SINGLETON = new LoginUserCommand()

export default SINGLETON
