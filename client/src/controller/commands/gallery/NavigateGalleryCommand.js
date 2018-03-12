import GetGalleryDataCommand from '@/controller/commands/gallery/GetGalleryDataCommand.js'

import GalleryError from '@/consts/errors/GalleryError'

class NavigateGalleryCommand {
  execute (
    serverVO,
    userSettingsVO,
    galleryVO,
    offset
  ) {
    galleryVO.index = galleryVO.index + offset
    console.log('> NavigateGalleryCommand > nextIndex =', galleryVO.index)

    if (galleryVO.index < 1) return Promise.reject(GalleryError.INDEX_LESS_THAN_MINIMUM)

    return GetGalleryDataCommand.execute(serverVO, userSettingsVO, galleryVO)
  }
}

const SINGLETON = new NavigateGalleryCommand()

export default SINGLETON
