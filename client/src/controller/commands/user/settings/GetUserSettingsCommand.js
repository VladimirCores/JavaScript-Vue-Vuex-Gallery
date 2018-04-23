import DatabaseService from '@/model/services/DatabaseService'

/**
  return
    SUCCESS:
    - Object { email, firstName, lastName, _id }
    FAILURE:
    - Int UserError.SIGN_UP_RESPONSE
    - Int UserError.SIGN_UP_FAILED
*/
const KEY_SETTINGS = 'settings'

class GetSettingsUserCommand {
  execute (userSettingVO) {
    console.log('> GetSettingsUserCommand -> userSettingVO =', userSettingVO)
    return DatabaseService.getUserData(KEY_SETTINGS)
      .then((doc) => {
        console.log('> GetSettingsUserCommand -> doc =', doc)
        return doc
      })
      .catch((error) => {
        console.log('> GetSettingsUserCommand > error:', error.status)
        if (error.status === 404) {
          return DatabaseService.setUserData(KEY_SETTINGS, userSettingVO)
        }
      })
  }
}

const SINGLETON = new GetSettingsUserCommand()

export default SINGLETON
