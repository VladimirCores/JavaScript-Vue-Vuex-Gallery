import DatabaseService from '@/model/services/DatabaseService'

// import UserError from '@/consts/errors/UserError'

/**
  return
    SUCCESS:
    - Object - userDoc from DB { email, firstName, lastName, _id }
    FAILURE:
    - Int UserError.SIGN_UP_RESPONSE
    - Int UserError.SIGN_UP_FAILED
*/
class ConfigUserCommand {
  execute (userDoc) {
    console.log('> ConfigUserCommand > userDoc:', userDoc)
    return DatabaseService.configureForUser(userDoc.name, userDoc.password_scheme)
  }
}

const SINGLETON = new ConfigUserCommand()

export default SINGLETON
