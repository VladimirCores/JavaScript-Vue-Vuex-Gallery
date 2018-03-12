import axios from 'axios'

import RESOLUTIONS from '@/consts/Resolutions'

import GalleryViewVO from '@/model/vos/gallery/GalleryViewVO'
import GalleryViewItemVO from '@/model/vos/gallery/GalleryViewItemVO'
import GalleryError from '@/consts/errors/GalleryError'

function IsWrongServer (serverVO) {
  return serverVO == null ||
    (serverVO != null && (serverVO.url == null || serverVO.url.length === 0))
}

function IsWrongUserSettings (userSettingsVO) {
  var notNull = !!userSettingsVO
  return !notNull ||
    (notNull && (
      (userSettingsVO.userID == null || userSettingsVO.userID.length === 0) ||
      (userSettingsVO.accessToken == null || userSettingsVO.accessToken.length === 0)
    ))
}

class GetGalleryDataCommand {
  constructor () {
    IsWrongServer.bind(this)
    IsWrongUserSettings.bind(this)
  }
  execute (serverVO, userSettingsVO, galleryVO) {
    return new Promise((resolve, reject) => {
      // https://developer.vimeo.com/api/authentication
      if (IsWrongServer(serverVO)) reject(GalleryError.WRONG_SERVER_DATA)
      if (IsWrongUserSettings(userSettingsVO)) reject(GalleryError.WRONG_USER_SETTINGS_DATA)
      else {
        let index = galleryVO.index
        let quantity = galleryVO.quantity
        let token = userSettingsVO.accessToken // '3dc0bb25295c04f03bf331e5227f963f'
        console.log('> SetupGalleryCommand > index | quantity =', index, quantity)
        return axios.get(`${serverVO.url}/${userSettingsVO.userID}/likes`, { // https://api.vimeo.com/users
          params: {
            page: index,
            per_page: quantity,
            access_token: token
          }})
          .then(response => {
            console.log('> SetupGalleryCommand > data', response.data)
            let inputData = response.data
            let resolution = RESOLUTIONS.R_200_150
            let galleryItems = inputData.data.map((item, index) => {
              // console.log('> GetDataGalleryCommand > item', index, item)
              let imageUrl = item.pictures.sizes[resolution].link
              return new GalleryViewItemVO(index, item.name, item.uri, imageUrl)
            })
            let pagesLimit = Math.ceil(inputData.total / quantity)
            resolve(new GalleryViewVO(pagesLimit, galleryItems))
          })
          .catch((error) => {
            console.log('> SetupGalleryCommand > error =', error)
            reject(GalleryError.REQUESTING_AXIOS_DATA_PROBLEM)
          })
      }
    })
  }
}

const SINGLETON = new GetGalleryDataCommand()

export default SINGLETON
