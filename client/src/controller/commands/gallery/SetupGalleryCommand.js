import axios from 'axios'

import RESOLUTIONS from '@/consts/Resolutions'

import GalleryViewVO from '@/model/vos/gallery/GalleryViewVO'
import GalleryViewItemVO from '@/model/vos/gallery/GalleryViewItemVO'

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

class SetupGalleryCommand {
  constructor () {
    IsWrongServer.bind(this)
    IsWrongUserSettings.bind(this)
  }
  execute (serverVO, userSettingsVO, galleryVO) {
    return new Promise((resolve, reject) => {
      // https://developer.vimeo.com/api/authentication
      if (IsWrongServer(serverVO)) reject(new Error(1))
      if (IsWrongUserSettings(userSettingsVO)) reject(new Error(0))
      else {
        let index = galleryVO.index
        let quantity = galleryVO.quantity
        let token = userSettingsVO.accessToken // '3dc0bb25295c04f03bf331e5227f963f'
        console.log('> \t GetDataGalleryCommand > index | quantity =', index, quantity)
        return axios.get(`${serverVO.url}/${userSettingsVO.userID}/likes`, { // https://api.vimeo.com/users
          params: {
            page: index,
            per_page: quantity,
            access_token: token
          }})
          .then(response => {
            console.log('> \t GetDataGalleryCommand > data', response.data)
            let inputData = response.data
            let resolution = RESOLUTIONS.R_200_150
            let galleryItems = inputData.data.map((item, index) => {
              // console.log('> GetDataGalleryCommand > item', index, item)
              let imageUrl = item.pictures.sizes[resolution].link
              return new GalleryViewItemVO(item.name, item.uri, imageUrl)
            })
            let pagesLimit = Math.ceil(inputData.total / quantity)
            resolve(new GalleryViewVO(pagesLimit, galleryItems))
          })
          .catch(function (error) {
            reject(error)
          })
      }
    })
  }
}

const SINGLETON = new SetupGalleryCommand()

export default SINGLETON
