import Database from '@/model/Database'

class LoginUserCommand {
  execute (email, password) {
    let db = Database.getInstance()
    return db
      .logIn(email, password)
      .then((response) => {
        // {"ok":true,"name":"david","roles":[]}
        console.log('> LoginUserCommand > logIn: response =', response)
        return response.ok
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
