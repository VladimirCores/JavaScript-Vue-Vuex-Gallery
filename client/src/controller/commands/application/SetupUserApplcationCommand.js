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
class SetupUserApplcationCommand {
  execute (input) {
  }
}

const SINGLETON = new SetupUserApplcationCommand()

export default SINGLETON
