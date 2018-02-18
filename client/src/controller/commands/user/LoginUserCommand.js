import Database from '@/model/Database'

class LoginUserCommand {
  execute (name, password) {
    console.log('> LoginUserCommand > name | password:', name + '|' + password)
    let db = Database.getApplicationInstance()
    return db
      .logIn(name, password)
      .then((response) => {
        // {"ok":true,"name":"david","roles":[]}
        console.log('> LoginUserCommand > logIn: response =', response)
        return db.getUser(name).then((response) => {
          console.log('> LoginUserCommand > getUser: response =', response)
          return response
        })
      })
      .catch((error) => {
        console.log('> LoginUserCommand > logIn: error =', error)
        if (error) {
          if (error.name === 'unauthorized' || error.name === 'forbidden') {
            // name or password incorrect
          } else {
            // cosmic rays, a meteor, etc.
          }
        }
      })
  }
}

const SINGLETON = new LoginUserCommand()

export default SINGLETON
