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
    return userDB.get('settings').then((doc) => {
      if (doc.userID === input.userID &&
          doc.accessToken === input.accessToken
      ) return new Error(UserSettingsError.UPDATE_ALREADY_UPDATED)
      else {
        return userDB.put(Object.assign(doc, input))
          .then((doc) => {
            console.log('> SetSettingsUserCommand -> doc =', doc)
            if (doc.ok) {
              return doc
            } else {
              return UserSettingsError.UPDATE_FAILED
            }
          })
          .catch((error) => {
            console.log('> SetSettingsUserCommand > error:', error)
            return UserSettingsError.UPDATE_UNEXPECTED
          })
      }
    })
  }
}

const SINGLETON = new SetSettingsUserCommand()

export default SINGLETON
