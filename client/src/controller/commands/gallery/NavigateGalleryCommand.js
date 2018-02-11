import GetDataGalleryCommand from '@/controller/commands/gallery/GetDataGalleryCommand.js'

class NavigateGalleryCommand {
  execute (index, quantity, limit, offset) {
    let nextIndex = index + offset
    console.log('> \t NavigateGalleryCommand > nextIndex =', nextIndex)

    if (nextIndex < 1) return Promise.reject(new Error('Index outside of the range'))

    return GetDataGalleryCommand.execute(nextIndex, quantity)
  }
}

const SINGLETON = new NavigateGalleryCommand()

export default SINGLETON
