import axios from 'axios'

import RESOLUTIONS from '@/consts/Resolutions'

import GalleryPageVO from '@/vos/GalleryPageVO'
import GalleryPageItemVO from '@/vos/GalleryPageItemVO'

export default class GetGalleryPageCommand {
  execute (index, quantity) {
    // https://developer.vimeo.com/api/authentication
    console.log('> \t GetGalleryPageCommand > index | quantity =', index, quantity)
    return axios.get('https://api.vimeo.com/users/invisart/likes', {
      params: {
        page: index,
        per_page: quantity,
        access_token: '3dc0bb25295c04f03bf331e5227f963f'
      }})
      .then(response => {
        console.log('> \t GetGalleryPageCommand > data', response.data)
        let inputData = response.data
        let galleryItems = inputData.data.map((item) => {
          // console.log('> GetGalleryPageCommand > item', item)
          let link = item.pictures.sizes[RESOLUTIONS.R_200_150].link
          return new GalleryPageItemVO(
            item.name,
            item.uri,
            link
          )
        })
        let pagesLimit = Math.ceil(inputData.total / quantity)
        return new GalleryPageVO(pagesLimit, galleryItems)
      })
      .catch(function (error) {
        Promise.resolve(error)
      })
  }
}
