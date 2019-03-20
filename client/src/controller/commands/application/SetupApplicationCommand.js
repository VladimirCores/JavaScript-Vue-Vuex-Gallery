import DatabaseService from '@/model/services/DatabaseService'
import Databases from '@/consts/Databases'

/**
 return
 SUCCESS:
 - Object {
    user: userDoc || null,
    server: serverDoc || null
 }
 FAILURE:
 - Int UserSettingsError.UPDATE_FAILED
 - Int UserSettingsError.UPDATE_UNEXPECTED
 */
class SetupApplicationCommand {
  execute () {
    let database = DatabaseService.getApplicationInstance()
    return Promise.all([
      DatabaseService.isAuthorized().then((user) => {
        console.log('> SetupApplicationCommand -> DatabaseService: session =', user)
        if (user) {
          return database.getUser(user).then((userDoc) => {
            console.log('> SetupApplicationCommand -> DatabaseService: user =', userDoc)
            return userDoc
          })
        }
      }),
      database.get(Databases.SERVER).then((serverDoc) => {
        console.log('> SetupApplicationCommand -> DatabaseService: server =', serverDoc)
        return serverDoc
      })
    ]).then((values) => {
      const userDoc = values[0]
      const serverDoc = values[1]
      return {
        user: userDoc || null,
        server: serverDoc || null
      }
    })
  }
}

const SINGLETON = new SetupApplicationCommand()

export default SINGLETON
