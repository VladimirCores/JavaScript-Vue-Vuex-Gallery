import GetGalleryPageCommand from '@/controller/commands/GetGalleryPageCommand.js'

export default class NavigateGalleryPageCommand {
  execute (index, quantity, limit, offset) {
    let nextIndex = index + offset
    console.log('> \t NavigateGalleryPageCommand > nextIndex =', nextIndex)

    if (nextIndex < 1) return Promise.reject(new Error('Index outside of the range'))

    return new GetGalleryPageCommand().execute(nextIndex, quantity)
  }
}
