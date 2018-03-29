import DatabaseService from '@/model/services/DatabaseService'

/**
  return
    SUCCESS:
    - Object { email, firstName, lastName, _id }
    FAILURE:
    - Int UserError.SIGN_UP_RESPONSE
    - Int UserError.SIGN_UP_FAILED
*/
class GetSettingsUserCommand {
  execute (userSettingVO) {
    let userDB = DatabaseService.getUserInstance()
    console.log('> GetSettingsUserCommand -> userSettingVO =', userSettingVO)
    return userDB.get('settings')
      .then((doc) => {
        console.log('> GetSettingsUserCommand -> doc =', doc)
        return doc
      })
      .catch((error) => {
        console.log('> GetSettingsUserCommand > error:', error)
        if (error.status === 404) {
          return userDB.put(userSettingVO)
        }
      })
  }
}

const SINGLETON = new GetSettingsUserCommand()

export default SINGLETON
