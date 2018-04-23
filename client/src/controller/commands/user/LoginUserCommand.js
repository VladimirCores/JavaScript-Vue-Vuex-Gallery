import DatabaseService from '@/model/services/DatabaseService'
import UserError from '@/consts/errors/UserError'

class LoginUserCommand {
  execute (email, password) {
    console.log('===========================================================================')
    console.log('> LoginUserCommand > name | password:', email + ' | ' + password)
    return DatabaseService
      .logIn(email, password)
      .then((response) => {
        // {"ok":true,"name":"david","roles":[]}
        console.log('> LoginUserCommand > logIn: response =', response)
        if (response.ok) {
          return DatabaseService.getUser(email).then((response) => {
            console.log('> LoginUserCommand > getUser: response =', response)
            response.logged = true
            return DatabaseService.updateUser(email, { metadata: { logged: true } })
              .then((status) => {
                console.log('> LoginUserCommand > updateUser: status =', status)
                return response
              })
              .catch((error) => {
                console.log('> LoginUserCommand > updateUser error =', error)
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
