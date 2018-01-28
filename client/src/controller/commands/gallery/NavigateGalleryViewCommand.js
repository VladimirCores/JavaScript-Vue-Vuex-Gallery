import GetGalleryViewCommand from '@/controller/commands/gallery/GetGalleryViewCommand.js'

class NavigateGalleryViewCommand {
  execute (index, quantity, limit, offset) {
    let nextIndex = index + offset
    console.log('> \t NavigateGalleryViewCommand > nextIndex =', nextIndex)

    if (nextIndex < 1) return Promise.reject(new Error('Index outside of the range'))

    return GetGalleryViewCommand.execute(nextIndex, quantity)
  }
}

const SINGLETON = new NavigateGalleryViewCommand()

export default SINGLETON
