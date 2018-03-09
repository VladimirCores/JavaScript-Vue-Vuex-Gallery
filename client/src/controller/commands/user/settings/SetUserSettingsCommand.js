import Database from '@/model/Database'
import UserSettingsError from '@/consts/errors/UserSettingsError'
/**
  return
    SUCCESS:
    - Object { email, firstName, lastName, _id }
    FAILURE:
    - Int UserSettingsError.UPDATE_FAILED
    - Int UserSettingsError.UPDATE_UNEXPECTED
*/
class SetSettingsUserCommand {
  execute (input) {
    let userDB = Database.getUserInstance()
    console.log('> SetSettingsUserCommand -> input =', input)
    return userDB.put(input)
      .then((doc) => {
        console.log('> SetSettingsUserCommand -> doc =', doc)
        if (doc.ok) {
          return Object.assign(input, { _rev: doc.rev })
        } else {
          return UserSettingsError.UPDATE_FAILED
        }
      })
      .catch((error) => {
        console.log('> SetSettingsUserCommand > error:', error)
        return UserSettingsError.UPDATE_UNEXPECTED
      })
  }
}

const SINGLETON = new SetSettingsUserCommand()

export default SINGLETON
